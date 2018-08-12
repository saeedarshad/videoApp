const winston = require('winston');
const express = require('express');
const app = express();
require('express-async-errors');

require('./startup/logging')();
require('./startup/route')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);

const port = process.env.PORT || 3000;

app.set('view engine', 'pug');
const server = app.listen(port, () => winston.info('listening on port ' + port));

module.exports = server;