import { Injectable } from '@angular/core';
import  { Flavor} from '../virtualmachinemodels/flavor';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {URLSearchParams} from "@angular/http";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class FlavorService {

  constructor (private http: Http){}

  getFlavors() :Observable<Flavor[]> {
     let urlSearchParams=new URLSearchParams();

     urlSearchParams.append('host','localhost');
      urlSearchParams.append('port','9090');

    return this.http.get('https://portal-dev.denbi.de/connector/flavors/',{search:urlSearchParams}).map((res:Response) => res.json()).catch((error:any) => Observable.throw(error.json().error ||'Server error'))

  }

}
