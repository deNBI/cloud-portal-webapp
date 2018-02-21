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

}
