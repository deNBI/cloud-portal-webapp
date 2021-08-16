import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiSettings } from './api-settings.service';
import { WordPressNews } from '../facility_manager/newsmanagement/wp-news';
import { WordPressTag } from '../facility_manager/newsmanagement/wp-tags';
import { FacilityNews } from '../facility_manager/newsmanagement/facility-news';

/**
 * Service which provides methods for the facilities.
 */
@Injectable()
export class NewsService {
	constructor(private http: HttpClient) {
		this.http = http;
	}

	updateNewsInWordpress(news: WordPressNews): Observable<any> {
		return this.http.patch(`${ApiSettings.getApiBaseURL()}wp-news-management/`, news, {
			withCredentials: true,
		});
	}

	updateNewsInAPI(news: FacilityNews): Observable<any> {
		return this.http.patch(`${ApiSettings.getApiBaseURL()}facility-news-management/`, news, {
			withCredentials: true,
		});
	}

	addNewsToWordpress(news: WordPressNews): Observable<any> {
		return this.http.post(`${ApiSettings.getApiBaseURL()}wp-news-management/`, news, {
			withCredentials: true,
		});
	}

	addNewsToAPI(news: FacilityNews): Observable<any> {
		return this.http.post(`${ApiSettings.getApiBaseURL()}facility-news-management/`, news, {
			withCredentials: true,
		});
	}

	/** Get existing News from Wordpress from facilites listed in facility_ids
	 *
	 * @param facility_ids string of all facility ids for which we want the news in wp
	 */
	getNewsFromWordPress(facility_ids: string): Observable<Object[]> {
		const params: HttpParams = new HttpParams().set('facility_ids', facility_ids);

		return this.http.get<Object[]>(`${ApiSettings.getApiBaseURL()}wp-news-management/`, {
			withCredentials: true,
			params,
		});
	}

	getFacilityNews(facility_ids: string): Observable<Object[]> {
		const params: HttpParams = new HttpParams().set('facility_ids', facility_ids);

		return this.http.get<Object[]>(`${ApiSettings.getApiBaseURL()}facility-news-management/`, {
			withCredentials: true,
			params,
		});
	}

	/**
	 * Delete existing News from Wordpress by news_id
	 *
	 * @param news_id
	 */
	deleteNewsFromWordpress(news_id: string): Observable<any> {
		const params: HttpParams = new HttpParams()
			.set('news_id', news_id);

		return this.http.delete(`${ApiSettings.getApiBaseURL()}facility-news-management/`, {
			withCredentials: true,
			params,
		});
	}

	deleteNewsFromAPI(news_id: string): Observable<any> {
		const params: HttpParams = new HttpParams()
			.set('news_id', news_id);

		return this.http.delete(`${ApiSettings.getApiBaseURL()}facility-news-management/`, {
			withCredentials: true,
			params,
		});
	}

	getAvailableTagsFromWordPress(): Observable<WordPressTag[]> {
		return this.http.get<WordPressTag[]>(`${ApiSettings.getApiBaseURL()}wp-tags-management/`, {
			withCredentials: true,
		});
	}
}
