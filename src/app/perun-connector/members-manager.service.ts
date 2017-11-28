import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {PerunSettings} from './connector-settings.service'
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {ApiSettings} from '../api-connector/api-settings.service';

@Injectable()
export class MembersManager {
  constructor(private http: Http, private settings: PerunSettings, private apiSettings: ApiSettings) {
  }

  getMemberByUser(user_id: number) {
    var vo = this.settings.getPerunVO();
    return this.http.get(this.settings.getPerunBaseURL() + `membersManager/getMemberByUser`, {
      headers: new Headers({ 'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()}),
      params: {user: user_id, vo: vo}
    });
  }

  getMemberByExtSourceNameAndExtLogin(ext_login: string) {
    let vo = this.settings.getPerunVO(),
      idp = this.settings.getUserExtSource();

    return this.http.get(this.settings.getPerunBaseURL() + `membersManager/getMemberByExtSourceNameAndExtLogin`, {
      headers: new Headers({ 'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()}),
      params: {extSourceName: idp,
               extLogin: ext_login,
               vo: vo}
    });
  }

}
