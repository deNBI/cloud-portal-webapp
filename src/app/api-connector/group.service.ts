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





    getFacilityByGroup(groupid: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid +'/computecenter/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error.error)));

    }


    assignGroupToResource(groupid: string, computecenter: string): Observable<any> {
        let params = new HttpParams().set('compute_center', computecenter)

        return this.http.post(this.settings.getApiBaseURL() + 'projects/' + groupid +'/resource/', params, {
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

        return this.http.post(this.settings.getApiBaseURL() + 'projects/'+ groupid + '/attributes/description/', params, {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error.error)));


    }


    setPerunGroupStatus(group_id: number, status: number): Observable<any> {

        let params = new HttpParams().set('status', status.toString());

        return this.http.post(this.settings.getApiBaseURL() + 'projects/'+ group_id + '/attributes/status/', params, {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error.error)));
    }

    setGroupVolumeLimit(group_id: number, value: number): Observable<any> {


        let params = new HttpParams().set('value', value.toString());


        return this.http.post(this.settings.getApiBaseURL() + 'projects/'+ group_id + '/attributes/volumeLimit/', params, {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error.error)));
    }


    setGroupVolumeCounter(group_id: number, value: number): Observable<any> {

        let params = new HttpParams().set('value', value.toString());

        return this.http.post(this.settings.getApiBaseURL() + 'projects/'+ group_id + '/attributes/volumeCounter/', params, {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error.error)));
    }

    setdeNBIDirectAcces(group_id: number, value: boolean): Observable<any> {

        let params = new HttpParams().set('value', value.toString());
        return this.http.post(this.settings.getApiBaseURL() + 'projects/'+ group_id + '/attributes/directAccess/', params, {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error.error)));
    }


    setName(groupid: string, name: string): Observable<any> {
        let params = new HttpParams().set('name', name);

        return this.http.post(this.settings.getApiBaseURL() + 'projects/'+ groupid + '/attributes/name/', params, {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error.error)));
    }


    getName(groupid: string): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'projects/'+ groupid + '/attributes/name/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error.error)));

    }


    setShortname(groupid: string, shortname: string): Observable<any> {
        let params = new HttpParams().set('shortname', shortname)

        return this.http.post(this.settings.getApiBaseURL() + 'projects/' + groupid +'/attributes/shortname/', params, {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error.error)));

    }


    getShortame(groupid: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid +'/attributes/shortname/', {
            withCredentials: true,
            params: {groupid: groupid}
        }).pipe(catchError((error: any) => throwError(error.error)));

    }

    getGroupDetails(): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'projects/details/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error.error)));


    }


    getGroupApplications(group: number): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + group + '/applications/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error.error)));


    }

    approveGroupApplication(groupid: number, application: number): Observable<any> {


        return this.http.post(this.settings.getApiBaseURL() + 'projects/' + groupid + '/applications/' + application + '/status/', null,{
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error.error)));

    }

    rejectGroupApplication(groupid: number, application: number): Observable<any> {


        return this.http.delete(this.settings.getApiBaseURL() + 'projects/' + groupid + '/applications/' + application + '/status/',{
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error.error)));

    }


    getMemberGroupsStatus(): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'projects/singlevm/', {
            withCredentials: true,
            headers: header

        }).pipe(catchError((error: any) => throwError(error.error)));
    }




    setLifetime(groupid: string, lifetime: string): Observable<any> {
        let params = new HttpParams().set('lifetime', lifetime);


        return this.http.post(this.settings.getApiBaseURL() + 'projects/'+ groupid + '/attributes/lifetime/', params, {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error.error)));


    }

    createGroup(group_name: string, group_description: string): Observable<any> {
        let params = new HttpParams().set('group_name', group_name).set('group_description', group_description.substring(0, 512));

        return this.http.post(this.settings.getApiBaseURL() + 'projects/', params,
            {
                withCredentials: true,
                headers: header
            }).pipe(catchError((error: any) => throwError(error.error)));
    }


    getLifetime(groupid: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'projects/'+ groupid + '/attributes//lifetime/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error.error)));

    }

    setPerunId(groupid: string, applicationId: string): Observable<any> {
        let params = new HttpParams().set('applicationId', applicationId);

        return this.http.post(this.settings.getApiBaseURL() + 'projects/'+ groupid + '/attributes/perunId/', params, {
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
        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid +'/attributes/approvedDiskspace/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error.error)));

    }

    getGroupUsedDiskspace(groupid: string): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid +'/attributes/usedDiskspace/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error.error)));


    }


    getVolumesUsed(groupid: string): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid +'/attributes/usedVolumes/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error.error)));
    }

    getVolumeCounter(groupid: string): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid +'/attributes/volumesCounter/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error.error)));
    }

    getGroupApprovedVms(groupid: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'projects/'  + groupid +'/attributes/approvedVms/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error.error)));


    }

    getGroupUsedVms(groupid: string): Observable<any> {

        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid +'/attributes/usedVms/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error.error)));

    }


    setPerunGroupAttributes(application_id: number, groupid: number): Observable<any> {
        let params = new HttpParams()
            .set('application_id', application_id.toString());

        return this.http.post(this.settings.getApiBaseURL() + 'projects/' + groupid + '/attributes/', params, {
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
