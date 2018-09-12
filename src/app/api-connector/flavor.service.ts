import {Injectable} from '@angular/core';
import {Flavor} from '../virtualmachines/virtualmachinemodels/flavor';
import {ApiSettings} from './api-settings.service';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';


@Injectable()
export class FlavorService {

    constructor(private http: HttpClient, private settings: ApiSettings) {
    }

    getFlavors(project_id:number): Observable<Flavor[]> {
                let params = new HttpParams().set('project_id', project_id.toString());


        return this.http.get<Flavor[]>(this.settings.getConnectorBaseUrl() + 'flavors/getFlavors/', {
            withCredentials: true,
            params:params

        }).pipe(catchError((error: any) => throwError(error)));

    }

}
