import {Injectable} from '@angular/core';
import {Flavor} from '../virtualmachinemodels/flavor';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {ApiSettings} from './api-settings.service';
import {URLSearchParams} from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class FlavorService {

  constructor(private http: Http, private settings: ApiSettings) {
  }

  getFlavors(host: string, port: string): Observable<Flavor[]> {
    let urlSearchParams = new URLSearchParams();

    urlSearchParams.append('host', host);
    urlSearchParams.append('port', port);

    return this.http.get(this.settings.getConnectorBaseUrl() + 'flavors/getFlavorByClient/', {
      withCredentials: true,
      search: urlSearchParams
    }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

  }

}
