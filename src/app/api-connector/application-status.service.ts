import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***ApiSettings***REMOVED***  from './api-settings.service'
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class ApplicationStatusService ***REMOVED***
  constructor(private http: Http, private settings: ApiSettings) ***REMOVED***
  ***REMOVED***

  getAllApplicationStatus() ***REMOVED***
    return this.http.get(this.settings.getApiBaseURL() + 'application_status/', ***REMOVED***
      withCredentials: true,
      params: ***REMOVED***format: this.settings.getApiFormat()***REMOVED***
    ***REMOVED***);
  ***REMOVED***

  setApplicationStatus(application_id: number, status_id: number) ***REMOVED***
    let parameter = JSON.stringify(***REMOVED***
      "project_application_status": status_id
    ***REMOVED***);
    let header = new Headers(***REMOVED***
      'X-CSRFToken': this.settings.getCSRFToken(),
      'Content-Type': 'application/json'
    ***REMOVED***);
    return this.http.patch(this.settings.getApiBaseURL() + 'update_application_status/' + application_id + "/", parameter,
      ***REMOVED***
        headers: header,
        withCredentials: true
      ***REMOVED***);
  ***REMOVED***

***REMOVED***
