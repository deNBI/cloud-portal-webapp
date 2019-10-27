import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {Cookie} from 'ng2-cookies/ng2-cookies';

const header: HttpHeaders = new HttpHeaders({
                                              'X-CSRFToken': Cookie.get('csrftoken')
                                            });

/**
 * Service which delivers functions for services related to the credit service.
 */
@Injectable()
export class CreditsService {
  constructor(private http: HttpClient) {
  }

  /**
   * Get credits for project application.
   * @returns {int} The expected credits for the credits.
   */
  public getCreditsForApplication(cpus: number, ram: number, months: number): Observable<number> {
    const params: HttpParams = new HttpParams().set('cpu', cpus.toString()).set('ram', ram.toString()).set('months', months.toString());

    return this.http.get<number>(`${ApiSettings.getApiBaseURL()}creditManager/getCreditsForApplication/`, {
      withCredentials: true,
      params: params
    });
  }

}
