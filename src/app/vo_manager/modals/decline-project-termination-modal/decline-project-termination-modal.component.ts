import { Component, EventEmitter, Injectable } from '@angular/core'
import { BsModalService } from 'ngx-bootstrap/modal'
import { AbstractBaseModalComponent } from '../../../shared/modal/abstract-base-modal/abstract-base-modal.component'
import { Application } from '../../../applications/application.model/application.model'
import { VoService } from '../../../api-connector/vo.service'
import { NotificationModalComponent } from '../../../shared/modal/notification-modal'

@Injectable({
	providedIn: 'root'
})
@Component({
	selector: 'app-decline-project-termination-modal',
	templateUrl: './decline-project-termination-modal.component.html',
	styleUrl: './decline-project-termination-modal.component.scss'
})
export class DeclineProjectTerminationModalComponent extends AbstractBaseModalComponent {
	application: Application

	constructor(
		protected modalService: BsModalService,
		private voService: VoService,
		private notificationModal: NotificationModalComponent
	) {
		super(modalService)
	}

	showTerminationProjectModal(application: Application): EventEmitter<boolean> {
		const initialState = {
			application
		}

		return this.showBaseModal(DeclineProjectTerminationModalComponent, initialState)
	}

	async declineTermination(): Promise<void> {
		await this.hide()

		this.voService.declineTermination(this.application.project_application_perun_id).subscribe(
			(): void => {
				this.event.emit()
				this.notificationModal.showSuccessFullNotificationModal('Success', 'The termination was successfully declined')
			},
			(): void => {
				this.notificationModal.showDangerNotificationModal('Failed', 'The status change was not successful.')
			}
		)
	}
}
