import {Injectable} from '@angular/core';
import {Flavor} from '../virtualmachines/virtualmachinemodels/flavor';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {ApiSettings} from './api-settings.service';
import {URLSearchParams} from "@angular/http";
import {map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import 'rxjs/add/operator/catch';

@Injectable()
export class FlavorService {

    constructor(private http: HttpClient, private settings: ApiSettings) {
    }

    getFlavors(): Observable<Flavor[]> {

        return this.http.get<Flavor[]>(this.settings.getConnectorBaseUrl() + 'flavors/getFlavors/', {
            withCredentials: true,

        }).pipe(catchError((error: any) => throwError(error)));

    }

}
