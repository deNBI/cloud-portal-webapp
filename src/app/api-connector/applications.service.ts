import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {EdamOntologyTerm} from '../applications/edam-ontology-term';
import {Application} from '../applications/application.model/application.model';
import {ApplicationExtension} from '../applications/application_extension.model';

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

  getApplicationValidationByHash(hash: string): Observable<Application> {

    return this.http.get<Application>(`${ApiSettings.getApiBaseURL()}project_applications/validation/${hash}/`, {
      headers: header,
      withCredentials: true
    })
  }

  validateApplicationAsPIByHash(hash: string, application: Application): Observable<any> {

    return this.http.post(`${ApiSettings.getApiBaseURL()}project_applications/validation/${hash}/`, application, {
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

  getApplication(app_id: string): Observable<Application> {
    return this.http.get<Application>(`${ApiSettings.getApiBaseURL()}project_applications/${app_id}/`, {
      headers: header,
      withCredentials: true
    })
  }

  /**
   * Gets the perun id of an application.
   * @param app_id Id of the application.
   */
  getApplicationPerunId(app_id: string): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}project_applications/${app_id}/perun/`, {
      headers: header,
      withCredentials: true
    })
  }

  /**
   * Gets a client from an applicaiton.
   * @param app_id Id of the application
   */
  getApplicationClient(app_id: string): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}project_applications/${app_id}/client/`, {
      headers: header,
      withCredentials: true
    })
  }

  /**
   * Gets all edam terms.
   */
  getEdamOntologyTerms(): Observable<EdamOntologyTerm[]> {
    return this.http.get<EdamOntologyTerm[]>(`${ApiSettings.getApiBaseURL()}edam_ontology/`, {
      headers: header,
      withCredentials: true
    })
  }

  /**
   * Add edam ontology term to an application.
   * @param application_id id of the Applicaiton
   * @param data EdamOntologyTerm array.
   */
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

  getAllApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${ApiSettings.getApiBaseURL()}project_applications/`, {
      withCredentials: true,
      headers: header

    })

  }

  addNewApplication(application: Application): Observable<Application> {

    return this.http.post<Application>(`${ApiSettings.getApiBaseURL()}project_applications/`, application, {
      headers: header,
      withCredentials: true
    })

  }

  requestRenewal(extension: ApplicationExtension): Observable<any> {

    return this.http.post(`${ApiSettings.getApiBaseURL()}applicationRenewals/`, extension, {
      headers: header,
      withCredentials: true
    })

  }

  /**
   * Approves an application renewal.
   * @param application_id Id of the applicaiton
   */
  approveRenewal(application_id: number | string): Observable<any> {

    return this.http.post(`${ApiSettings.getApiBaseURL()}applicationRenewals/${application_id}/status/`, null, {
      headers: header,
      withCredentials: true
    })

  }

  /**
   * Declines an application renewal.
   * @param application_id Id of the applicaiton
   */
  declineRenewal(application_id: number | string): Observable<any> {

    return this.http.delete(`${ApiSettings.getApiBaseURL()}applicationRenewals/${application_id}/status/`, {
      headers: header,
      withCredentials: true
    })

  }

  /**
   * Deletes an applicaiton.
   * @param application_id Id of the application.
   */
  deleteApplication(application_id: string | number): Observable<any> {

    return this.http.delete(`${ApiSettings.getApiBaseURL()}project_applications/${application_id}/`, {
      headers: header,
      withCredentials: true
    })

  }

}
