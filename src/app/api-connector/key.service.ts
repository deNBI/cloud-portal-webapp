import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Image***REMOVED*** from '../virtualmachines/virtualmachinemodels/image';
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';
import ***REMOVED***URLSearchParams***REMOVED*** from "@angular/http";
import ***REMOVED***ApiSettings***REMOVED*** from "./api-settings.service";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class keyService ***REMOVED***
  baseKeysUrl = this.settings.getApiBaseURL() + 'keys/';

  constructor(private http: Http, private settings: ApiSettings) ***REMOVED***
  ***REMOVED***

  getKey(elixir_id: string): Observable<Response> ***REMOVED***

    return this.http.get(this.baseKeysUrl + 'getPublicKeyByUser/', ***REMOVED***
      withCredentials: true,
    ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

  ***REMOVED***

  postKey(elixir_id: string, public_key: string, keyname: string): Observable<Response> ***REMOVED***
    let header = new Headers(***REMOVED***
      'X-CSRFToken': this.settings.getCSRFToken(),
    ***REMOVED***);
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('public_key', public_key);

    return this.http.post(this.baseKeysUrl + 'importKey/', urlSearchParams, ***REMOVED***
      withCredentials: true,
      headers: header,
    ***REMOVED***);
  ***REMOVED***


***REMOVED***
