const winston = require('winston');
require('express-async-errors');

module.exports = function() {
    process.on('unhandledRejection', (ex) => {
        winston.error(ex.message);
        process.exit(1);
      });
  
  process.on('unhandledRejection', (ex) => {
    winston.error(ex.message);
        process.exit(1);
  });
  
  winston.add(winston.transports.File, { filename: 'logfile.log' }); 
}