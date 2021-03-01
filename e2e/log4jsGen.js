'use strict';
var log4js = require('log4js');
log4js.configure({
  appenders: [
    {type: 'console'},
    {type: 'file', filename: 'logs/cheese.log', category: 'logs'}
  ]
});
var log4jsGen = log4js.getLogger('logs');

module.exports = log4jsGen;
