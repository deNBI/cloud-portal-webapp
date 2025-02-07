import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core'
import { Application } from '../application.model/application.model'
import { ApplicationBaseClassComponent } from '../../shared/shared_modules/baseClass/application-base-class.component'
import { ApplicationsService } from '../../api-connector/applications.service'
import { UserService } from '../../api-connector/user.service'
import { FacilityService } from '../../api-connector/facility.service'
import { is_vo } from '../../shared/globalvar'
import { CreditsService } from '../../api-connector/credits.service'
import { Application_States } from '../../shared/shared_modules/baseClass/abstract-base-class'
import { User } from '../application.model/user.model'
import { NotificationModalComponent } from '../../shared/modal/notification-modal'
import { NgClass, NgIf } from '@angular/common'
import { ApplicationPiDetailComponent } from './application-pi-detail/application-pi-detail.component'
import { InformationDetailComponent } from './information-detail/information-detail.component'
import { ResourceDetailComponent } from './resource-detail/resource-detail.component'
import { CreditsExtensionDetailComponent } from './credits-extension-detail/credits-extension-detail.component'
import { LifetimeExtensionDetailComponent } from './lifetime-extension-detail/lifetime-extension-detail.component'
import { AdjustmentDetailComponent } from './adjustment-detail/adjustment-detail.component'
import { HasstatusinlistPipe } from '../../pipe-module/pipes/hasstatusinlist.pipe'

/**
 * Class which displays the details of an application.
 */
@Component({
	selector: 'app-application-detail',
	templateUrl: './application-detail.component.html',
	styleUrls: ['./application-detail.component.scss'],
	providers: [FacilityService, UserService, ApplicationsService, CreditsService],
	imports: [
		NgClass,
		NgIf,
		ApplicationPiDetailComponent,
		InformationDetailComponent,
		ResourceDetailComponent,
		CreditsExtensionDetailComponent,
		LifetimeExtensionDetailComponent,
		AdjustmentDetailComponent,
		HasstatusinlistPipe
	]
})
export class ApplicationDetailComponent extends ApplicationBaseClassComponent implements OnInit {
	PI_USER_TAB: number = 0
	INFORMATION_TAB: number = 1
	RESOURCE_TAB: number = 2
	CREDITS_TAB: number = 3
	MODIFICATION_TAB: number = 4
	EXTENSION_TAB: number = 5
	COMMENT_TAB: number = 6
	MODIFICATION_COMMENT_TAB: number = 7
	LIFETIME_COMMENT_TAB: number = 8
	PI_USER_TAB_ACTIVE: boolean = true
	INFORMATION_TAB_ACTIVE: boolean = false
	RESOURCE_TAB_ACTIVE: boolean = false
	CREDITS_TAB_ACTIVE: boolean = false
	MODIFICATION_TAB_ACTIVE: boolean = false
	EXTENSION_TAB_ACTIVE: boolean = false
	COMMENT_TAB_ACTIVE: boolean = false
	MODIFICATION_COMMENT_TAB_ACTIVE: boolean = false
	LIFETIME_COMMENT_TAB_ACTIVE: boolean = false
	@Input() application: Application
	@Input() default_tab: number = this.PI_USER_TAB

	creditsService: CreditsService
	is_vo_admin: boolean = false
	current_credits: number = 0
	Application_States: typeof Application_States = Application_States

	setAllTabsFalse(): void {
		this.PI_USER_TAB_ACTIVE = false
		this.INFORMATION_TAB_ACTIVE = false
		this.RESOURCE_TAB_ACTIVE = false
		this.CREDITS_TAB_ACTIVE = false
		this.MODIFICATION_TAB_ACTIVE = false
		this.EXTENSION_TAB_ACTIVE = false
		this.COMMENT_TAB_ACTIVE = false
		this.MODIFICATION_COMMENT_TAB_ACTIVE = false
		this.LIFETIME_COMMENT_TAB_ACTIVE = false
	}

	setTab(tab_num: number): void {
		this.setAllTabsFalse()
		console.log(tab_num)
		switch (tab_num) {
			case this.PI_USER_TAB:
				this.PI_USER_TAB_ACTIVE = true
				break
			case this.INFORMATION_TAB:
				this.INFORMATION_TAB_ACTIVE = true
				break
			case this.RESOURCE_TAB:
				this.RESOURCE_TAB_ACTIVE = true
				break
			case this.CREDITS_TAB:
				this.CREDITS_TAB_ACTIVE = true
				break
			case this.MODIFICATION_TAB:
				this.MODIFICATION_TAB_ACTIVE = true
				break
			case this.EXTENSION_TAB:
				this.EXTENSION_TAB_ACTIVE = true
				break
			case this.COMMENT_TAB:
				this.COMMENT_TAB_ACTIVE = true
				break
			case this.LIFETIME_COMMENT_TAB:
				this.LIFETIME_COMMENT_TAB_ACTIVE = true
				break
			case this.MODIFICATION_COMMENT_TAB:
				this.MODIFICATION_COMMENT_TAB_ACTIVE = true
				break
			default:
				break
		}
	}

	constructor(
		applicationsService: ApplicationsService,
		userService: UserService,
		facilityService: FacilityService,
		cdrRef: ChangeDetectorRef,
		notificationModal: NotificationModalComponent
	) {
		super(userService, applicationsService, facilityService, notificationModal, cdrRef)
	}

	ngOnInit(): void {
		this.setTab(this.default_tab)

		this.loadData()
		this.is_vo_admin = is_vo
	}

	loadData() {
		this.getPi()
		this.getUser()
		if (this.application.credits_allowed) {
			this.getCurrentCredits()
		}
	}

	getUser() {
		if (!this.application.project_application_user) {
			this.applicationsService.getApplicationUser(this.application.project_application_id).subscribe((user: User) => {
				this.application.project_application_user = user
			})
		}
	}

	getPi() {
		if (!this.application.project_application_pi.email) {
			this.applicationsService.getApplicationPI(this.application.project_application_id).subscribe((pi: User) => {
				this.application.project_application_pi = pi
			})
		}
	}

	getCurrentCredits(): void {
		this.creditsService
			.getCurrentCreditsOfProject(Number(this.application.project_application_perun_id.toString()))
			.toPromise()
			.then((credits: number): void => {
				this.current_credits = credits
			})
			.catch((err: Error): void => console.log(err.message))
	}
}
