import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IResponseTemplate} from './response-template';

/**
 * Service which provides public key methods.
 */
@Injectable()
export class KeyService {

    constructor(private http: HttpClient) {
    }

    getKey(): Observable<IResponseTemplate> {

        return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}users/current/public_key/`, {
            withCredentials: true
        })

    }

    postKey(public_key: string): Observable<IResponseTemplate> {
        public_key = public_key.replace(/\r?\n|\r/gi, '');
        const params: HttpParams = new HttpParams().set('public_key', public_key);

        return this.http.put<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}users/current/public_key/`, params, {
            withCredentials: true
        })
    }

}
