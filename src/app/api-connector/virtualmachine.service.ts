import ***REMOVED*** Injectable ***REMOVED*** from '@angular/core';
import ***REMOVED***URLSearchParams***REMOVED*** from "@angular/http";
import ***REMOVED***VirtualMachineComponent***REMOVED*** from  '../applications/addvm.component'
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import ***REMOVED***observableToBeFn***REMOVED*** from "rxjs/testing/TestScheduler";

@Injectable()
export class VirtualmachineService ***REMOVED***

   constructor (private http: Http)***REMOVED******REMOVED***
  data:string;
   startVM(flavor :string,image :string,key:string ,servername:string ,):Observable<Response>***REMOVED***
    let urlSearchParams=new URLSearchParams();
    urlSearchParams.append('flavor',flavor);
    urlSearchParams.append('image',image);
    urlSearchParams.append('key',key);
    urlSearchParams.append('servername',servername);
     return this.http.post('https://localhost:8443/vms/',urlSearchParams)
   ***REMOVED***

***REMOVED***
