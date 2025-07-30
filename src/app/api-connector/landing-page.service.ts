import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiSettings } from './api-settings.service'

@Injectable({
	providedIn: 'root'
})
export class LandingPageService {
	constructor(private http: HttpClient) {}

	getProjectTypeInformation(): Observable<any[]> {
		return this.http.get<any[]>(`${ApiSettings.getWagtailBase()}project_types_information/`, {
			withCredentials: true
		})

		// add pipe map and so on
	}
}
