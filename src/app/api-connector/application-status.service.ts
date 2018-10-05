import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service'
import ***REMOVED***Observable, throwError***REMOVED*** from 'rxjs';
import ***REMOVED***catchError***REMOVED*** from 'rxjs/operators';
import ***REMOVED***HttpClient, HttpHeaders, HttpParams***REMOVED*** from '@angular/common/http';

import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';


const header = new HttpHeaders(***REMOVED***
    'X-CSRFToken': Cookie.get("csrftoken")
***REMOVED***);


@Injectable()
export class ApplicationStatusService ***REMOVED***
    constructor(private http: HttpClient, private settings: ApiSettings) ***REMOVED***
    ***REMOVED***

    getAllApplicationStatus(): Observable<any> ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'application_status/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***

    setApplicationStatus(application_id: number, status_id: number, compute_center: string): Observable<any> ***REMOVED***
        let params = new HttpParams().set("project_application_status", status_id.toString()).set('compute_center',compute_center)


        return this.http.patch(this.settings.getApiBaseURL() + 'project_applications/' + application_id + "/", params,
            ***REMOVED***
                headers: header,
                withCredentials: true
            ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***

***REMOVED***
