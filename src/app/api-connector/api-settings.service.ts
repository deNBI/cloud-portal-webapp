import {Injectable} from '@angular/core';

@Injectable()
export class ApiSettings {
  constructor() {}

  /*
    Provides base URL with trailing slash for all Portal API calls.
   */
  getApiBaseURL(): string {
    return 'https://portal-dev.denbi.de/portal/api/v0/';
  }

  /*
    Returns the format of the API call.
    default is JSON
   */
  getApiFormat(): string{
    return 'json';
  }

}
