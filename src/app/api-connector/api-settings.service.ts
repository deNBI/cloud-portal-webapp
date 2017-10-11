import ***REMOVED***Injectable***REMOVED*** from '@angular/core';

@Injectable()
export class ApiSettings ***REMOVED***
  constructor() ***REMOVED******REMOVED***

  /*
    Provides base URL with trailing slash for all Portal API calls.
   */
  getApiBaseURL(): string ***REMOVED***
    return 'https://portal-dev.denbi.de/portal/api/v0/';
  ***REMOVED***

  /*
    Returns the format of the API call.
    default is JSON
   */
  getApiFormat(): string***REMOVED***
    return 'json';
  ***REMOVED***

***REMOVED***
