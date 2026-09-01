import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiSettings } from './api-settings.service'

@Injectable({
	providedIn: 'root'
})
export class LandingPageService {
	private http = inject(HttpClient)

	getProjectTypeInformation(): Observable<any> {
		return this.http.get<any>(`${ApiSettings.getWagtailBase()}project_types_information/`, {
			withCredentials: true
		})
	}
}
