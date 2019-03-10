import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Cookie} from 'ng2-cookies/ng2-cookies';

const header: HttpHeaders = new HttpHeaders({
    'X-CSRFToken': Cookie.get('csrftoken')
});

/**
 * Service which provides methods for the facilities.
 */
@Injectable()
export class FacilityService {
    constructor(private http: HttpClient) {
    }

    /**
     * Get all available computecenters.
     * @returns {Observable<any>}
     */
    getComputeCenters(): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/`, {
            withCredentials: true

        })
    }

    /**
     * Get all facility, where the current user is manager.
     * @returns {Observable<any>}
     */
    getManagerFacilities(): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}facilityManagers/current/facilities/`, {
            withCredentials: true
        })

    }

    /**
     * Get allowed groups from a facility with a specific status.
     * @param {number} facility
     * @param {number} status
     * @returns {Observable<any>}
     */
    getFacilityAllowedGroupsWithDetailsAndSpecificStatus(facility: number, status: number): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/projects/`, {
            withCredentials: true,
            params: {status: status.toString()}

        })

    }

    /**
     * Get all resources assigned to a facility.
     * @param {number} facility id of the facility
     * @returns {Observable<any>}
     */
    getFacilityResources(facility: number): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/projects/resources/`, {
            withCredentials: true

        })

    }

    /**
     * Gets all facility applications which are waiting for conirmation.
     * @param {number} facility
     * @returns {Observable<any>}
     */
    getFacilityApplicationsWaitingForConfirmation(facility: number): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/applications/`, {
            withCredentials: true

        })

    }

    /**
     * Gets all facility applications history.
     * @param {number} facility
     * @returns {Observable<any>}
     */
    getFacilityApplicationsHistory(facility: number): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/applications_history/`, {
            withCredentials: true
        })

    }

    /**
     * Gets all facility modification applications which are waiting for conirmation.
     * @param {number} facility
     * @returns {Observable<any>}
     */
    getFacilityModificationApplicationsWaitingForConfirmation(facility: number): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/modification_applications/`, {
            withCredentials: true

        })
    }

    /**
     * Approves an facility application.
     * @param {number} facility
     * @param {number} application_id
     * @returns {Observable<any>}
     */
    approveFacilityApplication(facility: number, application_id: number): Observable<any> {
        const params: HttpParams = new HttpParams().set('action', 'approve');

        return this.http.post(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/applications/${application_id}/status/`, params, {
            withCredentials: true,
            headers: header,
            observe: 'response'
        })
    }

    /**
     * Declines an application for the facility
     * @param {number} facility
     * @param {number} application_id
     * @returns {Observable<any>}
     */
    declineFacilityApplication(facility: number, application_id: number): Observable<any> {
        const params: HttpParams = new HttpParams().set('action', 'decline');

        return this.http.post(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/applications/${application_id}/status/`, params, {
            withCredentials: true,
            headers: header,
            observe: 'response'
        })
    }

    /**
     * Sends an email to all members of the facility.
     * @param facility facility where to send the email
     * @param subject subject of the email
     * @param message message from the email
     * @param reply reply address
     * @returns {Observable<any>}
     */
    sendMailToFacility(facility: string, subject: string, message: string, reply?: string): Observable<any> {
        const params: HttpParams = new HttpParams().set('subject', subject)
            .set('facility_id', facility).set('message', message).set('reply', reply);

        return this.http.post(`${ApiSettings.getApiBaseURL()}facilityManagers/current/facilityMail/`, params, {
                withCredentials: true,
                headers: header,
                observe: 'response'
            }
        )
    }

    /**
     * Get Members of a project with emails.
     * @param {number} groupid id of the group
     * @param {number} facility id of the facility
     * @returns {Observable<any>}
     */
    getFacilityGroupRichMembers(groupid: number, facility: number): Observable<any> {
        return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/projects/${groupid}/members/`, {
                withCredentials: true
            }
        )
    }

}
