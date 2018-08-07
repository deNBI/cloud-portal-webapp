import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {ApiSettings} from './api-settings.service';
import {URLSearchParams} from "@angular/http";
import {map} from 'rxjs/operators';
import 'rxjs/add/operator/catch';
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


        return this.http.get(this.settings.getApiBaseURL() + 'group/computecenters/', {
            withCredentials: true,

        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));
    }

    getComputeCentersDetails(resource_id: number): Observable<any> {
        let params = new HttpParams();
        params = params.append('resource_id', resource_id.toString());

        return this.http.get(this.settings.getApiBaseURL() + 'group/facilityDetails/', {
            withCredentials: true,
            params: params
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));

    }

    getFacilityByGroup(groupid: string): Observable<any> {
        let params = new HttpParams();
        params.append('groupid', groupid);

        return this.http.get(this.settings.getApiBaseURL() + 'group/getFacilityByGroup/', {
            withCredentials: true,
            params: params
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));

    }


    assignGroupToResource(groupid: string, computecenter: string): Observable<any> {
        let params = new HttpParams();
        params = params.append('compute_center', computecenter);
        params.append('groupid', groupid);

        return this.http.post(this.settings.getApiBaseURL() + 'group/assignGroupToResource/', params, {
            withCredentials: true,
            headers: header
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));


    }

    isUserAdminOfGroup(groupid: string, userid: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'group/isUserPi/', {
            withCredentials: true,
            params: {group_id: groupid, user_id: userid}
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));

    }


    getGroupAdminIds(groupid: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'group/getGroupAdminsId/', {
            withCredentials: true,
            params: {group_id: groupid}
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));

    }

    getGroupRichMembers(groupid: number): Observable<any> {
        let params = new HttpParams();
        params.append('groupid', groupid.toString());

        return this.http.get(this.settings.getApiBaseURL() + 'group/getGroupRichMembers/', {
            withCredentials: true,
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));
    }


    addMember(group_id: number, member_id: number, facility_id: number): Observable<any> {
        let params = new HttpParams();
        params = params.append('facility_id', facility_id.toString());
        params.append('group_id', group_id.toString());
        params.append('member_id', member_id.toString());

        return this.http.post(this.settings.getApiBaseURL() + 'group/addMember/', params, {
            withCredentials: true,
            headers: header
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));
    }


    addAdmin(group_id: number, user_id: number, facility_id: number): Observable<any> {
        let params = new HttpParams();
        params = params.append('facility_id', facility_id.toString());
        params.append('group_id', group_id.toString());
        params.append('user_id', user_id.toString());

        return this.http.post(this.settings.getApiBaseURL() + 'group/addAdmin/', params, {
            withCredentials: true,
            headers: header
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));
    }


    removeMember(group_id: number, member_id: number, user_id: number, facility_id: number): Observable<any> {
        let params = new HttpParams();
        params = params.append('facility_id', facility_id.toString());
        params.append('group_id', group_id.toString());
        params.append('user_id', user_id.toString());
        params.append('member_id', member_id.toString());


        return this.http.post(this.settings.getApiBaseURL() + 'group/removeMember/', params, {
            withCredentials: true,
            headers: header
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));
    }


    removeAdmin(group_id: number, user_id: number, facility_id: number): Observable<any> {

        let params = new HttpParams();
        params = params.append('facility_id', facility_id.toString());
        params.append('group_id', group_id.toString());
        params.append('user_id', user_id.toString());


        return this.http.post(this.settings.getApiBaseURL() + 'group/removeAdmin/', params, {
            withCredentials: true,
            headers: header
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));
    }


    setDescription(groupid: string, description: string): Observable<any> {

        let params = new HttpParams();
        params = params.append('description', description);
        params.append('groupid', groupid);

        return this.http.post(this.settings.getApiBaseURL() + 'group/setDescription/', params, {
            withCredentials: true,
            headers: header
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));


    }


    setPerunGroupStatus(group_id: number, status: number): Observable<any> {

        let params = new HttpParams();
        params.append('groupid', group_id.toString());
        params.append('status', status.toString());


        return this.http.post(this.settings.getApiBaseURL() + 'group/setStatus/', params, {
            withCredentials: true,
            headers: header
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));
    }

    setGroupVolumeLimit(group_id: number, value: number): Observable<any> {


        let params = new HttpParams();
        params.append('groupid', group_id.toString());
        params.append('value', value.toString());


        return this.http.post(this.settings.getApiBaseURL() + 'group/setGroupVolumeLimit/', params, {
            withCredentials: true,
            headers: header
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));
    }


    setGroupVolumeCounter(group_id: number, value: number): Observable<any> {

        let params = new HttpParams();
        params.append('groupid', group_id.toString());
        params.append('value', value.toString());


        return this.http.post(this.settings.getApiBaseURL() + 'group/setGroupVolumeCounter/', value, {
            withCredentials: true,
            headers: header
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));
    }

    setdeNBIDirectAcces(group_id: number, value: boolean): Observable<any> {

        let params = new HttpParams();
        params.append('groupid', group_id.toString());
        params.append('value', value.toString());


        return this.http.post(this.settings.getApiBaseURL() + 'group/setdeNBIDirectAccess/', params, {
            withCredentials: true,
            headers: header
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));
    }


    setName(groupid: string, name: string): Observable<any> {
        let params = new HttpParams();
        params.append('groupid', groupid);
        params.append('name', name);
        return this.http.post(this.settings.getApiBaseURL() + 'group/setName/', params, {
            withCredentials: true,
            headers: header
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));
    }


    getName(groupid: string): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'group/getName/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));

    }


    setShortname(groupid: string, shortname: string): Observable<any> {
        let params = new HttpParams();
        params.append('shortname', shortname);
        params.append('groupid', groupid);
        return this.http.post(this.settings.getApiBaseURL() + 'group/setShortname/', params, {
            withCredentials: true,
            headers: header
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));

    }


    getShortame(groupid: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'group/getShortname/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));

    }

    getGroupDetails(): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'group/getGroupDetails/', {
            withCredentials: true,
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));


    }

    getMemberGroupsStatus(): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'group/getMemberGroupsStatus/', {
            withCredentials: true,
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));
    }

    getMemberGroups(): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'group/getMemberGroups/', {
            withCredentials: true,
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));
    }


    setLifetime(groupid: string, lifetime: string): Observable<any> {
        let params = new HttpParams();
        params.append('lifetime', lifetime);
        params.append('groupid', groupid);

        return this.http.post(this.settings.getApiBaseURL() + 'group/setLifetime/', params, {
            withCredentials: true,
            headers: header
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));


    }

    createGroup(group_name: string, group_description: string): Observable<any> {
        let params = new HttpParams();
        params.append('group_name', group_name);
        params.append('group_description', group_description.substring(0, 512));
        return this.http.post(this.settings.getApiBaseURL() + 'group/createGroup/', params,
            {
                withCredentials: true,
                headers: header
            }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));
    }


    getLifetime(groupid: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'group/getLifetime/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)))

    }

    setPerunId(groupid: string, applicationId: string): Observable<any> {
        let params = new HttpParams();
        params.append('groupid', groupid);
        params.append('applicationId', applicationId);

        return this.http.post(this.settings.getApiBaseURL() + 'group/setPerunId/', params, {
            withCredentials: true,
            headers: header
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));


    }


    getGroupMembers(groupid: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'group/getGroupMembers/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));


    }


    getGroupMaxDiskspace(groupid: string): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'project/getApprovedDiskSpace/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));


    }

    getGroupUsedDiskspace(groupid: string): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'project/getUsedDiskSpace/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));


    }


    getVolumesUsed(groupid: string): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'project/getUsedVolumes/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));
    }

    getVolumeCounter(groupid: string): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'project/getVolumesCounter/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));
    }

    getGroupApprovedVms(groupid: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'project/getNumberApprovedVms/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));


    }

    getGroupUsedVms(groupid: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'project/getUsedVms/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));

    }


    setPerunGroupAttributes(application_id: number, groupid: number): Observable<any> {
        let params = new HttpParams();
        params.append('groupid', groupid.toString());
        params.append('application_id', application_id.toString());

        return this.http.post(this.settings.getApiBaseURL() + 'group/setAttributes/', params, {
            withCredentials: true,
            headers: header
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));
    }


}
