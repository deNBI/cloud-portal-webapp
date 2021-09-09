import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiSettings } from './api-settings.service';
import { FacilityNews } from '../facility_manager/newsmanagement/facility-news';

/**
 * Service which provides methods for the facilities.
 */
@Injectable()
export class NewsService {
	constructor(private http: HttpClient) {
		this.http = http;
	}

	updateFacilityNews(news: FacilityNews): Observable<any> {
		return this.http.patch(`${ApiSettings.getApiBaseURL()}facility-news-management/`, news, {
			withCredentials: true,
		});
	}

	addFacilityNews(news: FacilityNews): Observable<any> {
		return this.http.post(`${ApiSettings.getApiBaseURL()}facility-news-management/`, news, {
			withCredentials: true,
		});
	}

	getFacilityNews(facility_ids: string): Observable<Object[]> {
		const params: HttpParams = new HttpParams().set('facility_ids', facility_ids);

		return this.http.get<Object[]>(`${ApiSettings.getApiBaseURL()}facility-news-management/`, {
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

	getFacilitiesFromWagtail(): Observable<Object[]> {
		return this.http.get<Object[]>(`${ApiSettings.getApiBaseURL()}facility-management/`, {
			withCredentials: true,
		});
	}

	updateFacilityMOTD(news: number, facility: number): Observable<any> {
		const request_object: { news_id: number, facility_id: number} = { news_id: news, facility_id: facility };

		return this.http.post(`${ApiSettings.getApiBaseURL()}facility-management/`, request_object, {
			withCredentials: true,
		});
	}

}
