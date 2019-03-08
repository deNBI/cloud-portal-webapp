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
export class UserService ***REMOVED***
    constructor(private http: HttpClient) ***REMOVED***
    ***REMOVED***

    setUserFacilityPassword(facility: string): Observable<any> ***REMOVED***
        const params = new HttpParams().set('facility', facility)

        ;
        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/setUserPassword/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***

    getLogins(): Observable<any> ***REMOVED***

        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/current/logins/',
            ***REMOVED***
                withCredentials: true,
            ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***


    getPreferredMailUser(): Observable<any> ***REMOVED***

        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/current/preferredEmail/',
            ***REMOVED***
                withCredentials: true,
            ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***

    requestChangePreferredMailUser(email: string): Observable<any> ***REMOVED***
        const params = new HttpParams().set('newPreferredEmail', email);


        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/current/preferredEmail/', params,
            ***REMOVED***
                withCredentials: true,
                headers: header,
            ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***


    getPendingPreferredMailUser(): Observable<any> ***REMOVED***


        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/current/pendingPreferredEmails/',
            ***REMOVED***
                withCredentials: true,
            ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***


    getMemberDetailsByElixirId(elixir_id: string) ***REMOVED***
        elixir_id = elixir_id.substring(0, elixir_id.indexOf('@'));
        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/' + elixir_id + '/member/',
            ***REMOVED***
                withCredentials: true,

            ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***

    isMember(userid: string) ***REMOVED***
        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/' + userid + '/member/status/',
            ***REMOVED***
                withCredentials: true,
            ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***

    getuserAffiliations(user_id: number) ***REMOVED***
        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/' + user_id.toString() + '/affiliations/',
            ***REMOVED***
                withCredentials: true,

            ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***

    getLoggedUser(): Observable<any> ***REMOVED***
        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/current/',
            ***REMOVED***
                withCredentials: true,

            ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***

    getMemberByUser(): Observable<any> ***REMOVED***

        return this.http.get(ApiSettings.getApiBaseURL() + `users/current/member/`, ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***


    getMemberByExtSourceNameAndExtLogin(ext_login: string): Observable<any> ***REMOVED***

        return this.http.get(ApiSettings.getApiBaseURL() + `users/current/extLogin/member/`, ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***

                extLogin: ext_login,

            ***REMOVED***
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***


    getVosWhereUserIsAdmin(): Observable<any> ***REMOVED***
        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/current/adminVos/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
        ;
    ***REMOVED***

    getGroupsWhereUserIsAdmin(): Observable<any> ***REMOVED***
        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/current/adminGroups/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
        ;
    ***REMOVED***

    setNewsletterSubscription(subscribed: boolean): Observable<any> ***REMOVED***
        const params = new HttpParams().set('subscribed', subscribed.toString());

        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***newsletter/subscription/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***

    getNewsletterSubscription(): Observable<any> ***REMOVED***

        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***newsletter/subscription/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));


    ***REMOVED***

    sendHelpMail(subject, message, reply): Observable<any> ***REMOVED***

        const params = new HttpParams().set('subject', subject).set('message', message).set('reply', reply);


        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/current/helpMail/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***

    getFilteredMembersOfdeNBIVo(searchString: string, groupid: string): Observable<any> ***REMOVED***

        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/filter/', ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***
                searchString: searchString,
            ***REMOVED***
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));


    ***REMOVED***


***REMOVED***
