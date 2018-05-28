import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service';
import ***REMOVED***URLSearchParams***REMOVED*** from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class GroupService ***REMOVED***

    constructor(private http: Http, private settings: ApiSettings) ***REMOVED***
    ***REMOVED***

    getComputeCenters(): Observable<any> ***REMOVED***


        return this.http.get(this.settings.getApiBaseURL() + 'computecenters/', ***REMOVED***
            withCredentials: true,

        ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

    ***REMOVED***

    getComputeCentersDetails(resource_id: number): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'facility_details/', ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***resource_id: resource_id***REMOVED***
        ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

    ***REMOVED***

    getFacilityByGroup(groupid: string): Observable<any> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'getFacilityByGroup/', ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***groupid: groupid***REMOVED***
        ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

    ***REMOVED***


    assignGroupToResource(groupid: string, computecenter: string): Observable<any> ***REMOVED***
        let urlSearchParams = new URLSearchParams();
        let header = new Headers(***REMOVED***
            'X-CSRFToken': this.settings.getCSRFToken(),
        ***REMOVED***);
        urlSearchParams.append('compute_center', computecenter);
        urlSearchParams.append('groupid', groupid);
        return this.http.post(this.settings.getApiBaseURL() + 'assignGroupToResource/', urlSearchParams, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))


    ***REMOVED***

    addMember(group_id: number, member_id: number, facility_id: number) ***REMOVED***
        let urlSearchParams = new URLSearchParams();
        let header = new Headers(***REMOVED***
            'X-CSRFToken': this.settings.getCSRFToken(),
        ***REMOVED***);
        urlSearchParams.append('facility_id', facility_id.toString());
        urlSearchParams.append('group_id', group_id.toString());
        urlSearchParams.append('member_id', member_id.toString())
        return this.http.post(this.settings.getApiBaseURL() + 'group/addMember/', urlSearchParams, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***)
    ***REMOVED***

    removeMember(group_id: number, member_id: number, facility_id: number) ***REMOVED***
        let urlSearchParams = new URLSearchParams();
        let header = new Headers(***REMOVED***
            'X-CSRFToken': this.settings.getCSRFToken(),
        ***REMOVED***);
        urlSearchParams.append('facility_id', facility_id.toString());
        urlSearchParams.append('group_id', group_id.toString());
        urlSearchParams.append('member_id', member_id.toString())
        return this.http.post(this.settings.getApiBaseURL() + 'group/removeMember/', urlSearchParams, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***)


    ***REMOVED***
      setDescription(groupid: string, description: string): Observable<any> ***REMOVED***
        let urlSearchParams = new URLSearchParams();
         let header = new Headers(***REMOVED***
            'X-CSRFToken': this.settings.getCSRFToken(),
        ***REMOVED***);
        urlSearchParams.append('description', description);
        urlSearchParams.append('groupid', groupid);
        return this.http.post(this.settings.getApiBaseURL() + 'group/setDescription/', urlSearchParams, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))


    ***REMOVED***




     getGroupMembers(groupid: string): Observable<any> ***REMOVED***
         let header = new Headers(***REMOVED***
            'X-CSRFToken': this.settings.getCSRFToken(),
        ***REMOVED***);
        return this.http.get(this.settings.getApiBaseURL() + 'group/getGroupMembers/', ***REMOVED***
            withCredentials: true,
            params:***REMOVED***groupid:groupid***REMOVED***
        ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))


    ***REMOVED***


         getGroupMaxDiskspace(groupid: string): Observable<any> ***REMOVED***
         let header = new Headers(***REMOVED***
            'X-CSRFToken': this.settings.getCSRFToken(),
        ***REMOVED***);
        return this.http.get(this.settings.getApiBaseURL() + 'project/getApprovedDiskSpace/', ***REMOVED***
            withCredentials: true,
            params:***REMOVED***groupid:groupid***REMOVED***
        ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))


    ***REMOVED***

    getGroupUsedDiskspace(groupid: string): Observable<any> ***REMOVED***
         let header = new Headers(***REMOVED***
            'X-CSRFToken': this.settings.getCSRFToken(),
        ***REMOVED***);
        return this.http.get(this.settings.getApiBaseURL() + 'project/getUsedDiskSpace/', ***REMOVED***
            withCredentials: true,
            params:***REMOVED***groupid:groupid***REMOVED***
        ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))


    ***REMOVED***

     getGroupApprovedVms(groupid: string): Observable<any> ***REMOVED***
         let header = new Headers(***REMOVED***
            'X-CSRFToken': this.settings.getCSRFToken(),
        ***REMOVED***);
        return this.http.get(this.settings.getApiBaseURL() + 'project/getNumberApprovedVms/', ***REMOVED***
            withCredentials: true,
            params:***REMOVED***groupid:groupid***REMOVED***
        ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))


    ***REMOVED***

       getGroupUsedVms(groupid: string): Observable<any> ***REMOVED***
         let header = new Headers(***REMOVED***
            'X-CSRFToken': this.settings.getCSRFToken(),
        ***REMOVED***);
        return this.http.get(this.settings.getApiBaseURL() + 'project/getUsedVms/', ***REMOVED***
            withCredentials: true,
            params:***REMOVED***groupid:groupid***REMOVED***
        ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))


    ***REMOVED***






    setNumberOfVms(groupid: string, numberofVms: string): Observable<any> ***REMOVED***
        let urlSearchParams = new URLSearchParams();
         let header = new Headers(***REMOVED***
            'X-CSRFToken': this.settings.getCSRFToken(),
        ***REMOVED***);
        urlSearchParams.append('numberOfVms', numberofVms);
        urlSearchParams.append('groupid', groupid);
        return this.http.post(this.settings.getApiBaseURL() + 'setGroupNumberOfVms/', urlSearchParams, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))


    ***REMOVED***

***REMOVED***
