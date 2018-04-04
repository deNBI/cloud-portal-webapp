import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';
import ***REMOVED***ApiSettings***REMOVED***  from './api-settings.service'
import ***REMOVED***URLSearchParams***REMOVED*** from "@angular/http";
import ***REMOVED***Vmclient***REMOVED*** from "../virtualmachines/virtualmachinemodels/vmclient";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ClientService ***REMOVED***
  clientURL =  this.settings.getConnectorBaseUrl()  + 'clients/';

  constructor(private http: Http,private settings: ApiSettings) ***REMOVED***
  ***REMOVED***

  getClientsUnchecked(): Observable<Vmclient[]> ***REMOVED***
    let urlSearchParams = new URLSearchParams();

    return this.http.get(this.clientURL + 'getUncheckedClients/', ***REMOVED***
      withCredentials: true,
      search: urlSearchParams
    ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'));

  ***REMOVED***

  getRRFirstClient(): Observable<Vmclient> ***REMOVED***

    let urlSearchParams = new URLSearchParams();

    return this.http.get(this.clientURL + 'getFirstClient/', ***REMOVED***
      withCredentials: true,
      search: urlSearchParams
    ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'));

  ***REMOVED***

  getClientsChecked(): Observable<Vmclient[]> ***REMOVED***
    let urlSearchParams = new URLSearchParams();

    return this.http.get(this.clientURL + 'getCheckedClients/', ***REMOVED***
      withCredentials: true,
      search: urlSearchParams
    ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  ***REMOVED***

  checkClient(host: string, port: string): Observable<Response> ***REMOVED***
     let header = new Headers(***REMOVED***
      'X-CSRFToken': this.settings.getCSRFToken(),
    ***REMOVED***);
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('port', port);

    urlSearchParams.append('host', host);

    return this.http.post(this.clientURL + 'checkClient/', urlSearchParams, ***REMOVED***
      withCredentials: true,
      headers: header,
    ***REMOVED***);

  ***REMOVED***

  postClient(host: string, port: string, location: string): Observable<Response> ***REMOVED***
      let header = new Headers(***REMOVED***
      'X-CSRFToken': this.settings.getCSRFToken(),
    ***REMOVED***);
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('port', port);
    urlSearchParams.append('location', location);
    urlSearchParams.append('host', host);

    return this.http.post(this.clientURL + 'addClient/',urlSearchParams, ***REMOVED***
      withCredentials: true,
      headers: header,
    ***REMOVED***);
  ***REMOVED***

  deleteClient(host: string, port: string, location: string): Observable<Response> ***REMOVED***
      let header = new Headers(***REMOVED***
      'X-CSRFToken': this.settings.getCSRFToken(),
    ***REMOVED***);
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('port', port);
    urlSearchParams.append('host', host);
    urlSearchParams.append('location', location);
    return this.http.post(this.clientURL + 'deleteClient/', urlSearchParams, ***REMOVED***
      withCredentials: true,
      headers: header,
    ***REMOVED***);
  ***REMOVED***
***REMOVED***
