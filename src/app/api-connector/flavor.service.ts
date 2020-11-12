import {Injectable} from '@angular/core';
import {Flavor} from '../virtualmachines/virtualmachinemodels/flavor';
import {ApiSettings} from './api-settings.service';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {FlavorType} from '../virtualmachines/virtualmachinemodels/flavorType';

/**
 * Service which provides methods for Flavors.
 */
@Injectable()
export class FlavorService {

    constructor(private http: HttpClient) {
    }

    getFlavors(project_id: number | string): Observable<Flavor[]> {
      return this.http.get<Flavor[]>(`${ApiSettings.getApiBaseURL()}projects/${project_id}/flavors/`, {
        withCredentials: true

      })
    }

    getListOfTypesAvailable(): Observable<FlavorType[]> {
        return this.http.get<FlavorType[]>(`${ApiSettings.getApiBaseURL()}project_applications/flavorTypes/`, {
            withCredentials: true
        })
    }

    getListOfFlavorsAvailable(): Observable<Flavor[]> {
        return this.http.get<Flavor[]>(`${ApiSettings.getApiBaseURL()}project_applications/flavors/`, {
            withCredentials: true
        })
    }

}
