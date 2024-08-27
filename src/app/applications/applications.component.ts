import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { Subscription } from 'rxjs'

import { ApplicationsService } from '../api-connector/applications.service'
import { ApiSettings } from '../api-connector/api-settings.service'
import { Application } from './application.model/application.model'
import { GroupService } from '../api-connector/group.service'
import { UserService } from '../api-connector/user.service'
import { VoService } from '../api-connector/vo.service'
import { FacilityService } from '../api-connector/facility.service'
import { Flavor } from '../virtualmachines/virtualmachinemodels/flavor'
import { FlavorService } from '../api-connector/flavor.service'
import { Client } from '../vo_manager/clients/client.model'
import { ApplicationBaseClassComponent } from '../shared/shared_modules/baseClass/application-base-class.component'
import { ComputecenterComponent } from '../projectmanagement/computecenter.component'
import { is_vo } from '../shared/globalvar'
import { Application_States } from '../shared/shared_modules/baseClass/abstract-base-class'
import { FlavorType } from '../virtualmachines/virtualmachinemodels/flavorType'
import { CreditsService } from '../api-connector/credits.service'
import { NotificationModalComponent } from '../shared/modal/notification-modal'
import { ConfirmationActions } from '../shared/modal/confirmation_actions'
import { ApplicationTabStates } from '../shared/enums/application-tab-states'

/**
 * Application Overview component.
 */
@Component({
	selector: 'app-applications-list',
	templateUrl: 'applications.component.html',
	providers: [
		FacilityService,
		VoService,
		UserService,
		GroupService,
		ApplicationsService,
		ApiSettings,
		FlavorService,
		CreditsService
	]
})
export class ApplicationsComponent extends ApplicationBaseClassComponent implements OnInit, OnDestroy {
	title: string = 'Application Overview'
	tab_state: number = ApplicationTabStates.SUBMITTED
	ApplicationTabStates: typeof ApplicationTabStates = ApplicationTabStates
	ConfirmationActions = ConfirmationActions

	loading_applications: boolean = false
	bsModalRef: BsModalRef
	subscription: Subscription = new Subscription()

	/**
	 * All Applications, just visible for a vo admin.
	 *
	 * @type {Array}
	 */
	all_applications: Application[] = []
	selectedApplication: Application
	applications_history: Application[] = []

	/**
	 * Limits information for Client tested/used for Simple Vm Project creation.
	 */
	notificationClientInfo: Client[] = []

	numberOfExtensionRequests: number = 0
	numberOfModificationRequests: number = 0
	numberOfCreditRequests: number = 0
	numberOfProjectApplications: number = 0
	Application_States: typeof Application_States = Application_States

	/**
	 * Constructor.
	 * Loads all Applications if user is vo admin and all user_applications.
	 *
	 * @param applicationsService
	 * @param userService
	 * @param groupservice
	 * @param modalService
	 * @param facilityService
	 * @param flavorService
	 */
	constructor(
		applicationsService: ApplicationsService,
		userService: UserService,
		private groupservice: GroupService,
		private modalService: BsModalService,
		facilityService: FacilityService,
		private flavorService: FlavorService,
		cdrRef: ChangeDetectorRef
	) {
		super(userService, applicationsService, facilityService, cdrRef)
	}

	ngOnDestroy() {
		this.subscription.unsubscribe()
	}

	ngOnInit(): void {
		this.is_vo_admin = is_vo
		if (this.is_vo_admin) {
			this.getApplicationNumbers()

			this.getSubmittedApplicationsAdmin()
			this.getApplicationHistory()
			this.getComputeCenters()
			this.flavorService.getListOfFlavorsAvailable(undefined, undefined, true).subscribe((flavList: Flavor[]): void => {
				this.flavorList = flavList
			})
			this.flavorService.getListOfTypesAvailable().subscribe((availableTypes: FlavorType[]): void => {
				this.typeList = availableTypes
			})
		} else {
			this.isLoaded = true
		}
	}

	/**
	 * Getting the current numbers of all Application-Request types from the API
	 */
	getApplicationNumbers(): void {
		console.log('rload numbers 3')
		this.applicationsService.getExtensionRequestsCounter().subscribe((result: any): void => {
			this.numberOfCreditRequests = result['credits_extension_requests_all']
			this.numberOfExtensionRequests = result['lifetime_extension_requests_all']
			this.numberOfModificationRequests = result['modification_requests_all']
			this.numberOfProjectApplications = result['applications_submitted_vo']
		})
	}

	changeTabState(state: number): void {
		if (!this.loading_applications) {
			this.tab_state = state
			this.getApplicationsByTabState()
		}
	}

	/**
	 * Get the facility of an application.
	 *
	 * @param app
	 */
	getFacilityProject(app: Application): void {
		if (!app.project_application_compute_center && !app.hasSubmittedStatus() && !app.hasTerminatedStatus()) {
			this.groupservice
				.getFacilityByGroup(app.project_application_perun_id.toString())
				.subscribe((res: object): void => {
					const login: string = res['Login']
					const suport: string = res['Support']
					const facilityname: string = res['Facility']
					const facilityId: number = res['FacilityId']
					if (facilityId) {
						app.project_application_compute_center = new ComputecenterComponent(
							facilityId.toString(),
							facilityname,
							login,
							suport
						)
					}
				})
		}
	}

	setApplicationByLoadedApplication(applications: Application[]) {
		this.all_applications = []
		if (applications.length === 0) {
			this.isLoaded_userApplication = true
		}
		for (const application of applications) {
			const newApplication = new Application(application)

			this.all_applications.push(newApplication)
		}
		this.isLoaded = true
		for (const app of this.all_applications) {
			this.getFacilityProject(app)
		}
		this.sortApplicationsByTabState()
		this.loading_applications = false
	}

	/**
	 * Get all Applications if user is admin.
	 */
	getSubmittedApplicationsAdmin(): void {
		if (this.is_vo_admin) {
			this.applicationsService.getSubmittedApplications().subscribe((applications: Application[]): void => {
				this.setApplicationByLoadedApplication(applications)
			})
		}
	}

	getApplicationHistory(): void {
		this.applicationsService.getAllApplications().subscribe((applications: Application[]): void => {
			if (applications.length > 0) {
				for (const application of applications) {
					this.applications_history.push(application)
				}
			}
		})
	}

	/**
	 * Emptying all application lists, so applications don't get pushed to the lists multiple times.
	 */
	clearApplicationLists(): void {
		this.all_applications = []
	}

	/**
	 * Loading Applications dependent from the current tab selected (submitted, credits, lifetime, modification)
	 */
	sortApplicationsByTabState(): void {
		switch (this.tab_state) {
			case ApplicationTabStates.SUBMITTED:
				this.all_applications.sort(
					(a, b) =>
						new Date(a.project_application_date_submitted).getTime() -
						new Date(b.project_application_date_submitted).getTime()
				)
				break

			case ApplicationTabStates.LIFETIME_EXTENSION:
				this.all_applications.sort(
					(a, b) =>
						new Date(a.project_lifetime_request.date_submitted).getTime() -
						new Date(b.project_lifetime_request.date_submitted).getTime()
				)
				break

			case ApplicationTabStates.MODIFICATION_EXTENSION:
				this.all_applications.sort(
					(a, b) =>
						new Date(a.project_modification_request.date_submitted).getTime() -
						new Date(b.project_modification_request.date_submitted).getTime()
				)
				break

			case ApplicationTabStates.CREDITS_EXTENSION:
				this.all_applications.sort(
					(a, b) =>
						new Date(a.project_credit_request.date_submitted).getTime() -
						new Date(b.project_credit_request.date_submitted).getTime()
				)
				break

			default:
				break
		}
	}

	getSubmittedApplications(): void {
		this.applicationsService.getSubmittedApplications().subscribe((applications: Application[]): void => {
			this.setApplicationByLoadedApplication(applications)
		})
	}

	getCreditsExtensionRequests(): void {
		this.applicationsService.getCreditsExtensionRequest().subscribe((credit_applications: Application[]): void => {
			if (credit_applications.length === 0) {
				// bool here?
			}
			for (const credit_application of credit_applications) {
				this.all_applications.push(new Application(credit_application))
			}
			for (const app of this.all_applications) {
				this.getFacilityProject(app)
			}
			this.sortApplicationsByTabState()

			this.isLoaded = true
			this.loading_applications = false
		})
	}

	getLifetimeExtensionRequests(): void {
		this.applicationsService
			.getLifetimeRequestedApplications()
			.subscribe((lifetime_applications: Application[]): void => {
				this.setApplicationByLoadedApplication(lifetime_applications)
			})
	}

	getModificationRequests(): void {
		this.applicationsService
			.getModificationRequestedApplications()
			.subscribe((modification_applications: Application[]): void => {
				this.setApplicationByLoadedApplication(modification_applications)
			})
	}

	getApplicationsByTabState(): void {
		this.loading_applications = true
		if (this.is_vo_admin) {
			this.clearApplicationLists()
			if (this.tab_state === ApplicationTabStates.SUBMITTED) {
				this.getSubmittedApplications()
			} else if (this.tab_state === ApplicationTabStates.CREDITS_EXTENSION) {
				this.getCreditsExtensionRequests()
			} else if (this.tab_state === ApplicationTabStates.LIFETIME_EXTENSION) {
				this.getLifetimeExtensionRequests()
			} else if (this.tab_state === ApplicationTabStates.MODIFICATION_EXTENSION) {
				this.getModificationRequests()
			}
		}
	}

	public resetNotificationModal(): void {
		this.notificationModalTitle = 'Notification'
		this.notificationModalMessage = 'Please wait...'
		this.notificationModalIsClosable = false
		this.notificationModalType = 'info'
		this.notificationClientInfo = []
	}

	showNotificationModal(
		notificationModalTitle: string,
		notificationModalMessage: string,
		notificationModalType: string
	) {
		const initialState = { notificationModalTitle, notificationModalType, notificationModalMessage }
		if (this.bsModalRef) {
			this.bsModalRef.hide()
		}

		this.bsModalRef = this.modalService.show(NotificationModalComponent, { initialState })
		this.bsModalRef.setClass('modal-lg')
	}
}
