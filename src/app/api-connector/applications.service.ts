import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import {HttpClient, HttpHeaders} from '@angular/common/http';
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

  /**
   * Get an applicaiton by hash
   * @param hash hash to search for
   */
  getApplicationValidationByHash(hash: string): Observable<any> {

    return this.http.get(`${ApiSettings.getApiBaseURL()}project_applications/validation/${hash}/`, {
      headers: header,
      withCredentials: true
    })
  }

  /**
   * Validates an application by hash
   * @param hash hash of the applicaiton
   * @param data modified application data.
   */
  validateApplicationAsPIByHash(hash: string, data: { [key: string]: string | number | boolean }): Observable<any> {

    return this.http.post(`${ApiSettings.getApiBaseURL()}project_applications/validation/${hash}/`, data, {
      headers: header,
      withCredentials: true
    })
  }

  /**
   * Sets the dissemination of a applicaiton
   * @param project_application_id id of the application
   * @param dissemination Disseminationobject
   */
  setApplicationDissemination(project_application_id: string | number, dissemination: ApplicationDissemination): Observable<any> {
    return this.http.post(`${ApiSettings.getApiBaseURL()}project_applications/${project_application_id}/dissemination/`,
                          dissemination, {
                            headers: header,
                            withCredentials: true
                          })
  }

  /**
   * Deletes a dissemination form an application
   * @param project_application_id Id of the application
   */
  deleteApplicationDissemination(project_application_id: string | number): Observable<any> {
    return this.http.delete(`${ApiSettings.getApiBaseURL()}project_applications/${project_application_id}/dissemination/`,
                            {
                              headers: header,
                              withCredentials: true
                            })
  }

  /**
   * Gets an application.
   * @param app_id Id of the application.
   */
  getApplication(app_id: string): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}project_applications/${app_id}/`, {
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

  /**
   * Get all applications.
   */
  getAllApplications(): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}project_applications/`, {
      withCredentials: true,
      headers: header

    })

  }

  /**
   * Creates a new application.
   * @param data Application data.
   */
  addNewApplication(data: { [key: string]: string | number | boolean }): Observable<any> {

    return this.http.post(`${ApiSettings.getApiBaseURL()}project_applications/`, data, {
      headers: header,
      withCredentials: true
    })

  }

  /**
   * Requests a renewal.
   * @param data renewaldata.
   */
  requestRenewal(data: { [key: string]: string | number | boolean }): Observable<any> {

    return this.http.post(`${ApiSettings.getApiBaseURL()}applicationRenewals/`, data, {
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
