import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service'
import ***REMOVED***Observable, throwError***REMOVED*** from 'rxjs';
import ***REMOVED***catchError***REMOVED*** from 'rxjs/operators';
import ***REMOVED***HttpClient, HttpHeaders, HttpParams***REMOVED*** from '@angular/common/http';

import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';


const header = new HttpHeaders(***REMOVED***
    'X-CSRFToken': Cookie.get('csrftoken')
***REMOVED***);


@Injectable()
export class ApplicationStatusService ***REMOVED***
    constructor(private http: HttpClient) ***REMOVED***
    ***REMOVED***

    /**
     * Get all application stati.
     * @returns ***REMOVED***Observable<any>***REMOVED***
     */
    getAllApplicationStatus(): Observable<any> ***REMOVED***
        return this.http.get(ApiSettings.getApiBaseURL() + 'application_status/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***

    /**
     * Set status for an application.
     * @param ***REMOVED***number***REMOVED*** application_id id of the application
     * @param ***REMOVED***number***REMOVED*** status_id id of the status to set
     * @returns ***REMOVED***Observable<any>***REMOVED***
     */
    setApplicationStatus(application_id: number, status_id: number): Observable<any> ***REMOVED***

        let params = new HttpParams().set("project_application_status", status_id.toString());


        return this.http.patch(ApiSettings.getApiBaseURL() + 'project_applications/' + application_id + '/', params,
            ***REMOVED***
                headers: header,
                withCredentials: true
            ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***

***REMOVED***
