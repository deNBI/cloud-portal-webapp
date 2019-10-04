import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service'
import ***REMOVED***HttpClient, HttpHeaders, HttpParams***REMOVED*** from '@angular/common/http';
import ***REMOVED***Observable***REMOVED*** from 'rxjs';
import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';
import ***REMOVED***EdamOntologyTerm***REMOVED*** from '../applications/edam-ontology-term';
import ***REMOVED***ApplicationDissemination***REMOVED*** from '../applications/application-dissemination';

const header: HttpHeaders = new HttpHeaders(***REMOVED***
                                              'X-CSRFToken': Cookie.get('csrftoken'),
                                              'Content-Type': 'application/json'

                                            ***REMOVED***);

/**
 * Service which provides methods for creating application.
 */
@Injectable()
export class ApplicationsService ***REMOVED***
  constructor(private http: HttpClient) ***REMOVED***
  ***REMOVED***

  getUserApplications(): Observable<any> ***REMOVED***
    return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/current/project_applications/`, ***REMOVED***
      headers: header,
      withCredentials: true
    ***REMOVED***)
  ***REMOVED***

  getApplicationValidationByHash(hash: string): Observable<any> ***REMOVED***

    return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***project_applications/validation/$***REMOVED***hash***REMOVED***/`, ***REMOVED***
      headers: header,
      withCredentials: true
    ***REMOVED***)
  ***REMOVED***

  validateApplicationAsPIByHash(hash: string): Observable<any> ***REMOVED***

    return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***project_applications/validation/$***REMOVED***hash***REMOVED***/`, null, ***REMOVED***
      headers: header,
      withCredentials: true
    ***REMOVED***)
  ***REMOVED***

  setApplicationDissemination(project_application_id: string | number, dissemination: ApplicationDissemination): Observable<any> ***REMOVED***
    return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***project_applications/$***REMOVED***project_application_id***REMOVED***/dissemination/`,
                          dissemination, ***REMOVED***
                            headers: header,
                            withCredentials: true
                          ***REMOVED***)
  ***REMOVED***

  getUserApplication(project_id: string | number): Observable<any> ***REMOVED***
    return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/current/project_applications/$***REMOVED***project_id***REMOVED***/`, ***REMOVED***
      headers: header,
      withCredentials: true
    ***REMOVED***)
  ***REMOVED***

  getApplication(app_id: string): Observable<any> ***REMOVED***
    return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***project_applications/$***REMOVED***app_id***REMOVED***/`, ***REMOVED***
      headers: header,
      withCredentials: true
    ***REMOVED***)
  ***REMOVED***

  getApplicationPerunId(app_id: string): Observable<any> ***REMOVED***
    return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***project_applications/$***REMOVED***app_id***REMOVED***/perun/`, ***REMOVED***
      headers: header,
      withCredentials: true
    ***REMOVED***)
  ***REMOVED***

  getApplicationClient(app_id: string): Observable<any> ***REMOVED***
    return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***project_applications/$***REMOVED***app_id***REMOVED***/client/`, ***REMOVED***
      headers: header,
      withCredentials: true
    ***REMOVED***)
  ***REMOVED***

  getEdamOntologyTerms(): Observable<EdamOntologyTerm[]> ***REMOVED***
    return this.http.get<EdamOntologyTerm[]>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***edam_ontology/`, ***REMOVED***
      headers: header,
      withCredentials: true
    ***REMOVED***)
  ***REMOVED***

  addEdamOntologyTerms(application_id: number | string, data: EdamOntologyTerm[]): Observable<any> ***REMOVED***
    const params = ***REMOVED***edam_ontology_terms: data***REMOVED***;

    return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***project_applications/$***REMOVED***application_id***REMOVED***/edam_terms/`, params, ***REMOVED***
      headers: header,
      withCredentials: true
    ***REMOVED***)

  ***REMOVED***

  /**
   * Checks if some client has the ressource avaiable for an application.
   * @param ***REMOVED***string***REMOVED*** app_id
   * @returns ***REMOVED***Observable<any>***REMOVED***
   */
  getApplicationClientAvaiable(app_id: string): Observable<any> ***REMOVED***
    return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***project_applications/$***REMOVED***app_id***REMOVED***/clients/resource/`, ***REMOVED***
      headers: header,
      withCredentials: true
    ***REMOVED***)
  ***REMOVED***

  getAllApplications(): Observable<any> ***REMOVED***
    return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***project_applications/`, ***REMOVED***
      withCredentials: true,
      headers: header

    ***REMOVED***)

  ***REMOVED***

  addNewApplication(data: ***REMOVED*** [key: string]: string | number | boolean ***REMOVED***): Observable<any> ***REMOVED***

    return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***project_applications/`, data, ***REMOVED***
      headers: header,
      withCredentials: true
    ***REMOVED***)

  ***REMOVED***

  requestRenewal(data: ***REMOVED*** [key: string]: string | number | boolean ***REMOVED***): Observable<any> ***REMOVED***

    return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***applicationRenewals/`, data, ***REMOVED***
      headers: header,
      withCredentials: true
    ***REMOVED***)

  ***REMOVED***

  approveRenewal(application_id: number | string): Observable<any> ***REMOVED***

    return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***applicationRenewals/$***REMOVED***application_id***REMOVED***/status/`, null, ***REMOVED***
      headers: header,
      withCredentials: true
    ***REMOVED***)

  ***REMOVED***

  declineRenewal(application_id: number | string): Observable<any> ***REMOVED***

    return this.http.delete(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***applicationRenewals/$***REMOVED***application_id***REMOVED***/status/`, ***REMOVED***
      headers: header,
      withCredentials: true
    ***REMOVED***)

  ***REMOVED***

  getAllApplicationsRenewalRequests(): Observable<any> ***REMOVED***
    return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***applicationsRenewals/`, ***REMOVED***
      withCredentials: true,
      headers: header

    ***REMOVED***)

  ***REMOVED***

  getApplicationsRenewalRequest(application_id: number): Observable<any> ***REMOVED***
    return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***applicationsRenewals/$***REMOVED***application_id***REMOVED***/`, ***REMOVED***
      withCredentials: true,
      headers: header
    ***REMOVED***)

  ***REMOVED***

  deleteApplication(application_id: string | number): Observable<any> ***REMOVED***

    return this.http.delete(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***project_applications/$***REMOVED***application_id***REMOVED***/`, ***REMOVED***
      headers: header,
      withCredentials: true
    ***REMOVED***)

  ***REMOVED***

***REMOVED***
