import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';
import ***REMOVED***ApiSettings***REMOVED***  from './api-settings.service'
import ***REMOVED***URLSearchParams***REMOVED*** from "@angular/http";
import ***REMOVED***Vmclient***REMOVED*** from "../virtualmachinemodels/vmclient";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ClientService ***REMOVED***
  clientURL = 'https://portal-dev.denbi.de/connector/clients/';

  constructor(private http: Http,private settings: ApiSettings) ***REMOVED***
  ***REMOVED***

  getClientsUnchecked(): Observable<Vmclient[]> ***REMOVED***
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('request', 'unchecked');
    return this.http.get(this.clientURL, ***REMOVED***
      withCredentials: true,
      search: urlSearchParams
    ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'));

  ***REMOVED***

  getRRFirstClient(): Observable<Vmclient> ***REMOVED***

    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('request', 'rr');
    return this.http.get(this.clientURL, ***REMOVED***
      withCredentials: true,
      search: urlSearchParams
    ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'));

  ***REMOVED***

  getClientsChecked(): Observable<Vmclient[]> ***REMOVED***
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('request', 'checked');
    return this.http.get('https://portal-dev.denbi.de/connector/clients/', ***REMOVED***
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
    urlSearchParams.append('request', 'check');
    return this.http.post('https://portal-dev.denbi.de/connector/clients/', urlSearchParams, ***REMOVED***
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
    urlSearchParams.append('request', 'add');
    return this.http.post('https://portal-dev.denbi.de/connector/clients/',urlSearchParams, ***REMOVED***
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
    urlSearchParams.append('request', 'delete');
    return this.http.post('https://portal-dev.denbi.de/connector/clients/', urlSearchParams, ***REMOVED***
      withCredentials: true,
      headers: header,
    ***REMOVED***);
  ***REMOVED***
***REMOVED***
