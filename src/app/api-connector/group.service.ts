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
export class GroupService {

    constructor(private http: HttpClient, private settings: ApiSettings) {
    }

    getComputeCenters(): Observable<any> {


        return this.http.get(this.settings.getApiBaseURL() + 'projects/computecenters/', {
            withCredentials: true,

        }).pipe(catchError((error: any) => throwError(error.error)));
    }

    getComputeCentersDetails(resource_id: number): Observable<any> {
        let params = new HttpParams().set('resource_id', resource_id.toString());

        return this.http.get(this.settings.getApiBaseURL() + 'projects/facilityDetails/', {
            withCredentials: true,
            params: params
        }).pipe(catchError((error: any) => throwError(error.error)));

    }

    getFacilityByGroup(groupid: string): Observable<any> {
        let params = new HttpParams().set('groupid', groupid);

        return this.http.get(this.settings.getApiBaseURL() + 'projects/getFacilityByGroup/', {
            withCredentials: true,
            params: params
        }).pipe(catchError((error: any) => throwError(error.error)));

    }


    assignGroupToResource(groupid: string, computecenter: string): Observable<any> {
        let params = new HttpParams().set('compute_center', computecenter).set('groupid', groupid);

        return this.http.post(this.settings.getApiBaseURL() + 'projects/assignGroupToResource/', params, {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error.error)));


    }

    isUserAdminOfGroup(groupid: string, userid: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid + '/members/' + userid + '/manager/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error.error)));

    }


    getGroupAdminIds(groupid: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid + '/admins/ids/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error.error)));

    }

    getGroupRichMembers(groupid: number): Observable<any> {
        let params = new HttpParams().set('groupid', groupid.toString());
        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid + '/richMembers/', {
            withCredentials: true,
            params: params
        }).pipe(catchError((error: any) => throwError(error.error)));
    }


    addMember(group_id: number, member_id: number, facility_id?: number) {
        let params = new HttpParams()
        if (facility_id) {
            params.set('facility_id', facility_id.toString())

        }


        return this.http.post(this.settings.getApiBaseURL() + 'projects/' + group_id + '/members/' + member_id + '/', params, {
            withCredentials: true,
            headers: header,
            //responseType: 'text',
            observe: 'response'
        }).pipe(catchError((error: any) => throwError(error.error)));
    }


    addAdmin(group_id: number, user_id: number, facility_id?: number): Observable<any> {
        let params = new HttpParams();


        if (facility_id) {
            params.set('facility_id', facility_id.toString())

        }

        return this.http.post(this.settings.getApiBaseURL() + 'projects/' + group_id + '/admins/' + user_id + '/', params, {
            withCredentials: true,
            headers: header,
            //responseType: 'text',
            observe: 'response'
        }).pipe(catchError((error: any) => throwError(error.error)));
    }


    removeMember(group_id: number, member_id: number,  facility_id?: number): Observable<any> {
        let params = new HttpParams();


        if (facility_id) {
            params.set('facility_id', facility_id.toString())

        }


        return this.http.request('delete',this.settings.getApiBaseURL() +'projects/' + group_id + '/members/' + member_id + '/', {
            withCredentials: true,
            headers: header,
            body:params,
            responseType: 'text',
            observe: 'response'
        }).pipe(catchError((error: any) => throwError(error.error)));
    }


    removeAdmin(group_id: number, user_id: number, facility_id?: number): Observable<any> {

        let params = new HttpParams()

        if (facility_id) {
            params.set('facility_id', facility_id.toString())

        }


        return this.http.request('delete',this.settings.getApiBaseURL() + 'projects/' + group_id + '/admins/' + user_id + '/', {
            withCredentials: true,
            headers: header,
            responseType: 'text',
            body: params,
            observe: 'response'
        }).pipe(catchError((error: any) => throwError(error.error)));
    }


    setDescription(groupid: string, description: string): Observable<any> {

        let params = new HttpParams().set('description', description).set('groupid', groupid);

        return this.http.post(this.settings.getApiBaseURL() + 'projects/setDescription/', params, {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error.error)));


    }


    setPerunGroupStatus(group_id: number, status: number): Observable<any> {

        let params = new HttpParams().set('groupid', group_id.toString()).set('status', status.toString());

        return this.http.post(this.settings.getApiBaseURL() + 'projects/setStatus/', params, {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error.error)));
    }

    setGroupVolumeLimit(group_id: number, value: number): Observable<any> {


        let params = new HttpParams().set('groupid', group_id.toString()).set('value', value.toString());


        return this.http.post(this.settings.getApiBaseURL() + 'projects/setGroupVolumeLimit/', params, {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error.error)));
    }


    setGroupVolumeCounter(group_id: number, value: number): Observable<any> {

        let params = new HttpParams().set('groupid', group_id.toString()).set('value', value.toString());

        return this.http.post(this.settings.getApiBaseURL() + 'projects/setGroupVolumeCounter/', params, {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error.error)));
    }

    setdeNBIDirectAcces(group_id: number, value: boolean): Observable<any> {

        let params = new HttpParams().set('groupid', group_id.toString()).set('value', value.toString());
        return this.http.post(this.settings.getApiBaseURL() + 'projects/setdeNBIDirectAccess/', params, {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error.error)));
    }


    setName(groupid: string, name: string): Observable<any> {
        let params = new HttpParams().set('groupid', groupid).set('name', name);

        return this.http.post(this.settings.getApiBaseURL() + 'projects/setName/', params, {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error.error)));
    }


    getName(groupid: string): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'projects/getName/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).pipe(catchError((error: any) => throwError(error.error)));

    }


    setShortname(groupid: string, shortname: string): Observable<any> {
        let params = new HttpParams().set('shortname', shortname).set('groupid', groupid);

        return this.http.post(this.settings.getApiBaseURL() + 'projects/setShortname/', params, {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error.error)));

    }


    getShortame(groupid: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'projects/getShortname/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).pipe(catchError((error: any) => throwError(error.error)));

    }

    getGroupDetails(): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'projects/getGroupDetails/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error.error)));


    }


    getGroupApplications(group: number): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + group + '/applications/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error.error)));


    }

    approveGroupApplication(groupid: number, application: number): Observable<any> {


        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid + '/applications/' + application + '/approve/', {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error.error)));

    }

    rejectGroupApplication(groupid: number, application: number): Observable<any> {


        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid + '/applications/' + application + '/reject/', {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error.error)));

    }


    getMemberGroupsStatus(): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'projects/singlevmprojects/', {
            withCredentials: true,
            headers: header

        }).pipe(catchError((error: any) => throwError(error.error)));
    }

    getMemberGroups(): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'projects/getMemberGroups/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error.error)));
    }


    setLifetime(groupid: string, lifetime: string): Observable<any> {
        let params = new HttpParams().set('lifetime', lifetime).set('groupid', groupid);


        return this.http.post(this.settings.getApiBaseURL() + 'projects/setLifetime/', params, {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error.error)));


    }

    createGroup(group_name: string, group_description: string): Observable<any> {
        let params = new HttpParams().set('group_name', group_name).set('group_description', group_description.substring(0, 512));

        return this.http.post(this.settings.getApiBaseURL() + 'projects/createGroup/', params,
            {
                withCredentials: true,
                headers: header
            }).pipe(catchError((error: any) => throwError(error.error)));
    }


    getLifetime(groupid: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'projects/getLifetime/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).pipe(catchError((error: any) => throwError(error.error)));

    }

    setPerunId(groupid: string, applicationId: string): Observable<any> {
        let params = new HttpParams().set('groupid', groupid).set('applicationId', applicationId);

        return this.http.post(this.settings.getApiBaseURL() + 'projects/setPerunId/', params, {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error.error)));


    }


    getGroupMembers(groupid: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid + '/members/', {
            withCredentials: true,
            headers: header

        }).pipe(catchError((error: any) => throwError(error.error)));


    }


    getGroupMaxDiskspace(groupid: string): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid + '/approvedDiskspace/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error.error)));

    }

    getGroupUsedDiskspace(groupid: string): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid + '/usedDiskspace/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error.error)));


    }


    getVolumesUsed(groupid: string): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid + '/usedVolumes/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error.error)));
    }

    getVolumeCounter(groupid: string): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid + '/volumesCounter/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error.error)));
    }

    getGroupApprovedVms(groupid: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid + '/approvedVms/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error.error)));


    }

    getGroupUsedVms(groupid: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid + '/usedVms/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error.error)));

    }


    setPerunGroupAttributes(application_id: number, groupid: number): Observable<any> {
        let params = new HttpParams()
            .set('application_id', application_id.toString());

        return this.http.post(this.settings.getApiBaseURL() + 'projects/' + groupid + 'attributes/', params, {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error.error)));
    }


    isFreemiumActive(): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'freemium/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error.error)));
    }

    addMemberToFreemium(): Observable<any> {

        return this.http.post(this.settings.getApiBaseURL() + 'freemium/', {
            withCredentials: true,
            headers: header
        })
    }


}
