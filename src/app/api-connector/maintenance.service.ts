import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ApiSettings } from './api-settings.service'
import { MaintenanceTimeFrame } from '../vo_manager/maintenance/maintenanceTimeFrame.model'

/**
 * Service which provides the newest maintenance timeframes, e.g. to show in userInformation
 */
@Injectable()
export class MaintenanceService {
	constructor(private http: HttpClient) {
		this.http = http
	}

	/**
	 * returns the upcoming maintenance timeframes
	 */
	getFutureMaintenanceTimeFrames(): Observable<MaintenanceTimeFrame[]> {
		//TODO adjust timeframe endpoint and add to api
		return this.http
			.get<MaintenanceTimeFrame[]>(`${ApiSettings.getApiBaseURL()}maintenance/`, {
				withCredentials: true,
			})
			.pipe(
				map((timeframes: MaintenanceTimeFrame[]): MaintenanceTimeFrame[] =>
					timeframes.map((timeframe: MaintenanceTimeFrame): MaintenanceTimeFrame => new MaintenanceTimeFrame(timeframe))
				)
			)
	}
}
