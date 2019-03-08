import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service';
import ***REMOVED***Observable, throwError***REMOVED*** from 'rxjs';
import ***REMOVED***catchError***REMOVED*** from 'rxjs/operators';
import ***REMOVED***HttpClient, HttpHeaders, HttpParams***REMOVED*** from '@angular/common/http';

import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';


const header = new HttpHeaders(***REMOVED***
    'X-CSRFToken': Cookie.get('csrftoken')
***REMOVED***);

@Injectable()
export class VoService ***REMOVED***
    constructor(private http: HttpClient) ***REMOVED***
    ***REMOVED***


    isVo(): Observable<any> ***REMOVED***

        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***voManagers/current/status/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***


    getNewsletterSubscriptionCounter(): Observable<any> ***REMOVED***


        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***newsletter/subscription/counter/', ***REMOVED***
            withCredentials: true,

        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***


    getAllVoGroups(): Observable<any> ***REMOVED***

        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***vo/projects/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***

    removeResourceFromGroup(groupid: string): Observable<any> ***REMOVED***
        return this.http.delete(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***vo/projects/' + groupid + '/resource/', ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));

    ***REMOVED***

    getAllGroupsWithDetails(): Observable<any> ***REMOVED***

        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***vo/projects/details/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***

    getProjectStatus(groupid: number): Observable<any> ***REMOVED***
        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***vo/projects/' + groupid + '/status/', ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***

    getVoProjectResources(): Observable<any> ***REMOVED***
        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***vo/projects/resources/', ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***


    setProjectStatus(groupid: number, status: number): Observable<any> ***REMOVED***
        const params = new HttpParams().set('status', status.toString());

        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***vo/projects/' + groupid + '/status/', params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***

    sendNewsletterToVo(subject, message, reply?): Observable<any> ***REMOVED***

        const params = new HttpParams().set('subject', subject).set('message', message).set('reply', reply);

        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***voManagers/current/newsletter/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***


    sendMailToVo(subject, message, reply?): Observable<any> ***REMOVED***
        const params = new HttpParams().set('subject', subject).set('message', message).set('reply', reply);


        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***voManagers/current/voMail/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***

    /**
     * Get members of a project with emails.
     * @param ***REMOVED***number***REMOVED*** groupid id of the the group
     * @returns ***REMOVED***Observable<any>***REMOVED***
     */
    getVoGroupRichMembers(groupid: number): Observable<any> ***REMOVED***
        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***vo/projects/' + groupid + '/members/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***


***REMOVED***
