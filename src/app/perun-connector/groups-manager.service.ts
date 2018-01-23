import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***PerunSettings***REMOVED*** from './connector-settings.service'
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import ***REMOVED***ApiSettings***REMOVED*** from "../api-connector/api-settings.service";
import ***REMOVED***Project***REMOVED*** from "../projectmanagement/project.model";

@Injectable()
export class GroupsManager ***REMOVED***
  baseConnectorUrl = 'https://portal-dev.denbi.de/connector/'

  constructor(private http: Http, private settings: PerunSettings, private apiSettings: ApiSettings) ***REMOVED***
  ***REMOVED***

  getMemberGroups(member_id: number) ***REMOVED***
    return this.http.get(this.settings.getPerunBaseURL() + 'groupsManager/getMemberGroups', ***REMOVED***
      headers: new Headers(***REMOVED***'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()***REMOVED***),
      params: ***REMOVED***member: member_id***REMOVED***
    ***REMOVED***);
  ***REMOVED***



  getMemberGroupsStatus() ***REMOVED***
    return this.http.get(this.apiSettings.getApiBaseURL() + 'approved_projects/', ***REMOVED***
       withCredentials: true,
      headers: new Headers(***REMOVED***'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()***REMOVED***),
    ***REMOVED***);

  ***REMOVED***

  createGroup(group_name: string, group_description: string) ***REMOVED***
    var parameter = JSON.stringify(***REMOVED***
      vo: this.settings.getPerunVO(),
      group: ***REMOVED***name: group_name, description: group_description***REMOVED***
    ***REMOVED***);
    return this.http.post(this.settings.getPerunBaseURL() + 'groupsManager/createGroup', parameter,
      ***REMOVED***
        headers: new Headers(***REMOVED***'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()***REMOVED***),
      ***REMOVED***);
  ***REMOVED***

  setPerunGroupStatus(group_id: number, status: number) ***REMOVED***
    /* 1:submitted
       2: approved
       3: declined
     */

    var parameter = JSON.stringify(***REMOVED***
      group: group_id,
      attribute: ***REMOVED***
        id: 3291, namespace: 'urn:perun:group:attribute-def:opt',
        friendlyName: 'denbiProjectStatus', type: 'java.lang.Integer',
        value: status,
      ***REMOVED***
    ***REMOVED***);
    return this.http.post(this.settings.getPerunBaseURL() + 'attributesManager/setAttribute', parameter,
      ***REMOVED***
        headers: new Headers(***REMOVED***'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()***REMOVED***),
      ***REMOVED***);
  ***REMOVED***

  getGroupRichMembers(group_id: number) ***REMOVED***
    return this.http.get(this.settings.getPerunBaseURL() + 'groupsManager/getGroupRichMembers', ***REMOVED***
      headers: new Headers(***REMOVED***'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()***REMOVED***),
      params: ***REMOVED***group: group_id***REMOVED***
    ***REMOVED***);
  ***REMOVED***

  addMember(group_id: number, member_id: number) ***REMOVED***
    var parameter = JSON.stringify(***REMOVED***
      group: group_id,
      member: member_id
    ***REMOVED***);
    return this.http.post(this.settings.getPerunBaseURL() + 'groupsManager/addMember', parameter,
      ***REMOVED***
        headers: new Headers(***REMOVED***'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()***REMOVED***),
      ***REMOVED***);
  ***REMOVED***

  addAdmin(group_id: number, user_id: number) ***REMOVED***
    var parameter = JSON.stringify(***REMOVED***
      group: group_id,
      user: user_id
    ***REMOVED***);
    return this.http.post(this.settings.getPerunBaseURL() + 'groupsManager/addAdmin', parameter,
      ***REMOVED***
        headers: new Headers(***REMOVED***'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()***REMOVED***),
      ***REMOVED***);
  ***REMOVED***

  removeMember(group_id: number, member_id: number) ***REMOVED***
    var parameter = JSON.stringify(***REMOVED***
      group: group_id,
      member: member_id
    ***REMOVED***);
    return this.http.post(this.settings.getPerunBaseURL() + 'groupsManager/removeMember', parameter,
      ***REMOVED***
        headers: new Headers(***REMOVED***'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()***REMOVED***),
      ***REMOVED***);
  ***REMOVED***

***REMOVED***
