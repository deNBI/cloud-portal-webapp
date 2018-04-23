import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {URLSearchParams} from '@angular/http';
import {ApiSettings} from './api-settings.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class FacilityService {
  constructor(private http: Http, private settings: ApiSettings) {
  }

  getManagerFacilities(): Observable<any> {

    return this.http.get(this.settings.getApiBaseURL()+ 'facilityManager/getFacilitiesWhereUserIsManager/', {
      withCredentials: true,
    }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

  }

  getFacilityAllowedGroups(facility): Observable<any> {

       let urlSearchParams = new URLSearchParams();
    return this.http.get(this.settings.getApiBaseURL()+ 'facilityManager/getFacilityAllowedGroups/', {
        withCredentials: true,
        params: {facility_id: facility}
    }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))




  }

  sendMailToFacility(facility,subject,message): Observable<any> {


    return this.http.get(this.settings.getApiBaseURL()+ 'facilityManager/sendMailToAllMembers/', {
        withCredentials: true,
        params: {facility_id: facility,subject:subject,message:message}
    }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))






  }

}
