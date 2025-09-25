import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ApiSettings } from './api-settings.service'
import { MaintenanceTimeFrame } from '../vo_manager/maintenance/maintenanceTimeFrame.model'

/**
 * Service which provides the newest maintenance timeframes, e.g. to show in userInformation
 */
@Injectable({
	providedIn: 'root'
})
export class MaintenanceService {
	constructor(private http: HttpClient) {}

	/**
	 * returns the upcoming maintenance timeframes
	 */
	getFutureMaintenanceTimeFrames(): Observable<MaintenanceTimeFrame[]> {
		return this.http
			.get<MaintenanceTimeFrame[]>(`${ApiSettings.getApiBaseURL()}maintenance/`, {
				withCredentials: true
			})
			.pipe(
				map((maintenanceTimeFrames: MaintenanceTimeFrame[]): MaintenanceTimeFrame[] =>
					maintenanceTimeFrames.map(
						(maintenanceTimeFrame: MaintenanceTimeFrame): MaintenanceTimeFrame =>
							new MaintenanceTimeFrame(maintenanceTimeFrame)
					)
				)
			)
	}

	getNumberOfUnconfirmedTimeFrames(lifescience_id: string): Observable<any> {
		const params: HttpParams = new HttpParams().set('lifescience_id', lifescience_id)

		return this.http.get<any>(`${ApiSettings.getApiBaseURL()}maintenance/confirmable/`, {
			withCredentials: true,
			params
		})
	}

	confirmNote(lifescience_id: string, timeframes: MaintenanceTimeFrame[]): Observable<any> {
		const params: HttpParams = new HttpParams()
			.set('elixilifescience_idr_id', lifescience_id)
			.set('ids', JSON.stringify(timeframes.map((tf: MaintenanceTimeFrame) => tf.id)))

		return this.http.get(`${ApiSettings.getApiBaseURL()}maintenance/confirm/`, {
			withCredentials: true,
			params
		})
	}
}
