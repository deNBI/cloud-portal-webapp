import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import {Vmclient} from '../virtualmachines/virtualmachinemodels/vmclient';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {Cookie} from 'ng2-cookies/ng2-cookies';


const header = new HttpHeaders({
    'X-CSRFToken': Cookie.get('csrftoken')
});

@Injectable()
export class ClientService {
    clientURL = this.settings.getApiBaseURL() + 'clients/';

    constructor(private http: HttpClient, private settings: ApiSettings) {
    }


    isClientAvaiable(): Observable<Vmclient> {


        return this.http.get<Vmclient>(this.clientURL + 'active/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));
    }

    getClientsChecked(): Observable<Vmclient[]> {

        return this.http.get<Vmclient[]>(this.clientURL, {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));
    }

    checkClient(host: string, port: string): Observable<any> {
        const params = new HttpParams().set('host', host).set('port', port);


        return this.http.post(this.clientURL + 'checkClient/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));
        ;

    }

    postClient(host: string, port: string, location: string): Observable<any> {

        const params = new HttpParams().set('host', host).set('port', port).set('location', location);


        return this.http.post(this.clientURL, params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));

    }

    deleteClient(client_id: number): Observable<any> {
        return this.http.delete(this.clientURL + client_id + '/', {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));

    }
}
