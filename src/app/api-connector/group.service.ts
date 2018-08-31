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
export class GroupService ***REMOVED***

    constructor(private http: HttpClient, private settings: ApiSettings) ***REMOVED***
    ***REMOVED***

    getComputeCenters(): Observable<any> ***REMOVED***


        return this.http.get(this.settings.getApiBaseURL() + 'group/computecenters/', ***REMOVED***
            withCredentials: true,

        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***

    getComputeCentersDetails(resource_id: number): Observable<any> ***REMOVED***
        let params = new HttpParams().set('resource_id', resource_id.toString());

        return this.http.get(this.settings.getApiBaseURL() + 'group/facilityDetails/', ***REMOVED***
            withCredentials: true,
            params: params
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));

    ***REMOVED***

    getFacilityByGroup(groupid: string): Observable<any> ***REMOVED***
        let params = new HttpParams().set('groupid', groupid);

        return this.http.get(this.settings.getApiBaseURL() + 'group/getFacilityByGroup/', ***REMOVED***
            withCredentials: true,
            params: params
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));

    ***REMOVED***


    assignGroupToResource(groupid: string, computecenter: string): Observable<any> ***REMOVED***
        let params = new HttpParams().set('compute_center', computecenter).set('groupid', groupid);

        return this.http.post(this.settings.getApiBaseURL() + 'group/assignGroupToResource/', params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));


    ***REMOVED***

    isUserAdminOfGroup(groupid: string, userid: string): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'group/isUserPi/', ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***group_id: groupid, user_id: userid***REMOVED***
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));

    ***REMOVED***


    getGroupAdminIds(groupid: string): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'group/getGroupAdminsId/', ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***group_id: groupid***REMOVED***
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));

    ***REMOVED***

    getGroupRichMembers(groupid: number): Observable<any> ***REMOVED***
        let params = new HttpParams().set('groupid', groupid.toString());
        return this.http.get(this.settings.getApiBaseURL() + 'group/getGroupRichMembers/', ***REMOVED***
            withCredentials: true,
            params: params
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***


    addMember(group_id: number, member_id: number, facility_id?: number) ***REMOVED***
        let params = new HttpParams()
            .set('group_id', group_id.toString())
            .set('member_id', member_id.toString());
        if (facility_id) ***REMOVED***
            params.set('facility_id', facility_id.toString())

        ***REMOVED***


        return this.http.post(this.settings.getApiBaseURL() + 'group/addMember/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
            //responseType: 'text',
            observe: 'response'
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***


    addAdmin(group_id: number, user_id: number, facility_id?: number): Observable<any> ***REMOVED***
        let params = new HttpParams()
            .set('group_id', group_id.toString())
            .set('user_id', user_id.toString());

        if (facility_id) ***REMOVED***
            params.set('facility_id', facility_id.toString())

        ***REMOVED***

        return this.http.post(this.settings.getApiBaseURL() + 'group/addAdmin/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
            //responseType: 'text',
            observe: 'response'
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***


    removeMember(group_id: number, member_id: number, user_id: number, facility_id?: number): Observable<any> ***REMOVED***
        let params = new HttpParams()
            .set('group_id', group_id.toString())
            .set('user_id', user_id.toString())
            .set('member_id', member_id.toString());

        if (facility_id) ***REMOVED***
            params.set('facility_id', facility_id.toString())

        ***REMOVED***


        return this.http.post(this.settings.getApiBaseURL() + 'group/removeMember/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
            responseType: 'text',
            observe: 'response'
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***


    removeAdmin(group_id: number, user_id: number, facility_id?: number): Observable<any> ***REMOVED***

        let params = new HttpParams()
            .set('group_id', group_id.toString())
            .set('user_id', user_id.toString());
        if (facility_id) ***REMOVED***
            params.set('facility_id', facility_id.toString())

        ***REMOVED***


        return this.http.post(this.settings.getApiBaseURL() + 'group/removeAdmin/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
            responseType: 'text',
            observe: 'response'
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***


    setDescription(groupid: string, description: string): Observable<any> ***REMOVED***

        let params = new HttpParams().set('description', description).set('groupid', groupid);

        return this.http.post(this.settings.getApiBaseURL() + 'group/setDescription/', params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));


    ***REMOVED***


    setPerunGroupStatus(group_id: number, status: number): Observable<any> ***REMOVED***

        let params = new HttpParams().set('groupid', group_id.toString()).set('status', status.toString());

        return this.http.post(this.settings.getApiBaseURL() + 'group/setStatus/', params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***

    setGroupVolumeLimit(group_id: number, value: number): Observable<any> ***REMOVED***


        let params = new HttpParams().set('groupid', group_id.toString()).set('value', value.toString());


        return this.http.post(this.settings.getApiBaseURL() + 'group/setGroupVolumeLimit/', params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***


    setGroupVolumeCounter(group_id: number, value: number): Observable<any> ***REMOVED***

        let params = new HttpParams().set('groupid', group_id.toString()).set('value', value.toString());

        return this.http.post(this.settings.getApiBaseURL() + 'group/setGroupVolumeCounter/', params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***

    setdeNBIDirectAcces(group_id: number, value: boolean): Observable<any> ***REMOVED***

        let params = new HttpParams().set('groupid', group_id.toString()).set('value', value.toString());
        return this.http.post(this.settings.getApiBaseURL() + 'group/setdeNBIDirectAccess/', params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***


    setName(groupid: string, name: string): Observable<any> ***REMOVED***
        let params = new HttpParams().set('groupid', groupid).set('name', name);

        return this.http.post(this.settings.getApiBaseURL() + 'group/setName/', params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***


    getName(groupid: string): Observable<any> ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'group/getName/', ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***groupid: groupid***REMOVED***
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));

    ***REMOVED***


    setShortname(groupid: string, shortname: string): Observable<any> ***REMOVED***
        let params = new HttpParams().set('shortname', shortname).set('groupid', groupid);

        return this.http.post(this.settings.getApiBaseURL() + 'group/setShortname/', params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));

    ***REMOVED***


    getShortame(groupid: string): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'group/getShortname/', ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***groupid: groupid***REMOVED***
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));

    ***REMOVED***

    getGroupDetails(): Observable<any> ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'group/getGroupDetails/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));


    ***REMOVED***


    getGroupApplications(group: number): Observable<any> ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'group/' + group + '/applications/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));


    ***REMOVED***

    approveGroupApplication(groupid: number, application: number): Observable<any> ***REMOVED***


        return this.http.get(this.settings.getApiBaseURL() + 'group/' + groupid + '/applications/' + application + '/approve/', ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));

    ***REMOVED***

    rejectGroupApplication(groupid: number, application: number): Observable<any> ***REMOVED***


        return this.http.get(this.settings.getApiBaseURL() + 'group/' + groupid + '/applications/' + application + '/reject/', ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));

    ***REMOVED***


    getMemberGroupsStatus(): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'group/getMemberGroupsStatus/', ***REMOVED***
            withCredentials: true,
            headers: header

        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***

    getMemberGroups(): Observable<any> ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'group/getMemberGroups/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***


    setLifetime(groupid: string, lifetime: string): Observable<any> ***REMOVED***
        let params = new HttpParams().set('lifetime', lifetime).set('groupid', groupid);


        return this.http.post(this.settings.getApiBaseURL() + 'group/setLifetime/', params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));


    ***REMOVED***

    createGroup(group_name: string, group_description: string): Observable<any> ***REMOVED***
        let params = new HttpParams().set('group_name', group_name).set('group_description', group_description.substring(0, 512));

        return this.http.post(this.settings.getApiBaseURL() + 'group/createGroup/', params,
            ***REMOVED***
                withCredentials: true,
                headers: header
            ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***


    getLifetime(groupid: string): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'group/getLifetime/', ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***groupid: groupid***REMOVED***
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));

    ***REMOVED***

    setPerunId(groupid: string, applicationId: string): Observable<any> ***REMOVED***
        let params = new HttpParams().set('groupid', groupid).set('applicationId', applicationId);

        return this.http.post(this.settings.getApiBaseURL() + 'group/setPerunId/', params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));


    ***REMOVED***


    getGroupMembers(groupid: string): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'group/getGroupMembers/', ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***groupid: groupid***REMOVED***
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));


    ***REMOVED***


    getGroupMaxDiskspace(groupid: string): Observable<any> ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'project/getApprovedDiskSpace/', ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***groupid: groupid***REMOVED***
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));

    ***REMOVED***

    getGroupUsedDiskspace(groupid: string): Observable<any> ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'project/getUsedDiskSpace/', ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***groupid: groupid***REMOVED***
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));


    ***REMOVED***


    getVolumesUsed(groupid: string): Observable<any> ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'project/getUsedVolumes/', ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***groupid: groupid***REMOVED***
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***

    getVolumeCounter(groupid: string): Observable<any> ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'project/getVolumesCounter/', ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***groupid: groupid***REMOVED***
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***

    getGroupApprovedVms(groupid: string): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'project/getNumberApprovedVms/', ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***groupid: groupid***REMOVED***
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));


    ***REMOVED***

    getGroupUsedVms(groupid: string): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'project/getUsedVms/', ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***groupid: groupid***REMOVED***
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));

    ***REMOVED***


    setPerunGroupAttributes(application_id: number, groupid: number): Observable<any> ***REMOVED***
        let params = new HttpParams()
            .set('groupid', groupid.toString())
            .set('application_id', application_id.toString());

        return this.http.post(this.settings.getApiBaseURL() + 'group/setAttributes/', params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***


    isFreemiumActive(): Observable<any> ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'freemium/isActive/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***

    addMemberToFreemium(): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'freemium/becomeMember/', ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***)
    ***REMOVED***


***REMOVED***
