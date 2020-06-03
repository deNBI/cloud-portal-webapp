import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {Cookie} from 'ng2-cookies/ng2-cookies';
import {IResponseTemplate} from './response-template';
import {Resources} from '../vo_manager/resources/resources';

const header: HttpHeaders = new HttpHeaders({
                                              'X-CSRFToken': Cookie.get('csrftoken')
                                            });

/**
 * Service which provides vo methods.
 */
@Injectable()
export class VoService {
  constructor(private http: HttpClient) {
  }

  isVo(): Observable<IResponseTemplate> {

    return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}voManagers/current/status/`, {
      withCredentials: true
    })
  }

  getNewsletterSubscriptionCounter(): Observable<IResponseTemplate> {

    return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}newsletter/subscription/counter/`, {
      withCredentials: true

    })
  }

  getAllVoGroups(): Observable<any> {

    return this.http.get(`${ApiSettings.getApiBaseURL()}vo/projects/`, {
      withCredentials: true
    })

  }

  terminateProject(groupId: number | string): Observable<object> {
    return this.http.delete(`${ApiSettings.getApiBaseURL()}vo/projects/${groupId}/`, {
      withCredentials: true
      // headers: header
    })

  }

  getProjectDetails(groupId: number | string): Observable<object> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}vo/projects/${groupId}/details/`, {
      withCredentials: true
      // headers: header
    })

  }

  removeResourceFromGroup(groupid: number | string): Observable<object> {
    return this.http.delete(`${ApiSettings.getApiBaseURL()}vo/projects/${groupid}/resource/`, {
      withCredentials: true
      // headers: header
    })

  }

  resumeProject(groupid: number | string): Observable<object> {
    return this.http.post(`${ApiSettings.getApiBaseURL()}vo/projects/${groupid}/resource/`, null, {
      withCredentials: true
      // headers: header
    })

  }

  getAllGroupsWithDetails(): Observable<any> {

    return this.http.get(`${ApiSettings.getApiBaseURL()}vo/projects/details/`, {
      withCredentials: true
    })

  }

  getProjectStatus(groupid: number | string): Observable<IResponseTemplate> {
    return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}vo/projects/${groupid}/status/`, {
      withCredentials: true
      // headers: header
    })
  }

  getVoProjectResources(): Observable<Resources[]> {
    return this.http.get<Resources[]>(`${ApiSettings.getApiBaseURL()}vo/projects/resources/`, {
      withCredentials: true
      // headers: header
    })
  }

  getVoProjectResourcesTimeframes(): Observable<Resources[]> {
    return this.http.get<Resources[]>(`${ApiSettings.getApiBaseURL()}vo/projects/resources/timeFrames/`, {
      withCredentials: true
      // headers: header
    })
  }

  getVoProjectDates(): Observable<Resources[]> {
    return this.http.get<Resources[]>(`${ApiSettings.getApiBaseURL()}vo/projects/dates/`, {
      withCredentials: true
      // headers: header
    })
  }

  getVoProjectCounter(): Observable<Resources[]> {
    return this.http.get<Resources[]>(`${ApiSettings.getApiBaseURL()}vo/projects/counter/`, {
      withCredentials: true
      // headers: header
    })
  }

  setProjectStatus(groupid: number | string, status: number): Observable<any> {
    const params: HttpParams = new HttpParams().set('status', status.toString());

    return this.http.post(`${ApiSettings.getApiBaseURL()}vo/projects/${groupid}/status/`, params, {
      withCredentials: true
      // headers: header
    })
  }

  sendNewsletterToVo(subject: string, message: string, type: string, reply?: string): Observable<IResponseTemplate> {

    const params: HttpParams = new HttpParams().set('subject', subject).set('message', message).set('reply', reply).set('type', type);

    return this.http.post<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}voManagers/current/newsletter/`, params, {
      withCredentials: true
      // headers: header
    })

  }

  sendMailToVo(subject: string, message: string, facility: string, type: string, reply?: string): Observable<any> {
    const params: HttpParams = new HttpParams()
      .set('subject', subject).set('message', message)
      .set('reply', reply).set('facility', facility).set('type', type);

    return this.http.post<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}voManagers/current/voMail/`, params, {
      withCredentials: true
      // headers: header
    })

  }

  /**
   * Get members of a project with emails.
   * @param {number} groupid id of the the group
   * @returns {Observable<any>}
   */
  getVoGroupRichMembers(groupid: number | string): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}vo/projects/${groupid}/members/`, {
      withCredentials: true
    })
  }

}
