'use strict';

// Chat application dependencies
var express 	= require('express');
var app  		= express();
var path 		= require('path');
var flash 		= require('connect-flash');
const winston = require('winston')
// Chat application components
// require('./app/startup/logging')();
 require('./app/startup/routes')(app);
const error = require('./app/startup/error');
var session 	= require('./app/session');
var passport    = require('./app/auth');
const ResumeParser = require('simple-resume-parser');
// const resume = new ResumeParser("./PrateekDuggalDotNetResume.docx");
// resume.parseToJSON()
// .then(data => {
//   console.log('Yay! ', data);
// })
// .catch(error => {
//   console.error(error);
// });
// Set the port number
var port = process.env.PORT || 8080;

// View engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(express.static('public'));

app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(error)
// Middleware to catch 404 errors
// app.use(function(req, res, next) {
//   res.status(404).sendFile(process.cwd() + '/app/views/404.ejs');
// });
app.listen(port, () => winston.info(`Listening on port ${port}...`));
// require('./app/test')


// var userTable = [
//     {memberID : 1, parentId:null, amount:200, otherInfo:"blah"},
//     {memberID : 2, parentId:1, amount:300, otherInfo:"blah1"},
//     {memberID : 3, parentId:1, amount:208, otherInfo:"blah2"},
//     {memberID : 5, parentId:2, amount:500, otherInfo:"blah3"},
//     {memberID : 6, parentId:2, amount:100, otherInfo:"blah4"},
//     {memberID : 7, parentId:3, amount:500, otherInfo:"blah5"},
//     {memberID : 8, parentId:3, amount:700, otherInfo:"blah3"},

//     ];

// function recursiveFun (userTable, user){        
//     user.subChild = userTable.filter(x=>x.parentId == user.memberID)

//     user.subChild.forEach((u,i) => {
//         recursiveFun(userTable, user.subChild[i]);
//     });
//     // for (var i=0;i<user.subChild.length; i++)
//     //     recursiveFun(userTable, user.subChild[i]);
// }

// function getTreeOfMemberId(userTable, memberID){    
//      var finalObj;
//      finalObj = userTable.filter(x=>x.parentId == memberID)
//      recursiveFun(userTable, finalObj);
//      return finalObj;
// }
// let data = getTreeOfMemberId(userTable, 1)
// console.log('data', data);
    