import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiSettings } from './api-settings.service';
import { FacilityNews } from '../facility_manager/newsmanagement/facility-news';
import { News } from '../news/news.model';

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

		return this.http
			.get<FacilityNews[]>(`${ApiSettings.getApiBaseURL()}facility-news-management/`, {
				withCredentials: true,
				params,
			})
			.pipe(
				map((facilityNewsArray: FacilityNews[]): FacilityNews[] => facilityNewsArray.map((facilityNew: FacilityNews): FacilityNews => new FacilityNews(facilityNew))),
			);
	}

	deleteNewsFromAPI(news_id: string): Observable<any> {
		const params: HttpParams = new HttpParams().set('news_id', news_id);

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
		const request_object: { news_id: number; facility_id: number } = { news_id: news, facility_id: facility };

		return this.http.post(`${ApiSettings.getApiBaseURL()}facility-management/`, request_object, {
			withCredentials: true,
		});
	}

	getNewsByTags(numberOfNews: number, tags: string[], facility_ids: number[] = []): Observable<News[]> {
		const params: HttpParams = new HttpParams()
			.set('number_of_news', numberOfNews)
			.set('tags', tags.toString())
			.set('facility_ids', facility_ids.toString());
		let skip_header: HttpHeaders = new HttpHeaders();
		skip_header = skip_header
			.append('skip', 'true')
			.append('Accept', 'application/json')
			.append('Content-Type', 'application/json');

		return this.http
			.get<News[]>(`${ApiSettings.getWagtailBase()}get_news/`, {
				params,
				headers: skip_header,
			})
			.pipe(
				map((news: News[]): News[] => news.map((one_news: News): News => new News(one_news))),
				catchError(this.handleError<News[]>([])),
			);
	}

	getTestimonial(project_application_id: string): Observable<any> {
		const params: HttpParams = new HttpParams().set('project_application_id', project_application_id);

		return this.http.get<any>(`${ApiSettings.getApiBaseURL()}wagtail-management/testimonial/`, {
			params,
			withCredentials: true,
		});
	}

	sendTestimonialDraft(
		title: string,
		text: string,
		excerpt: string,
		contributor: string,
		institution: string,
		workgroup: string,
		simple_vm: boolean,
		image_url: string,
		project_application_id: string,
	): Observable<any> {
		const testimonialData: any = {
			title,
			text,
			excerpt,
			contributor,
			institution,
			workgroup,
			simple_vm,
			image_url,
			project_application_id,
		};

		return this.http.post<any>(`${ApiSettings.getApiBaseURL()}wagtail-management/testimonial/`, testimonialData, {
			withCredentials: true,
		});
	}

	autoSaveTestimonialDraft(
		title: string,
		text: string,
		excerpt: string,
		contributor: string,
		institution: string,
		workgroup: string,
		simple_vm: boolean,
		project_application_id: string,
	): Observable<any> {
		const testimonialData: any = {
			title,
			text,
			excerpt,
			contributor,
			institution,
			workgroup,
			simple_vm,
			project_application_id,
		};

		return this.http.post<any>(
			`${ApiSettings.getApiBaseURL()}wagtail-management/testimonial/autosave/`,
			testimonialData,
			{
				withCredentials: true,
			},
		);
	}

	private handleError<T>(result?: T) {
		return (error: any): Observable<T> => {
			console.error(error); // log to console instead

			// Let the app keep running by returning an empty result.
			return of(result as T);
		};
	}
}
