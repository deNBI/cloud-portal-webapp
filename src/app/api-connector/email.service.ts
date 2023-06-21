import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Flavor} from '../virtualmachines/virtualmachinemodels/flavor';
import {ApiSettings} from './api-settings.service';
import {map} from 'rxjs/operators';

/**
 * Service which provides methods for Flavors.
 */
@Injectable()
export class EmailService {
	constructor(private http: HttpClient) {
	}


	getMailTemplates(): Observable<string[]> {
		return this.http.get<string[]>(`${ApiSettings.getApiBaseURL()}emails/templates/`, {
			withCredentials: true,
		});
	}


}
