const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');
module.exports = function() {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.File({ filename: 'infologfile.log', level: 'info' }),
      new winston.transports.File({ filename: 'errorlogfile.log', level:'error' })
    ]
  });
  
  logger.exceptions.handle(
   new winston.transports.File({ filename: 'uncaughtExceptions.log' }));
    process.on('unhandledRejection', (ex) => {
      console.log('unhandledRejection==>',ex);
      throw ex;
    });
}