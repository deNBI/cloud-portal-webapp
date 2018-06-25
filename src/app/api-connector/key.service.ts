import {Injectable} from '@angular/core';
import {Image} from '../virtualmachines/virtualmachinemodels/image';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {URLSearchParams} from "@angular/http";
import {ApiSettings} from "./api-settings.service";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class keyService {
  baseKeysUrl = this.settings.getApiBaseURL() + 'keys/';

  constructor(private http: Http, private settings: ApiSettings) {
  }

  getKey(elixir_id: string): Observable<Response> {

    return this.http.get(this.baseKeysUrl + 'getPublicKeyByUser/', {
      withCredentials: true,
    }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

  }

  postKey(elixir_id: string, public_key: string, keyname: string): Observable<Response> {
    let header = new Headers({
      'X-CSRFToken': this.settings.getCSRFToken(),
    });
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('public_key', public_key);

    return this.http.post(this.baseKeysUrl + 'importKey/', urlSearchParams, {
      withCredentials: true,
      headers: header,
    });
  }


}
