import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***PerunSettings***REMOVED***  from './connector-settings.service'
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import ***REMOVED***ApiSettings***REMOVED*** from "../api-connector/api-settings.service";

@Injectable()
export class UsersManager ***REMOVED***
  constructor(private http: Http, private settings: PerunSettings, private apiSettings: ApiSettings) ***REMOVED***
  ***REMOVED***

  getGroupsWhereUserIsAdmin(user_id: number) ***REMOVED***
    return this.http.get(this.settings.getPerunBaseURL() + 'usersManager/getGroupsWhereUserIsAdmin', ***REMOVED***
      headers: new Headers(***REMOVED*** 'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()***REMOVED***),
      params: ***REMOVED***user: user_id, vo: this.settings.getPerunVO()***REMOVED***
    ***REMOVED***);
  ***REMOVED***

  getVosWhereUserIsAdmin(user_id: number) ***REMOVED***
    return this.http.get(this.settings.getPerunBaseURL() + 'usersManager/getVosWhereUserIsAdmin', ***REMOVED***
      headers: new Headers(***REMOVED*** 'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()***REMOVED***),
      params: ***REMOVED***user: user_id***REMOVED***
    ***REMOVED***);
  ***REMOVED***

***REMOVED***
