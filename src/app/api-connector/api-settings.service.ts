import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';
import ***REMOVED***environment***REMOVED*** from '../../environments/environment'
@Injectable()
export class ApiSettings ***REMOVED***
  constructor() ***REMOVED******REMOVED***

  /*
    Provides base URL with trailing slash for all Portal API calls.
   */
  getApiBaseURL(): string ***REMOVED***
    return environment.apiBaseUrl;
  ***REMOVED***
  getConnectorBaseUrl(): string ***REMOVED***
    return environment.connectorBaseUrl;
  ***REMOVED***

  /*
    Returns the format of the API call.
    default is JSON
   */
  getApiFormat(): string***REMOVED***
    return 'json';
  ***REMOVED***

  getCSRFToken(): string***REMOVED***
    return Cookie.get("csrftoken");
  ***REMOVED***

  getAccessToken(): string***REMOVED***
    return Cookie.get("access_token");
  ***REMOVED***
***REMOVED***
