import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service';
import ***REMOVED***Observable, throwError***REMOVED*** from 'rxjs';
import ***REMOVED***catchError***REMOVED*** from 'rxjs/operators';
import ***REMOVED***HttpClient, HttpHeaders, HttpParams***REMOVED*** from '@angular/common/http';
import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';

const header = new HttpHeaders(***REMOVED***
    'X-CSRFToken': Cookie.get('csrftoken')
***REMOVED***);


@Injectable()
export class FacilityService ***REMOVED***
    constructor(private http: HttpClient, private settings: ApiSettings) ***REMOVED***
    ***REMOVED***


    /**
     * Get all available computecenters.
     * @returns ***REMOVED***Observable<any>***REMOVED***
     */
    getComputeCenters(): Observable<any> ***REMOVED***


        return this.http.get(this.settings.getApiBaseURL() + 'computecenters/', ***REMOVED***
            withCredentials: true,

        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***

    /**
     * Get all facility, where the current user is manager.
     * @returns ***REMOVED***Observable<any>***REMOVED***
     */
    getManagerFacilities(): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'facilityManagers/current/facilities/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***


    /**
     * Get allowed groups from a facility with a specific status.
     * @param ***REMOVED***number***REMOVED*** facility
     * @param ***REMOVED***number***REMOVED*** status
     * @returns ***REMOVED***Observable<any>***REMOVED***
     */
    getFacilityAllowedGroupsWithDetailsAndSpecificStatus(facility: number, status: number): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'computecenters/' + facility + '/projects/', ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***status: status.toString()***REMOVED***

        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));


    ***REMOVED***

    getFacilityResources(facility: number): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'computecenters/' + facility + '/projects/resources/', ***REMOVED***
            withCredentials: true,


        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));


    ***REMOVED***


    /**
     * Gets all facility applications which are waiting for conirmation.
     * @param ***REMOVED***number***REMOVED*** facility
     * @returns ***REMOVED***Observable<any>***REMOVED***
     */
    getFacilityApplicationsWaitingForConfirmation(facility: number): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'computecenters/' + facility + '/applications/', ***REMOVED***
            withCredentials: true,

        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));


    ***REMOVED***

    /**
     * Approves an facility application.
     * @param ***REMOVED***number***REMOVED*** facility
     * @param ***REMOVED***number***REMOVED*** application_id
     * @returns ***REMOVED***Observable<any>***REMOVED***
     */
    approveFacilityApplication(facility: number, application_id: number): Observable<any> ***REMOVED***
        const params = new HttpParams().set('action', 'approve');


        return this.http.post(this.settings.getApiBaseURL() + 'computecenters/' + facility + '/applications/' + application_id + '/status/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
            observe: 'response'
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));


    ***REMOVED***

    /**
     * Declines an application for the facility
     * @param ***REMOVED***number***REMOVED*** facility
     * @param ***REMOVED***number***REMOVED*** application_id
     * @returns ***REMOVED***Observable<any>***REMOVED***
     */
    declineFacilityApplication(facility: number, application_id: number): Observable<any> ***REMOVED***
        const params = new HttpParams().set('action', 'decline');


        return this.http.post(this.settings.getApiBaseURL() + 'computecenters/' + facility + '/applications/' + application_id + '/status/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
            observe: 'response'
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));


    ***REMOVED***

    /**
     * Sends an email to all members of the facility.
     * @param facility
     * @param subject
     * @param message
     * @param reply
     * @returns ***REMOVED***Observable<any>***REMOVED***
     */
    sendMailToFacility(facility, subject, message, reply?): Observable<any> ***REMOVED***
        const params = new HttpParams().set('subject', subject).set('facility_id', facility).set('message', message).set('reply', reply);

        return this.http.post(this.settings.getApiBaseURL() + 'facilityManagers/current/facilityMail/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
            observe: 'response'
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));


    ***REMOVED***

    /**
     * Get Members of a project with emails.
     * @param ***REMOVED***number***REMOVED*** groupid id of the group
     * @param ***REMOVED***number***REMOVED*** facility id of the facility
     * @returns ***REMOVED***Observable<any>***REMOVED***
     */
    getFacilityGroupRichMembers(groupid: number, facility: number): Observable<any> ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'computecenters/' + facility + '/projects/' + groupid + '/members/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***

***REMOVED***
