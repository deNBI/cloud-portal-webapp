import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {PerunSettings} from './connector-settings.service'
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import {ApiSettings} from "../api-connector/api-settings.service";
import {Project} from "../projectmanagement/project.model";

@Injectable()
export class GroupsManager {
  baseConnectorUrl = 'https://portal-dev.denbi.de/connector/'
  denbiProjectDiskSpace_ID=3288

  constructor(private http: Http, private settings: PerunSettings, private apiSettings: ApiSettings) {
  }






}
