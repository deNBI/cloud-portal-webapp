import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***environment***REMOVED*** from '../../environments/environment'

/**
 * Class for getting base urls.
 */
@Injectable()
export class ApiSettings ***REMOVED***
    /**
     *  Provides base URL with trailing slash for all Portal API calls.
     * @returns ***REMOVED***string***REMOVED***
     */
    static getApiBaseURL(): string ***REMOVED***
        return environment.apiBaseUrl;
    ***REMOVED***

    /**
     *  Returns the format of the API call.
     * @returns ***REMOVED***string***REMOVED*** 'json'
     */
    static getApiFormat(): string ***REMOVED***
        return 'json';
    ***REMOVED***
    constructor() ***REMOVED***
    ***REMOVED***
***REMOVED***
