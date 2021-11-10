import { Component, OnInit } from '@angular/core';
import { FacilityService } from '../api-connector/facility.service';
import { UserService } from '../api-connector/user.service';
import { GroupService } from '../api-connector/group.service';
import { ApiSettings } from '../api-connector/api-settings.service';
import { Application } from '../applications/application.model/application.model';
import { Application_States } from '../shared/shared_modules/baseClass/abstract-base-class';
import { ApplicationsService } from '../api-connector/applications.service';
import { ApplicationBaseClassComponent } from '../shared/shared_modules/baseClass/application-base-class.component';

// eslint-disable-next-line no-shadow
enum TabStates {
  'SUBMITTED' = 0,
  'CREDITS_EXTENSION' = 1,
  'LIFETIME_EXTENSION' = 2,
  'MODIFICATION_EXTENSION' = 3,
  'TERMINATION_REQUEST' = 4
}

/**
 * Application component
 */
@Component({
	selector: 'app-facility.application',
	templateUrl: 'facility.application.component.html',
	styleUrls: ['facility.application.component.scss'],
	providers: [FacilityService, UserService, GroupService,
		ApplicationsService, ApiSettings],

})
export class FacilityApplicationComponent extends ApplicationBaseClassComponent implements OnInit {

	numberOfExtensionRequests: number = 0;
	numberOfModificationRequests: number = 0;
	numberOfCreditRequests: number = 0;
	numberOfProjectApplications: number = 0;
	numberOfTerminationRequests: number = 0;
	Application_States: typeof Application_States = Application_States;

	title: string = 'Application Overview';
	/**
	 * All Applications waiting for confirmation for the selected facility.
	 *
	 * @type {Array}
	 */

	/**
	 * Facilitties where the user is manager ['name',id].
	 */
	public managerFacilities: [string, number][];
	/**
	 * Chosen facility.
	 */
	public selectedFacility: [string, number];

	/**
	 * List of all application modifications.
	 *
	 * @type {Array}
	 */
	all_application_modifications: Application [] = [];
	isHistoryLoaded: boolean = false;

	applications_history: Application [] = [];

	allApplicationsToCheck: Application[] = [];

	tab_state: number = TabStates.SUBMITTED;
	TabStates: typeof TabStates = TabStates;
	loadingApplications: boolean = false;

	approveLocked: boolean = false;

	constructor(userService: UserService,
		facilityService: FacilityService, applicationsService: ApplicationsService) {
		super(userService, applicationsService, facilityService);
	}

	getFacilityApplicationById(application: Application): void {
		if (application.project_application_description !== undefined) {
			return;
		}
		const idx: number = this.applications_history.indexOf(application);
		this.facilityService.getFacilityApplicationById(this.selectedFacility['FacilityId'], application.project_application_id.toString())
			.subscribe((app: Application): void => {
				this.applications_history[idx] = new Application(app);
			});
	}

	/**
	 * Get all application ( with all stati) for a facility.
	 *
	 * @param facility id of the facility
	 */
	getAllApplicationsHistory(facility: number): void {
		this.isHistoryLoaded = false;

		this.applications_history = [];

		// todo check if user is VO Admin
		this.facilityService.getFacilityApplicationsHistory(facility).subscribe((applications: Application[]): void => {
			if (applications.length === 0) {
				this.isHistoryLoaded = true;
			}
			for (const application of applications) {
				this.applications_history.push(new Application(application));
			}
			this.isHistoryLoaded = true;
		});
	}

	public approveExtension(app: Application): void {
		this.setApproveLocked(true);
		this.applicationsService.approveAdditionalLifetime(app.project_application_id)
			.subscribe((): void => {
				this.setApproveLocked(false);
				this.updateNotificationModal('Success', 'Successfully approved extension!', true, 'success');
				this.allApplicationsToCheck.splice(this.allApplicationsToCheck.indexOf(app), 1);
				this.numberOfExtensionRequests -= 1;
				this.getAllApplicationsHistory(this.selectedFacility['FacilityId']);
			}, (): void => {
				this.setApproveLocked(false);
				this.updateNotificationModal('Failed',
					'The approval of the extension request has failed.',
					true,
					'danger');
			});
	}

	/**
	 * Decline an extension request.
	 *
	 * @param application_id
	 */
	public declineExtension(app: Application): void {

		this.applicationsService.declineAdditionalLifetime(app.project_application_id)
			.subscribe((): void => {
				this.updateNotificationModal('Success', 'Successfully declined extension!', true, 'success');
				this.allApplicationsToCheck.splice(this.allApplicationsToCheck.indexOf(app), 1);
				this.numberOfExtensionRequests -= 1;
				this.getAllApplicationsHistory(this.selectedFacility['FacilityId']);
			}, (): void => {
				this.updateNotificationModal('Failed',
					'The decline of the extension request has failed.',
					true,
					'danger');
			});
	}

	public approveModification(app: Application): void {
		this.setApproveLocked(true);
		this.applicationsService.approveModificationRequest(app.project_application_id)
			.subscribe((): void => {
				this.setApproveLocked(false);
				this.updateNotificationModal('Success', 'Successfully approved modification!', true, 'success');
				this.allApplicationsToCheck.splice(this.allApplicationsToCheck.indexOf(app), 1);
				this.numberOfModificationRequests -= 1;
				this.getAllApplicationsHistory(this.selectedFacility['FacilityId']);
			}, (): void => {
				this.setApproveLocked(false);
				this.updateNotificationModal('Failed',
					'The approval of the modification request has failed.',
					true,
					'danger');
			});
	}

	public declineModification(app: Application): void {
		this.applicationsService.declineModificationRequest(app.project_application_id)
			.subscribe((): void => {
				this.updateNotificationModal('Success', 'Successfully declined modification!', true, 'success');
				this.allApplicationsToCheck.splice(this.allApplicationsToCheck.indexOf(app), 1);
				this.numberOfModificationRequests -= 1;
				this.getAllApplicationsHistory(this.selectedFacility['FacilityId']);
			}, (): void => {
				this.updateNotificationModal('Failed',
					'The decline of the modification request has failed.',
					true,
					'danger');
			});
	}

	public approveCreditRequest(app: Application): void {
		this.setApproveLocked(true);
		this.applicationsService.approveAdditionalCreditsRequest(app.project_application_id)
			.subscribe((): void => {
				this.setApproveLocked(false);
				this.updateNotificationModal('Success', 'Successfully approved credit extension!', true, 'success');
				this.allApplicationsToCheck.splice(this.allApplicationsToCheck.indexOf(app), 1);
				this.numberOfCreditRequests -= 1;
				this.getAllApplicationsHistory(this.selectedFacility['FacilityId']);
			}, (): void => {
				this.setApproveLocked(false);
				this.updateNotificationModal('Failed',
					'The approval of the credit request has failed.',
					true,
					'danger');
			});
	}

	public declineCreditRequest(app: Application): void {
		this.applicationsService.declineAdditionalCredits(app.project_application_id)
			.subscribe((): void => {
				this.updateNotificationModal('Success', 'Successfully declined credit extension!', true, 'success');
				this.allApplicationsToCheck.splice(this.allApplicationsToCheck.indexOf(app), 1);
				this.numberOfCreditRequests -= 1;
				this.getAllApplicationsHistory(this.selectedFacility['FacilityId']);
			}, (): void => {
				this.updateNotificationModal('Failed',
					'The decline of the credit request has failed.',
					true,
					'danger');
			});
	}

	approveTermination(app: Application): void {
		this.facilityService.approveTerminationByFM(app.project_application_perun_id, this.selectedFacility['FacilityId'])
			.subscribe((): void => {
				this.allApplicationsToCheck.splice(this.allApplicationsToCheck.indexOf(app), 1);
				this.numberOfTerminationRequests -= 1;
				this.getAllApplicationsHistory(this.selectedFacility['FacilityId']);
				this.updateNotificationModal('Success', 'The  project was terminated.', true, 'success');
			}, (error: any): void => {
				if (error['status'] === 409) {
					this.updateNotificationModal(
						'Failed',
						`The project could not be terminated. Reason: ${error['error']['reason']} for ${error['error']['openstackid']}`,
						true,
						'danger',
					);
				} else {
					this.updateNotificationModal('Failed', 'The project could not be terminated.', true, 'danger');
				}
			});
	}

	declineTermination(app: Application): void {
		this.facilityService.declineTerminationByFM(app.project_application_perun_id, this.selectedFacility['FacilityId'])
			.subscribe((): void => {
				this.allApplicationsToCheck.splice(this.allApplicationsToCheck.indexOf(app), 1);
				this.numberOfTerminationRequests -= 1;
				this.getAllApplicationsHistory(this.selectedFacility['FacilityId']);
				this.updateNotificationModal('Success', 'The termination of the project was declined.', true, 'success');
			}, (error: any): void => {
				if (error['status'] === 409) {
					this.updateNotificationModal(
						'Failed',
						`The decline of the project was not successful. Reason: ${error['error']['reason']} for ${error['error']['openstackid']}`,
						true,
						'danger',
					);
				} else {
					this.updateNotificationModal('Failed', 'The decline of the project failed.', true, 'danger');
				}
			});
	}

	/**
	 * Approves an  application.
	 *
	 * @param app: Application
	 */
	approveApplication(app: Application): void {
		this.setApproveLocked(true);

		this.updateNotificationModal('Approving Application', 'Waiting..', true, 'info');
		this.facilityService.approveFacilityApplication(this.selectedFacility['FacilityId'], app.project_application_id).subscribe(
			(): void => {
				this.setApproveLocked(false);
				this.updateNotificationModal('Success', 'Successfully approved the application.', true, 'success');
				this.allApplicationsToCheck.splice(this.allApplicationsToCheck.indexOf(app), 1);
				this.numberOfProjectApplications -= 1;
				this.getAllApplicationsHistory(this.selectedFacility['FacilityId']);
			},
			(): void => {
				this.setApproveLocked(false);
				this.updateNotificationModal('Failed', 'Failed to approve the application.', true, 'danger');

			},
		);
	}

	/**
	 * Declines an Application.
	 *
	 * @param application_id
	 */
	declineApplication(app: Application): void {
		this.updateNotificationModal('Decline Application', 'Waiting..', true, 'info');

		this.facilityService.declineFacilityApplication(this.selectedFacility['FacilityId'],
			parseInt(app.project_application_id.toString(), 10))
			.subscribe(
				(): void => {
					this.updateNotificationModal('Success', 'Successfully declined the application.', true, 'success');
					this.allApplicationsToCheck.splice(this.allApplicationsToCheck.indexOf(app), 1);
					this.numberOfProjectApplications -= 1;
					this.getAllApplicationsHistory(this.selectedFacility['FacilityId']);
				},
				(): void => {
					this.updateNotificationModal('Failed', 'Failed to decline the application.', true, 'danger');

				},
			);
	}

	/**
	 * If the selected facility changes, reload the applicatins.
	 *
	 * @param value
	 */
	onChangeSelectedFacility(): void {
		this.isLoaded = false;
		this.allApplicationsToCheck = [];
		this.all_application_modifications = [];
		this.applications_history = [];
		this.facilityService.getExtensionRequestsCounterFacility(this.selectedFacility['FacilityId'])
			.subscribe((res: any): void => {
				this.numberOfCreditRequests = res['credits_extension_requests'];
				this.numberOfExtensionRequests = res['lifetime_extension_requests'];
				this.numberOfModificationRequests = res['modification_requests'];
				this.numberOfProjectApplications = res['applications_submitted'];
				this.numberOfTerminationRequests = res['termination_requests'];
			});
		this.changeTabState(TabStates.SUBMITTED);
		this.isLoaded = true;
		// this.getFullApplications(this.selectedFacility ['FacilityId']);
		this.getAllApplicationsHistory(this.selectedFacility['FacilityId']);

	}

	/**
	 * may need changes due to multiple facilities for one single fm?
	 */
	changeTabState(state: number): void {
		if (!this.loadingApplications) {
			this.tab_state = state;
			this.getApplicationsByTabState();
		}
	}

	getApplicationsByTabState(): void {
		this.allApplicationsToCheck = [];
		this.loadingApplications = true;
		if (this.tab_state === TabStates.SUBMITTED) {
			this.facilityService.getWfcSubmittedApplications(this.selectedFacility['FacilityId'])
				.subscribe((applications: Application[]): void => {
					if (applications.length === 0) {
						this.isLoaded_userApplication = true;
					}
					for (const application of applications) {
						this.allApplicationsToCheck.push(new Application(application));
					}
					this.loadingApplications = false;
				});
		} else if (this.tab_state === TabStates.MODIFICATION_EXTENSION) {
			this.facilityService.getWfcModificationRequestedApplications(this.selectedFacility['FacilityId'])
				.subscribe((applications: Application[]): void => {
					if (applications.length === 0) {
						this.isLoaded_userApplication = true;
					}
					for (const application of applications) {
						this.allApplicationsToCheck.push(new Application(application));
					}
					this.loadingApplications = false;
				});
		} else if (this.tab_state === TabStates.CREDITS_EXTENSION) {
			this.facilityService.getWfcCreditsRequestedApplications(this.selectedFacility['FacilityId'])
				.subscribe((applications: Application[]): void => {
					if (applications.length === 0) {
						this.isLoaded_userApplication = true;
					}
					for (const application of applications) {
						this.allApplicationsToCheck.push(new Application(application));
					}
					this.loadingApplications = false;
				});
		} else if (this.tab_state === TabStates.LIFETIME_EXTENSION) {
			this.facilityService.getWfcLifetimeRequestedApplications(this.selectedFacility['FacilityId'])
				.subscribe((applications: Application[]): void => {
					if (applications.length === 0) {
						this.isLoaded_userApplication = true;
					}
					for (const application of applications) {
						this.allApplicationsToCheck.push(new Application(application));
					}
					this.loadingApplications = false;
				});
		} else if (this.tab_state === TabStates.TERMINATION_REQUEST) {
			this.facilityService.getWfcTerminationRequestedApplications(this.selectedFacility['FacilityId'])
				.subscribe((applications: Application[]): void => {
					if (applications.length === 0) {
						this.isLoaded_userApplication = true;
					}
					for (const application of applications) {
						this.allApplicationsToCheck.push(new Application(application));
					}
					this.loadingApplications = false;
				});
		}
	}

	ngOnInit(): void {
		this.facilityService.getManagerFacilities().subscribe((result: any): void => {
			this.managerFacilities = result;
			this.selectedFacility = this.managerFacilities[0];
			this.facilityService.getExtensionRequestsCounterFacility(this.selectedFacility['FacilityId'])
				.subscribe((res: any): void => {
					this.numberOfCreditRequests = res['credits_extension_requests'];
					this.numberOfExtensionRequests = res['lifetime_extension_requests'];
					this.numberOfModificationRequests = res['modification_requests'];
					this.numberOfProjectApplications = res['applications_submitted'];
					this.numberOfTerminationRequests = res['termination_requests'];
				});
			this.changeTabState(TabStates.SUBMITTED);
			this.isLoaded = true;

			// this.getFullApplications(this.selectedFacility ['FacilityId']);
			this.getAllApplicationsHistory(this.selectedFacility['FacilityId']);
		});
	}

	setApproveLocked(locked: boolean): void {
		this.approveLocked = locked;
	}

}
