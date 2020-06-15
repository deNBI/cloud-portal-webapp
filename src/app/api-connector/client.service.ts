import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import {Client} from '../vo_manager/clients/client.model';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {IResponseTemplate} from './response-template';

/**
 * Service which provides client methods.
 */
@Injectable()
export class ClientService {
    clientURL: string = `${ApiSettings.getApiBaseURL()}clients/`;

    constructor(private http: HttpClient) {
    }

    isClientAvaiable(): Observable<Client> {

        return this.http.get<Client>(`${this.clientURL}active/`, {
            withCredentials: true
        })
    }

    getClientsChecked(): Observable<Client[]> {

        return this.http.get<Client[]>(this.clientURL, {
            withCredentials: true
        })
    }

    checkClient(host: string, port: string): Observable<IResponseTemplate> {
        const params: HttpParams = new HttpParams().set('host', host).set('port', port);

        return this.http.post<IResponseTemplate>(`${this.clientURL}checkClient/`, params, {
            withCredentials: true
        })

    }

    postClient(host: string, port: string, location: string): Observable<Client> {

        const params: HttpParams = new HttpParams().set('host', host).set('port', port).set('location', location);

        return this.http.post<Client>(this.clientURL, params, {
            withCredentials: true
        })
    }

    deleteClient(client_id: number): Observable<any> {
        return this.http.delete(`${this.clientURL}${client_id }/`, {
            withCredentials: true
        })

    }

    updateClient(client: Client): Observable<Client> {
        const params: HttpParams = new HttpParams().set('host', client.host).set('port', client.port).set('location', client.location);

        return this.http.patch<Client>(`${this.clientURL}${client.id }/`, params, {
            withCredentials: true
        })

    }
}
