import {Injectable} from '@angular/core';
import {Flavor} from '../virtualmachines/virtualmachinemodels/flavor';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {ApiSettings} from './api-settings.service';
import {URLSearchParams} from "@angular/http";
import { map } from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';

import 'rxjs/add/operator/catch';

@Injectable()
export class FlavorService {

  constructor(private http: Http, private settings: ApiSettings) {
  }

  getFlavors(): Observable<Flavor[]> {
    let urlSearchParams = new URLSearchParams();

    return this.http.get(this.settings.getConnectorBaseUrl() + 'flavors/getFlavors/', {
      withCredentials: true,
      search: urlSearchParams
    }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))

  }

}
