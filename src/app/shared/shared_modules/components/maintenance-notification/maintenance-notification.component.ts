import { Component, Input, ViewChild } from '@angular/core'
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal'
import { MaintenanceTimeFrame } from '../../../../vo_manager/maintenance/maintenanceTimeFrame.model'
import { NgIf, NgClass, NgFor, DatePipe } from '@angular/common';
import { SignificancePipe } from './significance-pipe/significance.pipe';

@Component({
    selector: 'app-maintenance-notification',
    templateUrl: './maintenance-notification.component.html',
    styleUrls: ['./maintenance-notification.component.scss'],
    imports: [NgIf, NgClass, ModalModule, NgFor, DatePipe, SignificancePipe]
})
export class MaintenanceNotificationComponent {
	@Input() maintenanceTimeframes: MaintenanceTimeFrame[] = []
	@ViewChild('maintenanceModal') maintenanceModal: ModalDirective

	toggleModal(): void {
		this.maintenanceModal.toggle()
	}
}
