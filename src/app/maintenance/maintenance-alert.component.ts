import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { MaintenanceTimeFrame } from '../vo_manager/maintenance/maintenanceTimeFrame.model';
import { MaintenanceService } from '../api-connector/maintenance.service';

@Component({
	selector: 'app-maintenance-alert',
	templateUrl: './maintenance-alert.component.html',
	styleUrls: ['./maintenance-alert.component.scss'],
	providers: [MaintenanceService],
})
export class MaintenanceAlertComponent implements OnInit, OnDestroy {
	subscription: Subscription = new Subscription();
	maintenanceTimeFrames: MaintenanceTimeFrame[];
	frames_loaded: boolean = false;
	error_on_loading: boolean = false;

	constructor(private maintenanceService: MaintenanceService) {
		// eslint-disable-next-line no-empty-function
	}

	ngOnInit(): void {
		this.subscription = new Subscription();
		this.get_timeframes();
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	get_timeframes(): void {
		this.subscription.add(
			this.maintenanceService.getFutureMaintenanceTimeFrames().subscribe({
				next: (mtf: MaintenanceTimeFrame[]) => {
					this.maintenanceTimeFrames = mtf;
					this.error_on_loading = false;
					this.frames_loaded = true;
				},
				error: () => {
					this.error_on_loading = true;
					this.frames_loaded = true;
				},
			}),
		);
	}
}
