import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {URLSearchParams} from "@angular/http";
import { Vmclient} from "../virtualmachinemodels/vmclient";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ClientService {

  constructor (private http: Http){}

  getClientsUnchecked() :Observable<Vmclient[]> {
    let urlSearchParams= new URLSearchParams();
    urlSearchParams.append('request','unchecked');
    return this.http.get('https://portal-dev.denbi.de/connector/clients/',{search: urlSearchParams}).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error ||'Server error'));

  }
  getClientsChecked() :Observable<Vmclient[]> {
    let urlSearchParams= new URLSearchParams();
    urlSearchParams.append('request','checked');
    return this.http.get('https://portal-dev.denbi.de/connector/clients/',{search: urlSearchParams}).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error ||'Server error'));
  }
  checkClient(host:string,port:string): Observable<Response>{
     let urlSearchParams= new URLSearchParams();
    urlSearchParams.append('port', port);

    urlSearchParams.append('host', host);
    urlSearchParams.append('request', 'check');
    return this.http.post('https://portal-dev.denbi.de/connector/clients/',urlSearchParams)
  }
  postClient(host:string,port:string,location:string): Observable<Response> {
    let urlSearchParams= new URLSearchParams();
    urlSearchParams.append('port', port);
     urlSearchParams.append('location', location);
    urlSearchParams.append('host', host);
    urlSearchParams.append('request', 'add');
    return this.http.post('https://portal-dev.denbi.de/connector/clients/', urlSearchParams);
  }

  deleteClient(host:string,port:string,location:string):Observable<Response>{
    let urlSearchParams= new URLSearchParams();
    urlSearchParams.append('port', port);
    urlSearchParams.append('host', host);
     urlSearchParams.append('location', location);
    urlSearchParams.append('request', 'delete');
     return this.http.post('https://portal-dev.denbi.de/connector/clients/', urlSearchParams);
  }
}
