import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service';
import ***REMOVED***HttpClient, HttpHeaders, HttpParams***REMOVED*** from '@angular/common/http';
import ***REMOVED***Observable***REMOVED*** from 'rxjs';
import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';

const header = new HttpHeaders(***REMOVED***
    'X-CSRFToken': Cookie.get('csrftoken')
***REMOVED***);

/**
 * Service which provides public key methods.
 */
@Injectable()
export class KeyService ***REMOVED***

    constructor(private http: HttpClient) ***REMOVED***
    ***REMOVED***

    getKey(): Observable<any> ***REMOVED***

        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/current/public_key/`, ***REMOVED***
            withCredentials: true
        ***REMOVED***)

    ***REMOVED***

    postKey(public_key: string): Observable<any> ***REMOVED***
        public_key = public_key.replace(/\r?\n|\r/gi, '');
        const params: HttpParams = new HttpParams().set('public_key', public_key);

        return this.http.put(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/current/public_key/`, params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***)
    ***REMOVED***

***REMOVED***
