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


     getComputeCenters(): Observable<any> {


        return this.http.get(this.settings.getApiBaseURL() + 'computecenters/', {
            withCredentials: true,

        }).pipe(catchError((error: any) => throwError(error.error)));
    }

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
    getFacilityAllowedGroupsWithDetailsAndSpecificStatus(facility:number,status:number): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'computecenters/'+facility + '/projects/' , {
            withCredentials: true,
            params: {status: status}

        }).pipe(catchError((error: any) => throwError(error)));


    }


     getFacilityApplicationsWaitingForConfirmation(facility:number): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'computecenters/'+facility + '/applications/' , {
            withCredentials: true,

        }).pipe(catchError((error: any) => throwError(error)));


    }

    sendMailToFacility(facility, subject, message, reply?): Observable<any> {
        let params = new HttpParams().set('subject', subject).set('facility_id', facility).set('message', message).set('reply', reply);

        return this.http.post(this.settings.getApiBaseURL() + 'facilityManagers/current/facilityMail/', params, {
            withCredentials: true,
            headers: header,
            observe: 'response'
        }).pipe(catchError((error: any) => throwError(error)));


    }

}
