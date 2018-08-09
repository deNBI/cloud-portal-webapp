import {Injectable} from '@angular/core';
import {Flavor} from '../virtualmachines/virtualmachinemodels/flavor';
import {ApiSettings} from './api-settings.service';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';


@Injectable()
export class FlavorService {

    constructor(private http: HttpClient, private settings: ApiSettings) {
    }

    getFlavors(): Observable<Flavor[]> {

        return this.http.get<Flavor[]>(this.settings.getConnectorBaseUrl() + 'flavors/getFlavors/', {
            withCredentials: true,

        }).pipe(catchError((error: any) => throwError(error)));

    }

}
