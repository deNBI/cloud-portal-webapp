import {Injectable} from '@angular/core';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {environment} from '../../environments/environment'
@Injectable()
export class ApiSettings {
  constructor() {}

  /*
    Provides base URL with trailing slash for all Portal API calls.
   */
  getApiBaseURL(): string {
    return environment.apiBaseUrl;
  }
  getConnectorBaseUrl(): string {
    return environment.apiBaseUrl;
  }

  /*
    Returns the format of the API call.
    default is JSON
   */
  getApiFormat(): string {
    return 'json';
  }

  getCSRFToken(): string {
    return Cookie.get('csrftoken');
  }

  getAccessToken(): string {
    return Cookie.get('access_token');
  }
}
