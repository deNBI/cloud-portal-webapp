import { Component, EventEmitter, Injectable } from '@angular/core'
import { BsModalService } from 'ngx-bootstrap/modal'
import { AbstractBaseModalComponent } from '../../../shared/modal/abstract-base-modal/abstract-base-modal.component'
import { Application } from '../../../applications/application.model/application.model'

import { FullLayoutComponent } from '../../../layouts/full-layout.component'
import { NotificationModalComponent } from '../../../shared/modal/notification-modal'
import { ApplicationsService } from '../../../api-connector/applications.service'

@Injectable({
	providedIn: 'root'
})
@Component({
    selector: 'app-delete-member-application-modal',
    templateUrl: './delete-application-modal.component.html'
})
export class DeleteApplicationModal extends AbstractBaseModalComponent {
	application: Application

	constructor(
		protected modalService: BsModalService,
		private notificationModalComponent: NotificationModalComponent,
		private applicationsService: ApplicationsService,
		private fullLayout: FullLayoutComponent
	) {
		super(modalService)
	}

	showDeleteApplicationModal(application: Application): EventEmitter<boolean> {
		const initialState = {
			application
		}

		return this.showBaseModal(DeleteApplicationModal, initialState)
	}

	async deleteApplication(): Promise<void> {
		await this.hide()

		this.applicationsService.deleteApplication(this.application.project_application_id).subscribe(
			(): void => {
				this.notificationModalComponent.showSuccessFullNotificationModal(
					'Success',
					'The application has been successfully removed',
					'userinfo'
				)
				this.fullLayout.getGroupsEnumeration()
			},
			(): void => {
				this.notificationModalComponent.showDangerNotificationModal('Failed', 'Application could not be removed!')
			}
		)
	}
}
