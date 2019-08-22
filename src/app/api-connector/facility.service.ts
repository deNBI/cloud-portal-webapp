import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service';
import ***REMOVED***Observable***REMOVED*** from 'rxjs';
import ***REMOVED***HttpClient, HttpHeaders, HttpParams***REMOVED*** from '@angular/common/http';
import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';
import ***REMOVED***RamFactor***REMOVED*** from '../facility_manager/resources/ram-factor';
import ***REMOVED***CoreFactor***REMOVED*** from '../facility_manager/resources/core-factor';

const header: HttpHeaders = new HttpHeaders(***REMOVED***
                                              'X-CSRFToken': Cookie.get('csrftoken')
                                            ***REMOVED***);

/**
 * Service which provides methods for the facilities.
 */
@Injectable()
export class FacilityService ***REMOVED***
  constructor(private http: HttpClient) ***REMOVED***
  ***REMOVED***

  /**
   * Get all available computecenters.
   * @returns ***REMOVED***Observable<any>***REMOVED***
   */
  getComputeCenters(): Observable<any> ***REMOVED***

    return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***computecenters/`, ***REMOVED***
      withCredentials: true

    ***REMOVED***)
  ***REMOVED***

  /**
   * Get all facility, where the current user is manager.
   * @returns ***REMOVED***Observable<any>***REMOVED***
   */
  getManagerFacilities(): Observable<any> ***REMOVED***

    return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***facilityManagers/current/facilities/`, ***REMOVED***
      withCredentials: true
    ***REMOVED***)

  ***REMOVED***

  /**
   * Get allowed groups from a facility with a specific status.
   * @param ***REMOVED***number***REMOVED*** facility
   * @param ***REMOVED***number***REMOVED*** status
   * @returns ***REMOVED***Observable<any>***REMOVED***
   */
  getFacilityAllowedGroupsWithDetailsAndSpecificStatus(facility: number | string, status: number): Observable<any> ***REMOVED***

    return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***computecenters/$***REMOVED***facility***REMOVED***/projects/`, ***REMOVED***
      withCredentials: true,
      params: ***REMOVED***status: status.toString()***REMOVED***

    ***REMOVED***)

  ***REMOVED***

  /**
   * Get all resources assigned to a facility.
   * @param ***REMOVED***number***REMOVED*** facility id of the facility
   * @returns ***REMOVED***Observable<any>***REMOVED***
   */
  getFacilityResources(facility: number | string): Observable<any> ***REMOVED***

    return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***computecenters/$***REMOVED***facility***REMOVED***/projects/resources/`, ***REMOVED***
      withCredentials: true

    ***REMOVED***)

  ***REMOVED***



  /**
   * Gets all facility applications which are waiting for conirmation.
   * @param ***REMOVED***number***REMOVED*** facility
   * @returns ***REMOVED***Observable<any>***REMOVED***
   */
  getFacilityApplicationsWaitingForConfirmation(facility: number | string): Observable<any> ***REMOVED***

    return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***computecenters/$***REMOVED***facility***REMOVED***/applications/`, ***REMOVED***
      withCredentials: true

    ***REMOVED***)

  ***REMOVED***

  /**
   * Gets all facility applications history.
   * @param ***REMOVED***number***REMOVED*** facility
   * @returns ***REMOVED***Observable<any>***REMOVED***
   */
  getFacilityApplicationsHistory(facility: number | string): Observable<any> ***REMOVED***

    return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***computecenters/$***REMOVED***facility***REMOVED***/applications_history/`, ***REMOVED***
      withCredentials: true
    ***REMOVED***)

  ***REMOVED***

  /**
   * Gets all facility modification applications which are waiting for conirmation.
   * @param ***REMOVED***number***REMOVED*** facility
   * @returns ***REMOVED***Observable<any>***REMOVED***
   */
  getFacilityModificationApplicationsWaitingForConfirmation(facility: number | string): Observable<any> ***REMOVED***
    return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***computecenters/$***REMOVED***facility***REMOVED***/modification_applications/`, ***REMOVED***
      withCredentials: true

    ***REMOVED***)
  ***REMOVED***

  /**
   * Approves an facility application.
   * @param ***REMOVED***number***REMOVED*** facility
   * @param ***REMOVED***number***REMOVED*** application_id
   * @returns ***REMOVED***Observable<any>***REMOVED***
   */
  approveFacilityApplication(facility: number | string, application_id: number): Observable<any> ***REMOVED***
    const params: HttpParams = new HttpParams().set('action', 'approve');

    return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***computecenters/$***REMOVED***facility***REMOVED***/applications/$***REMOVED***application_id***REMOVED***/status/`, params, ***REMOVED***
      withCredentials: true,
      headers: header,
      observe: 'response'
    ***REMOVED***)
  ***REMOVED***

  /**
   * Add a new CoreFactor.
   * @param ***REMOVED***number | string***REMOVED*** facility
   * @param ***REMOVED***number | string***REMOVED*** cores
   * @param ***REMOVED***number | string***REMOVED*** factor
   * @param ***REMOVED***string***REMOVED*** description
   * @returns ***REMOVED***Observable<any>***REMOVED***
   */
  addCoresFactor(facility: number | string, cores: number | string, factor: number | string, description: string): Observable<CoreFactor[]> ***REMOVED***
    const params: HttpParams = new HttpParams().set('type', 'cores').set('cores', cores.toString()).set('factor', factor.toString()).set('description', description);

    return this.http.post<CoreFactor[]>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***computecenters/$***REMOVED***facility***REMOVED***/resources/coreFactors/`, params, ***REMOVED***
      withCredentials: true,
      headers: header
    ***REMOVED***)
  ***REMOVED***

  /**
   * Add a new RamFactor
   * @param ***REMOVED***number | string***REMOVED*** facility
   * @param ***REMOVED***number | string***REMOVED*** ram
   * @param ***REMOVED***number | string***REMOVED*** factor
   * @param ***REMOVED***string***REMOVED*** description
   * @returns ***REMOVED***Observable<any>***REMOVED***
   */
  addRamFactor(facility: number | string, ram: number | string, factor: number | string, description: string): Observable<RamFactor[]> ***REMOVED***
    const params: HttpParams = new HttpParams().set('type', 'ram').set('ram', ram.toString()).set('factor', factor.toString()).set('description', description);

    return this.http.post<RamFactor[]>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***computecenters/$***REMOVED***facility***REMOVED***/resources/ramFactors/`, params, ***REMOVED***
      withCredentials: true,
      headers: header
    ***REMOVED***)
  ***REMOVED***

  /**
   * Deletes an RamFactor.
   * @param ***REMOVED***number | string***REMOVED*** facility
   * @param ***REMOVED***number | string***REMOVED*** factor_id
   * @returns ***REMOVED***Observable<RamFactor[]>***REMOVED***
   */
  deleteRamFactor(facility: number | string, factor_id: number | string): Observable<RamFactor[]> ***REMOVED***

    return this.http.delete<RamFactor[]>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***computecenters/$***REMOVED***facility***REMOVED***/resources/ramFactors/$***REMOVED***factor_id***REMOVED***/`, ***REMOVED***
      withCredentials: true,
      headers: header
    ***REMOVED***)
  ***REMOVED***

  /**
   * Deletes an CoreFactor.
   * @param ***REMOVED***number | string***REMOVED*** facility
   * @param ***REMOVED***number | string***REMOVED*** factor_id
   * @returns ***REMOVED***Observable<RamFactor[]>***REMOVED***
   */
  deleteCoreFactor(facility: number | string, factor_id: number | string): Observable<CoreFactor[]> ***REMOVED***

    return this.http.delete<CoreFactor[]>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***computecenters/$***REMOVED***facility***REMOVED***/resources/coreFactors/$***REMOVED***factor_id***REMOVED***/`, ***REMOVED***
      withCredentials: true,
      headers: header
    ***REMOVED***)
  ***REMOVED***

  /**
   * Get CoreFactors from a facility.
   * @param ***REMOVED***number | string***REMOVED*** facility
   * @returns ***REMOVED***Observable<any>***REMOVED***
   */
  getCoreFactor(facility: number | string): Observable<CoreFactor[]> ***REMOVED***
    const params: HttpParams = new HttpParams().set('type', 'cores');

    return this.http.get<CoreFactor[]>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***computecenters/$***REMOVED***facility***REMOVED***/resources/coreFactors/`, ***REMOVED***
                                         withCredentials: true,
                                         params: params
                                       ***REMOVED***
    )
  ***REMOVED***

  /**
   * Get Ramactors from a facility.
   * @param ***REMOVED***number | string***REMOVED*** facility
   * @returns ***REMOVED***Observable<any>***REMOVED***
   */
  getRamFactor(facility: number | string): Observable<RamFactor[]> ***REMOVED***
    const params: HttpParams = new HttpParams().set('type', 'ram');

    return this.http.get<RamFactor[]>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***computecenters/$***REMOVED***facility***REMOVED***/resources/ramFactors/`, ***REMOVED***
                                        withCredentials: true,
                                        params: params
                                      ***REMOVED***
    )
  ***REMOVED***

  /**
   * Declines an application for the facility
   * @param ***REMOVED***number***REMOVED*** facility
   * @param ***REMOVED***number***REMOVED*** application_id
   * @returns ***REMOVED***Observable<any>***REMOVED***
   */
  declineFacilityApplication(facility: number, application_id: number): Observable<any> ***REMOVED***
    const params: HttpParams = new HttpParams().set('action', 'decline');

    return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***computecenters/$***REMOVED***facility***REMOVED***/applications/$***REMOVED***application_id***REMOVED***/status/`, params, ***REMOVED***
      withCredentials: true,
      headers: header,
      observe: 'response'
    ***REMOVED***)
  ***REMOVED***

  /**
   * Sends an email to all members of the facility.
   * @param facility facility that should be contacted
   * @param subject email subject
   * @param message email message
   * @param reply reply address
   * @returns ***REMOVED***Observable<any>***REMOVED***
   */
  sendMailToFacility(facility: string, subject: string, message: string, project_type: string, reply?: string): Observable<any> ***REMOVED***
    const params: HttpParams = new HttpParams().set('subject', subject)
      .set('facility_id', facility).set('message', message).set('reply', reply).set('type', project_type);

    return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***facilityManagers/current/facilityMail/`, params, ***REMOVED***
                            withCredentials: true,
                            headers: header,
                            observe: 'response'
                          ***REMOVED***
    )
  ***REMOVED***

  /**
   * Get Members of a project with emails.
   * @param ***REMOVED***number***REMOVED*** groupid id of the group
   * @param ***REMOVED***number***REMOVED*** facility id of the facility
   * @returns ***REMOVED***Observable<any>***REMOVED***
   */
  getFacilityGroupRichMembers(groupid: number, facility: number): Observable<any> ***REMOVED***
    return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***computecenters/$***REMOVED***facility***REMOVED***/projects/$***REMOVED***groupid***REMOVED***/members/`, ***REMOVED***
                           withCredentials: true
                         ***REMOVED***
    )
  ***REMOVED***

***REMOVED***
