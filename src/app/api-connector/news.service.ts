import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { SocialConsent } from 'app/shared/shared_modules/testimonial-forms/social-consent.model'
import { ApiSettings } from './api-settings.service'
import { FacilityNews } from '../facility_manager/newsmanagement/facility-news'
import { News } from '../news/news.model'

/**
 * Service which provides methods for the facilities.
 */
@Injectable({
	providedIn: 'root'
})
export class NewsService {
	constructor(private http: HttpClient) {
		this.http = http
	}

	updateFacilityNews(news: FacilityNews): Observable<any> {
		return this.http.patch(`${ApiSettings.getApiBaseURL()}facility-news-management/`, news, {
			withCredentials: true
		})
	}

	addFacilityNews(news: FacilityNews): Observable<any> {
		return this.http.post(`${ApiSettings.getApiBaseURL()}facility-news-management/`, news, {
			withCredentials: true
		})
	}

	getFacilityNews(facility_ids: string): Observable<FacilityNews[]> {
		const params: HttpParams = new HttpParams().set('facility_ids', facility_ids)

		return this.http
			.get<FacilityNews[]>(`${ApiSettings.getApiBaseURL()}facility-news-management/`, {
				withCredentials: true,
				params
			})
			.pipe(
				map((facilityNewsArray: FacilityNews[]): FacilityNews[] =>
					facilityNewsArray.map((facilityNew: FacilityNews): FacilityNews => new FacilityNews(facilityNew))
				)
			)
	}

	deleteNewsFromAPI(news_id: string): Observable<any> {
		const params: HttpParams = new HttpParams().set('news_id', news_id)

		return this.http.delete(`${ApiSettings.getApiBaseURL()}facility-news-management/`, {
			withCredentials: true,
			params
		})
	}

	getFacilitiesFromWagtail(): Observable<object[]> {
		return this.http.get<object[]>(`${ApiSettings.getApiBaseURL()}facility-management/`, {
			withCredentials: true
		})
	}

	updateFacilityMOTD(news: number, facility: number): Observable<any> {
		const request_object: { news_id: number; facility_id: number } = { news_id: news, facility_id: facility }

		return this.http.post(`${ApiSettings.getApiBaseURL()}facility-management/`, request_object, {
			withCredentials: true
		})
	}

	getNewsByTags(numberOfNews: number, tags: string[], facility_ids: number[] = []): Observable<News[]> {
		const params: HttpParams = new HttpParams()
			.set('number_of_news', numberOfNews)
			.set('tags', tags.toString())
			.set('facility_ids', facility_ids.toString())
		let skip_header: HttpHeaders = new HttpHeaders()
		skip_header = skip_header
			.append('skip', 'true')
			.append('Accept', 'application/json')
			.append('Content-Type', 'application/json')

		return this.http
			.get<News[]>(`${ApiSettings.getWagtailBase()}get_news/`, {
				params,
				headers: skip_header
			})
			.pipe(
				map((news: News[]): News[] => news.map((one_news: News): News => new News(one_news))),
				catchError(this.handleError<News[]>([]))
			)
	}

	getTestimonial(project_application_id: string): Observable<any> {
		const params: HttpParams = new HttpParams().set('project_application_id', project_application_id)

		return this.http.get<any>(`${ApiSettings.getApiBaseURL()}wagtail-management/testimonial/`, {
			params,
			withCredentials: true
		})
	}

	getPossibleSocialConsents(): Observable<any> {
		const params: HttpParams = new HttpParams()

		return this.http.get<any>(`${ApiSettings.getApiBaseURL()}wagtail-management/testimonial/social_consents/`, {
			params,
			withCredentials: true
		})
	}

	sendTestimonialDraft(
		title: string,
		text: string,
		excerpt: string,
		contributor: string,
		institution: string,
		workgroup: string,
		project_application_id: string,
		soc_consents: SocialConsent[],
		soc_photo_consents: SocialConsent[],
		file: File
	): Observable<any> {
		const consents_list = soc_consents.map(soc => soc.id)
		const photo_consents_list = soc_photo_consents.map(soc => soc.id)
		const consents = JSON.stringify(consents_list)
		const photo_consents = JSON.stringify(photo_consents_list)
		const formData: FormData = new FormData()
		formData.append('file', file)
		formData.append('title', title)
		formData.append('text', text)
		formData.append('excerpt', excerpt)
		formData.append('contributor', contributor)
		formData.append('institution', institution)
		formData.append('workgroup', workgroup)
		formData.append('project_application_id', project_application_id)
		formData.append('consents', consents)
		formData.append('photo_consents', photo_consents)

		return this.http.post<any>(`${ApiSettings.getApiBaseURL()}wagtail-management/testimonial/`, formData, {
			withCredentials: true
		})
	}

	autoSaveTestimonialDraft(
		title: string,
		text: string,
		excerpt: string,
		contributor: string,
		institution: string,
		workgroup: string,
		project_application_id: string,
		soc_consents: SocialConsent[],
		pho_consents: SocialConsent[]
	): Observable<any> {
		const consents_list = soc_consents.map(soc => soc.id)
		const consents = JSON.stringify(consents_list)
		const photo_consents_list = pho_consents.map(soc => soc.id)
		const photo_consents = JSON.stringify(photo_consents_list)

		const testimonialData: any = {
			title,
			text,
			excerpt,
			contributor,
			institution,
			workgroup,
			project_application_id,
			consents,
			photo_consents
		}

		return this.http.post<any>(
			`${ApiSettings.getApiBaseURL()}wagtail-management/testimonial/autosave/`,
			testimonialData,
			{
				withCredentials: true
			}
		)
	}

	private handleError<T>(result?: T) {
		return (error: any): Observable<T> => {
			console.error(error) // log to console instead

			// Let the app keep running by returning an empty result.
			return of(result)
		}
	}
}
