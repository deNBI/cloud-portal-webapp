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





    getFacilityByGroup(groupid: string): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid +'/computecenter/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));

    ***REMOVED***

    getClient(groupid:string):Observable<any>***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid +'/client/', ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));

    ***REMOVED***

    assignGroupToResource(groupid: string, computecenter: string): Observable<any> ***REMOVED***
        let params = new HttpParams().set('compute_center', computecenter)

        return this.http.post(this.settings.getApiBaseURL() + 'projects/' + groupid +'/resource/', params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));


    ***REMOVED***

    isUserAdminOfGroup(groupid: string, userid: string): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid + '/members/' + userid + '/manager/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));

    ***REMOVED***


    getGroupAdminIds(groupid: string): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid + '/admins/ids/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));

    ***REMOVED***

    getGroupRichMembers(groupid: number): Observable<any> ***REMOVED***
        let params = new HttpParams().set('groupid', groupid.toString());
        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid + '/richMembers/', ***REMOVED***
            withCredentials: true,
            params: params
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***


    addMember(group_id: number, member_id: number, facility_id?: number) ***REMOVED***
        let params = new HttpParams()
        if (facility_id) ***REMOVED***
            params.set('facility_id', facility_id.toString())

        ***REMOVED***


        return this.http.post(this.settings.getApiBaseURL() + 'projects/' + group_id + '/members/' + member_id + '/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
            //responseType: 'text',
            observe: 'response'
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***


    addAdmin(group_id: number, user_id: number, facility_id?: number): Observable<any> ***REMOVED***
        let params = new HttpParams();


        if (facility_id) ***REMOVED***
            params.set('facility_id', facility_id.toString())

        ***REMOVED***

        return this.http.post(this.settings.getApiBaseURL() + 'projects/' + group_id + '/admins/' + user_id + '/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
            //responseType: 'text',
            observe: 'response'
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***


    removeMember(group_id: number, member_id: number,  facility_id?: number): Observable<any> ***REMOVED***
        let params = new HttpParams();


        if (facility_id) ***REMOVED***
            params.set('facility_id', facility_id.toString())

        ***REMOVED***


        return this.http.request('delete',this.settings.getApiBaseURL() +'projects/' + group_id + '/members/' + member_id + '/', ***REMOVED***
            withCredentials: true,
            headers: header,
            body:params,
            responseType: 'text',
            observe: 'response'
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***


    removeAdmin(group_id: number, user_id: number, facility_id?: number): Observable<any> ***REMOVED***

        let params = new HttpParams()

        if (facility_id) ***REMOVED***
            params.set('facility_id', facility_id.toString())

        ***REMOVED***


        return this.http.request('delete',this.settings.getApiBaseURL() + 'projects/' + group_id + '/admins/' + user_id + '/', ***REMOVED***
            withCredentials: true,
            headers: header,
            responseType: 'text',
            body: params,
            observe: 'response'
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***


    setDescription(groupid: string, description: string): Observable<any> ***REMOVED***

        let params = new HttpParams().set('description', description).set('groupid', groupid);

        return this.http.post(this.settings.getApiBaseURL() + 'projects/'+ groupid + '/attributes/description/', params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));


    ***REMOVED***


    setPerunGroupStatus(group_id: number, status: number): Observable<any> ***REMOVED***

        let params = new HttpParams().set('status', status.toString());

        return this.http.post(this.settings.getApiBaseURL() + 'projects/'+ group_id + '/attributes/status/', params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***

    setGroupVolumeLimit(group_id: number, value: number): Observable<any> ***REMOVED***


        let params = new HttpParams().set('value', value.toString());


        return this.http.post(this.settings.getApiBaseURL() + 'projects/'+ group_id + '/attributes/volumeLimit/', params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***


    setGroupVolumeCounter(group_id: number, value: number): Observable<any> ***REMOVED***

        let params = new HttpParams().set('value', value.toString());

        return this.http.post(this.settings.getApiBaseURL() + 'projects/'+ group_id + '/attributes/volumesCounter/', params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***

    setdeNBIDirectAcces(group_id: number, value: boolean): Observable<any> ***REMOVED***

        let params = new HttpParams().set('value', value.toString());
        return this.http.post(this.settings.getApiBaseURL() + 'projects/'+ group_id + '/attributes/directAccess/', params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***


    setName(groupid: string, name: string): Observable<any> ***REMOVED***
        let params = new HttpParams().set('name', name);

        return this.http.post(this.settings.getApiBaseURL() + 'projects/'+ groupid + '/attributes/name/', params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***


    getName(groupid: string): Observable<any> ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'projects/'+ groupid + '/attributes/name/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));

    ***REMOVED***


    setShortname(groupid: string, shortname: string): Observable<any> ***REMOVED***
        let params = new HttpParams().set('shortname', shortname)

        return this.http.post(this.settings.getApiBaseURL() + 'projects/' + groupid +'/attributes/shortname/', params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));

    ***REMOVED***


    getShortame(groupid: string): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid +'/attributes/shortname/', ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***groupid: groupid***REMOVED***
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));

    ***REMOVED***

    getGroupDetails(): Observable<any> ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'projects/details/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));


    ***REMOVED***


    getGroupApplications(group: number): Observable<any> ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + group + '/applications/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));


    ***REMOVED***

    approveGroupApplication(groupid: number, application: number): Observable<any> ***REMOVED***


        return this.http.post(this.settings.getApiBaseURL() + 'projects/' + groupid + '/applications/' + application + '/status/', null,***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));

    ***REMOVED***

    rejectGroupApplication(groupid: number, application: number): Observable<any> ***REMOVED***


        return this.http.delete(this.settings.getApiBaseURL() + 'projects/' + groupid + '/applications/' + application + '/status/',***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));

    ***REMOVED***


    getMemberGroupsStatus(): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'projects/singlevm/', ***REMOVED***
            withCredentials: true,
            headers: header

        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***




    setLifetime(groupid: string, lifetime: string): Observable<any> ***REMOVED***
        let params = new HttpParams().set('lifetime', lifetime);


        return this.http.post(this.settings.getApiBaseURL() + 'projects/'+ groupid + '/attributes/lifetime/', params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));


    ***REMOVED***

    createGroup(group_name: string, group_description: string): Observable<any> ***REMOVED***
        let params = new HttpParams().set('group_name', group_name).set('group_description', group_description.substring(0, 512));

        return this.http.post(this.settings.getApiBaseURL() + 'projects/', params,
            ***REMOVED***
                withCredentials: true,
                headers: header
            ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***


    getLifetime(groupid: string): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'projects/'+ groupid + '/attributes/lifetime/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));

    ***REMOVED***

    setPerunId(groupid: string, applicationId: string): Observable<any> ***REMOVED***
        let params = new HttpParams().set('applicationId', applicationId);

        return this.http.post(this.settings.getApiBaseURL() + 'projects/'+ groupid + '/attributes/perunId/', params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));


    ***REMOVED***


    getGroupMembers(groupid: string): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid + '/members/', ***REMOVED***
            withCredentials: true,
            headers: header

        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));


    ***REMOVED***


    getGroupMaxDiskspace(groupid: string): Observable<any> ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid +'/attributes/approvedDiskspace/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));

    ***REMOVED***

    getGroupUsedDiskspace(groupid: string): Observable<any> ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid +'/attributes/usedDiskspace/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));


    ***REMOVED***


    getVolumesUsed(groupid: string): Observable<any> ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid +'/attributes/usedVolumes/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***

    getVolumeCounter(groupid: string): Observable<any> ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid +'/attributes/volumesCounter/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***

    getGroupApprovedVms(groupid: string): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'projects/'  + groupid +'/attributes/approvedVms/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));


    ***REMOVED***

    getGroupUsedVms(groupid: string): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'projects/' + groupid +'/attributes/usedVms/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));

    ***REMOVED***


    setPerunGroupAttributes(application_id: number, groupid: number): Observable<any> ***REMOVED***
        let params = new HttpParams()
            .set('application_id', application_id.toString());

        return this.http.post(this.settings.getApiBaseURL() + 'projects/' + groupid + '/attributes/', params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***


    isFreemiumActive(): Observable<any> ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'freemium/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error.error)));
    ***REMOVED***

    addMemberToFreemium(): Observable<any> ***REMOVED***

        return this.http.post(this.settings.getApiBaseURL() + 'freemium/', ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***)
    ***REMOVED***


***REMOVED***
