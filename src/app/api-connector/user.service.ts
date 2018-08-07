import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {URLSearchParams} from '@angular/http';
import {ApiSettings} from './api-settings.service';
import {Observable, throwError} from 'rxjs';
import {catchError } from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { map } from 'rxjs/operators';

import {Cookie} from 'ng2-cookies/ng2-cookies';
import 'rxjs/add/operator/catch';

const header = new HttpHeaders({
    'X-CSRFToken': Cookie.get("csrftoken")
});




@Injectable()
export class UserService {
    constructor(private http: HttpClient, private settings: ApiSettings) {
    }

    setUserFacilityPassword(facility: string): Observable<any> {
       let params = new HttpParams();
        params.append('facility',facility);
        return this.http.post(this.settings.getConnectorBaseUrl() + 'user/setUserPassword/', facility, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));
    }

    getLogins(): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'user/getLogins/',
            {
                withCredentials: true,
            }).pipe(catchError((error: any) => throwError(error)));
    }

    getLoggedUser():Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'user/getLoggedUser/',
            {
                withCredentials: true,

            }).pipe(catchError((error: any) => throwError(error)));
    }

    getMemberByUser():Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + `user/getMemberByUser/`, {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));
    }


    getMemberByExtSourceNameAndExtLogin(ext_login: string):Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + `user/getMemberByExtSourceNameAndExtLogin/`, {
            withCredentials: true,
            params: {

                extLogin: ext_login,

            }
        }).pipe(catchError((error: any) => throwError(error)));
    }


    getVosWhereUserIsAdmin():Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'user/getVosWhereUserIsAdmin/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));;
    }

    getGroupsWhereUserIsAdmin():Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'user/getGroupsWhereUserIsAdmin/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));;
    }

    setNewsletterSubscription(subscribed: boolean): Observable<any> {
        let params = new HttpParams();
        params.append('subscribed', subscribed.toString());

        return this.http.post(this.settings.getApiBaseURL() + 'newsletter/setNewsletterSubscription/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));;
    }

    getNewsletterSubscription(): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'newsletter/getNewsletterSubscription/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));;


    }

    sendHelpMail(subject, message, reply): Observable<any> {

        let params = new HttpParams();
        params.append('subject', subject);
        params.append('message',message);
        params.append('reply',reply);


        return this.http.post(this.settings.getApiBaseURL() + 'user/sendHelpMail/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));

    }

    getFilteredMembersOfdeNBIVo(firstname: string, lastName: string, groupid: string):Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'user/getFilteredMembers/', {
            withCredentials: true,
            params: {
                firstName: firstname,
                lastName: lastName,
                groupid: groupid
            }
        }).pipe(catchError((error: any) => throwError(error)));


    }


}
