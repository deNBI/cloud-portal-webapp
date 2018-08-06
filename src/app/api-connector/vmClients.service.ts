import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {ApiSettings}  from './api-settings.service'
import {URLSearchParams} from "@angular/http";
import {Vmclient} from "../virtualmachines/virtualmachinemodels/vmclient";
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/catch';
import {Observable, throwError} from 'rxjs';

@Injectable()
export class ClientService {
  clientURL =  this.settings.getConnectorBaseUrl()  + 'clients/';

  constructor(private http: Http,private settings: ApiSettings) {
  }

  getClientsUnchecked(): Observable<Vmclient[]> {
    let urlSearchParams = new URLSearchParams();

    return this.http.get(this.clientURL + 'getUncheckedClients/', {
      withCredentials: true,
      search: urlSearchParams
    }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'));

  }

  isClientAvaiable(): Observable<Vmclient> {

    let urlSearchParams = new URLSearchParams();

    return this.http.get(this.clientURL + 'isClientAvaiable/', {
      withCredentials: true,
      search: urlSearchParams
    }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'));

  }

  getClientsChecked(): Observable<Vmclient[]> {
    let urlSearchParams = new URLSearchParams();

    return this.http.get(this.clientURL + 'getCheckedClients/', {
      withCredentials: true,
      search: urlSearchParams
    }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'));
  }

  checkClient(host: string, port: string): Observable<Response> {
     let header = new Headers({
      'X-CSRFToken': this.settings.getCSRFToken(),
    });
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('port', port);

    urlSearchParams.append('host', host);

    return this.http.post(this.clientURL + 'checkClient/', urlSearchParams, {
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

    return this.http.post(this.clientURL + 'addClient/',urlSearchParams, {
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
    return this.http.post(this.clientURL + 'deleteClient/', urlSearchParams, {
      withCredentials: true,
      headers: header,
    });
  }
}
