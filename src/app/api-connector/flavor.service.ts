import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Flavor***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavor';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service';
import ***REMOVED***Observable***REMOVED*** from 'rxjs';
import ***REMOVED***HttpClient***REMOVED*** from '@angular/common/http';
import ***REMOVED***FlavorType***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavorType';

/**
 * Service which provides methods for Flavors.
 */
@Injectable()
export class FlavorService ***REMOVED***

    constructor(private http: HttpClient) ***REMOVED***
    ***REMOVED***

    getFlavors(project_id: number): Observable<Flavor[]> ***REMOVED***
        return this.http.get<Flavor[]>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***project_id***REMOVED***/flavors/`, ***REMOVED***
            withCredentials: true

        ***REMOVED***)
    ***REMOVED***

    getListOfTypesAvailable(): Observable<FlavorType[]> ***REMOVED***
        return this.http.get<FlavorType[]>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***project_applications/flavorTypes/`, ***REMOVED***
            withCredentials: true
        ***REMOVED***)
    ***REMOVED***

    getListOfFlavorsAvailable(): Observable<Flavor[]> ***REMOVED***
        return this.http.get<Flavor[]>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***project_applications/flavors/`, ***REMOVED***
            withCredentials: true
        ***REMOVED***)
    ***REMOVED***

***REMOVED***
