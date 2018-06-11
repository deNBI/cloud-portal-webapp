import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {ApiSettings} from './api-settings.service';
import {URLSearchParams} from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class GroupService {

    constructor(private http: Http, private settings: ApiSettings) {
    }

    getComputeCenters(): Observable<any> {


        return this.http.get(this.settings.getApiBaseURL() + 'computecenters/', {
            withCredentials: true,

        }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

    }

    getComputeCentersDetails(resource_id: number): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'facility_details/', {
            withCredentials: true,
            params: {resource_id: resource_id}
        }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

    }

    getFacilityByGroup(groupid: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'getFacilityByGroup/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

    }


    assignGroupToResource(groupid: string, computecenter: string): Observable<any> {
        let urlSearchParams = new URLSearchParams();
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        urlSearchParams.append('compute_center', computecenter);
        urlSearchParams.append('groupid', groupid);
        return this.http.post(this.settings.getApiBaseURL() + 'assignGroupToResource/', urlSearchParams, {
            withCredentials: true,
            headers: header
        }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))


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

    removeMember(group_id: number, member_id: number, facility_id: number) {
        let urlSearchParams = new URLSearchParams();
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        urlSearchParams.append('facility_id', facility_id.toString());
        urlSearchParams.append('group_id', group_id.toString());
        urlSearchParams.append('member_id', member_id.toString())
        return this.http.post(this.settings.getApiBaseURL() + 'group/removeMember/', urlSearchParams, {
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
        }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))


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
        }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))


    }


    getLifetime(groupid: string): Observable<any> {
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        return this.http.get(this.settings.getApiBaseURL() + 'group/getLifetime/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))


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
        }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))


    }


    getGroupMembers(groupid: string): Observable<any> {
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        return this.http.get(this.settings.getApiBaseURL() + 'group/getGroupMembers/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))


    }


    getGroupMaxDiskspace(groupid: string): Observable<any> {
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        return this.http.get(this.settings.getApiBaseURL() + 'project/getApprovedDiskSpace/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))


    }

    getGroupUsedDiskspace(groupid: string): Observable<any> {
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        return this.http.get(this.settings.getApiBaseURL() + 'project/getUsedDiskSpace/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))


    }

    getGroupApprovedVms(groupid: string): Observable<any> {
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        return this.http.get(this.settings.getApiBaseURL() + 'project/getNumberApprovedVms/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))


    }

    getGroupUsedVms(groupid: string): Observable<any> {
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        return this.http.get(this.settings.getApiBaseURL() + 'project/getUsedVms/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))


    }


    setNumberOfVms(groupid: string, numberofVms: string): Observable<any> {
        let urlSearchParams = new URLSearchParams();
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        urlSearchParams.append('numberOfVms', numberofVms);
        urlSearchParams.append('groupid', groupid);
        return this.http.post(this.settings.getApiBaseURL() + 'setGroupNumberOfVms/', urlSearchParams, {
            withCredentials: true,
            headers: header
        }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))


    }

}
