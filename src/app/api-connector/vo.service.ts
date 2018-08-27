import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service';
import ***REMOVED***Observable, throwError***REMOVED*** from 'rxjs';
import ***REMOVED***catchError***REMOVED*** from 'rxjs/operators';
import ***REMOVED***HttpClient, HttpHeaders, HttpParams***REMOVED*** from '@angular/common/http';

import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';


const header = new HttpHeaders(***REMOVED***
    'X-CSRFToken': Cookie.get("csrftoken")
***REMOVED***);

@Injectable()
export class VoService ***REMOVED***
    constructor(private http: HttpClient, private settings: ApiSettings) ***REMOVED***
    ***REMOVED***


    isVo(): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'vo_manager/isVoManager/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***


    getNewsletterSubscriptionCounter(): Observable<any> ***REMOVED***


        return this.http.get(this.settings.getApiBaseURL() + 'vo_manager/getNewsletterSubscriptionCounter/', ***REMOVED***
            withCredentials: true,

        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***


    getAllVoGroups(): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'vo_manager/getAllGroups/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***

    getAllGroupsWithDetails(): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'vo_manager/getAllGroupsWithDetails/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***

    sendNewsletterToVo(subject, message, reply?): Observable<any> ***REMOVED***

        let params = new HttpParams().set('subject', subject).set('message', message).set('reply', reply);

        return this.http.post(this.settings.getApiBaseURL() + 'vo_manager/sendNewsletterToMembers/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***


    sendMailToVo(subject, message, reply?): Observable<any> ***REMOVED***
        let params = new HttpParams().set('subject', subject).set('message', message).set('reply', reply);


        return this.http.post(this.settings.getApiBaseURL() + 'vo_manager/sendMailToAllMembers/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***


***REMOVED***
