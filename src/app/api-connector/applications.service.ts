import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***ApiSettings***REMOVED***  from './api-settings.service'
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class ApplicationsService ***REMOVED***
  constructor(private http: Http, private settings: ApiSettings) ***REMOVED***
  ***REMOVED***

  getUserApplications() ***REMOVED***
    return this.http.get(this.settings.getApiBaseURL() + 'project_applications/', ***REMOVED***
      withCredentials: true,
      params: ***REMOVED***format: this.settings.getApiFormat()***REMOVED***
    ***REMOVED***);
  ***REMOVED***

  getAllApplications() ***REMOVED***
    return this.http.get(this.settings.getApiBaseURL() + 'all_applications/', ***REMOVED***
      withCredentials: true,
      params: ***REMOVED***format: this.settings.getApiFormat()***REMOVED***
    ***REMOVED***);
  ***REMOVED***

  addNewApplication(data) ***REMOVED***
    let parameter = data;
    let header = new Headers(***REMOVED***
      'X-CSRFToken': this.settings.getCSRFToken(),
      'Content-Type': 'application/json'
    ***REMOVED***);

    return this.http.post(this.settings.getApiBaseURL() + 'add_application/', parameter,
      ***REMOVED***
        headers: header,
        withCredentials: true
      ***REMOVED***);
  ***REMOVED***

***REMOVED***
