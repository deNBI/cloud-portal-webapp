import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service';
import ***REMOVED***Observable***REMOVED*** from 'rxjs';
import ***REMOVED***HttpClient, HttpHeaders, HttpParams***REMOVED*** from '@angular/common/http';

import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';
import ***REMOVED***IResponseTemplate***REMOVED*** from './response-template';
import ***REMOVED***Resources***REMOVED*** from '../vo_manager/resources/resources';

const header: HttpHeaders = new HttpHeaders(***REMOVED***
                                              'X-CSRFToken': Cookie.get('csrftoken')
                                            ***REMOVED***);

/**
 * Service which provides vo methods.
 */
@Injectable()
export class VoService ***REMOVED***
  constructor(private http: HttpClient) ***REMOVED***
  ***REMOVED***

  isVo(): Observable<IResponseTemplate> ***REMOVED***

    return this.http.get<IResponseTemplate>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***voManagers/current/status/`, ***REMOVED***
      withCredentials: true
    ***REMOVED***)
  ***REMOVED***

  getNewsletterSubscriptionCounter(): Observable<IResponseTemplate> ***REMOVED***

    return this.http.get<IResponseTemplate>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***newsletter/subscription/counter/`, ***REMOVED***
      withCredentials: true

    ***REMOVED***)
  ***REMOVED***

  getAllVoGroups(): Observable<any> ***REMOVED***

    return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***vo/projects/`, ***REMOVED***
      withCredentials: true
    ***REMOVED***)

  ***REMOVED***

  removeResourceFromGroup(groupid: number | string): Observable<object> ***REMOVED***
    return this.http.delete(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***vo/projects/$***REMOVED***groupid***REMOVED***/resource/`, ***REMOVED***
      withCredentials: true,
      headers: header
    ***REMOVED***)

  ***REMOVED***

  getAllGroupsWithDetails(): Observable<any> ***REMOVED***

    return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***vo/projects/details/`, ***REMOVED***
      withCredentials: true
    ***REMOVED***)

  ***REMOVED***

  getProjectStatus(groupid: number | string): Observable<IResponseTemplate> ***REMOVED***
    return this.http.get<IResponseTemplate>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***vo/projects/$***REMOVED***groupid***REMOVED***/status/`, ***REMOVED***
      withCredentials: true,
      headers: header
    ***REMOVED***)
  ***REMOVED***

  getVoProjectResources(): Observable<Resources[]> ***REMOVED***
    return this.http.get<Resources[]>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***vo/projects/resources/`, ***REMOVED***
      withCredentials: true,
      headers: header
    ***REMOVED***)
  ***REMOVED***

  getVoProjectResourcesTimeframes(): Observable<Resources[]> ***REMOVED***
    return this.http.get<Resources[]>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***vo/projects/resources/timeFrames/`, ***REMOVED***
      withCredentials: true,
      headers: header
    ***REMOVED***)
  ***REMOVED***

  getVoProjectDates(): Observable<Resources[]> ***REMOVED***
    return this.http.get<Resources[]>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***vo/projects/dates/`, ***REMOVED***
      withCredentials: true,
      headers: header
    ***REMOVED***)
  ***REMOVED***

  getVoProjectCounter(): Observable<Resources[]> ***REMOVED***
    return this.http.get<Resources[]>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***vo/projects/counter/`, ***REMOVED***
      withCredentials: true,
      headers: header
    ***REMOVED***)
  ***REMOVED***

  setProjectStatus(groupid: number | string, status: number): Observable<any> ***REMOVED***
    const params: HttpParams = new HttpParams().set('status', status.toString());

    return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***vo/projects/$***REMOVED***groupid***REMOVED***/status/`, params, ***REMOVED***
      withCredentials: true,
      headers: header
    ***REMOVED***)
  ***REMOVED***

  sendNewsletterToVo(subject: string, message: string, reply?: string): Observable<IResponseTemplate> ***REMOVED***

    const params: HttpParams = new HttpParams().set('subject', subject).set('message', message).set('reply', reply);

    return this.http.post<IResponseTemplate>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***voManagers/current/newsletter/`, params, ***REMOVED***
      withCredentials: true,
      headers: header
    ***REMOVED***)

  ***REMOVED***

  sendMailToVo(subject: string, message: string, facility: string, type: string, reply?: string): Observable<any> ***REMOVED***
    const params: HttpParams = new HttpParams()
      .set('subject', subject).set('message', message)
      .set('reply', reply).set('facility', facility).set('type', type);

    return this.http.post<IResponseTemplate>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***voManagers/current/voMail/`, params, ***REMOVED***
      withCredentials: true,
      headers: header
    ***REMOVED***)

  ***REMOVED***

  /**
   * Get members of a project with emails.
   * @param ***REMOVED***number***REMOVED*** groupid id of the the group
   * @returns ***REMOVED***Observable<any>***REMOVED***
   */
  getVoGroupRichMembers(groupid: number | string): Observable<any> ***REMOVED***
    return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***vo/projects/$***REMOVED***groupid***REMOVED***/members/`, ***REMOVED***
      withCredentials: true
    ***REMOVED***)
  ***REMOVED***

***REMOVED***
