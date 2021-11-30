import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

	getFacilityNews(facility_ids: string): Observable<FacilityNews[]> {
		const params: HttpParams = new HttpParams().set('facility_ids', facility_ids);

		return this.http.get<FacilityNews[]>(`${ApiSettings.getApiBaseURL()}facility-news-management/`, {
			withCredentials: true,
			params,
		}).pipe(
			map(
				(facilityNewsArray: FacilityNews[]): FacilityNews[] => facilityNewsArray.map(
					(facilityNew: FacilityNews): FacilityNews => new FacilityNews(facilityNew),
				),
			),
		);
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

	getNewsByTags(tags: string[]): void {}

	getNewsByTagsFilteredByFacility(tags: string[], facility: number): void {}

}
