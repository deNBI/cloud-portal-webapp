import { Component, EventEmitter, Injectable, OnInit } from '@angular/core'
import { AbstractBaseModalComponent } from '../../../shared/modal/abstract-base-modal/abstract-base-modal.component'
import { BsModalService } from 'ngx-bootstrap/modal'
import { ProjectMemberApplication } from '../../project_member_application'
import moment from 'moment/moment'
import { Application } from '../../../applications/application.model/application.model'
import { GroupService } from '../../../api-connector/group.service'

@Injectable({
	providedIn: 'root'
})
@Component({
    selector: 'app-user-applications-modal',
    templateUrl: './user-applications-modal.component.html',
    styleUrl: './user-applications-modal.component.scss',
    standalone: false
})
export class UserApplicationsModalComponent extends AbstractBaseModalComponent implements OnInit {
	application: Application
	memberApplicationsLoaded: boolean
	application_action_done: boolean
	application_action_success: boolean
	application_action_error_message: string
	application_action: string
	application_member_name: string

	constructor(
		protected modalService: BsModalService,
		private groupService: GroupService
	) {
		super(modalService)
	}

	ngOnInit() {
		this.getUserProjectApplications()
	}

	showAddUserApplicationModal(application: Application): EventEmitter<boolean> {
		const initialState = {
			application
		}

		return this.showBaseModal(UserApplicationsModalComponent, initialState)
	}

	getUserProjectApplications(): void {
		if (this.application.isApproved() && this.application.project_application_perun_id) {
			this.memberApplicationsLoaded = false
			this.groupService
				.getGroupApplications(this.application.project_application_perun_id)
				.subscribe((applications: any): void => {
					const newProjectApplications: ProjectMemberApplication[] = []
					if (applications.length === 0) {
						this.application.project_application_member_applications = []

						this.memberApplicationsLoaded = true
					}
					for (const application of applications) {
						const dateApplicationCreated: moment.Moment = moment(application['createdAt'], 'YYYY-MM-DD HH:mm:ss.SSS')
						const membername: string = application['displayName']

						const newMemberApplication: ProjectMemberApplication = new ProjectMemberApplication(
							application['id'],
							membername,
							`${dateApplicationCreated.date()}.${dateApplicationCreated.month() + 1}.${dateApplicationCreated.year()}`
						)
						newProjectApplications.push(newMemberApplication)
						this.application.project_application_member_applications = newProjectApplications
						this.memberApplicationsLoaded = true
					}
				})
		}
	}

	approveMemberApplication(application: number, membername: string): void {
		this.memberApplicationsLoaded = false
		this.application_action_done = false
		this.groupService
			.approveGroupApplication(Number(this.application.project_application_perun_id), application)
			.subscribe((tmp_application: any): void => {
				if (tmp_application['state'] === 'APPROVED') {
					this.application_action_success = true
				} else if (tmp_application['message']) {
					this.application_action_success = false

					this.application_action_error_message = tmp_application['message']
				} else {
					this.application_action_success = false
				}

				this.application_action = 'approved'
				this.application_member_name = membername
				this.application_action_done = true
				this.getUserProjectApplications()
				this.event.emit()
			})
	}

	rejectMemberApplication(application: number, membername: string): void {
		this.application_action_done = false
		this.groupService
			.rejectGroupApplication(Number(this.application.project_application_perun_id), application)
			.subscribe((tmp_application: any): void => {
				this.application.project_application_member_applications = []

				if (tmp_application['state'] === 'REJECTED') {
					this.application_action_success = true
				} else if (tmp_application['message']) {
					this.application_action_success = false

					this.application_action_error_message = tmp_application['message']
				} else {
					this.application_action_success = false
				}
				this.application_action = 'rejected'
				this.application_member_name = membername
				this.application_action_done = true
				this.getUserProjectApplications()
				this.event.emit()
			})
	}
}
