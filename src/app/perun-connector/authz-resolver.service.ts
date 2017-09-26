import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***PerunSettings***REMOVED***  from './connector-settings.service'
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class AuthzResolver ***REMOVED***
  constructor(private http: Http, private settings: PerunSettings) ***REMOVED***
  ***REMOVED***

  getLoggedUser() ***REMOVED***
    return this.http.get(this.settings.getPerunBaseURL() + 'authzResolver/getLoggedUser', ***REMOVED***withCredentials: true***REMOVED***);
  ***REMOVED***

***REMOVED***
