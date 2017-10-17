import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {ApiSettings}  from './api-settings.service'
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class ApplicationStatusService {
  constructor(private http: Http, private settings: ApiSettings) {
  }

  getAllApplicationStatus() {
    return this.http.get(this.settings.getApiBaseURL() + 'application_status/', {
      withCredentials: true,
      params: {format: this.settings.getApiFormat()}
    });
  }

  setApplicationStatus(application_id: number, status_id: number) {
    let parameter = JSON.stringify({
      "project_application_status": status_id
    });
    let header = new Headers({
      'X-CSRFToken': this.settings.getCSRFToken(),
      'Content-Type': 'application/json'
    });
    return this.http.patch(this.settings.getApiBaseURL() + 'update_application_status/' + application_id + "/", parameter,
      {
        headers: header,
        withCredentials: true
      });
  }

}
