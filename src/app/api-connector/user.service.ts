import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Cookie} from 'ng2-cookies/ng2-cookies';

const header: HttpHeaders = new HttpHeaders({
    'X-CSRFToken': Cookie.get('csrftoken')
});

/**
 * Service which provides user methods.
 */
@Injectable()
export class UserService {
    constructor(private http: HttpClient) {
    }

    setUserFacilityPassword(facility: string): Observable<any> {
        const params: HttpParams = new HttpParams().set('facility', facility);

        return this.http.post(`${ApiSettings.getApiBaseURL()}users/setUserPassword/`, params, {
            withCredentials: true,
            headers: header
        })
    }

    getLogins(): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}users/current/logins/`, {
            withCredentials: true
        })
    }

    getPreferredMailUser(): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}users/current/preferredEmail/`, {
            withCredentials: true
        })
    }

    requestChangePreferredMailUser(email: string): Observable<any> {
        const params: HttpParams = new HttpParams().set('newPreferredEmail', email);

        return this.http.post(`${ApiSettings.getApiBaseURL()}users/current/preferredEmail/`, params, {
            withCredentials: true,
            headers: header
        })
    }

    getPendingPreferredMailUser(): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}users/current/pendingPreferredEmails/`, {
            withCredentials: true
        })
    }

    getMemberDetailsByElixirId(elixir_id: string): Observable<any> {
        elixir_id = elixir_id.substring(0, elixir_id.indexOf('@'));

        return this.http.get(`${ApiSettings.getApiBaseURL()}users/${elixir_id}/member/`, {
            withCredentials: true,

        })

    }

    isMember(userid: string): Observable<any> {
        return this.http.get(`${ApiSettings.getApiBaseURL()}users/${userid}/member/status/`, {
            withCredentials: true
        })

    }

    getuserAffiliations(user_id: number): Observable<any> {
        return this.http.get(`${ApiSettings.getApiBaseURL()}users/${user_id.toString()}/affiliations/`, {
            withCredentials: true

        })

    }

    getLoggedUser(): Observable<any> {
        return this.http.get(`${ApiSettings.getApiBaseURL()}users/current/`, {
            withCredentials: true

        })
    }

    getMemberByUser(): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}users/current/member/`, {
            withCredentials: true,
        })
    }

    getMemberByExtSourceNameAndExtLogin(ext_login: string): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}users/current/extLogin/member/`, {
            withCredentials: true,
            params: {
                extLogin: ext_login
            }
        })
    }

    getVosWhereUserIsAdmin(): Observable<any> {
        return this.http.get(`${ApiSettings.getApiBaseURL()}users/current/adminVos/`, {
            withCredentials: true
        })
    }

    getGroupsWhereUserIsAdmin(): Observable<any> {
        return this.http.get(`${ApiSettings.getApiBaseURL()}users/current/adminGroups/`, {
            withCredentials: true
        })
    }

    setNewsletterSubscription(subscribed: boolean): Observable<any> {
        const params: HttpParams = new HttpParams().set('subscribed', subscribed.toString());

        return this.http.post(`${ApiSettings.getApiBaseURL()}newsletter/subscription/`, params, {
            withCredentials: true,
            headers: header
        })

    }

    getNewsletterSubscription(): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}newsletter/subscription/`, {
            withCredentials: true
        })

    }

    sendHelpMail(subject: string, message: string, reply: string): Observable<any> {

        const params: HttpParams = new HttpParams().set('subject', subject).set('message', message).set('reply', reply);

        return this.http.post(`${ApiSettings.getApiBaseURL()}users/current/helpMail/`, params, {
            withCredentials: true,
            headers: header
        })
    }

    getFilteredMembersOfdeNBIVo(searchString: string, groupid: string): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}users/filter/`, {
            withCredentials: true,
            params: {
                searchString: searchString
            }
        })

    }

}
