import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {EdamOntologyTerm} from '../applications/edam-ontology-term';
import {ApplicationDissemination} from '../applications/application-dissemination';

const header: HttpHeaders = new HttpHeaders({
                                              'X-CSRFToken': Cookie.get('csrftoken'),
                                              'Content-Type': 'application/json'

                                            });

/**
 * Service which provides methods for creating application.
 */
@Injectable()
export class ApplicationsService {
  constructor(private http: HttpClient) {
  }

  getUserApplications(): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}users/current/project_applications/`, {
      headers: header,
      withCredentials: true
    })
  }

  getApplicationValidationByHash(hash: string): Observable<any> {

    return this.http.get(`${ApiSettings.getApiBaseURL()}project_applications/validation/${hash}/`, {
      headers: header,
      withCredentials: true
    })
  }

  validateApplicationAsPIByHash(hash: string): Observable<any> {

    return this.http.post(`${ApiSettings.getApiBaseURL()}project_applications/validation/${hash}/`, null, {
      headers: header,
      withCredentials: true
    })
  }

  setApplicationDissemination(project_application_id: string | number, dissemination: ApplicationDissemination): Observable<any> {
    return this.http.post(`${ApiSettings.getApiBaseURL()}project_applications/${project_application_id}/dissemination/`,
                          dissemination, {
                            headers: header,
                            withCredentials: true
                          })
  }

  getUserApplication(project_id: string | number): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}users/current/project_applications/${project_id}/`, {
      headers: header,
      withCredentials: true
    })
  }

  getApplication(app_id: string): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}project_applications/${app_id}/`, {
      headers: header,
      withCredentials: true
    })
  }

  getApplicationPerunId(app_id: string): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}project_applications/${app_id}/perun/`, {
      headers: header,
      withCredentials: true
    })
  }

  getApplicationClient(app_id: string): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}project_applications/${app_id}/client/`, {
      headers: header,
      withCredentials: true
    })
  }

  getEdamOntologyTerms(): Observable<EdamOntologyTerm[]> {
    return this.http.get<EdamOntologyTerm[]>(`${ApiSettings.getApiBaseURL()}edam_ontology/`, {
      headers: header,
      withCredentials: true
    })
  }

  addEdamOntologyTerms(application_id: number | string, data: EdamOntologyTerm[]): Observable<any> {
    const params: any = {edam_ontology_terms: data};

    return this.http.post(`${ApiSettings.getApiBaseURL()}project_applications/${application_id}/edam_terms/`, params, {
      headers: header,
      withCredentials: true
    })

  }

  /**
   * Checks if some client has the ressource avaiable for an application.
   * @param {string} app_id
   * @returns {Observable<any>}
   */
  getApplicationClientAvaiable(app_id: string): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}project_applications/${app_id}/clients/resource/`, {
      headers: header,
      withCredentials: true
    })
  }

  getAllApplications(): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}project_applications/`, {
      withCredentials: true,
      headers: header

    })

  }

  addNewApplication(data: { [key: string]: string | number | boolean }): Observable<any> {

    return this.http.post(`${ApiSettings.getApiBaseURL()}project_applications/`, data, {
      headers: header,
      withCredentials: true
    })

  }

  requestRenewal(data: { [key: string]: string | number | boolean }): Observable<any> {

    return this.http.post(`${ApiSettings.getApiBaseURL()}applicationRenewals/`, data, {
      headers: header,
      withCredentials: true
    })

  }

  approveRenewal(application_id: number | string): Observable<any> {

    return this.http.post(`${ApiSettings.getApiBaseURL()}applicationRenewals/${application_id}/status/`, null, {
      headers: header,
      withCredentials: true
    })

  }

  declineRenewal(application_id: number | string): Observable<any> {

    return this.http.delete(`${ApiSettings.getApiBaseURL()}applicationRenewals/${application_id}/status/`, {
      headers: header,
      withCredentials: true
    })

  }

  getAllApplicationsRenewalRequests(): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}applicationsRenewals/`, {
      withCredentials: true,
      headers: header

    })

  }

  getApplicationsRenewalRequest(application_id: number): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}applicationsRenewals/${application_id}/`, {
      withCredentials: true,
      headers: header
    })

  }

  deleteApplication(application_id: string | number): Observable<any> {

    return this.http.delete(`${ApiSettings.getApiBaseURL()}project_applications/${application_id}/`, {
      headers: header,
      withCredentials: true
    })

  }

}
