import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {ApiSettings}  from './api-settings.service'
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class ApplicationsService {
  constructor(private http: Http, private settings: ApiSettings) {
  }

  getUserApplications() {
    return this.http.get(this.settings.getApiBaseURL() + 'project_applications/', {withCredentials: true, params:{format: this.settings.getApiFormat()}});
  }

  getAllApplications() {
    return this.http.get(this.settings.getApiBaseURL() + 'all_applications/', {withCredentials: true, params:{format: this.settings.getApiFormat()}});
  }

}
