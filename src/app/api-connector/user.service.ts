import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***URLSearchParams***REMOVED*** from '@angular/http';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service';
import ***REMOVED***Observable, throwError***REMOVED*** from 'rxjs';
import ***REMOVED***catchError***REMOVED*** from 'rxjs/operators';
import ***REMOVED***HttpClient, HttpHeaders, HttpParams***REMOVED*** from '@angular/common/http';
import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';

const header = new HttpHeaders(***REMOVED***
    'X-CSRFToken': Cookie.get("csrftoken")
***REMOVED***);


@Injectable()
export class UserService ***REMOVED***
    constructor(private http: HttpClient, private settings: ApiSettings) ***REMOVED***
    ***REMOVED***

    setUserFacilityPassword(facility: string): Observable<any> ***REMOVED***
        let params = new HttpParams().set('facility', facility)

        ;
        return this.http.post(this.settings.getConnectorBaseUrl() + 'user/setUserPassword/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***

    getLogins(): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'user/getLogins/',
            ***REMOVED***
                withCredentials: true,
            ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***

    getuserAffiliations(user_id: number) ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'user/' + user_id.toString() + '/affiliations/',
            ***REMOVED***
                withCredentials: true,

            ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***

    getLoggedUser(): Observable<any> ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'user/getLoggedUser/',
            ***REMOVED***
                withCredentials: true,

            ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***

    getMemberByUser(): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + `user/getMemberByUser/`, ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***


    getMemberByExtSourceNameAndExtLogin(ext_login: string): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + `user/getMemberByExtSourceNameAndExtLogin/`, ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***

                extLogin: ext_login,

            ***REMOVED***
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***


    getVosWhereUserIsAdmin(): Observable<any> ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'user/getVosWhereUserIsAdmin/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
        ;
    ***REMOVED***

    getGroupsWhereUserIsAdmin(): Observable<any> ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'user/getGroupsWhereUserIsAdmin/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
        ;
    ***REMOVED***

    setNewsletterSubscription(subscribed: boolean): Observable<any> ***REMOVED***
        let params = new HttpParams().set('subscribed', subscribed.toString());

        return this.http.post(this.settings.getApiBaseURL() + 'newsletter/setNewsletterSubscription/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***

    getNewsletterSubscription(): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'newsletter/getNewsletterSubscription/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));


    ***REMOVED***

    sendHelpMail(subject, message, reply): Observable<any> ***REMOVED***

        let params = new HttpParams().set('subject', subject).set('message', message).set('reply', reply);


        return this.http.post(this.settings.getApiBaseURL() + 'user/sendHelpMail/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***

    getFilteredMembersOfdeNBIVo(firstname: string, lastName: string, groupid: string): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'user/getFilteredMembers/', ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***
                firstName: firstname,
                lastName: lastName,
                groupid: groupid
            ***REMOVED***
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));


    ***REMOVED***


***REMOVED***
