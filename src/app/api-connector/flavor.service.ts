import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Flavor***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavor';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service';
import ***REMOVED***Observable, throwError***REMOVED*** from 'rxjs';
import ***REMOVED***catchError***REMOVED*** from 'rxjs/operators';
import ***REMOVED***HttpClient***REMOVED*** from '@angular/common/http';


@Injectable()
export class FlavorService ***REMOVED***

    constructor(private http: HttpClient, private settings: ApiSettings) ***REMOVED***
    ***REMOVED***

    getFlavors(): Observable<Flavor[]> ***REMOVED***

        return this.http.get<Flavor[]>(this.settings.getConnectorBaseUrl() + 'flavors/getFlavors/', ***REMOVED***
            withCredentials: true,

        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***

***REMOVED***
