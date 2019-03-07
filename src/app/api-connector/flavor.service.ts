import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Flavor***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavor';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service';
import ***REMOVED***Observable, throwError***REMOVED*** from 'rxjs';
import ***REMOVED***catchError***REMOVED*** from 'rxjs/operators';
import ***REMOVED***HttpClient***REMOVED*** from '@angular/common/http';
import ***REMOVED***FlavorType***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavorType';


@Injectable()
export class FlavorService ***REMOVED***

    constructor(private http: HttpClient, private settings: ApiSettings) ***REMOVED***
    ***REMOVED***

    getFlavors(project_id: number): Observable<Flavor[]> ***REMOVED***
        return this.http.get<Flavor[]>(this.settings.getConnectorBaseUrl() + 'projects/' + project_id + '/flavors/', ***REMOVED***
            withCredentials: true,

        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***

    getListOfTypesAvailable(): Observable<FlavorType[]> ***REMOVED***
        return this.http.get<FlavorType[]>(this.settings.getConnectorBaseUrl() + 'project_applications/flavorTypes/', ***REMOVED***
            withCredentials: true
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***

    getListOfFlavorsAvailable(): Observable<Flavor[]> ***REMOVED***
        return this.http.get<Flavor[]>(this.settings.getConnectorBaseUrl() + 'project_applications/flavors/', ***REMOVED***
            withCredentials: true
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***

***REMOVED***
