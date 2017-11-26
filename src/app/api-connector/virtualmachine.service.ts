import ***REMOVED*** Injectable ***REMOVED*** from '@angular/core';
import ***REMOVED***URLSearchParams***REMOVED*** from "@angular/http";
import ***REMOVED***VirtualMachineComponent***REMOVED*** from  '../applications/addvm.component'
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import ***REMOVED***observableToBeFn***REMOVED*** from "rxjs/testing/TestScheduler";
import ***REMOVED***Metadata***REMOVED*** from "../virtualmachinemodels/metadata";

@Injectable()
export class VirtualmachineService ***REMOVED***

   constructor (private http: Http)***REMOVED******REMOVED***
  data:string;
   startVM(flavor :string,image :string,key:string ,servername:string ,username:string,elixir_id:string):Observable<Response>***REMOVED***
    let urlSearchParams=new URLSearchParams();
    urlSearchParams.append('flavor',flavor);
    urlSearchParams.append('image',image);
    urlSearchParams.append('key',key);
    urlSearchParams.append('username',username)
     urlSearchParams.append('elixir_id',elixir_id)
    urlSearchParams.append('servername',servername);
     urlSearchParams.append('host','localhost');
      urlSearchParams.append('port','9090');
    return this.http.post('https://portal-dev.denbi.de/connector/vms/',urlSearchParams); ***REMOVED***


***REMOVED***
