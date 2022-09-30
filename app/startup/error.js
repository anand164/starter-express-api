const winston = require('winston');

module.exports = function(err, req, res, next){
  winston.error(err.message, err);

  // error
  // warn
  // info
  // verbose
  // debug 
  // silly
  if(err == 'INVALID_TOKEN' || err == 'TOKEN_EXPIRED') res.status(401).send(err)
  else res.status(404).sendFile(process.cwd() + '/app/views/404.ejs');
}