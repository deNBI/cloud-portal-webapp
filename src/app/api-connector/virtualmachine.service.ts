import {Injectable} from '@angular/core';
import {URLSearchParams} from "@angular/http";
import {VirtualMachineComponent} from '../applications/addvm.component'
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {observableToBeFn} from "rxjs/testing/TestScheduler";
import {Metadata} from "../virtualmachinemodels/metadata";
import {VirtualMachine} from "../virtualmachinemodels/virtualmachine";

@Injectable()
export class VirtualmachineService {

  constructor(private http: Http) {
  }

  data: string;

  startVM(flavor: string, image: string, public_key: string, servername: string, username: string, elixir_id: string): Observable<Response> {
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('flavor', flavor);
    urlSearchParams.append('image', image);
   let re = /\+/gi;

  let newstr = public_key.replace(re, "%2B");

    urlSearchParams.append('public_key', newstr);
    urlSearchParams.append('username', username);
    urlSearchParams.append('elixir_id', elixir_id)
    urlSearchParams.append('servername', servername);
    urlSearchParams.append('host', 'localhost');
    urlSearchParams.append('port', '9090');
    return this.http.post('https://portal-dev.denbi.de/connector/vms/', urlSearchParams);
  }

   getVm(elixir_id: string): Observable<VirtualMachine[]>{
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('elixir_id', elixir_id)
    return this.http.get('https://portal-dev.denbi.de/connector/vms/', {search: urlSearchParams}).map((res:Response) => res.json()).catch((error:any) => Observable.throw(error.json().error ||'Server error'))
  }

}
