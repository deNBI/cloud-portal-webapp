import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiSettings } from './api-settings.service';
import { IResponseTemplate } from './response-template';
import { BlacklistedResponse } from './response-interfaces';

/**
 * Service which provides public key methods.
 */
@Injectable()
export class KeyService {
	constructor(private http: HttpClient) {}

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
		return this.http.post<IResponseTemplate>(
			`${ApiSettings.getApiBaseURL()}users/current/public_key/validate/`,
			{ public_key: public_key_param },
			{
				withCredentials: true,
			},
		);
	}

	isBlocked(public_key_param: string): Observable<BlacklistedResponse> {
		return this.http.post<BlacklistedResponse>(
			`${ApiSettings.getApiBaseURL()}users/current/public_key/blacklisted/`,
			{ public_key: public_key_param },
			{
				withCredentials: true,
			},
		);
	}

	generateKey(): Observable<any> {
		return this.http.post<any>(`${ApiSettings.getApiBaseURL()}users/current/public_key/generate/`, {
			withCredentials: true,
		});
	}
}
