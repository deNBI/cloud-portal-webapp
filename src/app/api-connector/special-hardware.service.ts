import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {ApiSettings}  from './api-settings.service'
import { Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class SpecialHardwareService {
  constructor(private http: Http, private settings: ApiSettings) {
  }

  getAllSpecialHardware() {
    return this.http.get(this.settings.getApiBaseURL() + 'special_hardware/', {
      withCredentials: true,
      params:{format: this.settings.getApiFormat()}});
  }

}
