import { Injectable } from '@angular/core';
import  { Flavor} from '../virtualmachinemodels/flavor';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
export const FLAVORS: Flavor[] = [

  { id: '11', name: 'Flav1',rootdisk:20,vcpus:2,ram: 2048 },
  { id: '12', name: 'Flav2',rootdisk:10,vcpus:4,ram: 4096 },
  { id: '13', name: 'Flav3',rootdisk:220,vcpus:2,ram: 2048 },
];

@Injectable()
export class FlavorService {

  constructor (private http: Http){}

  getFlavors() :Observable<Flavor[]> {


    return this.http.get('https://localhost:8443/flavors/').map((res:Response) => res.json()).catch((error:any) => Observable.throw(error.json().error ||'Server error'))
  }

}
