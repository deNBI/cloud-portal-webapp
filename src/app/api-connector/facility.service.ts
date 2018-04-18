import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';
import ***REMOVED***URLSearchParams***REMOVED*** from '@angular/http';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class FacilityService ***REMOVED***
  constructor(private http: Http, private settings: ApiSettings) ***REMOVED***
  ***REMOVED***

  getManagerFacilities(): Observable<any> ***REMOVED***

    return this.http.get(this.settings.getApiBaseURL()+ 'facilityManager/getFacilitiesWhereUserIsManager/', ***REMOVED***
      withCredentials: true,
    ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

  ***REMOVED***

  getFacilityAllowedGroups(facility): Observable<any> ***REMOVED***

       let urlSearchParams = new URLSearchParams();
    return this.http.get(this.settings.getApiBaseURL()+ 'facilityManager/getFacilityAllowedGroups/', ***REMOVED***
        withCredentials: true,
        params: ***REMOVED***facility_id: facility***REMOVED***
    ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))




  ***REMOVED***

***REMOVED***
