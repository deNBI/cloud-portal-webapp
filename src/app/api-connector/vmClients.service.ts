import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import {Client} from '../virtualmachines/clients/vmclient';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {Cookie} from 'ng2-cookies/ng2-cookies';

const header: HttpHeaders = new HttpHeaders({
    'X-CSRFToken': Cookie.get('csrftoken')
});

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

    checkClient(host: string, port: string): Observable<any> {
        const params: HttpParams = new HttpParams().set('host', host).set('port', port);

        return this.http.post(`${this.clientURL}checkClient/`, params, {
            withCredentials: true,
            headers: header
        })

    }

    postClient(host: string, port: string, location: string): Observable<any> {

        const params: HttpParams = new HttpParams().set('host', host).set('port', port).set('location', location);

        return this.http.post(this.clientURL, params, {
            withCredentials: true,
            headers: header
        })
    }

    deleteClient(client_id: number): Observable<any> {
        return this.http.delete(`${this.clientURL}${client_id }/`, {
            withCredentials: true,
            headers: header
        })

    }
}
