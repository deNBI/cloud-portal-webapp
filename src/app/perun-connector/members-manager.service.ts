import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***PerunSettings***REMOVED***  from './connector-settings.service'
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class MembersManager ***REMOVED***
  constructor(private http: Http, private settings: PerunSettings) ***REMOVED***
  ***REMOVED***

  getMemberByUser(user_id: number) ***REMOVED***
    var vo = this.settings.getPerunVO();
    return this.http.get(this.settings.getPerunBaseURL() + `membersManager/getMemberByUser`, ***REMOVED***
      withCredentials: true,
      params: ***REMOVED***user: user_id, vo: vo***REMOVED***
    ***REMOVED***);
  ***REMOVED***

  getMemberByExtSourceNameAndExtLogin(ext_login: string) ***REMOVED***
    var vo = this.settings.getPerunVO();
    var idp = this.settings.getUserExtSource();
    return this.http.get(this.settings.getPerunBaseURL() + `membersManager/getMemberByExtSourceNameAndExtLogin`, ***REMOVED***
      withCredentials: true,
      params: ***REMOVED***extSourceName: idp,
               extLogin: ext_login,
               vo: vo***REMOVED***
    ***REMOVED***);
  ***REMOVED***

***REMOVED***
