import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service'
import ***REMOVED***Observable, throwError***REMOVED*** from 'rxjs';
import ***REMOVED***catchError***REMOVED*** from 'rxjs/operators';
import ***REMOVED***HttpClient, HttpHeaders, HttpParams***REMOVED*** from '@angular/common/http';


@Injectable()
export class SpecialHardwareService ***REMOVED***
    constructor(private http: HttpClient, private settings: ApiSettings) ***REMOVED***
    ***REMOVED***

    getAllSpecialHardware():Observable<any> ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'special_hardware/', ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***format: this.settings.getApiFormat()***REMOVED***
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***

***REMOVED***
