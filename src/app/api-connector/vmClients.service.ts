import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service'
import ***REMOVED***Client***REMOVED*** from '../virtualmachines/virtualmachinemodels/vmclient';
import ***REMOVED***Observable***REMOVED*** from 'rxjs';
import ***REMOVED***HttpClient, HttpHeaders, HttpParams***REMOVED*** from '@angular/common/http';

import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';

const header: HttpHeaders = new HttpHeaders(***REMOVED***
    'X-CSRFToken': Cookie.get('csrftoken')
***REMOVED***);

/**
 * Service which provides client methods.
 */
@Injectable()
export class ClientService ***REMOVED***
    clientURL: string = `$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***clients/`;

    constructor(private http: HttpClient) ***REMOVED***
    ***REMOVED***

    isClientAvaiable(): Observable<Client> ***REMOVED***

        return this.http.get<Client>(`$***REMOVED***this.clientURL***REMOVED***active/`, ***REMOVED***
            withCredentials: true
        ***REMOVED***)
    ***REMOVED***

    getClientsChecked(): Observable<Client[]> ***REMOVED***

        return this.http.get<Client[]>(this.clientURL, ***REMOVED***
            withCredentials: true
        ***REMOVED***)
    ***REMOVED***

    checkClient(host: string, port: string): Observable<any> ***REMOVED***
        const params: HttpParams = new HttpParams().set('host', host).set('port', port);

        return this.http.post(`$***REMOVED***this.clientURL***REMOVED***checkClient/`, params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***)

    ***REMOVED***

    postClient(host: string, port: string, location: string): Observable<any> ***REMOVED***

        const params: HttpParams = new HttpParams().set('host', host).set('port', port).set('location', location);

        return this.http.post(this.clientURL, params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***)
    ***REMOVED***

    deleteClient(client_id: number): Observable<any> ***REMOVED***
        return this.http.delete(`$***REMOVED***this.clientURL***REMOVED***$***REMOVED***client_id ***REMOVED***/`, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***)

    ***REMOVED***
***REMOVED***
