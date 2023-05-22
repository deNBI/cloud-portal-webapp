import { Component, Input } from '@angular/core';
import { MaintenanceTimeFrame } from '../../../../vo_manager/maintenance/maintenanceTimeFrame.model';

@Component({
	selector: 'app-maintenance-notification',
	templateUrl: './maintenance-notification.component.html',
	styleUrls: ['./maintenance-notification.component.scss'],
})
export class MaintenanceNotificationComponent {
	@Input() urgentMaintenances: MaintenanceTimeFrame[] = [];

	constructor() {
		this.urgentMaintenances.push(
			new MaintenanceTimeFrame({
				id: '123',
				name: 'test',
				start_time: new Date(),
				end_time: new Date(),
				message: 'Lets show something!',
			}),
		);
		//
	}
}
