
import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {PerunSettings} from './connector-settings.service'
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {ApiSettings} from '../api-connector/api-settings.service';
import {URLSearchParams} from "@angular/http";


@Injectable()
export class GeneralServicemanager {
    constructor(private http: Http, private settings: PerunSettings, private apiSettings: ApiSettings) {
    }


    forceDenbiComputeCenterServicePropagation(facility:string): Observable<any> {
        let urlSearchParams = new URLSearchParams();
    let header = new Headers({
      'X-CSRFToken': this.apiSettings.getCSRFToken(),
    });
    urlSearchParams.append('compute_center', facility);
    return this.http.post(this.apiSettings.getApiBaseURL() + 'forceServicePropagation/', urlSearchParams, {
      withCredentials: true,
      headers: header
    }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))
    }
}
