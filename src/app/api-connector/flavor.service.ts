import ***REMOVED*** Injectable ***REMOVED*** from '@angular/core';
import  ***REMOVED*** Flavor***REMOVED*** from '../virtualmachinemodels/flavor';
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';
import ***REMOVED***URLSearchParams***REMOVED*** from "@angular/http";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
export const FLAVORS: Flavor[] = [

  ***REMOVED*** id: '11', name: 'Flav1',rootdisk:20,vcpus:2,ram: 2048 ***REMOVED***,
  ***REMOVED*** id: '12', name: 'Flav2',rootdisk:10,vcpus:4,ram: 4096 ***REMOVED***,
  ***REMOVED*** id: '13', name: 'Flav3',rootdisk:220,vcpus:2,ram: 2048 ***REMOVED***,
];

@Injectable()
export class FlavorService ***REMOVED***

  constructor (private http: Http)***REMOVED******REMOVED***

  getFlavors() :Observable<Flavor[]> ***REMOVED***
     let urlSearchParams=new URLSearchParams();

     urlSearchParams.append('host','localhost');
      urlSearchParams.append('port','9090');

    return this.http.get('https://portal-dev.denbi.de/connector/flavors/',***REMOVED***search:urlSearchParams***REMOVED***).map((res:Response) => res.json()).catch((error:any) => Observable.throw(error.json().error ||'Server error'))

  ***REMOVED***

***REMOVED***
