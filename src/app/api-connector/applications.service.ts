import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cookie} from 'ng2-cookies/ng2-cookies';


const header: HttpHeaders = new HttpHeaders({
    'X-CSRFToken': Cookie.get('csrftoken'),
    'Content-Type': 'application/json'

});

const header_csrf: HttpHeaders = new HttpHeaders({
    'X-CSRFToken': Cookie.get('csrftoken'),
    'Content-Type': 'application/json'

});

@Injectable()
export class ApplicationsService {
    constructor(private http: HttpClient) {
    }

    getUserApplications(): Observable<any> {
        return this.http.get(`${ApiSettings.getApiBaseURL()}users/current/project_applications/`, {
            headers: header_csrf,
            withCredentials: true,
        })
    }

    getUserApplication(project_id: string): Observable<any> {
        return this.http.get(`${ApiSettings.getApiBaseURL()}users/current/project_applications/${ project_id }/`, {
            headers: header_csrf,
            withCredentials: true
        })
    }

    getApplication(app_id: string): Observable<any> {
        return this.http.get(`${ApiSettings.getApiBaseURL()}project_applications/${app_id}/`, {
            headers: header_csrf,
            withCredentials: true
        })
    }

    getApplicationClient(app_id: string): Observable<any> {
        return this.http.get(`${ApiSettings.getApiBaseURL()}project_applications/${app_id}/client/`, {
            headers: header_csrf,
            withCredentials: true
        })
    }

    /**
     * Checks if some client has the ressource avaiable for an application.
     * @param {string} app_id
     * @returns {Observable<any>}
     */
    getApplicationClientAvaiable(app_id: string): Observable<any> {
        return this.http.get(`${ApiSettings.getApiBaseURL()}project_applications/${app_id}/clients/resource/`, {
            headers: header_csrf,
            withCredentials: true,
        })
    }

    getAllApplications(): Observable<any> {
        return this.http.get(`${ApiSettings.getApiBaseURL()}project_applications/`, {
            withCredentials: true,
            headers: header_csrf

        })

    }

    addNewApplication(data: string): Observable<any> {
        const parameter: string = data;

        return this.http.post(`${ApiSettings.getApiBaseURL()}project_applications/`, parameter, {
            headers: header,
            withCredentials: true
        })

    }

    requestRenewal(data: string): Observable<any> {
        const parameter: string = data;

        return this.http.post(`${ApiSettings.getApiBaseURL()}applicationRenewals/`, parameter, {
            headers: header,
            withCredentials: true
        })

    }

    approveRenewal(application_id: number): Observable<any> {

        return this.http.post(`${ApiSettings.getApiBaseURL()}applicationRenewals/${application_id}/status/`, null, {
            headers: header_csrf,
            withCredentials: true
        })

    }

    declineRenewal(application_id: number): Observable<any> {

        return this.http.delete(`${ApiSettings.getApiBaseURL()}applicationRenewals/${application_id}/status/`, {
            headers: header_csrf,
            withCredentials: true
        })

    }

    getAllApplicationsRenewalRequests(): Observable<any> {
        return this.http.get(`${ApiSettings.getApiBaseURL()}applicationsRenewals/`, {
            withCredentials: true,
            headers: header_csrf

        })

    }

    getApplicationsRenewalRequest(application_id: number): Observable<any> {
        return this.http.get(`${ApiSettings.getApiBaseURL()}applicationsRenewals/${application_id}/`, {
            withCredentials: true,
            headers: header_csrf
        })

    }

    deleteApplication(application_id: number): Observable<any> {

        return this.http.delete(`${ApiSettings.getApiBaseURL()}project_applications/${application_id}/`, {
            headers: header_csrf,
            withCredentials: true,
        })

    }


}
