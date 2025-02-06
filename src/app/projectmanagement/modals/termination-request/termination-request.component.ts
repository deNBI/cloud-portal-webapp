import { Component, EventEmitter, Injectable } from '@angular/core'
import { BsModalService } from 'ngx-bootstrap/modal'

import { Application } from '../../../applications/application.model/application.model'
import { GroupService } from '../../../api-connector/group.service'
import { FullLayoutComponent } from '../../../layouts/full-layout.component'
import { NotificationModalComponent } from '../../../shared/modal/notification-modal'
import { AbstractBaseModalComponent } from '../../../shared/modal/abstract-base-modal/abstract-base-modal.component'
import { ProjectOsDetailsComponent } from '../../project-os-details/project-os-details.component';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Injectable({
	providedIn: 'root'
})
@Component({
    selector: 'app-termination-request',
    templateUrl: './termination-request.component.html',
    styleUrl: './termination-request.component.scss',
    imports: [ProjectOsDetailsComponent, NgClass, FormsModule]
})
export class TerminationRequestComponent extends AbstractBaseModalComponent {
	application: Application
	terminate_confirmation_given: boolean = false

	constructor(
		protected modalService: BsModalService,
		private groupService: GroupService,
		private fullLayout: FullLayoutComponent,
		private notificationModalComponent: NotificationModalComponent
	) {
		super(modalService)
	}

	showTerminationRequestModal(application: Application): EventEmitter<boolean> {
		const initialState = {
			application
		}

		return this.showBaseModal(TerminationRequestComponent, initialState)
	}

	async requestProjectTermination(): Promise<void> {
		await this.hide()
		this.notificationModalComponent.showInfoNotificationModal('Waiting', 'Termination request will be submitted...')
		this.groupService.requestProjectTermination(this.application.project_application_perun_id).subscribe((): void => {
			this.fullLayout.getGroupsEnumeration()
			this.notificationModalComponent.showSuccessFullNotificationModal('Success', 'Termination was requested!')
			this.event.emit()
		})
	}
}
