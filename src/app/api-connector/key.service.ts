import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Cookie} from 'ng2-cookies/ng2-cookies';

const header = new HttpHeaders({
    'X-CSRFToken': Cookie.get('csrftoken')
});


@Injectable()
export class KeyService {


    constructor(private http: HttpClient, private settings: ApiSettings) {
    }

    getKey(): Observable<any> {

        return this.http.get(ApiSettings.getApiBaseURL() + 'users/current/public_key/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));

    }

    postKey(public_key: string): Observable<any> {
        public_key = public_key.replace(/\r?\n|\r/gi, '');
        const params = new HttpParams().set('public_key', public_key);

        return this.http.put(ApiSettings.getApiBaseURL() + 'users/current/public_key/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));
    }


}
