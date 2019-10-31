import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {IResponseTemplate} from './response-template';
import {Userinfo} from '../userinfo/userinfo.model';

const header: HttpHeaders = new HttpHeaders({
                                              'X-CSRFToken': Cookie.get('csrftoken')
                                            });

/**
 * Service which provides user methods.
 */
@Injectable()
export class UserService {
  constructor(private http: HttpClient) {
  }

  getLoginElixirName(): Observable<IResponseTemplate> {

    return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}users/current/logins/`, {
      withCredentials: true
    })
  }

  getPreferredMailUser(): Observable<IResponseTemplate> {

    return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}users/current/preferredEmail/`, {
      withCredentials: true
    })
  }

  requestChangePreferredMailUser(email: string): Observable<any> {
    const params: HttpParams = new HttpParams().set('newPreferredEmail', email);

    return this.http.post(`${ApiSettings.getApiBaseURL()}users/current/preferredEmail/`, params, {
      withCredentials: true,
      headers: header
    })
  }

  getPendingPreferredMailUser(): Observable<IResponseTemplate> {

    return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}users/current/pendingPreferredEmails/`, {
      withCredentials: true
    })
  }

  getMemberDetailsByElixirId(elixir_id: string): Observable<any> {
    elixir_id = elixir_id.substring(0, elixir_id.indexOf('@'));

    return this.http.get(`${ApiSettings.getApiBaseURL()}users/${elixir_id}/member/`, {
      withCredentials: true

    })

  }

  getUserInfo(): Observable<any> {

    return this.http.get<any>(`${ApiSettings.getApiBaseURL()}users/current/userInfo/`, {
      withCredentials: true

    })
  }

  getLoggedUser(): Observable<any> {
    const params: HttpParams = new HttpParams().set('redirect_after_login', 'redirect');

    return this.http.get(`${ApiSettings.getApiBaseURL()}users/current/`, {
      withCredentials: true,
      params: params

    })
  }

  getOnlyLoggedUserWithRedirect(redirect?: string): Observable<any> {
    if (redirect && redirect !== '/userinfo' && redirect !== 'redirect') {
      const params: HttpParams = new HttpParams().set('redirect_after_login', redirect);

      return this.http.get(`${ApiSettings.getApiBaseURL()}loggedUser/`, {
        withCredentials: true,
        params: params

      })
    } else {
      return this.http.get(`${ApiSettings.getApiBaseURL()}loggedUser/`, {
        withCredentials: true

      })
    }

  }

  getMemberByUser(): Observable<any> {

    return this.http.get(`${ApiSettings.getApiBaseURL()}users/current/member/`, {
      withCredentials: true
    })
  }

  getMemberByExtSourceNameAndExtLogin(ext_login: string): Observable<any> {

    return this.http.get(`${ApiSettings.getApiBaseURL()}users/current/extLogin/member/`, {
      withCredentials: true,
      params: {
        extLogin: ext_login
      }
    })
  }

  setNewsletterSubscriptionWhenSubscribed(): Observable<IResponseTemplate> {
    const params: HttpParams = new HttpParams().set('subscribed', true.toString());

    return this.http.post<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}newsletter/subscription/`, params, {
      withCredentials: true,
      headers: header
    })

  }

  setNewsletterSubscriptionWhenNotSubscribed(): Observable<IResponseTemplate> {
    const params: HttpParams = new HttpParams().set('subscribed', false.toString());

    return this.http.post<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}newsletter/subscription/`, params, {
      withCredentials: true,
      headers: header
    })

  }

  getNewsletterSubscription(): Observable<IResponseTemplate> {

    return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}newsletter/subscription/`, {
      withCredentials: true
    })

  }

  sendHelpMail(subject: string, message: string, reply: string): Observable<IResponseTemplate> {

    const params: HttpParams = new HttpParams().set('subject', subject).set('message', message).set('reply', reply);

    return this.http.post<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}users/current/helpMail/`, params, {
      withCredentials: true,
      headers: header
    })
  }

  getFilteredMembersOfdeNBIVo(searchString: string): Observable<any> {

    return this.http.get(`${ApiSettings.getApiBaseURL()}users/filter/`, {
      withCredentials: true,
      params: {
        searchString: searchString
      }
    })

  }

}
