import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { AbstractBaseClass, Application_States } from '../../shared/shared_modules/baseClass/abstract-base-class'
import { ConfirmationActions } from '../../shared/modal/confirmation_actions'
import { Application } from '../application.model/application.model'
import { ApplicationTabStates } from '../../shared/enums/application-tab-states'
import { ApplicationsService } from '../../api-connector/applications.service'
import { is_vo } from '../../shared/globalvar'
import { ComputecenterComponent } from '../../projectmanagement/computecenter.component'
import { User } from '../application.model/user.model'
import { ApplicationDetailComponent } from '../application-detail/application-detail.component'

@Component({
    selector: 'app-application-card',
    templateUrl: './application-card.component.html',
    styleUrl: './application-card.component.scss',
    standalone: false
})
export class ApplicationCardComponent extends AbstractBaseClass implements OnInit {
	@Input() application: Application
	@Input() tabState: ApplicationTabStates = ApplicationTabStates.SUBMITTED
	@Input() computeCenters: ComputecenterComponent[] = []
	@Output() reloadNumbersTrigger: EventEmitter<void> = new EventEmitter()
	@Output() removeApplicationTrigger: EventEmitter<number | string> = new EventEmitter()
	@Input() facilityView: boolean = false
	@Input() voView: boolean = false
	@ViewChild('applicationdetail') applicationDetailComponent: ApplicationDetailComponent

	bsModalRef: BsModalRef
	is_vo_admin: boolean = false

	ngOnInit() {
		this.is_vo_admin = is_vo
		this.getAndSetPiAndUserApplication()
	}

	getAndSetPiAndUserApplication() {
		if (!this.application.project_application_user) {
			this.getAndSetApplicationUser()
		}
		if (!this.application.project_application_pi) {
			this.getAndSetApplicationPi()
		}
	}

	getAndSetApplicationPi() {
		this.applicationsService.getApplicationPI(this.application.project_application_id).subscribe((pi: User) => {
			this.application.project_application_pi = pi
		})
	}

	getAndSetApplicationUser() {
		this.applicationsService.getApplicationUser(this.application.project_application_id).subscribe((user: User) => {
			this.application.project_application_user = user
		})
	}

	constructor(private applicationsService: ApplicationsService) {
		super()
	}

	triggerRemoveApplication() {
		this.removeApplicationTrigger.emit(this.application.project_application_id)
	}

	triggerReloadNumbers() {
		this.reloadNumbersTrigger.emit()
	}

	getApplication(): void {
		this.applicationsService.getApplication(this.application.project_application_id.toString()).subscribe(
			(aj: Application): void => {
				this.application = aj
				this.applicationDetailComponent.loadData()
			},
			(error: any): void => {
				console.log(error)
			}
		)
	}

	switchCollaps() {
		this.isCollapsed = !this.isCollapsed
	}

	isCollapsed: boolean = true
	protected readonly Application_States = Application_States
	protected readonly ConfirmationActions = ConfirmationActions
}
