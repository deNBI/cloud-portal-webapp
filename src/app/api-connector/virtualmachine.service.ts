import ***REMOVED*** Injectable ***REMOVED*** from '@angular/core';
import ***REMOVED***URLSearchParams***REMOVED*** from "@angular/http";
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class VirtualmachineService ***REMOVED***
   constructor (private http: Http)***REMOVED******REMOVED***

   startVM(flavor :string,image :string,key:string ,servername:string ,):void***REMOVED***
    let urlSearchParams=new URLSearchParams();
    urlSearchParams.append('flavor',flavor);
    urlSearchParams.append('image',image);
    urlSearchParams.append('key',key);
    urlSearchParams.append('servername',servername);
    this.http.post('https://localhost:8443/vms/',urlSearchParams).subscribe(data => ***REMOVED***alert('ok');***REMOVED***,error => ***REMOVED***console.log(JSON.stringify(error.jsn()));***REMOVED***)
  ***REMOVED***

***REMOVED***
