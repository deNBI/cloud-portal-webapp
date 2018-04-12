import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';
import ***REMOVED***URLSearchParams***REMOVED*** from '@angular/http';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class UserService ***REMOVED***
  constructor(private http: Http, private settings: ApiSettings) ***REMOVED***
  ***REMOVED***

   setUserFacilityPassword(facility: string): Observable<Response> ***REMOVED***
    let header = new Headers(***REMOVED***
      'X-CSRFToken': this.settings.getCSRFToken(),
    ***REMOVED***);
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('facility',facility);

    return this.http.post(this.settings.getConnectorBaseUrl() + 'user/setUserPassword/', urlSearchParams, ***REMOVED***
      withCredentials: true,
      headers: header,
    ***REMOVED***);
  ***REMOVED***


***REMOVED***
