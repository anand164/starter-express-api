'use strict';

var express = require('express');
var router = express.Router();
var passport = require('passport');
const uuidv4 = require('uuid/v4');
var expressValidator = require('express-validator');
const jwt = require('jsonwebtoken')
router.use(expressValidator())
var Candidate = require('../models/candiddate');
var candidateDetails = require('../models/candidate.details');

var CandidateTokenStatus = require('../models/candidate-token-status.model');

const _ = require('lodash')
const config = require('../config')
var services = require('../services')
const crypto = require('../services/crypto')
const response = require('../services/response');

// Home page
router.get('/', (req, res, next) => {
	res.send('Welcome in candidate route use /signin or /signup');
});

// Login
router.post('/signin', (req, res, next)=>{
    req.checkBody('email', 'Enter username or email').notEmpty();
	req.checkBody('password', 'Enter Valid password.').notEmpty();
	var errors = req.validationErrors();
    if (errors) return res.status(404).send(response(null,'MISSING_FIELS',false,404,errors))
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).send(response(null,'FAILED_TO_LOGIN',false,400, err || info))
        }
       req.login(user, {session: false}, async (err)=> {
           if (err)  return res.status(404).send(response(null,'FAILED_TO_LOGIN',false,404,err))
           // generate a signed son web token with the contents of user object and return it in the response
           user = _.pick(user,['candidateId','candidatename','picture','email','isEmailVerified','accType', 'modifiedAt', 'createdAt']);
        	user['tokenId'] = uuidv4();
           const token = jwt.sign({data:user}, config.jwtSecret,{expiresIn:(60*60*60*24)});
			await CandidateTokenStatus.createOrUpdate({candidateId:user.candidateId},user['tokenId'])
           return res.status(200).send(response({user,token}))
        });
    })(req, res);
});
router.post('/signup', async (req, res) => {
	var credentials = { 'email': req.body.email };
	req.checkBody('email', 'Enter Valid Email.').isEmail();
	var errors = req.validationErrors();
    if (errors) return res.status(400).send(response(null,'MISSING_FIELS',false,404,errors))
	// Check if the username already exists for non-social account
    let user = await Candidate.findOne({ 'email': new RegExp('^' + credentials.email + '$', 'i') })
    if (user) return res.status(200).send(response(null,'DUPLICATE_EMAIL',false,801,errors))
    user = await Candidate.create({ email: credentials.email })
    if(!user) return res.status(500).send(response(null,'SWW',false,500,errors))
    let emailStatus = await services.sendMail(user, true)
    if (emailStatus == 'EMAIL_SENT') res.status(201).send(response(null))
    else res.status(201).send(response(null,"PARTIAL_SUCCESS"))
})

// Logout
router.get('/logout', passport.authenticate('jwt', {session: false}), async function (req, res, next) {
    // remove the req.user property and clear the login session
	let auth = req.headers['authorization']
	let token = auth.split(' ')[1];
	if(auth && token){
		let decodedToken = jwt.decode(token)
		if(decodedToken && decodedToken.data && decodedToken.data.candidateId)
			await CandidateTokenStatus.removeToken(decodedToken.data.candidateId,decodedToken.data.tokenId)
	}
	
	req.logout();

	// destroy session data
    req.session = null;
    
	// redirect to homepage
    res.send('success')

	
});
router.get('/user', passport.authenticate('jwt', {session: false}), async function (req, res, next) {
	let auth = req.headers['authorization']
	let token = auth.split(' ')[1];
	if(auth && token){
		let decodedToken = jwt.decode(token)
		if(decodedToken && decodedToken.data && decodedToken.data.candidateId){
			let candidate = await Candidate.findOne({candidateId:decodedToken.data.candidateId})
			let candidateInfo = await candidateDetails.findOne({candidateId:decodedToken.data.candidateId})
			if(candidate) return res.status(200).send(response({candidate,candidateDetails}))
			else return res.status(400).send(response(null,'FAILED_TO_FETCH',false,400))
		} else return res.status(400).send(response(null,'FAILED_TO_FETCH',false,400))
	} else return res.status(400).send(response(null,'FAILED_TO_FETCH',false,400))
})
router.get('/verifymail/:eaccType/:token/:astatus/:encdate/:invStatus', async (req, res, next) => {
	req.checkParams('token', 'Invalid Args').notEmpty();
	req.checkParams('astatus', 'Invalid Args').notEmpty();
	req.checkParams('encdate', 'Invalid Args').notEmpty();
	req.checkParams('eaccType', 'Invalid Args').notEmpty();
	req.checkParams('invStatus', 'Invalid Args').notEmpty();

	var errors = req.validationErrors();
	if (errors) return res.render('404');
	else {
		let Token, emailDate, accType, aStatus,
			encDate = req.params.encdate,
			invStatus = req.params.invStatus,
			encToken = req.params.token,
			encAstatus = req.params.astatus,
			eaccType = req.params.eaccType;

		emailDate = crypto.decrypt(encDate)
		Token = crypto.decrypt(encToken)
		aStatus = crypto.decrypt(encAstatus)
		accType = crypto.decrypt(eaccType)
		aStatus = (aStatus === 'true');
		emailDate = new Date(emailDate).getTime()
		var today = new Date().getTime()
		if (emailDate > today) {
			// console.log('hi',req.params);
			let user = await Candidate.findOne({ emailToken: Token })
			console.log('user=>',user, invStatus);
			if (user) {
				if (invStatus != 2) {
					if (invStatus == 0) { // Accept
						// let identity = { invitedTo: user.userId, invitationStatus: 'PENDING' };
						// let inv = await Invitation.findOneAndUpdate(identity, { invitationStatus: 'ACCEPTED' })
						res.send('OK')
					} else { // Reject

					}
				}
				else if (aStatus) {
					if (user.isEmailVerified) {
						return res.render('emailstatus', { title: "Email Already Verified", isEmailVerified: true, linkExpired: false, });
					}
					return res.render('emailstatus', {
						title: "Email Verification", isEmailVerified: false,
						accType: accType, linkExpired: false, userName: user.firstName, eToken: encToken
					});
				} else {
					return res.render('forget', { title: "Forget Password", accType: accType, linkExpired: false, userName: user.firstName, eToken: encToken });
				}
			} else {
				return res.render('404');
			}
		} else {
			return res.render('emailstatus', { title: "Link Expired", linkExpired: true });
		}
	}
});
router.get('/getusername/:username/:accType', async (req, res, next) => {
	let userModel;
	var username = req.params.username;
	var accType = req.params.accType;
	req.checkParams('username', 'username is Required').notEmpty();
	req.checkParams('accType', 'Account Type is Required').notEmpty();
	var errors = req.validationErrors();
	if (errors) return res.status(202).send({ validationError: errors, API_STATUS: false });
	let user = await Candidate.findOne({ username: username });
	if (user) return res.status(200).send({ API_STATUS: true, user: user });
	else return res.status(202).send({ API_STATUS: true, msg: 'USER_NOT_FOUND' });
});
router.post('/setuser', async (req, res, next) => {
	console.log('body=>', req.body);

	let Token;
	const username = req.body.username;
	const password = req.body.password;
	const eToken = req.body.token;
	const accType = req.body.accType;


	req.checkBody('token', 'Token is Required').notEmpty();
	req.checkBody('username', 'User Name is Required').notEmpty();
	req.checkBody('password', 'Password is Required').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		return res.status(202).send({ validationError: errors, API_STATUS: false });
	}

	Token = crypto.decrypt(eToken)
	let user = await Candidate.findOne({ emailToken: Token })
	// console.log('user ',user);
	if (!user) {
		return res.status(202).send({ API_STATUS: false, error: 'INVALID_TOKEN' });
	}
	let hash = await crypto.encryptPassword(password)
	if (hash) {
		let update = { candidatename: username, password: hash, isEmailVerified: true, emailToken: uuidv4(),modifiedAt:new Date().toISOString() };
		let _user = await Candidate.findOneAndUpdate({ _id: user._id }, update);
		if (_user) return res.status(200).send({ API_STATUS: true, msg: 'USER_UPDATED' });
		return res.status(202).send({ API_STATUS: false, error: 'USER_NOT_UPDATED' });
	} else {
		return res.status(202).send({ API_STATUS: false, error: 'USER_NOT_UPDATED' });
	}
});
router.post('/forget-password', async (req, res, next) => {
	let Token;
	const password = req.body.password;
	const eToken = req.body.token;
	const accType = req.body.accType;
	req.checkBody('accType', 'Account Type is Required').notEmpty();
	req.checkBody('token', 'Token is Required').notEmpty();
	req.checkBody('password', 'Password is Required').notEmpty();
	var errors = req.validationErrors();
	if (errors) return res.status(202).send({ validationError: errors, API_STATUS: false });
	Token = crypto.decrypt(eToken)
	let user = await Candidate.findOne({ emailToken: Token })
	if (user) {
		let hash = await crypto.encryptPassword(password)
		if (hash) {
			console.log(hash);
			let update = { password: hash, emailToken: uuidv4() };
			let _user = await Candidate.findOneAndUpdate({ _id: user._id }, update);
			if (_user) return res.status(200).send({ API_STATUS: true, msg: 'PASSWORD_UPDATED' });
			return res.status(202).send({ API_STATUS: false, error: 'PASSWORD_NOT_UPDATED' });
		} else {
			return res.status(202).send({ API_STATUS: false, error: 'PASSWORD_UPDATED' });
		}
	} else {
		return res.status(202).send({ API_STATUS: false, error: 'INVALID_TOKEN' });
	}
});

router.get('/getemail/:email/:accType', async (req, res, next) => {
	let userModel;
	var email = req.params.email;
	var accType = req.params.accType;

	console.log('hr/getemail', email, accType);
	req.checkParams('email', 'Enter valid Email').isEmail();
	req.checkParams('accType', 'Account Type is Required').notEmpty();
	var errors = req.validationErrors();
	if (errors) return res.status(202).send({ validationError: errors, API_STATUS: false });
	if (accType == 'EMPLOYEE') userModel = EmpModel;
	else if (accType == 'HR') userModel = HRModel;
	else if (accType == 'ADMIN') userModel = AdminModel;
	else return res.status(202).send({ API_STATUS: false, error: 'INVALID_ACCOUNT_TYPE' });
	let user = await userModel.Model.findOne({ email: email })
	if (user) return res.status(200).send({ API_STATUS: true, user: user });
	res.status(200).send({ API_STATUS: true, msg: 'USER_NOT_FOUND' });
});
router.get('/forget-password', async (req, res, next) => {
	console.log('forget-password called............');

	var email = req.query.email;
	var accType = req.query.accType;
	req.checkQuery('email', 'Enter valid email').isEmail();
	req.checkQuery('accType', 'Acount Type is Required').notEmpty();
	var errors = req.validationErrors();
	console.log('errors', errors);

	if (errors) return res.status(202).send({ validationError: errors, API_STATUS: false });
	let user = await Candidate.findOne({ email: email })
	if (user) {
		let emailStatus = await services.sendMail(user, false)
		if (emailStatus == 'EMAIL_SENT')
			return res.status(200).send(response(null))
		else return res.status(500).send(response(null,'SWW',false,500))
	} else return res.status(500).send(response(null,'SWW',false,500))
});
module.exports = router;