import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {URLSearchParams} from '@angular/http';
import {ApiSettings} from './api-settings.service';
import {map} from 'rxjs/operators';
import 'rxjs/add/operator/catch';
import {Observable, throwError} from 'rxjs';
import {catchError } from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {Cookie} from 'ng2-cookies/ng2-cookies';


const header = new HttpHeaders({
    'X-CSRFToken': Cookie.get("csrftoken")
});

@Injectable()
export class VoService {
    constructor(private http: HttpClient, private settings: ApiSettings) {
    }


    isVo(): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'vo_manager/isVoManager/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));
    }


    getNewsletterSubscriptionCounter(): Observable<any> {


        return this.http.get(this.settings.getApiBaseURL() + 'vo_manager/getNewsletterSubscriptionCounter/', {
            withCredentials: true,

        }).pipe(catchError((error: any) => throwError(error)));
    }


    getAllVoGroups(): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'vo_manager/getAllGroups/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));

    }

    getAllGroupsWithDetails(): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'vo_manager/getAllGroupsWithDetails/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));

    }

    sendNewsletterToVo(subject, message, reply?): Observable<any> {

         let params = new HttpParams();
        params.append('subject', subject);
        params.append('message', message);
        params.append('reply',reply);

        return this.http.post(this.settings.getApiBaseURL() + 'vo_manager/sendNewsletterToMembers/',params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));

    }


    sendMailToVo(subject, message, reply?): Observable<any> {
           let params = new HttpParams();
        params.append('subject', subject);
        params.append('message', message);
        params.append('reply',reply);


        return this.http.post(this.settings.getApiBaseURL() + 'vo_manager/sendMailToAllMembers/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));

    }


}
