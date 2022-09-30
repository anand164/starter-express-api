'use strict';

var config 		= require('../config');
var mongoose 	= require('mongoose');
var winstonLogger = require('winston')
// var logger 		= require('../logger');

// mongooseOptions.replset = {
// 	ha: true, // Make sure the high availability checks are on
// 	haInterval: 5000, // Run every 5 seconds
//   }
// Mongoose.connect(config.dbURI,{useNewUrlParser:true})
// .then(()=>console.log('Connected to database...'))

var connectionOptions = {
	useNewUrlParser:true,
	connectTimeoutMS:20000,
	ha:true,
	haInterval:10000,
	useFindAndModify:false,
	useUnifiedTopology: true
	
};
//mongoose.set('debug', true);
mongoose.connect(config.dbURI, connectionOptions, function (err) {
    if (err) winstonLogger.error(err);
});

mongoose.connection.on('connected', function () {
    console.log('Database Connected..')
});

mongoose.connection.on('disconnected', function () {
    winstonLogger.error('MongoDB disconnected!');
});
mongoose.connection.on('reconnected', function () {
    console.log('MongoDB reconnected!');
});


// if (mongoose.connection.db.serverConfig.s.replset) {
//     mongoose.connection.db.serverConfig.s.replset.on('ha', function(type, data) {
//         console.log('replset ha ' + type);
//     });
//     mongoose.connection.db.serverConfig.s.replset.on('timeout', function () {
//         winstonLogger.error('MongoDB timeout');
//     });
// }

// mpromise (mongoose's default promise library) is deprecated, 
// Plug-in your own promise library instead.
// Use native promises
mongoose.Promise = global.Promise;

module.exports = { mongoose, 
	models: {
		candidate: require('./schemas/candidate'),
		candidateTokenStatus: require('./schemas/candidate-token-status'),
		candidateDetails: require('./schemas/candidate.details'),

	}
};
