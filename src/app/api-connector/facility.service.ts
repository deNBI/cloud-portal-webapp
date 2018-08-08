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

    getManagerFacilities(): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'facilityManager/getFacilitiesWhereUserIsManager/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));

    }

    getFacilityAllowedGroups(facility): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'facilityManager/getFacilityAllowedGroups/', {
            withCredentials: true,
            params: {facility_id: facility}
        }).pipe(catchError((error: any) => throwError(error)));


    }

    getFacilityAllowedGroupsWithDetails(facility): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'facilityManager/getFacilityAllowedGroupsWithDetails/', {
            withCredentials: true,
            params: {facility_id: facility}
        }).pipe(catchError((error: any) => throwError(error)));


    }

    sendMailToFacility(facility, subject, message, reply?): Observable<any> {
        let params = new HttpParams().set('subject', subject).set('facility_id', facility).set('message', message).set('reply', reply);

        return this.http.post(this.settings.getApiBaseURL() + 'facilityManager/sendMailToAllMembers/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));


    }

}
