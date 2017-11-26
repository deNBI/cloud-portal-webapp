import { Injectable } from '@angular/core';
import {URLSearchParams} from "@angular/http";
import {VirtualMachineComponent} from  '../applications/addvm.component'
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {observableToBeFn} from "rxjs/testing/TestScheduler";
import {Metadata} from "../virtualmachinemodels/metadata";

@Injectable()
export class VirtualmachineService {

   constructor (private http: Http){}
  data:string;
   startVM(flavor :string,image :string,public_key:string ,servername:string ,username:string,elixir_id:string):Observable<Response>{
    let urlSearchParams=new URLSearchParams();
    urlSearchParams.append('flavor',flavor);
    urlSearchParams.append('image',image);
    urlSearchParams.append('public_key',public_key);
    urlSearchParams.append('username',username)
     urlSearchParams.append('elixir_id',elixir_id)
    urlSearchParams.append('servername',servername);
     urlSearchParams.append('host','localhost');
      urlSearchParams.append('port','9090');
    return this.http.post('https://portal-dev.denbi.de/connector/vms/',urlSearchParams); }


}
