import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***URLSearchParams***REMOVED*** from "@angular/http";
import ***REMOVED***VirtualMachineComponent***REMOVED*** from '../applications/addvm.component'
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import ***REMOVED***observableToBeFn***REMOVED*** from "rxjs/testing/TestScheduler";
import ***REMOVED***Metadata***REMOVED*** from "../virtualmachinemodels/metadata";
import ***REMOVED***VirtualMachine***REMOVED*** from "../virtualmachinemodels/virtualmachine";

@Injectable()
export class VirtualmachineService ***REMOVED***

  constructor(private http: Http) ***REMOVED***
  ***REMOVED***

  data: string;

  startVM(flavor: string, image: string, public_key: string, servername: string, username: string, elixir_id: string): Observable<Response> ***REMOVED***
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
  ***REMOVED***

   getVm(elixir_id: string): Observable<VirtualMachine[]>***REMOVED***
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('elixir_id', elixir_id)
    return this.http.get('https://portal-dev.denbi.de/connector/vms/', ***REMOVED***search: urlSearchParams***REMOVED***).map((res:Response) => res.json()).catch((error:any) => Observable.throw(error.json().error ||'Server error'))
  ***REMOVED***

***REMOVED***
