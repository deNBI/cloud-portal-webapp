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

    getComputeCentersDetails(resource_id:number): Observable<any> ***REMOVED***

    return this.http.get(this.settings.getApiBaseURL() + 'facility_details/', ***REMOVED***
      withCredentials: true,
        params:***REMOVED***resource_id:resource_id***REMOVED***
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

***REMOVED***
