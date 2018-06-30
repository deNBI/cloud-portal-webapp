import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import {ApiSettings}  from './api-settings.service'
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class ApplicationsService {
  constructor(private http: Http, private settings: ApiSettings) {
  }

  getUserApplications() {
    return this.http.get(this.settings.getApiBaseURL() + 'project_applications/', {
      withCredentials: true,
      params: {format: this.settings.getApiFormat()}
    });
  }

  getAllApplications() {
    return this.http.get(this.settings.getApiBaseURL() + 'all_applications/', {
      withCredentials: true,
      params: {format: this.settings.getApiFormat()}
    });
  }

  addNewApplication(data) {
    let parameter = data;
    let header = new Headers({
      'X-CSRFToken': this.settings.getCSRFToken(),
      'Content-Type': 'application/json'
    });

    return this.http.post(this.settings.getApiBaseURL() + 'add_application/', parameter,
      {
        headers: header,
        withCredentials: true
      });
  }



  requestRenewal(data) {
     let parameter = data;


    let header = new Headers({
      'X-CSRFToken': this.settings.getCSRFToken(),
    });
    return this.http.post(this.settings.getApiBaseURL() + 'application/requestRenewal/',parameter,
      {
        headers: header,
        withCredentials: true
      });
  }

    approveRenewal(application_id: number) {


    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('project_application_id', application_id.toString());
    let header = new Headers({
      'X-CSRFToken': this.settings.getCSRFToken(),
    });
    return this.http.post(this.settings.getApiBaseURL() + 'application/approveRenewal/', urlSearchParams,
      {
        headers: header,
        withCredentials: true
      });
  }


   getAllApplicationsRenewalRequests() {
    return this.http.get(this.settings.getApiBaseURL() + 'application/applicationRenewalRequests/', {
      withCredentials: true,
      params: {format: this.settings.getApiFormat()}
    });
  }

     getApplicationsRenewalRequest(application_id: number) {
    return this.http.get(this.settings.getApiBaseURL() + 'application/getApplicationRenewalRequestById/', {
      withCredentials: true,
      params: {format: this.settings.getApiFormat(),'project_application_id':application_id}
    });
  }


  deleteApplication(application_id: number) {


    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('project_application_id', application_id.toString());
    let header = new Headers({
      'X-CSRFToken': this.settings.getCSRFToken(),
    });
    return this.http.post(this.settings.getApiBaseURL() + 'delete_application/deleteApplicationById/', urlSearchParams,
      {
        headers: header,
        withCredentials: true
      });
  }



}
