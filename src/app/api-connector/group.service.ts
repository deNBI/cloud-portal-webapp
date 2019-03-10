import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Cookie} from 'ng2-cookies/ng2-cookies';

const header: HttpHeaders = new HttpHeaders({
    'X-CSRFToken': Cookie.get('csrftoken')
});

/**
 * Service which provides Group methods.
 */
@Injectable()
export class GroupService {

    constructor(private http: HttpClient) {
    }

    getFacilityByGroup(groupid: string): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/computecenter/`, {
            withCredentials: true
        }).pipe(catchError((error: any) => throwError(error.error)));

    }

    getClient(groupid: string): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/client/`, {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error.error)));

    }

    assignGroupToResource(groupid: string, computecenter: string): Observable<any> {
        const params: HttpParams = new HttpParams().set('compute_center', computecenter);

        return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${groupid}/resource/`, params, {
            withCredentials: true,
            headers: header
        })

    }

    removeGroupFromResource(groupid: string): Observable<any> {

        return this.http.delete(`${ApiSettings.getApiBaseURL()}projects/${groupid}/resource/`, {
            withCredentials: true,
            headers: header
        })

    }

    isUserAdminOfGroup(groupid: number | string, userid: number | string): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/members/${userid}/manager/`, {
            withCredentials: true
        })
    }

    getGroupAdminIds(groupid: number | string): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/admins/ids/`, {
            withCredentials: true
        })
    }

    getGroupRichMembers(groupid: number | string): Observable<any> {
        const params: HttpParams = new HttpParams().set('groupid', groupid.toString());

        return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/richMembers/`, {
            withCredentials: true,
            params: params
        })
    }

    addMember(group_id: string | number, member_id: string | number, facility_id?: string | number): Observable<any> {
        const params: HttpParams = new HttpParams();
        if (facility_id !== null) {
            params.set('facility_id', facility_id.toString())

        }

        return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${group_id}members/${member_id}/`, params, {
            withCredentials: true,
            headers: header,
            // responseType: 'text',
            observe: 'response'
        })
    }

    addAdmin(group_id: string | number, user_id: string | number, facility_id?: string | number): Observable<any> {
        const params: HttpParams = new HttpParams();

        if (facility_id !== null) {
            params.set('facility_id', facility_id.toString())

        }

        return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${group_id}/admins/${user_id}/`, params, {
            withCredentials: true,
            headers: header,
            // responseType: 'text',
            observe: 'response'
        })
    }

    removeMember(group_id: number | string, member_id: number | string, facility_id?: number | string): Observable<any> {
        const params: HttpParams = new HttpParams();

        if (facility_id !== null) {
            params.set('facility_id', facility_id.toString())

        }

        return this.http.request('delete', `${ApiSettings.getApiBaseURL()}projects/${group_id}/members/${member_id}/`, {
            withCredentials: true,
            headers: header,
            body: params,
            responseType: 'text',
            observe: 'response'
        })
    }

    removeAdmin(group_id: number | string, user_id: number | string, facility_id?: number | string): Observable<any> {

        const params: HttpParams = new HttpParams();

        if (facility_id !== null) {
            params.set('facility_id', facility_id.toString())

        }

        return this.http.request('delete', `${ApiSettings.getApiBaseURL()}projects/${group_id}/admins/${user_id}/`, {
            withCredentials: true,
            headers: header,
            responseType: 'text',
            body: params,
            observe: 'response'
        })
    }

    setDescription(groupid: string, description: string): Observable<any> {

        const params: HttpParams = new HttpParams().set('description', description).set('groupid', groupid);

        return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/description/`, params, {
            withCredentials: true,
            headers: header
        })

    }

    setPerunGroupStatus(group_id: string, status: string): Observable<any> {

        const params: HttpParams = new HttpParams().set('status', status);

        return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${group_id}/attributes/status/`, params, {
            withCredentials: true,
            headers: header
        })
    }

    setGroupVolumeLimit(group_id: number, value: number): Observable<any> {

        const params: HttpParams = new HttpParams().set('value', value.toString());

        return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${group_id}attributes/volumeLimit/`, params, {
            withCredentials: true,
            headers: header
        })
    }

    setGroupVolumeCounter(group_id: number, value: number): Observable<any> {

        const params: HttpParams = new HttpParams().set('value', value.toString());

        return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${group_id}/attributes/volumesCounter/`, params, {
            withCredentials: true,
            headers: header
        })
    }

    setdeNBIDirectAcces(group_id: number, value: boolean): Observable<any> {

        const params: HttpParams = new HttpParams().set('value', value.toString());

        return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${group_id}/attributes/directAccess/`, params, {
            withCredentials: true,
            headers: header
        })
    }

    setName(groupid: string, name: string): Observable<any> {
        const params: HttpParams = new HttpParams().set('name', name);

        return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/name/`, params, {
            withCredentials: true,
            headers: header
        })
    }

    getName(groupid: string): Observable<any> {
        return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/name/`, {
            withCredentials: true
        })

    }

    setShortname(groupid: string, shortname: string): Observable<any> {
        const params: HttpParams = new HttpParams().set('shortname', shortname)

        return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/shortname/`, params, {
            withCredentials: true,
            headers: header
        })

    }

    getShortame(groupid: string): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/shortname/`, {
            withCredentials: true,
            params: {groupid: groupid}
        })

    }

    getGroupDetails(): Observable<any> {
        return this.http.get(`${ApiSettings.getApiBaseURL()}projects/details/`, {
            withCredentials: true
        })
    }

    getGroupApplications(group: number): Observable<any> {
        return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${group}/applications/`, {
            withCredentials: true
        })

    }

    approveGroupApplication(groupid: number, application: number): Observable<any> {

        return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${groupid}/applications/${application}/status/`, null, {
            withCredentials: true,
            headers: header
        })

    }

    rejectGroupApplication(groupid: number, application: number): Observable<any> {

        return this.http.delete(`${ApiSettings.getApiBaseURL()}projects/${groupid}/applications/${application}/status/`, {
            withCredentials: true,
            headers: header
        })

    }

    getMemberGroupsStatus(): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}projects/singlevm/`, {
            withCredentials: true,
            headers: header

        })
    }

    setLifetime(groupid: string, lifetime: string): Observable<any> {
        const params: HttpParams = new HttpParams().set('lifetime', lifetime);

        return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/lifetime/`, params, {
            withCredentials: true,
            headers: header
        })

    }

    createGroup(group_name: string, group_description: string): Observable<any> {
        const params: HttpParams = new HttpParams().set('name', group_name).set('description', group_description.substring(0, 512));

        return this.http.post(`${ApiSettings.getApiBaseURL()}projects/`, params,
            {
                withCredentials: true,
                headers: header
            })
    }

    getLifetime(groupid: string | number): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/lifetime/`, {
            withCredentials: true
        })

    }

    setPerunId(groupid: string, applicationId: string): Observable<any> {
        const params: HttpParams = new HttpParams().set('applicationId', applicationId);

        return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/perunId/`, params, {
            withCredentials: true,
            headers: header
        })

    }

    getGroupMembers(groupid: string): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/members/`, {
            withCredentials: true,
            headers: header

        })

    }

    getGroupMaxDiskspace(groupid: string): Observable<any> {
        return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/approvedDiskspace/`, {
            withCredentials: true
        })

    }

    getGroupUsedDiskspace(groupid: string): Observable<any> {
        return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/usedDiskspace/`, {
            withCredentials: true
        })

    }

    getVolumesUsed(groupid: string): Observable<any> {
        return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/usedVolumes/`, {
            withCredentials: true
        })
    }

    getVolumeCounter(groupid: string): Observable<any> {
        return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/volumesCounter/`, {
            withCredentials: true
        })
    }

    getGroupApprovedVms(groupid: string): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/approvedVms/`, {
            withCredentials: true
        })

    }

    getGroupUsedVms(groupid: string): Observable<any> {

        return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/usedVms/`, {
            withCredentials: true
        })

    }

    setPerunGroupAttributes(application_id: string, groupid: string): Observable<any> {
        const params: HttpParams = new HttpParams()
            .set('application_id', application_id.toString());

        return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/`, params, {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error.error)));
    }

    isFreemiumActive(): Observable<any> {
        return this.http.get(`${ApiSettings.getApiBaseURL()}freemium/`, {
            withCredentials: true
        }).pipe(catchError((error: any) => throwError(error.error)));
    }

    addMemberToFreemium(): Observable<any> {

        return this.http.post(`${ApiSettings.getApiBaseURL()}freemium/`, {
            withCredentials: true,
            headers: header
        })
    }

}
