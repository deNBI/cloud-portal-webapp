import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***ApiSettings***REMOVED***  from './api-settings.service'
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class SpecialHardwareService ***REMOVED***
  constructor(private http: Http, private settings: ApiSettings) ***REMOVED***
  ***REMOVED***

  getAllSpecialHardware() ***REMOVED***
    return this.http.get(this.settings.getApiBaseURL() + 'special_hardware/', ***REMOVED***withCredentials: true, params:***REMOVED***format: this.settings.getApiFormat()***REMOVED******REMOVED***);
  ***REMOVED***

***REMOVED***
