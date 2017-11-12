import { Injectable } from '@angular/core';
import  { Image} from '../virtualmachinemodels/image';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
export const IMAGES: Image[] = [

  { id: '11', name: 'Ubuntu1',status:'ACTIVE',min_disk:20,min_ram: 2048 },
  { id: '12', name: 'Ubuntu2',status:'ACTIVE',min_disk:40,min_ram: 2048 },
  { id: '13', name: 'Ubuntu3',status:'PAUSED',min_disk:20,min_ram: 2048 },
];


@Injectable()
export class ImageService {
   constructor (private http: Http){}

  getImages() :Observable<Image[]> {


    return this.http.get('https://localhost:8443/images/').map((res:Response) => res.json()).catch((error:any) => Observable.throw(error.json().error ||'Server error'))
  }

}
