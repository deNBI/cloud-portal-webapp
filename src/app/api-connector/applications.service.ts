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
        return this.http.get(this.settings.getApiBaseURL() + 'project_applications/', {
            headers: header_csrf,
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));
    }

    getAllApplications(): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'all_applications/', {
            withCredentials: true,
            headers: header_csrf,

        }).pipe(catchError((error: any) => throwError(error)));

    }

    addNewApplication(data): Observable<any> {
        let parameter = data;


        return this.http.post(this.settings.getApiBaseURL() + 'add_application/', parameter,
            {
                headers: header,
                withCredentials: true
            }).pipe(catchError((error: any) => throwError(error)));

    }


    requestRenewal(data): Observable<any> {
        let parameter = data;

        return this.http.post(this.settings.getApiBaseURL() + 'application/requestRenewal/', parameter,
            {
                headers: header,
                withCredentials: true
            }).pipe(catchError((error: any) => throwError(error)));

    }

    approveRenewal(application_id: number): Observable<any> {


        return this.http.post(this.settings.getApiBaseURL() + 'application/approveRenewal/', {'project_application_id': application_id}, {
            headers: header_csrf,
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));

    }

    declineRenewal(application_id: number): Observable<any> {


        return this.http.post(this.settings.getApiBaseURL() + 'application/declineRenewal/', {'project_application_id': application_id},
            {
                headers: header_csrf,
                withCredentials: true,
            }).pipe(catchError((error: any) => throwError(error)));

    }


    getAllApplicationsRenewalRequests(): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'application/applicationRenewalRequests/', {
            withCredentials: true,
            headers: header_csrf,

        }).pipe(catchError((error: any) => throwError(error)));

    }

    getApplicationsRenewalRequest(application_id: number): Observable<any> {
        let params = new HttpParams().set('project_application_id', application_id.toString());
        return this.http.get(this.settings.getApiBaseURL() + 'application/getApplicationRenewalRequestById/', {
            withCredentials: true,
            headers: header_csrf,
            params: params
        }).pipe(catchError((error: any) => throwError(error)));

    }


    deleteApplication(application_id: number): Observable<any> {


        return this.http.post(this.settings.getApiBaseURL() + 'application/deleteApplicationById/',{'project_application_id':application_id},
            {
                headers: header_csrf,
                withCredentials: true,
            }).pipe(catchError((error: any) => throwError(error)));

    }


}
