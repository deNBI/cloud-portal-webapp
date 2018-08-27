import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service';
import ***REMOVED***Observable, throwError***REMOVED*** from 'rxjs';
import ***REMOVED***catchError***REMOVED*** from 'rxjs/operators';
import ***REMOVED***HttpClient, HttpHeaders, HttpParams***REMOVED*** from '@angular/common/http';
import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';

const header = new HttpHeaders(***REMOVED***
    'X-CSRFToken': Cookie.get("csrftoken")
***REMOVED***);


@Injectable()
export class FacilityService ***REMOVED***
    constructor(private http: HttpClient, private settings: ApiSettings) ***REMOVED***
    ***REMOVED***

    getManagerFacilities(): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'facilityManager/getFacilitiesWhereUserIsManager/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***

    getFacilityAllowedGroups(facility): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'facilityManager/getFacilityAllowedGroups/', ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***facility_id: facility***REMOVED***
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));


    ***REMOVED***

    getFacilityAllowedGroupsWithDetails(facility): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'facilityManager/getFacilityAllowedGroupsWithDetails/', ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***facility_id: facility***REMOVED***
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));


    ***REMOVED***

    sendMailToFacility(facility, subject, message, reply?): Observable<any> ***REMOVED***
        let params = new HttpParams().set('subject', subject).set('facility_id', facility).set('message', message).set('reply', reply);

        return this.http.post(this.settings.getApiBaseURL() + 'facilityManager/sendMailToAllMembers/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));


    ***REMOVED***

***REMOVED***
