import { Injectable } from '@angular/core';
import  { Image} from '../virtualmachinemodels/image';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {URLSearchParams} from "@angular/http";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';



@Injectable()
export class ImageService {
   constructor (private http: Http){}

  getImages(host:string,port:string) :Observable<Image[]> {
         let urlSearchParams=new URLSearchParams();

     urlSearchParams.set('host',host);
      urlSearchParams.set('port',port);


    return this.http.get('https://portal-dev.denbi.de/connector/images/',{search:urlSearchParams}).map((res:Response) => res.json()).catch((error:any) => Observable.throw(error.json().error ||'Server error'))

  }

}
