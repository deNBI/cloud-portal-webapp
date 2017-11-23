import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {PerunSettings}  from './connector-settings.service'
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import {ApiSettings} from "../api-connector/api-settings.service";

@Injectable()
export class UsersManager {
  constructor(private http: Http, private settings: PerunSettings, private apiSettings: ApiSettings) {
  }

  getGroupsWhereUserIsAdmin(user_id: number) {
    return this.http.get(this.settings.getPerunBaseURL() + 'usersManager/getGroupsWhereUserIsAdmin', {
      headers: new Headers({ 'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()}),
      params: {user: user_id, vo: this.settings.getPerunVO()}
    });
  }

  getVosWhereUserIsAdmin(user_id: number) {
    return this.http.get(this.settings.getPerunBaseURL() + 'usersManager/getVosWhereUserIsAdmin', {
      headers: new Headers({ 'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()}),
      params: {user: user_id}
    });
  }
}
