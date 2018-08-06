import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {ApiSettings} from './api-settings.service';
import {URLSearchParams} from "@angular/http";
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/catch';
import {Observable, throwError} from 'rxjs';


@Injectable()
export class GroupService {

    constructor(private http: Http, private settings: ApiSettings) {
    }

    getComputeCenters(): Observable<any> {


        return this.http.get(this.settings.getApiBaseURL() + 'group/computecenters/', {
            withCredentials: true,

        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))

    }

    getComputeCentersDetails(resource_id: number): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'group/facilityDetails/', {
            withCredentials: true,
            params: {resource_id: resource_id}
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))

    }

    getFacilityByGroup(groupid: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'group/getFacilityByGroup/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))

    }


    assignGroupToResource(groupid: string, computecenter: string): Observable<any> {
        let urlSearchParams = new URLSearchParams();
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        urlSearchParams.append('compute_center', computecenter);
        urlSearchParams.append('groupid', groupid);
        return this.http.post(this.settings.getApiBaseURL() + 'group/assignGroupToResource/', urlSearchParams, {
            withCredentials: true,
            headers: header
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))


    }

    isUserAdminOfGroup(groupid: string, userid: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'group/isUserPi/', {
            withCredentials: true,
            params: {group_id: groupid, user_id: userid}
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))

    }


    getGroupAdminIds(groupid: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'group/getGroupAdminsId/', {
            withCredentials: true,
            params: {group_id: groupid}
        }).map((res: Response) => res.json()).catch((error: any) => throwError(
            error.json().error || 'Server error'))

    }

    getGroupRichMembers(groupid: number): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'group/getGroupRichMembers/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))

    }


    addMember(group_id: number, member_id: number, facility_id: number) {
        let urlSearchParams = new URLSearchParams();
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        urlSearchParams.append('facility_id', facility_id.toString());
        urlSearchParams.append('group_id', group_id.toString());
        urlSearchParams.append('member_id', member_id.toString())
        return this.http.post(this.settings.getApiBaseURL() + 'group/addMember/', urlSearchParams, {
            withCredentials: true,
            headers: header
        })
    }


    addAdmin(group_id: number, user_id: number, facility_id: number) {
        let urlSearchParams = new URLSearchParams();
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        urlSearchParams.append('facility_id', facility_id.toString());
        urlSearchParams.append('group_id', group_id.toString());
        urlSearchParams.append('user_id', user_id.toString())
        return this.http.post(this.settings.getApiBaseURL() + 'group/addAdmin/', urlSearchParams, {
            withCredentials: true,
            headers: header
        })
    }


    removeMember(group_id: number, member_id: number, user_id: number, facility_id: number) {
        let urlSearchParams = new URLSearchParams();
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        urlSearchParams.append('facility_id', facility_id.toString());
        urlSearchParams.append('group_id', group_id.toString());
        urlSearchParams.append('member_id', member_id.toString())
        urlSearchParams.append('user_id', user_id.toString())
        return this.http.post(this.settings.getApiBaseURL() + 'group/removeMember/', urlSearchParams, {
            withCredentials: true,
            headers: header
        })
    }


    removeAdmin(group_id: number, user_id: number, facility_id: number) {
        let urlSearchParams = new URLSearchParams();
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        urlSearchParams.append('facility_id', facility_id.toString());
        urlSearchParams.append('group_id', group_id.toString());

        urlSearchParams.append('user_id', user_id.toString())
        return this.http.post(this.settings.getApiBaseURL() + 'group/removeAdmin/', urlSearchParams, {
            withCredentials: true,
            headers: header
        })
    }


    setDescription(groupid: string, description: string): Observable<any> {

        let urlSearchParams = new URLSearchParams();
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        urlSearchParams.append('description', description);
        urlSearchParams.append('groupid', groupid);
        return this.http.post(this.settings.getApiBaseURL() + 'group/setDescription/', urlSearchParams, {
            withCredentials: true,
            headers: header
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))


    }


    setPerunGroupStatus(group_id: number, status: number) {
        let urlSearchParams = new URLSearchParams();
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        urlSearchParams.append('groupid', group_id.toString());
        urlSearchParams.append('status', status.toString());
        return this.http.post(this.settings.getApiBaseURL() + 'group/setStatus/', urlSearchParams, {
            withCredentials: true,
            headers: header
        })
    }

    setGroupVolumeLimit(group_id: number, value: number) {
        let urlSearchParams = new URLSearchParams();
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        urlSearchParams.append('groupid', group_id.toString());
        urlSearchParams.append('value', value.toString());
        return this.http.post(this.settings.getApiBaseURL() + 'group/setGroupVolumeLimit/', urlSearchParams, {
            withCredentials: true,
            headers: header
        })
    }


    setGroupVolumeCounter(group_id: number, value: number) {
        let urlSearchParams = new URLSearchParams();
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        urlSearchParams.append('groupid', group_id.toString());
        urlSearchParams.append('value', value.toString());
        return this.http.post(this.settings.getApiBaseURL() + 'group/setGroupVolumeCounter/', urlSearchParams, {
            withCredentials: true,
            headers: header
        })
    }

    setdeNBIDirectAcces(group_id: number, value: boolean) {
        let urlSearchParams = new URLSearchParams();
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        urlSearchParams.append('groupid', group_id.toString());
        urlSearchParams.append('value', value.toString());
        return this.http.post(this.settings.getApiBaseURL() + 'group/setdeNBIDirectAccess/', urlSearchParams, {
            withCredentials: true,
            headers: header
        })
    }


    setName(groupid: string, name: string): Observable<any> {
        let urlSearchParams = new URLSearchParams();
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        urlSearchParams.append('name', name);
        urlSearchParams.append('groupid', groupid);
        return this.http.post(this.settings.getApiBaseURL() + 'group/setName/', urlSearchParams, {
            withCredentials: true,
            headers: header
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))


    }


    getName(groupid: string): Observable<any> {
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        return this.http.get(this.settings.getApiBaseURL() + 'group/getName/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))


    }


    setShortname(groupid: string, shortname: string): Observable<any> {
        let urlSearchParams = new URLSearchParams();
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        urlSearchParams.append('shortname', shortname);
        urlSearchParams.append('groupid', groupid);
        return this.http.post(this.settings.getApiBaseURL() + 'group/setShortname/', urlSearchParams, {
            withCredentials: true,
            headers: header
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))


    }


    getShortame(groupid: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'group/getShortname/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))


    }

    getGroupDetails(): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'group/getGroupDetails/', {
            withCredentials: true,
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))


    }

    getMemberGroupsStatus(): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'group/getMemberGroupsStatus/', {
            withCredentials: true,
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))

    }

    getMemberGroups(): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'group/getMemberGroups/', {
            withCredentials: true,
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))
    }


    setLifetime(groupid: string, lifetime: string): Observable<any> {
        let urlSearchParams = new URLSearchParams();
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        urlSearchParams.append('lifetime', lifetime);
        urlSearchParams.append('groupid', groupid);
        return this.http.post(this.settings.getApiBaseURL() + 'group/setLifetime/', urlSearchParams, {
            withCredentials: true,
            headers: header
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))


    }

    createGroup(group_name: string, group_description: string) {
        let urlSearchParams = new URLSearchParams();
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        urlSearchParams.append('group_name', group_name);
        urlSearchParams.append('group_description', group_description.substring(0, 512));

        return this.http.post(this.settings.getApiBaseURL() + 'group/createGroup/', urlSearchParams,
            {
                withCredentials: true,
                headers: header
            });
    }


    getLifetime(groupid: string): Observable<any> {
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        return this.http.get(this.settings.getApiBaseURL() + 'group/getLifetime/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))

    }

    setPerunId(groupid: string, applicationId: string): Observable<any> {
        let urlSearchParams = new URLSearchParams();
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });

        urlSearchParams.append('groupid', groupid);
        urlSearchParams.append('applicationId', applicationId);
        return this.http.post(this.settings.getApiBaseURL() + 'group/setPerunId/', urlSearchParams, {
            withCredentials: true,
            headers: header
        })


    }


    getGroupMembers(groupid: string): Observable<any> {
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        return this.http.get(this.settings.getApiBaseURL() + 'group/getGroupMembers/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))


    }


    getGroupMaxDiskspace(groupid: string): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'project/getApprovedDiskSpace/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))


    }

    getGroupUsedDiskspace(groupid: string): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'project/getUsedDiskSpace/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))


    }


    getVolumesUsed(groupid: string): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'project/getUsedVolumes/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))


    }

    getVolumeCounter(groupid: string): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'project/getVolumesCounter/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))


    }

    getGroupApprovedVms(groupid: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'project/getNumberApprovedVms/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))


    }

    getGroupUsedVms(groupid: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'project/getUsedVms/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))


    }





    setPerunGroupAttributes(application_id: number, groupid: number) {
        let urlSearchParams = new URLSearchParams();
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        urlSearchParams.append('groupid', groupid.toString());
        urlSearchParams.append('application_id', application_id.toString());
        return this.http.post(this.settings.getApiBaseURL() + 'group/setAttributes/', urlSearchParams, {
            withCredentials: true,
            headers: header
        })
    }


}
