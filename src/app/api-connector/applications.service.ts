import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Cookie} from 'ng2-cookies/ng2-cookies';


const header = new HttpHeaders({
    'X-CSRFToken': Cookie.get("csrftoken"),
    'Content-Type': 'application/json'

});

const header_csrf = new HttpHeaders({
    'X-CSRFToken': Cookie.get("csrftoken"),
    'Content-Type': 'application/json'

});

@Injectable()
export class ApplicationsService {
    constructor(private http: HttpClient, private settings: ApiSettings) {
    }


    getUserApplications(): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'users/current/project_applications/', {
            headers: header_csrf,
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));
    }

    getUserApplication(project_id:string):Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'users/current/project_applications/' + project_id + '/', {
            headers: header_csrf,
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));
    }

    getApplication(app_id:string):Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'project_applications/' + app_id + '/', {
            headers: header_csrf,
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));
    }

    getAllApplications(): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'project_applications/', {
            withCredentials: true,
            headers: header_csrf,

        }).pipe(catchError((error: any) => throwError(error)));

    }

    addNewApplication(data): Observable<any> {
        let parameter = data;


        return this.http.post(this.settings.getApiBaseURL() + 'project_applications/', parameter,
            {
                headers: header,
                withCredentials: true
            }).pipe(catchError((error: any) => throwError(error)));

    }


    requestRenewal(data): Observable<any> {
        let parameter = data;

        return this.http.post(this.settings.getApiBaseURL() + 'applicationRenewals/', parameter,
            {
                headers: header,
                withCredentials: true
            }).pipe(catchError((error: any) => throwError(error)));

    }

    approveRenewal(application_id: number): Observable<any> {


        return this.http.post(this.settings.getApiBaseURL() +  'applicationRenewals/'  + application_id + '/status/',null, {
            headers: header_csrf,
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));

    }

    declineRenewal(application_id: number): Observable<any> {


        return this.http.delete(this.settings.getApiBaseURL() + 'applicationRenewals/' +application_id + '/status/',
            {
                headers: header_csrf,
                withCredentials: true,
            }).pipe(catchError((error: any) => throwError(error)));

    }


    getAllApplicationsRenewalRequests(): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'applicationsRenewals/', {
            withCredentials: true,
            headers: header_csrf,

        }).pipe(catchError((error: any) => throwError(error)));

    }

    getApplicationsRenewalRequest(application_id: number): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'applicationsRenewals/' + application_id + '/', {
            withCredentials: true,
            headers: header_csrf,
        }).pipe(catchError((error: any) => throwError(error)));

    }


    deleteApplication(application_id: number): Observable<any> {


        return this.http.delete(this.settings.getApiBaseURL() +'project_applications/' + application_id +'/',
            {
                headers: header_csrf,
                withCredentials: true,
            }).pipe(catchError((error: any) => throwError(error)));

    }


}
