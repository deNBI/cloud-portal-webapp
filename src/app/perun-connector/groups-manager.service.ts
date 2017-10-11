import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {PerunSettings}  from './connector-settings.service'
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GroupsManager {
  constructor(private http: Http, private settings: PerunSettings) {
  }

  getMemberGroups(member_id: number) {
    return this.http.get(this.settings.getPerunBaseURL() + 'groupsManager/getMemberGroups', {
      withCredentials: true,
      params: {member: member_id}
    });
  }


  createGroup(group_name: string, group_description: string) {
    var parameter = JSON.stringify({
      vo: this.settings.getPerunVO(),
      group: {name: group_name, description: group_description}
    });
    return this.http.post(this.settings.getPerunBaseURL() + 'groupsManager/createGroup', parameter,
      {withCredentials: true});
  }

}
