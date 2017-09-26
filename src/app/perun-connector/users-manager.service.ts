import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {PerunSettings}  from './connector-settings.service'
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UsersManager {
  constructor(private http: Http, private settings: PerunSettings) {
  }

  getGroupsWhereUserIsAdmin(user_id: number) {
    return this.http.get(this.settings.getPerunBaseURL() + 'usersManager/getGroupsWhereUserIsAdmin', {
      withCredentials: true,
      params: {user: user_id, vo: this.settings.getPerunVO()}
    });
  }

  getVosWhereUserIsAdmin(user_id: number) {
    return this.http.get(this.settings.getPerunBaseURL() + 'usersManager/getVosWhereUserIsAdmin', {
      withCredentials: true,
      params: {user: user_id}
    });
  }

}
