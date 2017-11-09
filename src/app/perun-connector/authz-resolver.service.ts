import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {PerunSettings} from './connector-settings.service'
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {ApiSettings} from '../api-connector/api-settings.service';


@Injectable()
export class AuthzResolver {
  constructor(private http: Http, private perunSettings: PerunSettings, private apiSettings: ApiSettings) {
  }

  getLoggedUser() {
    return this.http.get(this.perunSettings.getPerunBaseURL() + 'authzResolver/getLoggedUser',
      {
      headers: new Headers({ 'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()}),
  });
  }

}
