import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service';
import ***REMOVED***Observable, throwError***REMOVED*** from 'rxjs';
import ***REMOVED***catchError***REMOVED*** from 'rxjs/operators';
import ***REMOVED***HttpClient, HttpHeaders, HttpParams***REMOVED*** from '@angular/common/http';
import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';

const header: HttpHeaders = new HttpHeaders(***REMOVED***
    'X-CSRFToken': Cookie.get('csrftoken')
***REMOVED***);

/**
 * Service which provides Group methods.
 */
@Injectable()
export class GroupService ***REMOVED***

    constructor(private http: HttpClient) ***REMOVED***
    ***REMOVED***

    getFacilityByGroup(groupid: string): Observable<any> ***REMOVED***

        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***groupid***REMOVED***/computecenter/`, ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));

    ***REMOVED***

    getClient(groupid: string): Observable<any> ***REMOVED***

        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***groupid***REMOVED***/client/`, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));

    ***REMOVED***

    assignGroupToResource(groupid: string, computecenter: string): Observable<any> ***REMOVED***
        const params: HttpParams = new HttpParams().set('compute_center', computecenter);

        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***groupid***REMOVED***/resource/`, params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***)

    ***REMOVED***

    removeGroupFromResource(groupid: string): Observable<any> ***REMOVED***

        return this.http.delete(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***groupid***REMOVED***/resource/`, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***)

    ***REMOVED***

    isUserAdminOfGroup(groupid: string, userid: string): Observable<any> ***REMOVED***

        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***groupid***REMOVED***/members/$***REMOVED***userid***REMOVED***/manager/`, ***REMOVED***
            withCredentials: true,
        ***REMOVED***)
    ***REMOVED***

    getGroupAdminIds(groupid: string): Observable<any> ***REMOVED***

        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***groupid***REMOVED***/admins/ids/`, ***REMOVED***
            withCredentials: true,
        ***REMOVED***)
    ***REMOVED***

    getGroupRichMembers(groupid: number): Observable<any> ***REMOVED***
        const params: HttpParams = new HttpParams().set('groupid', groupid.toString());

        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***groupid***REMOVED***/richMembers/`, ***REMOVED***
            withCredentials: true,
            params: params
        ***REMOVED***)
    ***REMOVED***

    addMember(group_id: number, member_id: number, facility_id?: number): Observable<any> ***REMOVED***
        const params: HttpParams = new HttpParams();
        if (facility_id) ***REMOVED***
            params.set('facility_id', facility_id.toString())

        ***REMOVED***

        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***group_id***REMOVED***members/$***REMOVED***member_id***REMOVED***/`, params, ***REMOVED***
            withCredentials: true,
            headers: header,
            // responseType: 'text',
            observe: 'response'
        ***REMOVED***)
    ***REMOVED***

    addAdmin(group_id: number, user_id: number, facility_id?: number): Observable<any> ***REMOVED***
        const params: HttpParams = new HttpParams();

        if (facility_id) ***REMOVED***
            params.set('facility_id', facility_id.toString())

        ***REMOVED***

        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***group_id***REMOVED***/admins/$***REMOVED***user_id***REMOVED***/`, params, ***REMOVED***
            withCredentials: true,
            headers: header,
            // responseType: 'text',
            observe: 'response'
        ***REMOVED***)
    ***REMOVED***

    removeMember(group_id: number, member_id: number, facility_id?: number): Observable<any> ***REMOVED***
        const params: HttpParams = new HttpParams();

        if (facility_id) ***REMOVED***
            params.set('facility_id', facility_id.toString())

        ***REMOVED***

        return this.http.request('delete', `$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***group_id***REMOVED***/members/$***REMOVED***member_id***REMOVED***/`, ***REMOVED***
            withCredentials: true,
            headers: header,
            body: params,
            responseType: 'text',
            observe: 'response'
        ***REMOVED***)
    ***REMOVED***

    removeAdmin(group_id: number, user_id: number, facility_id?: number): Observable<any> ***REMOVED***

        const params: HttpParams = new HttpParams();

        if (facility_id) ***REMOVED***
            params.set('facility_id', facility_id.toString())

        ***REMOVED***

        return this.http.request('delete', `$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***group_id***REMOVED***/admins/$***REMOVED***user_id***REMOVED***/`, ***REMOVED***
            withCredentials: true,
            headers: header,
            responseType: 'text',
            body: params,
            observe: 'response'
        ***REMOVED***)
    ***REMOVED***

    setDescription(groupid: string, description: string): Observable<any> ***REMOVED***

        const params: HttpParams = new HttpParams().set('description', description).set('groupid', groupid);

        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***groupid***REMOVED***/attributes/description/`, params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***)

    ***REMOVED***

    setPerunGroupStatus(group_id: number, status: number): Observable<any> ***REMOVED***

        const params: HttpParams = new HttpParams().set('status', status.toString());

        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***group_id***REMOVED***/attributes/status/`, params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***)
    ***REMOVED***

    setGroupVolumeLimit(group_id: number, value: number): Observable<any> ***REMOVED***

        const params: HttpParams = new HttpParams().set('value', value.toString());

        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***group_id***REMOVED***attributes/volumeLimit/`, params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***)
    ***REMOVED***

    setGroupVolumeCounter(group_id: number, value: number): Observable<any> ***REMOVED***

        const params: HttpParams = new HttpParams().set('value', value.toString());

        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***group_id***REMOVED***/attributes/volumesCounter/`, params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***)
    ***REMOVED***

    setdeNBIDirectAcces(group_id: number, value: boolean): Observable<any> ***REMOVED***

        const params: HttpParams = new HttpParams().set('value', value.toString());

        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***group_id***REMOVED***/attributes/directAccess/`, params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***)
    ***REMOVED***

    setName(groupid: string, name: string): Observable<any> ***REMOVED***
        const params: HttpParams = new HttpParams().set('name', name);

        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***groupid***REMOVED***/attributes/name/`, params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***)
    ***REMOVED***

    getName(groupid: string): Observable<any> ***REMOVED***
        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***groupid***REMOVED***/attributes/name/`, ***REMOVED***
            withCredentials: true,
        ***REMOVED***)

    ***REMOVED***

    setShortname(groupid: string, shortname: string): Observable<any> ***REMOVED***
        const params: HttpParams = new HttpParams().set('shortname', shortname)

        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***groupid***REMOVED***/attributes/shortname/`, params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***)

    ***REMOVED***

    getShortame(groupid: string): Observable<any> ***REMOVED***

        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***groupid***REMOVED***/attributes/shortname/`, ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***groupid: groupid***REMOVED***
        ***REMOVED***)

    ***REMOVED***

    getGroupDetails(): Observable<any> ***REMOVED***
        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/details/`, ***REMOVED***
            withCredentials: true,
        ***REMOVED***)
    ***REMOVED***

    getGroupApplications(group: number): Observable<any> ***REMOVED***
        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***group***REMOVED***/applications/`, ***REMOVED***
            withCredentials: true,
        ***REMOVED***)

    ***REMOVED***

    approveGroupApplication(groupid: number, application: number): Observable<any> ***REMOVED***

        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***groupid***REMOVED***/applications/$***REMOVED***application***REMOVED***/status/`, null, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***)

    ***REMOVED***

    rejectGroupApplication(groupid: number, application: number): Observable<any> ***REMOVED***

        return this.http.delete(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***groupid***REMOVED***/applications/$***REMOVED***application***REMOVED***/status/`, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***)

    ***REMOVED***

    getMemberGroupsStatus(): Observable<any> ***REMOVED***

        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/singlevm/`, ***REMOVED***
            withCredentials: true,
            headers: header

        ***REMOVED***)
    ***REMOVED***

    setLifetime(groupid: string, lifetime: string): Observable<any> ***REMOVED***
        const params: HttpParams = new HttpParams().set('lifetime', lifetime);

        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***groupid***REMOVED***/attributes/lifetime/`, params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***)

    ***REMOVED***

    createGroup(group_name: string, group_description: string): Observable<any> ***REMOVED***
        const params: HttpParams = new HttpParams().set('name', group_name).set('description', group_description.substring(0, 512));

        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/`, params,
            ***REMOVED***
                withCredentials: true,
                headers: header
            ***REMOVED***)
    ***REMOVED***

    getLifetime(groupid: string): Observable<any> ***REMOVED***

        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***groupid***REMOVED***/attributes/lifetime/`, ***REMOVED***
            withCredentials: true,
        ***REMOVED***)

    ***REMOVED***

    setPerunId(groupid: string, applicationId: string): Observable<any> ***REMOVED***
        const params: HttpParams = new HttpParams().set('applicationId', applicationId);

        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***groupid***REMOVED***/attributes/perunId/`, params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***)

    ***REMOVED***

    getGroupMembers(groupid: string): Observable<any> ***REMOVED***

        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***groupid***REMOVED***/members/`, ***REMOVED***
            withCredentials: true,
            headers: header

        ***REMOVED***)

    ***REMOVED***

    getGroupMaxDiskspace(groupid: string): Observable<any> ***REMOVED***
        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***groupid***REMOVED***/attributes/approvedDiskspace/`, ***REMOVED***
            withCredentials: true
        ***REMOVED***)

    ***REMOVED***

    getGroupUsedDiskspace(groupid: string): Observable<any> ***REMOVED***
        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***groupid***REMOVED***/attributes/usedDiskspace/`, ***REMOVED***
            withCredentials: true
        ***REMOVED***)

    ***REMOVED***

    getVolumesUsed(groupid: string): Observable<any> ***REMOVED***
        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***groupid***REMOVED***/attributes/usedVolumes/`, ***REMOVED***
            withCredentials: true,
        ***REMOVED***)
    ***REMOVED***

    getVolumeCounter(groupid: string): Observable<any> ***REMOVED***
        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***groupid***REMOVED***/attributes/volumesCounter/`, ***REMOVED***
            withCredentials: true,
        ***REMOVED***)
    ***REMOVED***

    getGroupApprovedVms(groupid: string): Observable<any> ***REMOVED***

        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***groupid***REMOVED***/attributes/approvedVms/`, ***REMOVED***
            withCredentials: true,
        ***REMOVED***)

    ***REMOVED***

    getGroupUsedVms(groupid: string): Observable<any> ***REMOVED***

        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***groupid***REMOVED***/attributes/usedVms/`, ***REMOVED***
            withCredentials: true,
        ***REMOVED***)

    ***REMOVED***

    setPerunGroupAttributes(application_id: number, groupid: number): Observable<any> ***REMOVED***
        const params: HttpParams = new HttpParams()
            .set('application_id', application_id.toString());

        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/'$***REMOVED***groupid***REMOVED***/attributes/`, params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***

    isFreemiumActive(): Observable<any> ***REMOVED***
        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***freemium/`, ***REMOVED***
            withCredentials: true
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***

    addMemberToFreemium(): Observable<any> ***REMOVED***

        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***freemium/`, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***)
    ***REMOVED***

***REMOVED***
