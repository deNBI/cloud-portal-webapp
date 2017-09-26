import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {PerunSettings}  from './connector-settings.service'
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class MembersManager {
  constructor(private http: Http, private settings: PerunSettings) {
  }

  getMemberByUser(user_id: number) {
    var vo = this.settings.getPerunVO();
    return this.http.get(this.settings.getPerunBaseURL() + `membersManager/getMemberByUser`, {
      withCredentials: true,
      params: {user: user_id, vo: vo}
    });
  }

}
