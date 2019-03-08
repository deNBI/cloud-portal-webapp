import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {Cookie} from 'ng2-cookies/ng2-cookies';

const header: HttpHeaders = new HttpHeaders({
    'X-CSRFToken': Cookie.get('csrftoken')
});

/**
 * Service which provides vo methods.
 */
@Injectable()
export class VoService {
    constructor(private http: HttpClient) {
    }

    isVo(): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}voManagers/current/status/`, {
            withCredentials: true
        })
    }

    getNewsletterSubscriptionCounter(): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}newsletter/subscription/counter/`, {
            withCredentials: true

        })
    }

    getAllVoGroups(): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}vo/projects/`, {
            withCredentials: true
        })

    }

    removeResourceFromGroup(groupid: string): Observable<any> {
        return this.http.delete(`${ApiSettings.getApiBaseURL()}vo/projects/${groupid}/resource/`, {
            withCredentials: true,
            headers: header
        })

    }

    getAllGroupsWithDetails(): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}vo/projects/details/`, {
            withCredentials: true
        })

    }

    getProjectStatus(groupid: number): Observable<any> {
        return this.http.get(`${ApiSettings.getApiBaseURL()}vo/projects/' + groupid + '/status/`, {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error.error)));
    }

    getVoProjectResources(): Observable<any> {
        return this.http.get(`${ApiSettings.getApiBaseURL()}vo/projects/resources/`, {
            withCredentials: true,
            headers: header
        })
    }

    setProjectStatus(groupid: number, status: number): Observable<any> {
        const params: HttpParams = new HttpParams().set('status', status.toString());

        return this.http.post(`${ApiSettings.getApiBaseURL()}vo/projects/${groupid}/status/`, params, {
            withCredentials: true,
            headers: header
        })
    }

    sendNewsletterToVo(subject: string, message: string, reply?: string): Observable<any> {

        const params: HttpParams = new HttpParams().set('subject', subject).set('message', message).set('reply', reply);

        return this.http.post(`${ApiSettings.getApiBaseURL()}voManagers/current/newsletter/`, params, {
            withCredentials: true,
            headers: header
        })

    }

    sendMailToVo(subject: string, message: string, reply?: string): Observable<any> {
        const params: HttpParams = new HttpParams().set('subject', subject).set('message', message).set('reply', reply);

        return this.http.post(`${ApiSettings.getApiBaseURL()}voManagers/current/voMail/`, params, {
            withCredentials: true,
            headers: header
        })

    }

    /**
     * Get members of a project with emails.
     * @param {number} groupid id of the the group
     * @returns {Observable<any>}
     */
    getVoGroupRichMembers(groupid: number): Observable<any> {
        return this.http.get(`${ApiSettings.getApiBaseURL()}vo/projects/${groupid}/members/`, {
            withCredentials: true
        })
    }

}
