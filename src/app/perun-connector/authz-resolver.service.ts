import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***PerunSettings***REMOVED*** from './connector-settings.service'
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service';


@Injectable()
export class AuthzResolver ***REMOVED***
  constructor(private http: Http, private perunSettings: PerunSettings, private apiSettings: ApiSettings) ***REMOVED***
  ***REMOVED***

  getLoggedUser() ***REMOVED***
    return this.http.get(this.perunSettings.getPerunBaseURL() + 'authzResolver/getLoggedUser',
      ***REMOVED***
        headers: new Headers(***REMOVED***'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()***REMOVED***),
      ***REMOVED***);
  ***REMOVED***

  isVoAdmin(): Observable<Response> ***REMOVED***
    return this.http.get(this.perunSettings.getPerunBaseURL() + 'authzResolver/isVoAdmin',
      ***REMOVED***
        headers: new Headers(***REMOVED***'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()***REMOVED***),
      ***REMOVED***);

  ***REMOVED***

***REMOVED***
