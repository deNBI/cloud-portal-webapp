import ***REMOVED***ErrorHandler***REMOVED*** from '@angular/core';
import ***REMOVED*** JL ***REMOVED*** from 'jsnlog';
import ***REMOVED*** Cookie ***REMOVED*** from 'ng2-cookies';
import ***REMOVED*** ApiSettings ***REMOVED*** from '../api-connector/api-settings.service';

// ---Before Send Function
// Runs before the Ajax Appender sends the logs to the server
function beforeSendFunction(xhr: XMLHttpRequest, json: JSON): any ***REMOVED***
  json = filter(json); // filter out duplicate error messages
  xhr.setRequestHeader('X-CSRFToken', Cookie.get('csrftoken')); // add csrftoken to cookie
  xhr.withCredentials = true;
***REMOVED***

// filters duplicate messages from the logs
function filter(json: JSON): JSON ***REMOVED***
  const ems: string[] = []; // save messages temporarily in an array
  for (let count: number = 0; count < json['lg'].length; count++) ***REMOVED*** // iterate over the messages
    const message: string = json['lg'][count]['m'];
    if (ems.indexOf(message) === -1) ***REMOVED*** // if message was not found in ems, push it to ems
      ems.push(message);
    ***REMOVED*** else ***REMOVED*** // if message was found in ems, delete it from the log file
      delete json['lg'][count]
    ***REMOVED***
  ***REMOVED***

  return json;
***REMOVED***

// ---Ajax Appender and Settings
const appender: JL.JSNLogAjaxAppender = JL.createAjaxAppender('ajax appender');

appender.setOptions(***REMOVED***
  beforeSend: beforeSendFunction, // set function to run before sending the logs
  url: `$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***jsnlog/log/`, // where to send the logs
  batchSize: 5,
  batchTimeout: 180000, // equals 3 minutes
  maxBatchSize: 50, // max size of batch when batch could not be send to server
  sendTimeout: 10000 // equals 10 seconds. time to retry sending of batch
                    ***REMOVED***);

// ---Console Appender and Settings
const consoleAppender: JL.JSNLogConsoleAppender = JL.createConsoleAppender('console appender');

// ---JSNLOG Options
JL().setOptions(***REMOVED***
                  appenders: [appender, consoleAppender]
                ***REMOVED***);

/**
 * ErrorHandler Class implementing JSNLog
 */
export class UncaughtExceptionHandler implements ErrorHandler***REMOVED***

  handleError(error: any): any ***REMOVED***
    JL().fatalException('Uncaught Exception', error);
  ***REMOVED***
***REMOVED***
