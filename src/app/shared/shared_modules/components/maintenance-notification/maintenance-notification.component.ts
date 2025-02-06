import { Component, Input, ViewChild } from '@angular/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { MaintenanceTimeFrame } from '../../../../vo_manager/maintenance/maintenanceTimeFrame.model'

@Component({
	selector: 'app-maintenance-notification',
	templateUrl: './maintenance-notification.component.html',
	styleUrls: ['./maintenance-notification.component.scss'],
	standalone: false
})
export class MaintenanceNotificationComponent {
	@Input() maintenanceTimeframes: MaintenanceTimeFrame[] = []
	@ViewChild('maintenanceModal') maintenanceModal: ModalDirective

	toggleModal(): void {
		this.maintenanceModal.toggle()
	}
}
