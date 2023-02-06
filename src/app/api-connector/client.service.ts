import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiSettings } from './api-settings.service';
import { Client } from '../vo_manager/clients/client.model';
import { IResponseTemplate } from './response-template';

/**
 * Service which provides client methods.
 */
@Injectable()
export class ClientService {
	clientURL: string = `${ApiSettings.getApiBaseURL()}clients/`;

	constructor(private http: HttpClient) {
		this.http = http;
	}

	isClientAvaiable(): Observable<Client> {
		return this.http.get<Client>(`${this.clientURL}active/`, {
			withCredentials: true,
		});
	}

	getClientsChecked(): Observable<Client[]> {
		return this.http
			.get<Client[]>(this.clientURL, {
				withCredentials: true,
			})
			.pipe(map((clients: Client[]): Client[] => clients.map((client: Client): Client => new Client(client))));
	}

	checkClient(host: string, port: string): Observable<IResponseTemplate> {
		const params: HttpParams = new HttpParams().set('host', host).set('port', port);

		return this.http.post<IResponseTemplate>(`${this.clientURL}checkClient/`, params, {
			withCredentials: true,
		});
	}

	getClientLimits(client_id: number | string): Observable<any> {
		return this.http.get(`${this.clientURL}${client_id}/limits/`, {
			withCredentials: true,
		});
	}

	postClient(host: string, port: string, location: string): Observable<Client> {
		const params: HttpParams = new HttpParams().set('host', host).set('port', port).set('location', location);

		return this.http.post<Client>(this.clientURL, params, {
			withCredentials: true,
		});
	}

	deleteClient(client_id: number): Observable<any> {
		return this.http.delete(`${this.clientURL}${client_id}/`, {
			withCredentials: true,
		});
	}

	updateClient(client: Client): Observable<Client> {
		return this.http.patch<Client>(`${this.clientURL}${client.id}/`, client, {
			withCredentials: true,
		});
	}

	switchActive(client_id: string): Observable<Client> {
		return this.http.post<Client>(`${this.clientURL}${client_id}/switchActive/`, null, {
			withCredentials: true,
		});
	}

	switchUseSSL(client_id: string): Observable<Client> {
		return this.http.post<Client>(`${this.clientURL}${client_id}/switchUseSSL/`, null, {
			withCredentials: true,
		});
	}
}
