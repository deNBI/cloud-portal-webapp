import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EdamOntologyTerm} from '../applications/edam-ontology-term';
import {Application} from '../applications/application.model/application.model';
import {ApplicationLifetimeExtension} from '../applications/application_extension.model';
import {ApplicationModification} from '../applications/application_modification.model';
import {ApplicationCreditRequest} from '../applications/application_credit_request';

/**
 * Service which provides methods for creating application.
 */
@Injectable()
export class ApplicationsService {
  constructor(private http: HttpClient) {
  }

  getUserApplications(): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}users/current/project_applications/`, {
      withCredentials: true
    })
  }

  getApplicationValidationByHash(hash: string): Observable<Application> {

    return this.http.get<Application>(`${ApiSettings.getApiBaseURL()}project_applications/validation/${hash}/`, {
      withCredentials: true
    })
  }

  validateApplicationAsPIByHash(hash: string, application: Application): Observable<any> {

    return this.http.post(`${ApiSettings.getApiBaseURL()}project_applications/validation/${hash}/`, application, {
      withCredentials: true
    })
  }

  getUserApplication(project_id: string | number): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}users/current/project_applications/${project_id}/`, {
      withCredentials: true
    })
  }

  getApplication(app_id: string): Observable<Application> {
    return this.http.get<Application>(`${ApiSettings.getApiBaseURL()}project_applications/${app_id}/`, {
      withCredentials: true
    })
  }

  getApplicationPerunId(app_id: string): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}project_applications/${app_id}/perun/`, {
      withCredentials: true
    })
  }

  getApplicationClient(app_id: string): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}project_applications/${app_id}/client/`, {
      withCredentials: true
    })
  }

  getEdamOntologyTerms(): Observable<EdamOntologyTerm[]> {
    return this.http.get<EdamOntologyTerm[]>(`${ApiSettings.getApiBaseURL()}edam_ontology/`, {
      withCredentials: true
    })
  }

  addEdamOntologyTerms(application_id: number | string, data: EdamOntologyTerm[]): Observable<any> {
    const params: any = {edam_ontology_terms: data};

    return this.http.post(`${ApiSettings.getApiBaseURL()}project_applications/${application_id}/edam_terms/`, params, {
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
      withCredentials: true
    })
  }

  getAllApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${ApiSettings.getApiBaseURL()}project_applications/`, {
      withCredentials: true

    })

  }

  getAllCreditsExtensionRequests(): Observable<Application[]> {
    return this.http.get<Application[]>(`${ApiSettings.getApiBaseURL()}project_applications/credits/extensions/`, {
      withCredentials: true

    })

  }

  getCreditsExtensionRequest(): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}project_applications/credits/extensions/`, {
      withCredentials: true
    })
  }

  addNewApplication(application: Application): Observable<Application> {

    return this.http.post<Application>(`${ApiSettings.getApiBaseURL()}project_applications/`, application, {
      withCredentials: true
    })

  }

  requestExtension(extension: ApplicationLifetimeExtension): Observable<any> {
    return this.http.post(`${ApiSettings.getApiBaseURL()}applicationRenewals/`, extension, {
      withCredentials: true
    })

  }

  requestModification(modification: ApplicationModification): Observable<any> {
   return this.http.post(`${ApiSettings.getApiBaseURL()}project_applications/modifications/`,
                         modification, {
                            withCredentials: true
                          })
  }

  requestAdditionalLifetime(lifetimeRequest: ApplicationLifetimeExtension): Observable<any> {
    return this.http.post(`${ApiSettings.getApiBaseURL()}project_applications/lifetime/extensions/`,
                          lifetimeRequest, {
                            withCredentials: true
                          })
  }

  requestAdditionalCredits(creditRequest: ApplicationCreditRequest): Observable<any> {
    return this.http.post(`${ApiSettings.getApiBaseURL()}project_applications/credits/extensions/`,
                          creditRequest, {
                            withCredentials: true
                          })
  }

  approveRenewal(application_id: number | string): Observable<any> {

    return this.http.post(`${ApiSettings.getApiBaseURL()}applicationRenewals/${application_id}/status/`, null, {
      withCredentials: true
    })

  }

  declineRenewal(application_id: number | string): Observable<any> {

    return this.http.delete(`${ApiSettings.getApiBaseURL()}applicationRenewals/${application_id}/status/`, {
      withCredentials: true
    })

  }

  getAllApplicationsRenewalRequests(): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}applicationsRenewals/`, {
      withCredentials: true
    })

  }

  getApplicationsRenewalRequest(application_id: number): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}applicationsRenewals/${application_id}/`, {
      withCredentials: true
    })

  }

  deleteApplication(application_id: string | number): Observable<any> {

    return this.http.delete(`${ApiSettings.getApiBaseURL()}project_applications/${application_id}/`, {
      withCredentials: true
    })

  }

}
