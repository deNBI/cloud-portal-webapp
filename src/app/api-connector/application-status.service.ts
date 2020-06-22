import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ApplicationStatus} from '../applications/application_status.model';

/**
 * Service which delivers functions for getting and setting Application status.
 */
@Injectable()
export class ApplicationStatusService {
    constructor(private http: HttpClient) {
    }

    /**
     * Get all application stati.
     * @returns {Observable<any>} List of all application stati
     */
    getAllApplicationStatus(): Observable<ApplicationStatus[]> {
        return this.http.get<ApplicationStatus[]>(`${ApiSettings.getApiBaseURL()}application_status/`, {
            withCredentials: true
        })
    }

    /**
     * Set status for an application.
     * @param {number} application_id id of the application
     * @param {number} status_id id of the status to set
     * @returns {Observable<any>} 200 if successfull
     */
    setApplicationStatus(application_id: number | string, status_id: number | string): Observable<any> {

        const params: HttpParams = new HttpParams().set('project_application_status', status_id.toString());

        return this.http.patch(`${ApiSettings.getApiBaseURL()}project_applications/${application_id}/`, params, {
            withCredentials: true
        })
    }

}
