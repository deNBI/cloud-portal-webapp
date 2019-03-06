import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {URLSearchParams} from '@angular/http';
import {ApiSettings} from './api-settings.service';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Cookie} from 'ng2-cookies/ng2-cookies';

const header = new HttpHeaders({
    'X-CSRFToken': Cookie.get('csrftoken')
});


@Injectable()
export class UserService {
    constructor(private http: HttpClient, private settings: ApiSettings) {
    }

    setUserFacilityPassword(facility: string): Observable<any> {
        const params = new HttpParams().set('facility', facility)

        ;
        return this.http.post(this.settings.getConnectorBaseUrl() + 'users/setUserPassword/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));
    }

    getLogins(): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'users/current/logins/',
            {
                withCredentials: true,
            }).pipe(catchError((error: any) => throwError(error)));
    }


    getPreferredMailUser(): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'users/current/preferredEmail/',
            {
                withCredentials: true,
            }).pipe(catchError((error: any) => throwError(error)));
    }

    requestChangePreferredMailUser(email: string): Observable<any> {
        const params = new HttpParams().set('newPreferredEmail', email);


        return this.http.post(this.settings.getApiBaseURL() + 'users/current/preferredEmail/', params,
            {
                withCredentials: true,
                headers: header,
            }).pipe(catchError((error: any) => throwError(error)));
    }


    getPendingPreferredMailUser(): Observable<any> {


        return this.http.get(this.settings.getApiBaseURL() + 'users/current/pendingPreferredEmails/',
            {
                withCredentials: true,
            }).pipe(catchError((error: any) => throwError(error)));
    }


    getMemberDetailsByElixirId(elixir_id: string) {
        elixir_id = elixir_id.substring(0, elixir_id.indexOf('@'));
        return this.http.get(this.settings.getApiBaseURL() + 'users/' + elixir_id + '/member/',
            {
                withCredentials: true,

            }).pipe(catchError((error: any) => throwError(error)));

    }

    isMember(userid: string) {
        return this.http.get(this.settings.getApiBaseURL() + 'users/' + userid + '/member/status/',
            {
                withCredentials: true,
            }).pipe(catchError((error: any) => throwError(error)));

    }

    getuserAffiliations(user_id: number) {
        return this.http.get(this.settings.getApiBaseURL() + 'users/' + user_id.toString() + '/affiliations/',
            {
                withCredentials: true,

            }).pipe(catchError((error: any) => throwError(error)));

    }

    getLoggedUser(): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'users/current/',
            {
                withCredentials: true,

            }).pipe(catchError((error: any) => throwError(error)));
    }

    getMemberByUser(): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + `users/current/member/`, {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));
    }


    getMemberByExtSourceNameAndExtLogin(ext_login: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + `users/current/extLogin/member/`, {
            withCredentials: true,
            params: {

                extLogin: ext_login,

            }
        }).pipe(catchError((error: any) => throwError(error)));
    }


    getVosWhereUserIsAdmin(): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'users/current/adminVos/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));
        ;
    }

    getGroupsWhereUserIsAdmin(): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'users/current/adminGroups/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));
        ;
    }

    setNewsletterSubscription(subscribed: boolean): Observable<any> {
        const params = new HttpParams().set('subscribed', subscribed.toString());

        return this.http.post(this.settings.getApiBaseURL() + 'newsletter/subscription/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));

    }

    getNewsletterSubscription(): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'newsletter/subscription/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));


    }

    sendHelpMail(subject, message, reply): Observable<any> {

        const params = new HttpParams().set('subject', subject).set('message', message).set('reply', reply);


        return this.http.post(this.settings.getApiBaseURL() + 'users/current/helpMail/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));

    }

    getFilteredMembersOfdeNBIVo(searchString: string, groupid: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'users/filter/', {
            withCredentials: true,
            params: {
                searchString: searchString,
            }
        }).pipe(catchError((error: any) => throwError(error)));


    }


}
