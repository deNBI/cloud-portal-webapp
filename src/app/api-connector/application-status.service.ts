import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service'
import ***REMOVED***Observable***REMOVED*** from 'rxjs';
import ***REMOVED***HttpClient, HttpHeaders, HttpParams***REMOVED*** from '@angular/common/http';

import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';

const header: HttpHeaders = new HttpHeaders(***REMOVED***
    'X-CSRFToken': Cookie.get('csrftoken')
***REMOVED***);

/**
 * Service which delivers functions for getting and setting Application status.
 */
@Injectable()
export class ApplicationStatusService ***REMOVED***
    constructor(private http: HttpClient) ***REMOVED***
    ***REMOVED***

    /**
     * Get all application stati.
     * @returns ***REMOVED***Observable<any>***REMOVED***
     */
    getAllApplicationStatus(): Observable<any> ***REMOVED***
        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***application_status/`, ***REMOVED***
            withCredentials: true
        ***REMOVED***)
    ***REMOVED***

    /**
     * Set status for an application.
     * @param ***REMOVED***number***REMOVED*** application_id id of the application
     * @param ***REMOVED***number***REMOVED*** status_id id of the status to set
     * @returns ***REMOVED***Observable<any>***REMOVED***
     */
    setApplicationStatus(application_id: string, status_id: string): Observable<any> ***REMOVED***

        const params: HttpParams = new HttpParams().set('project_application_status', status_id);

        return this.http.patch(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***project_applications/$***REMOVED***application_id***REMOVED***/`, params,
            ***REMOVED***
                headers: header,
                withCredentials: true
            ***REMOVED***)
    ***REMOVED***

***REMOVED***
