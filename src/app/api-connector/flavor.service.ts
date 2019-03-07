import {Injectable} from '@angular/core';
import {Flavor} from '../virtualmachines/virtualmachinemodels/flavor';
import {ApiSettings} from './api-settings.service';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {FlavorType} from '../virtualmachines/virtualmachinemodels/flavorType';


@Injectable()
export class FlavorService {

    constructor(private http: HttpClient, private settings: ApiSettings) {
    }

    getFlavors(project_id: number): Observable<Flavor[]> {
        return this.http.get<Flavor[]>(this.settings.getApiBaseURL() + 'projects/' + project_id + '/flavors/', {
            withCredentials: true,

        }).pipe(catchError((error: any) => throwError(error)));

    }

    getListOfTypesAvailable(): Observable<FlavorType[]> {
        return this.http.get<FlavorType[]>(this.settings.getApiBaseURL() + 'project_applications/flavorTypes/', {
            withCredentials: true
        }).pipe(catchError((error: any) => throwError(error)));
    }

    getListOfFlavorsAvailable(): Observable<Flavor[]> {
        return this.http.get<Flavor[]>(this.settings.getApiBaseURL() + 'project_applications/flavors/', {
            withCredentials: true
        }).pipe(catchError((error: any) => throwError(error)));
    }

}
