import { ChangeDetectorRef, Component, OnInit } from '@angular/core'

import { FacilityService } from '../api-connector/facility.service'
import { UserService } from '../api-connector/user.service'
import { GroupService } from '../api-connector/group.service'
import { ApiSettings } from '../api-connector/api-settings.service'
import { Application } from '../applications/application.model/application.model'
import { Application_States } from '../shared/shared_modules/baseClass/abstract-base-class'
import { ApplicationsService } from '../api-connector/applications.service'
import { ApplicationBaseClassComponent } from '../shared/shared_modules/baseClass/application-base-class.component'
import { NotificationModalComponent } from '../shared/modal/notification-modal'

enum TabStates {
	'SUBMITTED' = 0,
	'CREDITS_EXTENSION' = 1,
	'LIFETIME_EXTENSION' = 2,
	'MODIFICATION_EXTENSION' = 3,
	'TERMINATION_REQUEST' = 4,
}

/**
 * Application component
 */
@Component({
	selector: 'app-facility.application',
	templateUrl: 'facility.application.component.html',
	styleUrls: ['facility.application.component.scss'],
	providers: [FacilityService, UserService, GroupService, ApplicationsService, ApiSettings]
})
export class FacilityApplicationComponent extends ApplicationBaseClassComponent implements OnInit {
	numberOfExtensionRequests: number = 0
	numberOfModificationRequests: number = 0
	numberOfCreditRequests: number = 0
	numberOfProjectApplications: number = 0
	numberOfTerminationRequests: number = 0
	Application_States: typeof Application_States = Application_States

	title: string = 'Application Overview'
	/**
	 * All Applications waiting for confirmation for the selected facility.
	 *
	 * @type {Array}
	 */

	/**
	 * Facilitties where the user is manager ['name',id].
	 */
	public managerFacilities: [string, number][]
	/**
	 * Chosen facility.
	 */
	public selectedFacility: [string, number]

	/**
	 * List of all application modifications.
	 *
	 * @type {Array}
	 */
	all_application_modifications: Application[] = []
	isHistoryLoaded: boolean = false

	applications_history: Application[] = []

	allApplicationsToCheck: Application[] = []

	tab_state: number = TabStates.SUBMITTED
	TabStates: typeof TabStates = TabStates
	loadingApplications: boolean = false

	approveLocked: boolean = false

	constructor(
		userService: UserService,
		facilityService: FacilityService,
		applicationsService: ApplicationsService,
		cdrRef: ChangeDetectorRef,
		notificationModal: NotificationModalComponent
	) {
		super(userService, applicationsService, facilityService, notificationModal, cdrRef)
	}

	getFacilityApplicationById(application: Application): void {
		if (application.project_application_description !== undefined) {
			return
		}
		const idx: number = this.applications_history.indexOf(application)
		this.facilityService
			.getFacilityApplicationById(this.selectedFacility['FacilityId'], application.project_application_id.toString())
			.subscribe((app: Application): void => {
				this.applications_history[idx] = new Application(app)
			})
	}

	/**
	 * Get all application ( with all stati) for a facility.
	 *
	 * @param facility id of the facility
	 */
	getAllApplicationsHistory(facility: number): void {
		this.isHistoryLoaded = false

		this.applications_history = []

		// todo check if user is VO Admin
		this.facilityService.getFacilityApplicationsHistory(facility).subscribe((applications: Application[]): void => {
			if (applications.length === 0) {
				this.isHistoryLoaded = true
			}
			for (const application of applications) {
				this.applications_history.push(new Application(application))
			}
			this.isHistoryLoaded = true
		})
	}

	/**
	 * If the selected facility changes, reload the applicatins.
	 *
	 * @param value
	 */
	onChangeSelectedFacility(): void {
		this.isLoaded = false
		this.allApplicationsToCheck = []
		this.all_application_modifications = []
		this.applications_history = []
		this.facilityService
			.getExtensionRequestsCounterFacility(this.selectedFacility['FacilityId'])
			.subscribe((res: any): void => {
				this.numberOfCreditRequests = res['credits_extension_requests']
				this.numberOfExtensionRequests = res['lifetime_extension_requests']
				this.numberOfModificationRequests = res['modification_requests']
				this.numberOfProjectApplications = res['applications_submitted']
				this.numberOfTerminationRequests = res['termination_requests']
			})
		this.changeTabState(TabStates.SUBMITTED)
		this.isLoaded = true
		// this.getFullApplications(this.selectedFacility ['FacilityId']);
		this.getAllApplicationsHistory(this.selectedFacility['FacilityId'])
	}

	/**
	 * may need changes due to multiple facilities for one single fm?
	 */
	changeTabState(state: number): void {
		if (!this.loadingApplications) {
			this.tab_state = state
			this.getApplicationsByTabState()
		}
	}

	getApplicationsByTabState(): void {
		this.allApplicationsToCheck = []
		this.loadingApplications = true
		if (this.tab_state === TabStates.SUBMITTED) {
			this.facilityService
				.getWfcSubmittedApplications(this.selectedFacility['FacilityId'])
				.subscribe((applications: Application[]): void => {
					if (applications.length === 0) {
						this.isLoaded_userApplication = true
					}
					for (const application of applications) {
						this.allApplicationsToCheck.push(new Application(application))
					}
					this.loadingApplications = false
				})
		} else if (this.tab_state === TabStates.MODIFICATION_EXTENSION) {
			this.facilityService
				.getWfcModificationRequestedApplications(this.selectedFacility['FacilityId'])
				.subscribe((applications: Application[]): void => {
					if (applications.length === 0) {
						this.isLoaded_userApplication = true
					}
					for (const application of applications) {
						this.allApplicationsToCheck.push(new Application(application))
					}
					this.loadingApplications = false
				})
		} else if (this.tab_state === TabStates.CREDITS_EXTENSION) {
			this.facilityService
				.getWfcCreditsRequestedApplications(this.selectedFacility['FacilityId'])
				.subscribe((applications: Application[]): void => {
					if (applications.length === 0) {
						this.isLoaded_userApplication = true
					}
					for (const application of applications) {
						this.allApplicationsToCheck.push(new Application(application))
					}
					this.loadingApplications = false
				})
		} else if (this.tab_state === TabStates.LIFETIME_EXTENSION) {
			this.facilityService
				.getWfcLifetimeRequestedApplications(this.selectedFacility['FacilityId'])
				.subscribe((applications: Application[]): void => {
					if (applications.length === 0) {
						this.isLoaded_userApplication = true
					}
					for (const application of applications) {
						this.allApplicationsToCheck.push(new Application(application))
					}
					this.loadingApplications = false
				})
		} else if (this.tab_state === TabStates.TERMINATION_REQUEST) {
			this.facilityService
				.getWfcTerminationRequestedApplications(this.selectedFacility['FacilityId'])
				.subscribe((applications: Application[]): void => {
					if (applications.length === 0) {
						this.isLoaded_userApplication = true
					}
					for (const application of applications) {
						this.allApplicationsToCheck.push(new Application(application))
					}
					this.loadingApplications = false
				})
		}
	}

	getApplicationNumbers() {
		this.facilityService
			.getExtensionRequestsCounterFacility(this.selectedFacility['FacilityId'])
			.subscribe((res: any): void => {
				this.numberOfCreditRequests = res['credits_extension_requests']
				this.numberOfExtensionRequests = res['lifetime_extension_requests']
				this.numberOfModificationRequests = res['modification_requests']
				this.numberOfProjectApplications = res['applications_submitted']
				this.numberOfTerminationRequests = res['termination_requests']
			})
	}

	ngOnInit(): void {
		this.facilityService.getManagerFacilities().subscribe((result: any): void => {
			this.managerFacilities = result
			this.selectedFacility = this.managerFacilities[0]
			this.getApplicationNumbers()
			this.changeTabState(TabStates.SUBMITTED)
			this.isLoaded = true

			// this.getFullApplications(this.selectedFacility ['FacilityId']);
			this.getAllApplicationsHistory(this.selectedFacility['FacilityId'])
		})
	}
}
