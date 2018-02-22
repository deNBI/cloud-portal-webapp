import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***PerunSettings***REMOVED*** from './connector-settings.service'
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service';
import ***REMOVED***URLSearchParams***REMOVED*** from "@angular/http";

@Injectable()
export class MembersManager ***REMOVED***
  constructor(private http: Http, private settings: PerunSettings, private apiSettings: ApiSettings) ***REMOVED***
  ***REMOVED***

  getMemberByUser(user_id: number) ***REMOVED***
    var vo = this.settings.getPerunVO();
    return this.http.get(this.settings.getPerunBaseURL() + `membersManager/getMemberByUser`, ***REMOVED***
      headers: new Headers(***REMOVED***'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()***REMOVED***),
      params: ***REMOVED***user: user_id, vo: vo***REMOVED***
    ***REMOVED***);
  ***REMOVED***

  getMemberByExtSourceNameAndExtLogin(ext_login: string) ***REMOVED***
    let vo = this.settings.getPerunVO(),
      idp = this.settings.getUserExtSource();

    return this.http.get(this.settings.getPerunBaseURL() + `membersManager/getMemberByExtSourceNameAndExtLogin`, ***REMOVED***
      headers: new Headers(***REMOVED***'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()***REMOVED***),
      params: ***REMOVED***
        extSourceName: idp,
        extLogin: ext_login,
        vo: vo
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED***

  getMembersOfdeNBIVo(firstname: string, lastName: string) ***REMOVED***

    return this.http.get(this.apiSettings.getApiBaseURL() + 'filter_deNBIMembers/', ***REMOVED***
      withCredentials: true,
      params: ***REMOVED***
        firstName: firstname,
        lastName: lastName,
      ***REMOVED***
    ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))


  ***REMOVED***
***REMOVED***
