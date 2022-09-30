'use strict';
require('dotenv').config()
var init = function () {
	let redis;	console.log('node env........', process.env.NODE_ENV, process.env.PORT);
	let baseUrl;
	if(process.env.NODE_ENV == 'production') {	
		baseUrl = 	'https://chat2io.herokuapp.com/';
		redis = {
			host: process.env.REDIS_URL,
			port: process.env.REDIS_PORT,
			password: process.env.REDIS_PASS
		}
	} else {
		baseUrl = 	`http://localhost:${process.env.PORT}/`;
		redis= {
			host: "127.0.0.1",
			port: 6379,	
			password: ""
		}
	}
	return {
		dbURI:process.env.DB_URI,
		sessionSecret: process.env.SESSION_SEC,
		facebook: {
			clientID: process.env.FACEBOOK_CLIENT_ID,
			clientSecret: process.env.FACEBOOK_CLIENT_SEC,
			callbackURL: "/auth/facebook/callback",
			profileFields: ['id', 'displayName', 'photos', 'email']
		},
		twitter:{
			consumerKey: process.env.TWEETER_CONSUMER_KEY,
			consumerSecret: process.env.TWEETER_CONSUMER_SEC,
			callbackURL: "/auth/twitter/callback",
			includeEmail: true,
			// profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline'],
			userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
//   passReqToCallback : true,
		},
		linkedin:{
			consumerKey: process.env.LINKEDIN_API_KEY,
			consumerSecret: process.env.LINKEDIN_SECRET_KEY,
			callbackURL: "/auth/linkedin/callback",
			// profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline']
		},
		redis: redis,
		BASE_URL:baseUrl,
		jwtSecret:process.env.JWT_SECRET
	}
	

}

module.exports = init();
