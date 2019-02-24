import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Cookie} from 'ng2-cookies/ng2-cookies';

const header = new HttpHeaders({
    'X-CSRFToken': Cookie.get("csrftoken")
});


@Injectable()
export class FacilityService {
    constructor(private http: HttpClient, private settings: ApiSettings) {
    }


    /**
     * Get all available computecenters.
     * @returns {Observable<any>}
     */
    getComputeCenters(): Observable<any> {


        return this.http.get(this.settings.getApiBaseURL() + 'computecenters/', {
            withCredentials: true,

        }).pipe(catchError((error: any) => throwError(error.error)));
    }

    /**
     * Get all facility, where the current user is manager.
     * @returns {Observable<any>}
     */
    getManagerFacilities(): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'facilityManagers/current/facilities/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));

    }


    /**
     * Get allowed groups from a facility with a specific status.
     * @param {number} facility
     * @param {number} status
     * @returns {Observable<any>}
     */
    getFacilityAllowedGroupsWithDetailsAndSpecificStatus(facility: number, status: number): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'computecenters/' + facility + '/projects/', {
            withCredentials: true,
            params: {status: status.toString()}

        }).pipe(catchError((error: any) => throwError(error)));


    }

    getFacilityResources(facility: number): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'computecenters/' + facility + '/projects/resources/', {
            withCredentials: true,


        }).pipe(catchError((error: any) => throwError(error)));


    }


    /**
     * Gets all facility applications which are waiting for conirmation.
     * @param {number} facility
     * @returns {Observable<any>}
     */
    getFacilityApplicationsWaitingForConfirmation(facility: number): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'computecenters/' + facility + '/applications/', {
            withCredentials: true,

        }).pipe(catchError((error: any) => throwError(error)));


    }



      /**
     * Gets all facility modification applications which are waiting for conirmation.
     * @param {number} facility
     * @returns {Observable<any>}
     */
    getFacilityModificationApplicationsWaitingForConfirmation(facility: number): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'computecenters/' + facility + '/modification_applications/', {
            withCredentials: true,

        }).pipe(catchError((error: any) => throwError(error)));


    }

    /**
     * Approves an facility application.
     * @param {number} facility
     * @param {number} application_id
     * @returns {Observable<any>}
     */
    approveFacilityApplication(facility: number, application_id: number): Observable<any> {
        let params = new HttpParams().set('action', 'approve');


        return this.http.post(this.settings.getApiBaseURL() + 'computecenters/' + facility + '/applications/' + application_id + '/status/', params, {
            withCredentials: true,
            headers: header,
            observe: 'response'
        }).pipe(catchError((error: any) => throwError(error)));


    }

    /**
     * Declines an application for the facility
     * @param {number} facility
     * @param {number} application_id
     * @returns {Observable<any>}
     */
    declineFacilityApplication(facility: number, application_id: number): Observable<any> {
        let params = new HttpParams().set('action', 'decline');


        return this.http.post(this.settings.getApiBaseURL() + 'computecenters/' + facility + '/applications/' + application_id + '/status/', params, {
            withCredentials: true,
            headers: header,
            observe: 'response'
        }).pipe(catchError((error: any) => throwError(error)));


    }

    /**
     * Sends an email to all members of the facility.
     * @param facility
     * @param subject
     * @param message
     * @param reply
     * @returns {Observable<any>}
     */
    sendMailToFacility(facility, subject, message, reply?): Observable<any> {
        let params = new HttpParams().set('subject', subject).set('facility_id', facility).set('message', message).set('reply', reply);

        return this.http.post(this.settings.getApiBaseURL() + 'facilityManagers/current/facilityMail/', params, {
            withCredentials: true,
            headers: header,
            observe: 'response'
        }).pipe(catchError((error: any) => throwError(error)));


    }

    /**
     * Get Members of a project with emails.
     * @param {number} groupid id of the group
     * @param {number} facility id of the facility
     * @returns {Observable<any>}
     */
    getFacilityGroupRichMembers(groupid: number, facility: number): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'computecenters/' + facility + '/projects/' + groupid + '/members/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error.error)));
    }

}
