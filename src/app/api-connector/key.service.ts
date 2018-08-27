import {Injectable} from '@angular/core';
import {ApiSettings} from "./api-settings.service";
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Cookie} from 'ng2-cookies/ng2-cookies';

const header = new HttpHeaders({
    'X-CSRFToken': Cookie.get("csrftoken")
});


@Injectable()
export class keyService {
    baseKeysUrl = this.settings.getApiBaseURL() + 'keys/';

    constructor(private http: HttpClient, private settings: ApiSettings) {
    }

    getKey(): Observable<any> {

        return this.http.get(this.baseKeysUrl + 'getPublicKeyByUser/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));

    }

    postKey(public_key: string): Observable<any> {
        let params = new HttpParams().set('public_key', public_key);

        return this.http.post(this.baseKeysUrl + 'importKey/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));
    }


}
