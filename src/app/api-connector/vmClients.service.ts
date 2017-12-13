import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {ApiSettings}  from './api-settings.service'
import {URLSearchParams} from "@angular/http";
import {Vmclient} from "../virtualmachinemodels/vmclient";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ClientService {
  clientURL = 'https://portal-dev.denbi.de/connector/clients/';

  constructor(private http: Http,private settings: ApiSettings) {
  }

  getClientsUnchecked(): Observable<Vmclient[]> {
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('request', 'unchecked');
    return this.http.get(this.clientURL, {
      withCredentials: true,
      search: urlSearchParams
    }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'));

  }

  getRRFirstClient(): Observable<Vmclient> {

    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('request', 'rr');
    return this.http.get(this.clientURL, {
      withCredentials: true,
      search: urlSearchParams
    }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'));

  }

  getClientsChecked(): Observable<Vmclient[]> {
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('request', 'checked');
    return this.http.get('https://portal-dev.denbi.de/connector/clients/', {
      withCredentials: true,
      search: urlSearchParams
    }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  checkClient(host: string, port: string): Observable<Response> {
     let header = new Headers({
      'X-CSRFToken': this.settings.getCSRFToken(),
    });
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('port', port);

    urlSearchParams.append('host', host);
    urlSearchParams.append('request', 'check');
    return this.http.post('https://portal-dev.denbi.de/connector/clients/', urlSearchParams, {
      withCredentials: true,
      headers: header,
    });

  }

  postClient(host: string, port: string, location: string): Observable<Response> {
      let header = new Headers({
      'X-CSRFToken': this.settings.getCSRFToken(),
    });
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('port', port);
    urlSearchParams.append('location', location);
    urlSearchParams.append('host', host);
    urlSearchParams.append('request', 'add');
    return this.http.post('https://portal-dev.denbi.de/connector/clients/',urlSearchParams, {
      withCredentials: true,
      headers: header,
    });
  }

  deleteClient(host: string, port: string, location: string): Observable<Response> {
      let header = new Headers({
      'X-CSRFToken': this.settings.getCSRFToken(),
    });
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('port', port);
    urlSearchParams.append('host', host);
    urlSearchParams.append('location', location);
    urlSearchParams.append('request', 'delete');
    return this.http.post('https://portal-dev.denbi.de/connector/clients/', urlSearchParams, {
      withCredentials: true,
      headers: header,
    });
  }
}
