const express = require('express');
const passport = require('../auth');
const candidate_router = require('../routes/candidate')
const mgmt_router = require('../routes/api/management')
const cors = require('cors')
module.exports = function(app) {
  app.use(express.json());
  
  // CORS Middleware
  app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type','Authorization'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
  }));

  //  Session 
  // app.use(session({
  //   secret: config.secret,
  //   resave: false,
  //   saveUninitialized: true,
  //   cookie: { secure: true }
  // }))
  // Body Parser Middleware
   app.use(express.urlencoded({ extended: true }));
   app.use(express.json());
  //  Routers
  // app.use('/user', user_router);
  app.use('/candidate', candidate_router);
  app.use('/api/management', passport.authenticate('jwt', {session: false}), mgmt_router);
  app.use('/',(req, res)=>{
    res.send('Welcome to rest API, use /api/management or /candidate')
  })
}