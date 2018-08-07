import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service';
import {map} from 'rxjs/operators';
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
        let params = new HttpParams();
        params = params.append('subject', subject);
        params.append('facility_id', facility);
        params.append('message', message);
        params.append('reply', reply);

        return this.http.post(this.settings.getApiBaseURL() + 'facilityManager/sendMailToAllMembers/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));


    }

}
