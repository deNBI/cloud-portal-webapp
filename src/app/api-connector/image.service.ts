import ***REMOVED*** Injectable ***REMOVED*** from '@angular/core';
import  ***REMOVED*** Image***REMOVED*** from '../virtualmachinemodels/image';
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';
import ***REMOVED***URLSearchParams***REMOVED*** from "@angular/http";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
export const IMAGES: Image[] = [

  ***REMOVED*** id: '11', name: 'Ubuntu1',status:'ACTIVE',min_disk:20,min_ram: 2048 ***REMOVED***,
  ***REMOVED*** id: '12', name: 'Ubuntu2',status:'ACTIVE',min_disk:40,min_ram: 2048 ***REMOVED***,
  ***REMOVED*** id: '13', name: 'Ubuntu3',status:'PAUSED',min_disk:20,min_ram: 2048 ***REMOVED***,
];


@Injectable()
export class ImageService ***REMOVED***
   constructor (private http: Http)***REMOVED******REMOVED***

  getImages() :Observable<Image[]> ***REMOVED***
         let urlSearchParams=new URLSearchParams();

     urlSearchParams.set('host','localhost');
      urlSearchParams.set('port','9090');


    return this.http.get('https://portal-dev.denbi.de/connector/images/',***REMOVED***search:urlSearchParams***REMOVED***).map((res:Response) => res.json()).catch((error:any) => Observable.throw(error.json().error ||'Server error'))

  ***REMOVED***

***REMOVED***
