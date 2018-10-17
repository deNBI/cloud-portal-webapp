import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Flavor***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavor';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service';
import ***REMOVED***Observable, throwError***REMOVED*** from 'rxjs';
import ***REMOVED***catchError***REMOVED*** from 'rxjs/operators';
import ***REMOVED***HttpClient, HttpHeaders, HttpParams***REMOVED*** from '@angular/common/http';


@Injectable()
export class FlavorService ***REMOVED***

    constructor(private http: HttpClient, private settings: ApiSettings) ***REMOVED***
    ***REMOVED***

    getFlavors(project_id:number): Observable<Flavor[]> ***REMOVED***
                let params = new HttpParams().set('project_id', project_id.toString());


        return this.http.get<Flavor[]>(this.settings.getConnectorBaseUrl() + 'flavors/', ***REMOVED***
            withCredentials: true,
            params:params

        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***

    getListOfFlavorsAvailable(): Observable<Flavor[]> ***REMOVED***
      return this.http.get<Flavor[]>(this.settings.getConnectorBaseUrl() + 'project_applications/flavors/',***REMOVED***
        withCredentials: true
      ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***

***REMOVED***
