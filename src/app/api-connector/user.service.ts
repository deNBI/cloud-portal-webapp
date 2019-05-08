import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service';
import ***REMOVED***Observable***REMOVED*** from 'rxjs';
import ***REMOVED***HttpClient, HttpHeaders, HttpParams***REMOVED*** from '@angular/common/http';
import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';
import ***REMOVED***IResponseTemplate***REMOVED*** from "./response-template";
import ***REMOVED***Userinfo***REMOVED*** from "../userinfo/userinfo.model";

const header: HttpHeaders = new HttpHeaders(***REMOVED***
    'X-CSRFToken': Cookie.get('csrftoken')
***REMOVED***);

/**
 * Service which provides user methods.
 */
@Injectable()
export class UserService ***REMOVED***
    constructor(private http: HttpClient) ***REMOVED***
    ***REMOVED***

    getLoginElixirName(): Observable<IResponseTemplate> ***REMOVED***

        return this.http.get<IResponseTemplate>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/current/logins/`, ***REMOVED***
            withCredentials: true
        ***REMOVED***)
    ***REMOVED***

    getPreferredMailUser(): Observable<IResponseTemplate> ***REMOVED***

        return this.http.get<IResponseTemplate>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/current/preferredEmail/`, ***REMOVED***
            withCredentials: true
        ***REMOVED***)
    ***REMOVED***

    requestChangePreferredMailUser(email: string): Observable<any> ***REMOVED***
        const params: HttpParams = new HttpParams().set('newPreferredEmail', email);

        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/current/preferredEmail/`, params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***)
    ***REMOVED***

    getPendingPreferredMailUser(): Observable<IResponseTemplate> ***REMOVED***

        return this.http.get<IResponseTemplate>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/current/pendingPreferredEmails/`, ***REMOVED***
            withCredentials: true
        ***REMOVED***)
    ***REMOVED***

    getMemberDetailsByElixirId(elixir_id: string): Observable<any> ***REMOVED***
        elixir_id = elixir_id.substring(0, elixir_id.indexOf('@'));

        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/$***REMOVED***elixir_id***REMOVED***/member/`, ***REMOVED***
            withCredentials: true

        ***REMOVED***)

    ***REMOVED***

    getUserInfo(): Observable<any> ***REMOVED***

        return this.http.get<any>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/current/userInfo/`, ***REMOVED***
            withCredentials: true

        ***REMOVED***)
    ***REMOVED***


    getLoggedUser(): Observable<any> ***REMOVED***
        const params: HttpParams = new HttpParams().set('redirect_after_login', 'redirect');

        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/current/`, ***REMOVED***
            withCredentials: true,
            params: params

        ***REMOVED***)
    ***REMOVED***

    getLoggedUserWithRedirect(redirect?: string): Observable<any> ***REMOVED***
        if (redirect && redirect != '/userinfo' && redirect != 'redirect') ***REMOVED***
            const params: HttpParams = new HttpParams().set('redirect_after_login', redirect);
            return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/current/`, ***REMOVED***
                withCredentials: true,
                params: params

            ***REMOVED***)
        ***REMOVED*** else ***REMOVED***
            return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/current/`, ***REMOVED***
                withCredentials: true,

            ***REMOVED***)
        ***REMOVED***


    ***REMOVED***

    getMemberByUser(): Observable<any> ***REMOVED***

        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/current/member/`, ***REMOVED***
            withCredentials: true
        ***REMOVED***)
    ***REMOVED***

    getMemberByExtSourceNameAndExtLogin(ext_login: string): Observable<any> ***REMOVED***

        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/current/extLogin/member/`, ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***
                extLogin: ext_login
            ***REMOVED***
        ***REMOVED***)
    ***REMOVED***

    setNewsletterSubscriptionWhenSubscribed(): Observable<IResponseTemplate> ***REMOVED***
        const params: HttpParams = new HttpParams().set('subscribed', true.toString());

        return this.http.post<IResponseTemplate>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***newsletter/subscription/`, params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***)

    ***REMOVED***

    setNewsletterSubscriptionWhenNotSubscribed(): Observable<IResponseTemplate> ***REMOVED***
        const params: HttpParams = new HttpParams().set('subscribed', false.toString());

        return this.http.post<IResponseTemplate>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***newsletter/subscription/`, params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***)

    ***REMOVED***

    getNewsletterSubscription(): Observable<IResponseTemplate> ***REMOVED***

        return this.http.get<IResponseTemplate>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***newsletter/subscription/`, ***REMOVED***
            withCredentials: true
        ***REMOVED***)

    ***REMOVED***

    sendHelpMail(subject: string, message: string, reply: string): Observable<IResponseTemplate> ***REMOVED***

        const params: HttpParams = new HttpParams().set('subject', subject).set('message', message).set('reply', reply);

        return this.http.post<IResponseTemplate>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/current/helpMail/`, params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***)
    ***REMOVED***

    getFilteredMembersOfdeNBIVo(searchString: string): Observable<any> ***REMOVED***

        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/filter/`, ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***
                searchString: searchString
            ***REMOVED***
        ***REMOVED***)

    ***REMOVED***

***REMOVED***
