import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiSettings } from './api-settings.service'

/**
 * Class to get numbers from the api for graphs
 */
@Injectable({
	providedIn: 'root'
})
export class NumbersService {
	private http = inject(HttpClient)

	constructor() {
		const http = this.http

		this.http = http
	}

	getProjectCounterTimeline(): Observable<any> {
		return this.http.get(`${ApiSettings.getApiBase()}public/statistic/projectcounter_timeline/`, {
			withCredentials: true
		})
	}

	getRamCoresTimeline(): Observable<any> {
		return this.http.get(`${ApiSettings.getApiBase()}public/statistic/counter_cores_ram/`, {
			withCredentials: true
		})
	}
}
