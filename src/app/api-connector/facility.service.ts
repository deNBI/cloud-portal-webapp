import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {RamFactor} from '../facility_manager/resources/ram-factor';
import {CoreFactor} from '../facility_manager/resources/core-factor';

const header: HttpHeaders = new HttpHeaders({
                                              'X-CSRFToken': Cookie.get('csrftoken')
                                            });

/**
 * Service which provides methods for the facilities.
 */
@Injectable()
export class FacilityService {
  constructor(private http: HttpClient) {
  }

  /**
   * Get all available computecenters.
   * @returns {Observable<any>}
   */
  getComputeCenters(): Observable<any> {

    return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/`, {
      withCredentials: true

    })
  }

  /**
   * Get all facility, where the current user is manager.
   * @returns {Observable<any>}
   */
  getManagerFacilities(): Observable<any> {

    return this.http.get(`${ApiSettings.getApiBaseURL()}facilityManagers/current/facilities/`, {
      withCredentials: true
    })

  }

  /**
   * Get allowed groups from a facility with a specific status.
   * @param {number} facility
   * @param {number} status
   * @returns {Observable<any>}
   */
  getFacilityAllowedGroupsWithDetailsAndSpecificStatus(facility: number | string, status: number): Observable<any> {

    return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/projects/`, {
      withCredentials: true,
      params: {status: status.toString()}

    })

  }

  /**
   * Get all resources assigned to a facility.
   * @param {number} facility id of the facility
   * @returns {Observable<any>}
   */
  getFacilityResources(facility: number | string): Observable<any> {

    return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/projects/resources/`, {
      withCredentials: true

    })

  }

  /**
   * Gets all facility applications which are waiting for conirmation.
   * @param {number} facility
   * @returns {Observable<any>}
   */
  getFacilityApplicationsWaitingForConfirmation(facility: number | string): Observable<any> {

    return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/applications/`, {
      withCredentials: true

    })

  }

  /**
   * Gets all facility applications history.
   * @param {number} facility
   * @returns {Observable<any>}
   */
  getFacilityApplicationsHistory(facility: number | string): Observable<any> {

    return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/applications_history/`, {
      withCredentials: true
    })

  }

  /**
   * Gets all volumes from a specific facility.
   * @param {number} facility
   * @returns {Observable<any>}
   */
  getFacilityVolumes(facility: number | string): Observable<any> {

    return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/volumes/`, {
      withCredentials: true
    })

  }

  /**
   * Gets all volumes from a specific facility.
   * @param {number} facility
   * @returns {Observable<any>}
   */
  getFacilitySnapshots(facility: number | string): Observable<any> {

    return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/snapshots/`, {
      withCredentials: true
    })

  }

  /**
   * Gets all facility modification applications which are waiting for conirmation.
   * @param {number} facility
   * @returns {Observable<any>}
   */
  getFacilityModificationApplicationsWaitingForConfirmation(facility: number | string): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/modification_applications/`, {
      withCredentials: true

    })
  }

  /**
   * Approves an facility application.
   * @param {number} facility
   * @param {number} application_id
   * @returns {Observable<any>}
   */
  approveFacilityApplication(facility: number | string, application_id: number | string): Observable<any> {
    const params: HttpParams = new HttpParams().set('action', 'approve');

    return this.http.post(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/applications/${application_id}/status/`,
                          params, {
                            withCredentials: true,
                            headers: header,
                            observe: 'response'
                          })
  }

  /**
   * Add a new CoreFactor.
   * @param {number | string} facility
   * @param {number | string} cores
   * @param {number | string} factor
   * @param {string} description
   * @returns {Observable<any>}
   */
  // tslint:disable-next-line:max-line-length
  addCoresFactor(facility: number | string, cores: number | string, factor: number | string, description: string): Observable<CoreFactor[]> {
    const params: HttpParams = new HttpParams()
      .set('type', 'cores')
      .set('cores', cores.toString())
      .set('factor', factor.toString())
      .set('description', description);

    return this.http.post<CoreFactor[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/coreFactors/`, params, {
      withCredentials: true,
      headers: header
    })
  }

  /**
   * Add a new RamFactor
   * @param {number | string} facility
   * @param {number | string} ram
   * @param {number | string} factor
   * @param {string} description
   * @returns {Observable<any>}
   */
  addRamFactor(facility: number | string, ram: number | string, factor: number | string, description: string): Observable<RamFactor[]> {
    const params: HttpParams = new HttpParams().set('type', 'ram').set('ram', ram.toString()).set('factor', factor.toString()).set('description', description);

    return this.http.post<RamFactor[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/ramFactors/`, params, {
      withCredentials: true,
      headers: header
    })
  }

  /**
   * Deletes an RamFactor.
   * @param {number | string} facility
   * @param {number | string} factor_id
   * @returns {Observable<RamFactor[]>}
   */
  deleteRamFactor(facility: number | string, factor_id: number | string): Observable<RamFactor[]> {

    return this.http.delete<RamFactor[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/ramFactors/${factor_id}/`, {
      withCredentials: true,
      headers: header
    })
  }

  /**
   * Deletes an CoreFactor.
   * @param {number | string} facility
   * @param {number | string} factor_id
   * @returns {Observable<RamFactor[]>}
   */
  deleteCoreFactor(facility: number | string, factor_id: number | string): Observable<CoreFactor[]> {

    return this.http.delete<CoreFactor[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/coreFactors/${factor_id}/`, {
      withCredentials: true,
      headers: header
    })
  }

  /**
   * Get CoreFactors from a facility.
   * @param {number | string} facility
   * @returns {Observable<any>}
   */
  getCoreFactor(facility: number | string): Observable<CoreFactor[]> {
    const params: HttpParams = new HttpParams().set('type', 'cores');

    return this.http.get<CoreFactor[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/coreFactors/`, {
                                         withCredentials: true,
                                         params: params
                                       }
    )
  }

  /**
   * Get Ramactors from a facility.
   * @param {number | string} facility
   * @returns {Observable<any>}
   */
  getRamFactor(facility: number | string): Observable<RamFactor[]> {
    const params: HttpParams = new HttpParams().set('type', 'ram');

    return this.http.get<RamFactor[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/ramFactors/`, {
                                        withCredentials: true,
                                        params: params
                                      }
    )
  }

  /**
   * Declines an application for the facility
   * @param {number} facility
   * @param {number} application_id
   * @returns {Observable<any>}
   */
  declineFacilityApplication(facility: number, application_id: number): Observable<any> {
    const params: HttpParams = new HttpParams().set('action', 'decline');

    return this.http.post(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/applications/${application_id}/status/`, params, {
      withCredentials: true,
      headers: header,
      observe: 'response'
    })
  }

  /**
   * Sends an email to all members of the facility.
   * @param facility facility that should be contacted
   * @param subject email subject
   * @param message email message
   * @param reply reply address
   * @returns {Observable<any>}
   */
  sendMailToFacility(facility: string, subject: string, message: string, project_type: string,
                     reply?: string, sendNews?: any): Observable<any> {
    const params: HttpParams = new HttpParams()
      .set('subject', subject)
      .set('facility_id', facility)
      .set('message', message)
      .set('reply', reply)
      .set('type', project_type)
      .set('sendNews', sendNews);

    return this.http.post(`${ApiSettings.getApiBaseURL()}facilityManagers/current/facilityMail/`, params, {
                            withCredentials: true,
                            headers: header,
                            observe: 'response'
                          }
    )
  }

  /**
   * Get Members of a project with emails.
   * @param {number} groupid id of the group
   * @param {number} facility id of the facility
   * @returns {Observable<any>}
   */
  getFacilityGroupRichMembers(groupid: number, facility: number): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/projects/${groupid}/members/`, {
                           withCredentials: true
                         }
    )
  }

}
