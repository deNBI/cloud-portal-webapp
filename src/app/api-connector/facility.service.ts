import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {RamFactor} from '../facility_manager/resources/ram-factor';
import {CoreFactor} from '../facility_manager/resources/core-factor';
import {Application} from '../applications/application.model/application.model';

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

  getWfcSubmittedApplications(facility_id: number | string): Observable<Application[]> {
    return this.http.get<Application[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility_id}/wfc/submitted/`, {
      withCredentials: true

    })

  }

  getWfcLifetimeRequestedApplications(facility_id: number | string): Observable<Application[]> {
    return this.http.get<Application[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility_id}/wfc/lifetime_requests/`, {
      withCredentials: true

    })

  }

  getWfcModificationRequestedApplications(facility_id: number | string): Observable<Application[]> {
    return this.http.get<Application[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility_id}/wfc/modifications_requests/`, {
      withCredentials: true

    })

  }

  getWfcCreditsRequestedApplications(facility_id: number | string): Observable<Application[]> {
    return this.http.get<Application[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility_id}/wfc/credits_requests/`, {
      withCredentials: true

    })

  }

    getExtensionRequestsCounterFacility(facility_id: number | string): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/${facility_id}/extensions_counter/`, {
      withCredentials: true

    })

  }

  /**
   * Sets the newsID of the facility news which contains the motd for facility with the corresponding facility ID.
   * @param facilityID facility id of the facility to set the id
   * @param newsId the id of the news containing the motd
   */
  setMOTDForFacility(facilityID: string, newsId: string): Observable<any> {
    const httpParams: HttpParams = new HttpParams().set('facilityID', facilityID).set('newsID', newsId);

    return this.http.post(`${ApiSettings.getApiBaseURL()}wp-motd-management/`, httpParams, {
      withCredentials: true
    });
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
   * Gets FacilityGroups by the elixirId of the member.
   * @param facility the facility
   * @param elixir_id the id of the member
   */
  getFacilityGroupsByMemberElixirId(facility: number | string, elixir_id: string): Observable<any> {

    return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/projects/filter/`, {
      withCredentials: true,
      params: {elixir_id: elixir_id.toString()}
    });
  }

  /**
   * Get all resources assigned to a facility.
   * @param {number} facility id of the facility
   * @returns {Observable<any>}
   */
  getFacilityResources(facility: number | string): Observable<any> {

    return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/projects/resources/`, {
      withCredentials: true
    });
  }

  /**
   * Gets all facility applications which are waiting for conirmation.
   * @param {number} facility
   * @returns {Observable<any>}
   */
  getFacilityApplicationsWaitingForConfirmation(facility: number | string): Observable<Application[]> {

    return this.http.get<Application[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/applications/`, {
      withCredentials: true
    });
  }

  /**
   * Gets all facility applications history.
   * @param {number} facility
   * @returns {Observable<any>}
   */
  getFacilityApplicationsHistory(facility: number | string): Observable<Application[]> {

    return this.http.get<Application[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/applications_history/`, {
      withCredentials: true
    });
  }

  /**
   * Get application for facility by id.
   * @param facility self-speaking
   * @param id self-speaking
   */
  getFacilityApplicationById(facility: number | string, id: string): Observable<Application> {

    return this.http.get<Application>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/applications/${id}/detail/`, {
      withCredentials: true
    });
  }

  /**
   * Gets all volumes from a specific facility.
   * @param {number} facility
   * @returns {Observable<any>}
   */
  getFacilityVolumes(facility: number | string, items_per_page: number, current_page: number): Observable<any> {
    const params: HttpParams = new HttpParams().set('items_per_page', items_per_page.toString()).set('page', current_page.toString());

    return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/volumes/`, {
      withCredentials: true,
      params: params
    });
  }

  /**
   * Gets all volumes from a specific facility.
   * @param {number | string} facility
   * @param {number} currentPage
   * @param {number} snapsPerSite
   * @returns {Observable<any>}
   */
  getFacilitySnapshots(facility: number | string, currentPage: number, snapsPerSite: number, filter?: string): Observable<any> {
    let params: HttpParams = new HttpParams().set('page', currentPage.toString()).set('snaps_per_site', snapsPerSite.toString());
    if (filter) {
      params = params.set('filter', filter);
    }

    return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/snapshots/`, {
      withCredentials: true,
      params: params
    });
  }

  /**
   * Gets all facility modification applications which are waiting for conirmation.
   * @param {number} facility
   * @returns {Observable<any>}
   */
  getFacilityModificationApplicationsWaitingForConfirmation(facility: number | string): Observable<Application[]> {
    return this.http.get<Application[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/modification_applications/`, {
      withCredentials: true
    });
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
                            observe: 'response'
                          });
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
      withCredentials: true
    });
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
    const params: HttpParams = new HttpParams().set('type', 'ram')
      .set('ram', ram.toString()).set('factor', factor.toString()).set('description', description);

    return this.http.post<RamFactor[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/ramFactors/`, params, {
      withCredentials: true
    });
  }

  /**
   * Deletes an RamFactor.
   * @param {number | string} facility
   * @param {number | string} factor_id
   * @returns {Observable<RamFactor[]>}
   */
  deleteRamFactor(facility: number | string, factor_id: number | string): Observable<RamFactor[]> {

    return this.http.delete<RamFactor[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/ramFactors/${factor_id}/`, {
      withCredentials: true
    });
  }

  /**
   * Gets the RamFactor for facility with factor_id.
   * @param facility self-speaking
   * @param factor_id self-speaking
   */
  getRamFactor(facility: number | string, factor_id: number | string): Observable<RamFactor> {

    return this.http.get<RamFactor>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/ramFactors/${factor_id}/`, {
      withCredentials: true
    });
  }

  /**
   * Gets the CoreFactor for facility with factor_id.
   * @param facility self-speaking
   * @param factor_id self-speaking
   */
  getCoreFactor(facility: number | string, factor_id: number | string): Observable<CoreFactor> {

    return this.http.get<CoreFactor>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/coreFactors/${factor_id}/`, {
      withCredentials: true
    });
  }

  /**
   * Updates an RamFactor.
   * @param {number | string} facility
   * @param {number | string} factor_id
   * @param factor
   * @returns {Observable<RamFactor[]>}
   */
  updateRamFactor(facility: number | string, factor: RamFactor): Observable<RamFactor> {
    const params: HttpParams = new HttpParams().set('factor', JSON.stringify(factor));

    // tslint:disable-next-line:max-line-length
    return this.http.post<RamFactor>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/ramFactors/${factor.id}/`, params, {
      withCredentials: true
    });
  }

  /**
   * Updates the CoreFactor.
   * @param facility
   * @param factor
   */
  updateCoreFactor(facility: number | string, factor: CoreFactor): Observable<CoreFactor> {
    const params: HttpParams = new HttpParams().set('factor', JSON.stringify(factor));

    // tslint:disable-next-line:max-line-length
    return this.http.post<CoreFactor>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/coreFactors/${factor.id}/`, params, {
      withCredentials: true
    });
  }

  /**
   * Deletes an CoreFactor.
   * @param {number | string} facility
   * @param {number | string} factor_id
   * @returns {Observable<RamFactor[]>}
   */
  deleteCoreFactor(facility: number | string, factor_id: number | string): Observable<CoreFactor[]> {

    return this.http.delete<CoreFactor[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/coreFactors/${factor_id}/`, {
      withCredentials: true
    })
  }

  /**
   * Get CoreFactors from a facility.
   * @param {number | string} facility
   * @returns {Observable<any>}
   */
  getCoreFactors(facility: number | string): Observable<CoreFactor[]> {
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
  getRamFactors(facility: number | string): Observable<RamFactor[]> {
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
      observe: 'response'
    })
  }

  /**
   * Sends an email to all members of the facility.
   * @param facility facility that should be contacted
   * @param subject email subject
   * @param message email message
   * @param project_type which users to email
   * @param reply reply address
   * @param sendNews boolean if news should be send
   * @param alternative_news_text an alternative news text
   * @param news_tags additional tags
   * @returns {Observable<any>}
   */
  sendMailToFacility(facility: string, subject: string, message: string, project_type: string,
                     reply?: string, sendNews?: any, alternative_news_text?: string, tags?: string): Observable<any> {
    const params: HttpParams = new HttpParams()
      .set('subject', subject)
      .set('facility_id', facility)
      .set('message', message)
      .set('reply', reply)
      .set('type', project_type)
      .set('sendNews', sendNews)
      .set('alternative_message', alternative_news_text)
      .set('tags', tags);

    return this.http.post(`${ApiSettings.getApiBaseURL()}facilityManagers/current/facilityMail/`, params, {
                            withCredentials: true,
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
