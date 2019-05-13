import {ErrorHandler} from '@angular/core';
import { JL } from 'jsnlog';
import { Cookie } from 'ng2-cookies';
import { ApiSettings } from '../api-connector/api-settings.service';

// Before Send Function
function beforeSendFunction(xhr: XMLHttpRequest, json: JSON): any {
  for (const message of json['lg']) {
    message['identifier'] = Cookie.get('csrftoken').slice(5, 10);
  }
  json = filter(json);
  xhr.setRequestHeader('X-CSRFToken', Cookie.get('csrftoken'));
  xhr.withCredentials = true;
}

function filter(json: JSON): JSON {
  const ems: string[] = [];
  for (let count: number = 0; count < json['lg'].length; count++) {
    const message: string = json['lg'][count]['m'];
    if (ems.indexOf(message) === -1) {
      ems.push(message);
    } else {
      delete json['lg'][count]
    }
  }

  return json;
}
// Ajax Appender and Settings
const appender: JL.JSNLogAjaxAppender = JL.createAjaxAppender('ajax appender');

appender.setOptions({
  beforeSend: beforeSendFunction,
  url: `${ApiSettings.getApiBaseURL()}jsnlog/log/`,
  batchSize: 30,
  batchTimeout: 600000,
  maxBatchSize: 50,
  sendTimeout: 10000
                    });

// Console Appender and Settings
const consoleAppender: JL.JSNLogConsoleAppender = JL.createConsoleAppender('console appender');

// JSNLOG Options
JL().setOptions({
                  appenders: [appender, consoleAppender]
                });

/**
 * ErrorHandler Class implementing JSNLog
 */
export class UncaughtExceptionHandler implements ErrorHandler{

  handleError(error: any): any {
    JL().fatalException('Uncaught Exception', error);
  }
}
