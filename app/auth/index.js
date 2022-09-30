'use strict';

var config 		= require('../config');
var passport 	= require('passport');
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
var LocalStrategy 		= require('passport-local').Strategy;
var FacebookStrategy  	= require('passport-facebook').Strategy;
var LinkedinStrategy  	= require('passport-linkedin');
var TwitterStrategy  	= require('passport-twitter').Strategy;
var User = require('../models/candiddate');
var TokenStatus = require('../models/candidate-token-status.model');


/**
 * Encapsulates all code for authentication
 * Either by using username and password, or by using social accounts
 */
var init = function(){
	// Serialize and Deserialize user instances to and from the session.
	passport.serializeUser((user, done)=> {
		done(null, user.id);
	});

	passport.deserializeUser(async(id, done) => {
		let user = await User.findById(id)
		if(user) done(null, user);
	});

	// Plug-in JWT Strategy
	passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : config.jwtSecret
		}, async (jwtPayload, cb)=>{
			if(jwtPayload.data && jwtPayload.data.candidateId){
				let tokenStatus =  await TokenStatus.findOne({candidateId:jwtPayload.data.candidateId})
				if(tokenStatus && tokenStatus.tokenList && tokenStatus.tokenList.includes(jwtPayload.data.tokenId)){
					return User.findOne({candidateId:jwtPayload.data.candidateId}).then(user => {
						return cb(null, user);
					}).catch(err => {
						return cb(err);
					});
				} else {
					return cb('TOKEN_EXPIRED');
				}				
			} else {
				return cb('INVALID_TOKEN');
			}
			
		}
	));

	// Plug-in Local Strategy
	passport.use(new LocalStrategy({ 
			usernameField: 'email',    // define the parameter in req.body that passport can use as username and password
			passwordField: 'password',
		  },(username, password, done) => {			   			
		User.findOne({$or:[{candidatename:username},{email:username}],socialId:null})
		.then(user=>{	
			if (!user) {
				return done('Incorrect username or password.');
			  }
			  user.validatePassword(password, function(err, isMatch) {				  
					if (err) { return done(err) }
					if (!isMatch){
						return done('Incorrect username or password.');
					}
					return done(null, user);
			  });
		}).catch(err=>done(err))	      
	  }
	));

	// In case of Facebook, tokenA is the access token, while tokenB is the refersh token.
	// In case of Twitter, tokenA is the token, whilet tokenB is the tokenSecret.
	var verifySocialAccount = async (tokenA, tokenB, data, done) => {
		let user  = await User.findOrCreate(data)
	    if(user) return done(null, user); 
		else return ('user not found')

	}

	// Plug-in Facebook & Twitter Strategies
	// passport.use(new FacebookStrategy(config.facebook, verifySocialAccount));
	// passport.use(new LinkedinStrategy(config.linkedin, verifySocialAccount));
	// passport.use(new TwitterStrategy(config.twitter, verifySocialAccount));
	return passport;
}	
module.exports = init();