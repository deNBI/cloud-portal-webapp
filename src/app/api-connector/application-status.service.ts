import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {Cookie} from 'ng2-cookies/ng2-cookies';


const header = new HttpHeaders({
    'X-CSRFToken': Cookie.get('csrftoken')
});


@Injectable()
export class ApplicationStatusService {
    constructor(private http: HttpClient, private settings: ApiSettings) {
    }

    getAllApplicationStatus(): Observable<any> {
        return this.http.get(this.settings.getApiBaseURL() + 'application_status/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));
    }

    setApplicationStatus(application_id: number, status_id: number, compute_center: string): Observable<any> {
        const params = new HttpParams().set('project_application_status', status_id.toString()).set('compute_center', compute_center);


        return this.http.patch(this.settings.getApiBaseURL() + 'project_applications/' + application_id + '/', params,
            {
                headers: header,
                withCredentials: true
            }).pipe(catchError((error: any) => throwError(error)));
    }

}
