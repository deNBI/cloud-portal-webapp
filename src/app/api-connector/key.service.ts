import {Injectable} from '@angular/core';
import {Image} from '../virtualmachinemodels/image';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {URLSearchParams} from "@angular/http";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class keyService {
  constructor(private http: Http) {
  }

  getKey(elixir_id: string): Observable<Response> {
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('elixir_id', elixir_id);


    return this.http.get('https://portal-dev.denbi.de/connector/keys/', {search: urlSearchParams}).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

  }

  postKey(elixir_id: string, public_key: string, keyname: string): Observable<Response> {
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('elixir_id', elixir_id);
    urlSearchParams.append('public_key', public_key);
    urlSearchParams.append('keyname', keyname);
     urlSearchParams.append('request', 'import');
    return this.http.post('https://portal-dev.denbi.de/connector/keys/', urlSearchParams);
  }

  reimportKey(elixir_id: string, public_key: string, keyname: string): Observable<Response> {
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('elixir_id', elixir_id);
    urlSearchParams.append('public_key', public_key);
    urlSearchParams.append('keyname', keyname);
     urlSearchParams.append('request', 'reimport');
    return this.http.post('https://portal-dev.denbi.de/connector/keys/', urlSearchParams);
  }
}
