import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiSettings} from './api-settings.service';
import {IResponseTemplate} from './response-template';

/**
 * Service which provides public key methods.
 */
@Injectable()
export class KeyService {

		constructor(private http: HttpClient) {
				this.http = http;
		}

		getKey(): Observable<IResponseTemplate> {

				return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}users/current/public_key/`, {
						withCredentials: true,
				});

		}

		postKey(public_key_param: string): Observable<IResponseTemplate> {
				const public_key: string = public_key_param.replace(/\r?\n|\r/gi, '');
				const params: HttpParams = new HttpParams().set('public_key', public_key);

				return this.http.put<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}users/current/public_key/`, params, {
						withCredentials: true,
				});
		}


		validateKey(public_key_param: string): Observable<IResponseTemplate> {

				return this.http.post<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}users/current/public_key/validate/`, {'public_key': public_key_param}, {
						withCredentials: true,
				});
		}

		generateKey(): Observable<any> {

				return this.http.post<any>(`${ApiSettings.getApiBaseURL()}users/current/public_key/generate/`, {
						withCredentials: true,
				});
		}

}
