import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'

import 'rxjs/add/operator/catch';
import {map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import 'rxjs/add/operator/catch';


@Injectable()
export class SpecialHardwareService {
    constructor(private http: HttpClient, private settings: ApiSettings) {
    }

    getAllSpecialHardware() {
        return this.http.get(this.settings.getApiBaseURL() + 'special_hardware/', {
            withCredentials: true,
            params: {format: this.settings.getApiFormat()}
        }).pipe(catchError((error: any) => throwError(error)));
    }

}
