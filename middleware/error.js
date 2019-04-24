const logger = require('../util/logger');

module.exports = function(err, req, res, next){
  logger.log({
    level: 'error',
    message: err.err
  });

  res.status(500).send('Something failed.');
};