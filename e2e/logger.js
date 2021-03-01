'use strict';
var log4js = require('log4js');
var log4jsGen = {
  getLogger: function getLogger() {
    log4js.loadAppender('file');
    log4js.addAppender(log4js.appenders.file('./logs/ExecutionLog.log'), 'logs');
    var logger = log4js.getLogger('logs');
    return logger;
  }
};

module.exports = log4jsGen;
