import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service'
import ***REMOVED***Vmclient***REMOVED*** from "../virtualmachines/virtualmachinemodels/vmclient";
import ***REMOVED***Observable, throwError***REMOVED*** from 'rxjs';
import ***REMOVED***catchError***REMOVED*** from 'rxjs/operators';
import ***REMOVED***HttpClient, HttpHeaders, HttpParams***REMOVED*** from '@angular/common/http';

import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';


const header = new HttpHeaders(***REMOVED***
    'X-CSRFToken': Cookie.get("csrftoken")
***REMOVED***);

@Injectable()
export class ClientService ***REMOVED***
    clientURL = this.settings.getConnectorBaseUrl() + 'clients/';

    constructor(private http: HttpClient, private settings: ApiSettings) ***REMOVED***
    ***REMOVED***



    isClientAvaiable(): Observable<Vmclient> ***REMOVED***


        return this.http.get<Vmclient>(this.clientURL + 'active/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***

    getClientsChecked(): Observable<Vmclient[]> ***REMOVED***

        return this.http.get<Vmclient[]>(this.clientURL, ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***

    checkClient(host: string, port: string): Observable<any> ***REMOVED***
        let params = new HttpParams().set('host', host).set('port', port);


        return this.http.post(this.clientURL + 'checkClient/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
        ;

    ***REMOVED***

    postClient(host: string, port: string, location: string): Observable<any> ***REMOVED***

        let params = new HttpParams().set('host', host).set('port', port).set('location', location);


        return this.http.post(this.clientURL , params, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***

    deleteClient(client_id:number): Observable<any> ***REMOVED***
        return this.http.delete(this.clientURL + client_id +'/', ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***
***REMOVED***
