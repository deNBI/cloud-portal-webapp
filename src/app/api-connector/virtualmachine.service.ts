import { Injectable } from '@angular/core';
import {URLSearchParams} from "@angular/http";
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class VirtualmachineService {
   constructor (private http: Http){}

   startVM(flavor :string,image :string,key:string ,servername:string ,):void{
    let urlSearchParams=new URLSearchParams();
    urlSearchParams.append('flavor',flavor);
    urlSearchParams.append('image',image);
    urlSearchParams.append('key',key);
    urlSearchParams.append('servername',servername);
    this.http.post('https://localhost:8443/vms/',urlSearchParams).subscribe(data => {alert('ok');},error => {console.log(JSON.stringify(error.jsn()));})
  }

}
