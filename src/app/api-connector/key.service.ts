import {Injectable} from '@angular/core';
import {Image} from '../virtualmachinemodels/image';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {URLSearchParams} from "@angular/http";
import {ApiSettings} from "./api-settings.service";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class keyService {
  baseKeysUrl = 'https://portal-dev.denbi.de/connector/keys/';

  constructor(private http: Http, private settings: ApiSettings) {
  }

  getKey(elixir_id: string): Observable<Response> {
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('elixir_id', elixir_id);


    return this.http.get(this.baseKeysUrl + 'getPublicKeyByUser/', {
      withCredentials: true,
      search: urlSearchParams
    }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

  }

  postKey(elixir_id: string, public_key: string, keyname: string): Observable<Response> {
    let header = new Headers({
      'X-CSRFToken': this.settings.getCSRFToken(),
    });
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('elixir_id', elixir_id);
    urlSearchParams.append('public_key', public_key);
    urlSearchParams.append('keyname', keyname);

    return this.http.post(this.baseKeysUrl + 'importKey/', urlSearchParams, {
      withCredentials: true,
      headers: header,
    });
  }

  reimportKey(elixir_id: string, public_key: string, keyname: string): Observable<Response> {
    let header = new Headers({
      'X-CSRFToken': this.settings.getCSRFToken(),
    });
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('elixir_id', elixir_id);
    urlSearchParams.append('public_key', public_key);
    urlSearchParams.append('keyname', keyname);
    urlSearchParams.append('request', 'reimport');
    return this.http.post(this.baseKeysUrl + 'reimportKey/', urlSearchParams, {
      withCredentials: true,
      headers: header,
    });
  }
}
