'use strict';
var log4js = require('log4js');
log4js.configure({

  appenders: {
    fileLog: {type: 'file', filename: './logs/ExecutionLog.log'},
    console: {type: 'console'}
  }
});
var log4jsGen = log4js.getLogger('logs');

module.exports = log4jsGen;
