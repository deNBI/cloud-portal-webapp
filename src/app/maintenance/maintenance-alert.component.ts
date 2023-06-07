import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { MaintenanceTimeFrame } from '../vo_manager/maintenance/maintenanceTimeFrame.model';
import { MaintenanceService } from '../api-connector/maintenance.service';
import { UserService } from '../api-connector/user.service';

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

	constructor(private maintenanceService: MaintenanceService, private userService: UserService) {
		// eslint-disable-next-line no-empty-function
	}

	ngOnInit(): void {
		this.subscription = new Subscription();
		this.get_timeframes();
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	confirmTakenNote(): void {
		this.subscription.add(
			this.userService.getUserInfo().subscribe(
				(login: any): void => {
					this.maintenanceService.confirmNote(login['ElixirId'], this.maintenanceTimeFrames).subscribe(nxt => {
						console.log(nxt);
					});
				},
				() => {
					console.log('An error occurred');
				},
			),
		);
	}
	get_timeframes(): void {
		this.subscription.add(
			this.maintenanceService.getFutureMaintenanceTimeFrames().subscribe({
				next: (mtf: MaintenanceTimeFrame[]) => {
					this.maintenanceTimeFrames = mtf.sort((a, b) => {
						if (a.start_time < b.start_time) {
							return -1;
						} else if (a.start_time > b.start_time) {
							return 1;
						} else {
							return 0;
						}
					});
					this.error_on_loading = false;
					this.frames_loaded = true;
					console.log(this.maintenanceTimeFrames);
				},
				error: () => {
					this.error_on_loading = true;
					this.frames_loaded = true;
				},
			}),
		);
	}
}
