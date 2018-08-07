import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Cookie} from 'ng2-cookies/ng2-cookies';


const http_header_json_csrf = new HttpHeaders({
    'X-CSRFToken': Cookie.get("csrftoken"),
    'Content-Type': 'application/json'
});

const http_header_csrf = new HttpHeaders({
    'X-CSRFToken': Cookie.get("csrftoken")
});

@Injectable()
export class ApplicationsService {
    constructor(private http: HttpClient, private settings: ApiSettings) {
    }


    getUserApplications(): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'project_applications/', {
            headers: http_header_json_csrf,
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));
    }

    getAllApplications(): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'all_applications/', {
            withCredentials: true,
            headers: http_header_json_csrf,

        }).pipe(catchError((error: any) => throwError(error)));

    }

    addNewApplication(data): Observable<any> {
        let parameter = data;


        return this.http.post(this.settings.getApiBaseURL() + 'add_application/', parameter,
            {
                headers: http_header_json_csrf,
                withCredentials: true
            }).pipe(catchError((error: any) => throwError(error)));

    }


    requestRenewal(data): Observable<any> {
        let parameter = data;

        return this.http.post(this.settings.getApiBaseURL() + 'application/requestRenewal/', parameter,
            {
                headers: http_header_json_csrf,
                withCredentials: true
            }).pipe(catchError((error: any) => throwError(error)));

    }

    approveRenewal(application_id: number): Observable<any> {


        let params = new HttpParams();
        params = params.append('project_application_id', application_id.toString());

        return this.http.post(this.settings.getApiBaseURL() + 'application/approveRenewal/',
            {
                headers: http_header_csrf,
                withCredentials: true,
                params: params
            }).pipe(catchError((error: any) => throwError(error)));

    }

    declineRenewal(application_id: number): Observable<any> {

        let params = new HttpParams();
        params = params.append('project_application_id', application_id.toString());

        return this.http.post(this.settings.getApiBaseURL() + 'application/declineRenewal/',
            {
                headers: http_header_csrf,
                withCredentials: true,
                params: params
            }).pipe(catchError((error: any) => throwError(error)));

    }


    getAllApplicationsRenewalRequests(): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'application/applicationRenewalRequests/', {
            withCredentials: true,
            headers: http_header_json_csrf,

        }).pipe(catchError((error: any) => throwError(error)));

    }

    getApplicationsRenewalRequest(application_id: number): Observable<any> {
        let params = new HttpParams().set('project_application_id', application_id.toString());
        return this.http.get(this.settings.getApiBaseURL() + 'application/getApplicationRenewalRequestById/', {
            withCredentials: true,
            headers: http_header_json_csrf,
            params: params
        }).pipe(catchError((error: any) => throwError(error)));

    }


    deleteApplication(application_id: number): Observable<any> {

        let params = new HttpParams().set('project_application_id', application_id.toString());

        return this.http.post(this.settings.getApiBaseURL() + 'delete_application/deleteApplicationById/',
            {
                headers: http_header_csrf,
                withCredentials: true,
                params: params
            }).pipe(catchError((error: any) => throwError(error)));

    }


}
