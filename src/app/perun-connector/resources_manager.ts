import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {PerunSettings} from './connector-settings.service'
import { Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import {ApiSettings} from "../api-connector/api-settings.service";

@Injectable()
export class ResourcesManager {
  constructor(private http: Http, private settings: PerunSettings, private apiSettings: ApiSettings) {
  }

  getGroupAssignedResources(group_id: number) {
    return this.http.get(this.settings.getPerunBaseURL() + 'resourcesManager/getAssignedResources', {
      headers: new Headers({'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()}),
      params: {group: group_id}
    });
  }

   getFacilityByResource(resource_id: number) {
    return this.http.get(this.settings.getPerunBaseURL() + 'resourcesManager/getFacility', {
      headers: new Headers({'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()}),
      params: {resource: resource_id}
    });
  }
}
