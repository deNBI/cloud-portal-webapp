import ***REMOVED***ErrorHandler***REMOVED*** from '@angular/core';
import ***REMOVED*** JL ***REMOVED*** from 'jsnlog';
import ***REMOVED*** Cookie ***REMOVED*** from 'ng2-cookies';
import ***REMOVED*** ApiSettings ***REMOVED*** from '../api-connector/api-settings.service';

// Before Send Function
function beforeSendFunction(xhr: XMLHttpRequest, json: JSON): any ***REMOVED***
  for (const message of json['lg']) ***REMOVED***
    message['identifier'] = Cookie.get('csrftoken').slice(5, 10);
  ***REMOVED***
  json = filter(json);
  xhr.setRequestHeader('X-CSRFToken', Cookie.get('csrftoken'));
  xhr.withCredentials = true;
***REMOVED***

function filter(json: JSON): JSON ***REMOVED***
  const ems: string[] = [];
  for (let count: number = 0; count < json['lg'].length; count++) ***REMOVED***
    const message: string = json['lg'][count]['m'];
    if (ems.indexOf(message) === -1) ***REMOVED***
      ems.push(message);
    ***REMOVED*** else ***REMOVED***
      delete json['lg'][count]
    ***REMOVED***
  ***REMOVED***

  return json;
***REMOVED***
// Ajax Appender and Settings
const appender: JL.JSNLogAjaxAppender = JL.createAjaxAppender('ajax appender');

appender.setOptions(***REMOVED***
  beforeSend: beforeSendFunction,
  url: `$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***jsnlog/log/`,
  batchSize: 30,
  batchTimeout: 180000,
  maxBatchSize: 50,
  sendTimeout: 10000
                    ***REMOVED***);

// Console Appender and Settings
const consoleAppender: JL.JSNLogConsoleAppender = JL.createConsoleAppender('console appender');

// JSNLOG Options
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
