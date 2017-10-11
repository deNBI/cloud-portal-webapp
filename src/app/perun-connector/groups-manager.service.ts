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

***REMOVED***
