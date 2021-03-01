'use strict';
var log4js = require('log4js');
log4js.configure({
  appenders: {logs: {type: "file", filename: "test_results/e2e.log"}, console: {type: 'log4js-protractor-appender'}},

  categories: {default: {appenders: ["logs", "console"], level: "debug"}}
});

var log4jsGen = {
  getLogger: function getLogger() {

    var logger = log4js.getLogger('logs');
    return logger;
  }
};

module.exports = log4jsGen;
