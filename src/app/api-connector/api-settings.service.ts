import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***environment***REMOVED*** from '../../environments/environment'

@Injectable()
export class ApiSettings ***REMOVED***
    /**
     * Class for getting base urls.
     */

    constructor() ***REMOVED***
    ***REMOVED***

    /**
     * Provides base URL with trailing slash for all Portal API calls.
     * @returns ***REMOVED***string***REMOVED*** Base Django API Url
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

***REMOVED***
