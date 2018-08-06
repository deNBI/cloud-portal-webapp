import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {URLSearchParams} from '@angular/http';
import {ApiSettings} from './api-settings.service';
import {map} from 'rxjs/operators';
import 'rxjs/add/operator/catch';
import {Observable, throwError} from 'rxjs';
import {catchError } from 'rxjs/operators';

@Injectable()
export class VoService {
    constructor(private http: Http, private settings: ApiSettings) {
    }


    isVo(): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'vo_manager/isVoManager/', {
            withCredentials: true,
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error.json().error || 'Server error')))
    }


    getNewsletterSubscriptionCounter(): Observable<any> {


        return this.http.get(this.settings.getApiBaseURL() + 'vo_manager/getNewsletterSubscriptionCounter/', {
            withCredentials: true,

        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error.json().error || 'Server error')))
    }


    getAllVoGroups(): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'vo_manager/getAllGroups/', {
            withCredentials: true,
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error.json().error || 'Server error')))

    }

    getAllGroupsWithDetails(): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'vo_manager/getAllGroupsWithDetails/', {
            withCredentials: true,
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error.json().error || 'Server error')))

    }

    sendNewsletterToVo(subject, message, reply?): Observable<any> {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('subject', subject);
        urlSearchParams.append('message', message);
        urlSearchParams.append('reply', reply)

        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        return this.http.post(this.settings.getApiBaseURL() + 'vo_manager/sendNewsletterToMembers/', urlSearchParams, {
            withCredentials: true,
            headers: header,
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error.json().error || 'Server error')))

    }


    sendMailToVo(subject, message, reply?): Observable<any> {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('subject', subject);
        urlSearchParams.append('message', message);
        urlSearchParams.append('reply', reply)

        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        return this.http.post(this.settings.getApiBaseURL() + 'vo_manager/sendMailToAllMembers/', urlSearchParams, {
            withCredentials: true,
            headers: header,
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error.json().error || 'Server error')))

    }


}
