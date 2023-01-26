import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiSettings } from './api-settings.service';
import { MaintenanceTimeFrame } from '../vo_manager/maintenance/maintenanceTimeFrame.model';

/**
 * Service which provides the newest maintenance timeframes, e.g. to show in userInformation
 */
@Injectable()
export class MaintenanceService {
	constructor(private http: HttpClient) {
		this.http = http;
	}

	/**
	 * returns the upcoming maintenance timeframes
	 */
	getFutureMaintenanceTimeFrames(): Observable<MaintenanceTimeFrame[]> {
		return this.http
			.get<MaintenanceTimeFrame[]>(`${ApiSettings.getApiBaseURL()}maintenance/`, {
				withCredentials: true,
			})
			.pipe(
				map((maintenanceTimeFrames: MaintenanceTimeFrame[]): MaintenanceTimeFrame[] => maintenanceTimeFrames.map(
					(maintenanceTimeFrame: MaintenanceTimeFrame): MaintenanceTimeFrame => new MaintenanceTimeFrame(maintenanceTimeFrame),
				)),
			);
	}
}
