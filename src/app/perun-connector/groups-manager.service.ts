import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***PerunSettings***REMOVED***  from './connector-settings.service'
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GroupsManager ***REMOVED***
  constructor(private http: Http, private settings: PerunSettings) ***REMOVED***
  ***REMOVED***

  getMemberGroups(member_id: number) ***REMOVED***
    return this.http.get(this.settings.getPerunBaseURL() + 'groupsManager/getMemberGroups', ***REMOVED***
      withCredentials: true,
      params: ***REMOVED***member: member_id***REMOVED***
    ***REMOVED***);
  ***REMOVED***


  createGroup(group_name: string, group_description: string) ***REMOVED***
    var parameter = JSON.stringify(***REMOVED***
      vo: this.settings.getPerunVO(),
      group: ***REMOVED***name: group_name, description: group_description***REMOVED***
    ***REMOVED***);
    return this.http.post(this.settings.getPerunBaseURL() + 'groupsManager/createGroup', parameter,
      ***REMOVED***withCredentials: true***REMOVED***);
  ***REMOVED***

  getGroupRichMembers(group_id: number) ***REMOVED***
    return this.http.get(this.settings.getPerunBaseURL() + 'groupsManager/getGroupRichMembers', ***REMOVED***
      withCredentials: true,
      params: ***REMOVED***group: group_id***REMOVED***
    ***REMOVED***);
  ***REMOVED***

  addMember(group_id: number, member_id: number) ***REMOVED***
    var parameter = JSON.stringify(***REMOVED***
      group: group_id,
      member: member_id
    ***REMOVED***);
    return this.http.post(this.settings.getPerunBaseURL() + 'groupsManager/addMember', parameter,
      ***REMOVED***withCredentials: true***REMOVED***);
  ***REMOVED***

  addAdmin(group_id: number, user_id: number) ***REMOVED***
    var parameter = JSON.stringify(***REMOVED***
      group: group_id,
      user: user_id
    ***REMOVED***);
    return this.http.post(this.settings.getPerunBaseURL() + 'groupsManager/addAdmin', parameter,
      ***REMOVED***withCredentials: true***REMOVED***);
  ***REMOVED***

  removeMember(group_id: number, member_id: number) ***REMOVED***
    var parameter = JSON.stringify(***REMOVED***
      group: group_id,
      member: member_id
    ***REMOVED***);
    return this.http.post(this.settings.getPerunBaseURL() + 'groupsManager/removeMember', parameter,
      ***REMOVED***withCredentials: true***REMOVED***);
  ***REMOVED***

***REMOVED***
