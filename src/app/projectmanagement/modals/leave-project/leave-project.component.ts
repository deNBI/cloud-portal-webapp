import { Component, EventEmitter, Injectable } from '@angular/core'
import { BsModalService } from 'ngx-bootstrap/modal'
import { Application } from '../../../applications/application.model/application.model'
import { GroupService } from '../../../api-connector/group.service'
import { FullLayoutComponent } from '../../../layouts/full-layout.component'
import { NotificationModalComponent } from '../../../shared/modal/notification-modal'
import { AbstractBaseModalComponent } from '../../../shared/modal/abstract-base-modal/abstract-base-modal.component'
import { Userinfo } from '../../../userinfo/userinfo.model'
import { CLOUD_PORTAL_SUPPORT_MAIL } from '../../../../links/links'

@Injectable({
	providedIn: 'root'
})
@Component({
	selector: 'app-leave-project',
	templateUrl: './leave-project.component.html',
	styleUrl: './leave-project.component.scss'
})
export class LeaveProjectComponent extends AbstractBaseModalComponent {
	application: Application
	userinfo: Userinfo
	CLOUD_PORTAL_SUPPORT_MAIL: string = CLOUD_PORTAL_SUPPORT_MAIL

	constructor(
		protected modalService: BsModalService,
		private groupService: GroupService,
		private fullLayout: FullLayoutComponent,
		private notificationModalComponent: NotificationModalComponent
	) {
		super(modalService)
	}

	showLeaveProjectModal(application: Application, userinfo: Userinfo): EventEmitter<boolean> {
		const initialState = {
			application,
			userinfo
		}

		return this.showBaseModal(LeaveProjectComponent, initialState)
	}

	async leaveProject(): Promise<void> {
		console.log('leave project')
		console.log(this.modalId)
		await this.hide()

		if (this.application.project_application_pi.elixir_id === this.userinfo.ElixirId) {
			console.log('is pi')
			this.notificationModalComponent.showDangerNotificationModal(
				'Denied',
				`You cannot leave projects as PI. Please contact ${CLOUD_PORTAL_SUPPORT_MAIL} for further steps.`
			)
		} else {
			console.log('leave group')

			this.groupService
				.leaveGroup(
					this.application.project_application_perun_id,
					this.userinfo?.MemberId,
					this.application.project_application_compute_center.FacilityId
				)
				.subscribe(
					(result: any) => {
						switch (result.status) {
							case 200:
								this.fullLayout.getGroupsEnumeration()

								this.notificationModalComponent.showSuccessFullNotificationModal(
									'Success',
									`You were removed from the project ${this.application.project_application_shortname}`,
									'userinfo'
								)

								break
							case 403:
								this.notificationModalComponent.showDangerNotificationModal(
									'Unauthorized',
									'You are not authorized to leave this project.'
								)

								break
							case 500:
								this.notificationModalComponent.showDangerNotificationModal(
									'Server Error',
									'A server error occurred while trying to leave the project. Please try again later.'
								)

								break
							default:
								this.notificationModalComponent.showDangerNotificationModal(
									'Failed',
									`Failed to leave the project ${this.application.project_application_shortname}!`
								)
						}
					},
					error => {
						console.error('Error:', error)
						this.notificationModalComponent.showDangerNotificationModal(
							'Failed',
							`Failed to leave the project ${this.application.project_application_shortname}!`
						)
					}
				)
		}
	}
}
