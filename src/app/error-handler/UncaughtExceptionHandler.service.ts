import {ErrorHandler} from '@angular/core';
import { JL } from 'jsnlog';
import { Cookie } from 'ng2-cookies';
import { ApiSettings } from '../api-connector/api-settings.service';

// ---Before Send Function
// Runs before the Ajax Appender sends the logs to the server
function beforeSendFunction(xhr: XMLHttpRequest, json: JSON): any {
  json = filter(json); // filter out duplicate error messages
  xhr.setRequestHeader('X-CSRFToken', Cookie.get('csrftoken')); // add csrftoken to cookie
  xhr.withCredentials = true;
}

// filters duplicate messages from the logs
function filter(json: JSON): JSON {
  const ems: string[] = []; // save messages temporarily in an array
  for (let count: number = 0; count < json['lg'].length; count++) { // iterate over the messages
    const message: string = json['lg'][count]['m'];
    if (ems.indexOf(message) === -1) { // if message was not found in ems, push it to ems
      ems.push(message);
    } else { // if message was found in ems, delete it from the log file
      delete json['lg'][count]
    }
  }

  return json;
}

// ---Ajax Appender and Settings
const appender: JL.JSNLogAjaxAppender = JL.createAjaxAppender('ajax appender');

appender.setOptions({
  beforeSend: beforeSendFunction, // set function to run before sending the logs
  url: `${ApiSettings.getApiBaseURL()}jsnlog/log/`, // where to send the logs
  batchSize: 5,
  batchTimeout: 180000, // equals 3 minutes
  maxBatchSize: 50, // max size of batch when batch could not be send to server
  sendTimeout: 10000 // equals 10 seconds. time to retry sending of batch
                    });

// ---Console Appender and Settings
const consoleAppender: JL.JSNLogConsoleAppender = JL.createConsoleAppender('console appender');

// ---JSNLOG Options
JL().setOptions({
                  appenders: [appender, consoleAppender]
                });

/**
 * ErrorHandler Class implementing JSNLog
 */
export class UncaughtExceptionHandler implements ErrorHandler {

  handleError(error: any): any {
    JL().fatalException('Uncaught Exception', error);
  }
}
