import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {URLSearchParams} from '@angular/http';
import {ApiSettings} from './api-settings.service';
import {Observable, throwError} from 'rxjs';


import 'rxjs/add/operator/catch';
import {map} from 'rxjs/operators';



@Injectable()
export class UserService {
    constructor(private http: Http, private settings: ApiSettings) {
    }

    setUserFacilityPassword(facility: string): Observable<Response> {
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('facility', facility);

        return this.http.post(this.settings.getConnectorBaseUrl() + 'user/setUserPassword/', urlSearchParams, {
            withCredentials: true,
            headers: header,
        });
    }

    getLogins(): Observable<Response> {

        return this.http.get(this.settings.getApiBaseURL() + 'user/getLogins/',
            {
                withCredentials: true,
            });
    }

    getLoggedUser() {
        return this.http.get(this.settings.getApiBaseURL() + 'user/getLoggedUser/',
            {
                withCredentials: true,

            });
    }

    getMemberByUser() {

        return this.http.get(this.settings.getApiBaseURL() + `user/getMemberByUser/`, {
            withCredentials: true,
        });
    }


    getMemberByExtSourceNameAndExtLogin(ext_login: string) {

        return this.http.get(this.settings.getApiBaseURL() + `user/getMemberByExtSourceNameAndExtLogin/`, {
            withCredentials: true,
            params: {

                extLogin: ext_login,

            }
        });
    }


    getVosWhereUserIsAdmin() {
        return this.http.get(this.settings.getApiBaseURL() + 'user/getVosWhereUserIsAdmin/', {
            withCredentials: true,
        });
    }

    getGroupsWhereUserIsAdmin() {
        return this.http.get(this.settings.getApiBaseURL() + 'user/getGroupsWhereUserIsAdmin/', {
            withCredentials: true,
        });
    }

    setNewsletterSubscription(subscribed: boolean): Observable<any> {
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('subscribed', subscribed.toString());

        return this.http.post(this.settings.getApiBaseURL() + 'newsletter/setNewsletterSubscription/', urlSearchParams, {
            withCredentials: true,
            headers: header,
        });
    }

    getNewsletterSubscription(): Observable<any> {
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        return this.http.get(this.settings.getApiBaseURL() + 'newsletter/getNewsletterSubscription/', {
            withCredentials: true,
        });


    }

    sendHelpMail(subject, message, reply): Observable<any> {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('subject', subject);
        urlSearchParams.append('message', message);
        urlSearchParams.append('reply', reply);

        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        return this.http.post(this.settings.getApiBaseURL() + 'user/sendHelpMail/', urlSearchParams, {
            withCredentials: true,
            headers: header,
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))

    }

    getFilteredMembersOfdeNBIVo(firstname: string, lastName: string, groupid: string) {

        return this.http.get(this.settings.getApiBaseURL() + 'user/getFilteredMembers/', {
            withCredentials: true,
            params: {
                firstName: firstname,
                lastName: lastName,
                groupid: groupid
            }
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))


    }


}
