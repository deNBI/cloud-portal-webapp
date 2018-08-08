import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import {Vmclient} from "../virtualmachines/virtualmachinemodels/vmclient";
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {Cookie} from 'ng2-cookies/ng2-cookies';


const header = new HttpHeaders({
    'X-CSRFToken': Cookie.get("csrftoken")
});

@Injectable()
export class ClientService {
    clientURL = this.settings.getConnectorBaseUrl() + 'clients/';

    constructor(private http: HttpClient, private settings: ApiSettings) {
    }

    getClientsUnchecked(): Observable<Vmclient[]> {

        return this.http.get<Vmclient[]>(this.clientURL + 'getUncheckedClients/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));

    }

    isClientAvaiable(): Observable<Vmclient> {


        return this.http.get<Vmclient>(this.clientURL + 'isClientAvaiable/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));
    }

    getClientsChecked(): Observable<Vmclient[]> {

        return this.http.get<Vmclient[]>(this.clientURL + 'getCheckedClients/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));
    }

    checkClient(host: string, port: string): Observable<any> {
        let params = new HttpParams().set('host', host).set('port', port);


        return this.http.post(this.clientURL + 'checkClient/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));
        ;

    }

    postClient(host: string, port: string, location: string): Observable<any> {

        let params = new HttpParams().set('host', host).set('port', port).set('location', location);


        return this.http.post(this.clientURL + 'addClient/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));

    }

    deleteClient(host: string, port: string, location: string): Observable<any> {

        let params = new HttpParams().set('host', host).set('port', port).set('location', location);



        return this.http.post(this.clientURL + 'deleteClient/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));

    }
}
