import { Component, EventEmitter, Injectable } from '@angular/core'
import { BsModalService } from 'ngx-bootstrap/modal'

import { Application } from '../../../applications/application.model/application.model'

import { AbstractBaseModalComponent } from '../../../shared/modal/abstract-base-modal/abstract-base-modal.component'
import { VoService } from '../../../api-connector/vo.service'
import { NotificationModalComponent } from '../../../shared/modal/notification-modal'
import { NgIf } from '@angular/common'
import { ProjectOsDetailsComponent } from '../../../projectmanagement/project-os-details/project-os-details.component'

@Injectable({
	providedIn: 'root'
})
@Component({
	selector: 'app-terminate-project-modal',
	templateUrl: './terminate-project-modal.component.html',
	styleUrl: './terminate-project-modal.component.scss',
	imports: [NgIf, ProjectOsDetailsComponent]
})
export class TerminateProjectModalComponent extends AbstractBaseModalComponent {
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

		return this.showBaseModal(TerminateProjectModalComponent, initialState)
	}

	async terminateProject(): Promise<void> {
		await this.hide()

		this.voService.terminateProject(this.application.project_application_perun_id).subscribe(
			(): void => {
				if (this.application.project_application_openstack_project) {
					this.notificationModal.showSuccessFullNotificationModal(
						'Success',
						'The request to terminate the project was forwarded to the facility manager.'
					)
				} else {
					this.notificationModal.showSuccessFullNotificationModal('Success', 'The  project was terminated.')
				}
				this.event.emit()
			},
			(error: any): void => {
				if (error['status'] === 409) {
					this.notificationModal.showDangerNotificationModal(
						'Failed',
						`The project could not be terminated. Reason: ${error['error']['reason']} for ${error['error']['openstackid']}`
					)
				} else {
					this.notificationModal.showDangerNotificationModal('Failed', 'The project could not be terminated.')
				}
			}
		)
	}
}
