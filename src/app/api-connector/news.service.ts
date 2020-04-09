import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {Injectable} from '@angular/core';
import {ObjectUnsubscribedError, Observable} from 'rxjs';
import {ApiSettings} from './api-settings.service';
import {WordPressNews} from '../facility_manager/newsmanagement/wp-news';

const header: HttpHeaders = new HttpHeaders({
                                              'X-CSRFToken': Cookie.get('csrftoken')
                                            });

/**
 * Service which provides methods for the facilities.
 */
@Injectable()
export class NewsService {
  constructor(private http: HttpClient) {
  }

  updateNewsInWordpress(news: WordPressNews): Observable<any> {
    return this.http.patch(`${ApiSettings.getApiBaseURL()}wp-news-management/`, news, {
      withCredentials: true,
      headers: header
    });
  }

  addNewsToWordpress(news: WordPressNews): Observable<any> {
    return this.http.post(`${ApiSettings.getApiBaseURL()}wp-news-management/`, news, {
      withCredentials: true,
      headers: header
    });
  }

  /** Get existing News from Wordpress from facilites listed in facility_ids
   * @param facility_ids string of all facility ids for which we want the news in wp
   */
  getNewsFromWordPress(facility_ids: string): Observable<any> {
    const params: HttpParams = new HttpParams().set('facility_ids', facility_ids);

    return this.http.get(`${ApiSettings.getApiBaseURL()}wp-news-management/`, {
      withCredentials: true,
      headers: header,
      params: params});
  }

  /**
   * Delete existing News from Wordpress by news_id
   * @param news_id
   */
  deleteNewsFromWordpress(news_id: string): Observable<any> {
    const params: HttpParams = new HttpParams()
      .set('news_id', news_id);

    return this.http.delete(`${ApiSettings.getApiBaseURL()}wp-news-management/`, {
        withCredentials: true,
        headers: header,
        params: params
      }
    )
  }

  getAvailableTagsFromWordPress(): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}wp-tags-management/`, {
      withCredentials: true,
      headers: header
    })
  }
}
