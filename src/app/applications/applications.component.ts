/* eslint-disable no-lonely-if */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { ApplicationsService } from '../api-connector/applications.service';
import { ApiSettings } from '../api-connector/api-settings.service';
import { Application } from './application.model/application.model';
import { GroupService } from '../api-connector/group.service';
import { UserService } from '../api-connector/user.service';
import { VoService } from '../api-connector/vo.service';
import { FacilityService } from '../api-connector/facility.service';
import { Flavor } from '../virtualmachines/virtualmachinemodels/flavor';
import { FlavorService } from '../api-connector/flavor.service';
import { Client } from '../vo_manager/clients/client.model';
import { ApplicationBaseClassComponent } from '../shared/shared_modules/baseClass/application-base-class.component';
import { ComputecenterComponent } from '../projectmanagement/computecenter.component';
import { is_vo } from '../shared/globalvar';
import { Application_States } from '../shared/shared_modules/baseClass/abstract-base-class';
import { FlavorType } from '../virtualmachines/virtualmachinemodels/flavorType';
import { CreditsService } from '../api-connector/credits.service';
import { ClientLimitsComponent } from '../vo_manager/clients/modals/client-limits..component';
import { NotificationModalComponent } from '../shared/modal/notification-modal';

// eslint-disable-next-line no-shadow
enum TabStates {
	'SUBMITTED' = 0,
	'CREDITS_EXTENSION' = 3,
	'LIFETIME_EXTENSION' = 5,
	'MODIFICATION_EXTENSION' = 4,
}

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
		CreditsService,
	],
})
export class ApplicationsComponent extends ApplicationBaseClassComponent implements OnInit, OnDestroy {
	title: string = 'Application Overview';
	tab_state: number = TabStates.SUBMITTED;
	TabStates: typeof TabStates = TabStates;
	selectedCenter: { [key: string]: string } = {};

	loading_applications: boolean = false;
	atLeastOneVM: boolean = false;
	bsModalRef: BsModalRef;
	subscription: Subscription = new Subscription();

	/**
	 * All Applications, just visible for a vo admin.
	 *
	 * @type {Array}
	 */
	all_applications: Application[] = [];
	selectedApplication: Application;
	adjustedApplication: Application;
	applications_history: Application[] = [];

	/**
	 * Limits information for Client tested/used for Simple Vm Project creation.
	 */
	notificationClientInfo: Client[] = [];

	/**
	 * id of the extension status.
	 *
	 * @type {number}
	 */
	extension_status: number = 0;
	/**
	 * id of Application set for deletion.
	 */

	numberOfExtensionRequests: number = 0;
	numberOfModificationRequests: number = 0;
	numberOfCreditRequests: number = 0;
	numberOfProjectApplications: number = 0;
	Application_States: typeof Application_States = Application_States;

	reassignLocked: boolean = false;
	assignLocked: boolean = false;
	approveLocked: boolean = false;

	/**
	 * Constructor.
	 * Loads all Applications if user is vo admin and all user_applications.
	 *
	 * @param applicationsService
	 * @param userService
	 * @param groupservice
	 * @param modalService
	 * @param voService
	 * @param facilityService
	 * @param flavorService
	 * @param creditsService
	 */
	constructor(
		applicationsService: ApplicationsService,
		userService: UserService,
		private groupservice: GroupService,
		private modalService: BsModalService,
		private voService: VoService,
		facilityService: FacilityService,
		private flavorService: FlavorService,
		private creditsService: CreditsService,
	) {
		super(userService, applicationsService, facilityService);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	ngOnInit(): void {
		this.is_vo_admin = is_vo;
		if (this.is_vo_admin) {
			this.getSubmittedApplications();
			this.getApplicationHistory();
			this.getComputeCenters();
			this.flavorService.getListOfFlavorsAvailable().subscribe((flavList: Flavor[]): void => {
				this.flavorList = flavList;
			});
			this.flavorService.getListOfTypesAvailable().subscribe((availableTypes: FlavorType[]): void => {
				this.typeList = availableTypes;
			});
			this.getApplicationNumbers();
		} else {
			this.isLoaded = true;
		}
	}

	/**
	 * Getting the current numbers of all Application-Request types from the API
	 */
	getApplicationNumbers(): void {
		this.applicationsService.getExtensionRequestsCounter().subscribe((result: any): void => {
			this.numberOfCreditRequests = result['credits_extension_requests_all'];
			this.numberOfExtensionRequests = result['lifetime_extension_requests_all'];
			this.numberOfModificationRequests = result['modification_requests_all'];
			this.numberOfProjectApplications = result['applications_submitted_vo'];
		});
	}

	/**
	 * Sets both the selected application and the adjusted application which serves as a model for the
	 * application adjustment of the VO
	 * @param application
	 */
	setApplicationToAdjust(application: Application): void {
		this.selectedApplication = application;
		this.adjustedApplication = new Application(application);
		this.checkIfMinimumSelected();
	}

	onChangeFlavor(flavor: Flavor, value: number): void {
		console.log(flavor);
		this.adjustedApplication.setFlavorInFlavors(flavor, value);
		this.checkIfMinimumSelected();
		this.creditsService
			.getCreditsForApplication(this.adjustedApplication.flavors, this.adjustedApplication.project_application_lifetime)
			.toPromise()
			.then((credits: number): void => {
				this.adjustedApplication.project_application_initial_credits = credits;
			})
			.catch((err: any): void => console.log(err));
	}

	public setFlavorInFlavors(flavor_param: Flavor, counter: number): void {
		const idx: number = this.adjustedApplication.flavors.findIndex(
			(fl: Flavor): boolean => fl.name === flavor_param.name,
		);
		if (idx !== -1) {
			if (counter > 0) {
				this.adjustedApplication.flavors[idx].counter = counter;
			} else {
				this.adjustedApplication.flavors.splice(idx, 1);
			}
		} else if (counter > 0) {
			const flavor: Flavor = flavor_param;
			flavor.counter = counter;
			this.adjustedApplication.flavors.push(flavor);
		}
		this.calculateRamCores();
	}

	checkIfMinimumSelected(): void {
		let numberOfVMs: number = 0;
		for (const fl of this.adjustedApplication.flavors) {
			numberOfVMs += this.adjustedApplication.getFlavorCounter(fl);
		}
		this.atLeastOneVM = numberOfVMs > 0 || this.adjustedApplication.project_application_openstack_project;
	}

	adjustApplication(): void {
		this.applicationsService.adjustApplication(this.adjustedApplication).subscribe(
			(adjustmentResult: Application): void => {
				const index: number = this.all_applications.indexOf(this.selectedApplication);
				this.all_applications[index] = new Application(adjustmentResult);
				this.showNotificationModal('Success', 'The resources of the application were adjusted successfully!', 'success');
			},
			(): void => {
				this.showNotificationModal('Failed', 'The adjustment of the resources has failed!', 'danger');
			},
		);
	}

	/**
	 * Checks if the flavor is available for SimpleVM
	 * @param type
	 */
	checkIfTypeGotSimpleVmFlavor(type: FlavorType): boolean {
		for (const flav of this.flavorList) {
			if (flav.type.shortcut === type.shortcut && flav.simple_vm) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Checks if the key given represents a flavor and if so returns the respective Flavor
	 *
	 * @param key the key which is checked
	 */
	isKeyFlavor(key: string): Flavor {
		for (const fkey in this.flavorList) {
			if (fkey in this.flavorList) {
				if (this.flavorList[fkey].name === key.substring(20)) {
					return this.flavorList[fkey];
				}
			}
		}

		return null;
	}

	changeTabState(state: number): void {
		if (!this.loading_applications) {
			this.tab_state = state;
			this.getApplicationsByTabState();
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
					const login: string = res['Login'];
					const suport: string = res['Support'];
					const facilityname: string = res['Facility'];
					const facilityId: number = res['FacilityId'];
					if (facilityId) {
						// eslint-disable-next-line no-param-reassign
						app.project_application_compute_center = new ComputecenterComponent(
							facilityId.toString(),
							facilityname,
							login,
							suport,
						);
					}
				});
		}
	}

	approveLifetimeExtension(application: Application): void {
		this.applicationsService.approveAdditionalLifetime(application.project_application_id).subscribe(
			(res: Response): void => {
				if (application.project_application_openstack_project) {
					const applicationToGet: Application = application;
					applicationToGet.project_application_status = [];
					this.getApplication(applicationToGet);
					this.showNotificationModal('Success', 'The request has been sent to the facility manager.', 'success');
				} else {
					this.showNotificationModal('Success', 'The project has been extended!', 'success');
				}
				if (!application.project_application_openstack_project) {
					if (res.status === HttpStatusCode.Accepted) {
						this.getApplicationNumbers();
						this.all_applications.splice(this.all_applications.indexOf(application), 1);
					}
				}
			},
			(err: any): void => {
				console.log('error', err.status);
				this.showNotificationModal('Failed', 'Project lifetime could not be extendend!', 'danger');
			},
		);
	}

	declineLifetimeExtension(application: Application): void {
		this.applicationsService.deleteAdditionalLifetimeRequests(application.project_application_id).subscribe(
			(): void => {
				this.showNotificationModal('Declined', 'The project extension was declined!', 'success');
				this.all_applications.splice(this.all_applications.indexOf(application), 1);
				this.getApplicationNumbers();
			},
			(err: any): void => {
				console.log('error', err.status);
				this.showNotificationModal('Failed', 'Decline of project extension failed!', 'danger');
			},
		);
	}

	approveModificationRequest(application: Application): void {
		this.applicationsService.approveModificationRequest(application.project_application_id).subscribe(
			(res: Response): void => {
				this.showNotificationModal('Success', 'The resource modification request was approved!', 'success');
				if (!application.project_application_openstack_project) {
					if (res.status === HttpStatusCode.Accepted) {
						this.getApplicationNumbers();
						this.all_applications.splice(this.all_applications.indexOf(application), 1);
					}
				} else {
					const applicationToGet: Application = application;
					applicationToGet.project_application_status = [];
					this.getApplication(applicationToGet);
				}
			},
			(err: any): void => {
				console.log('error', err.status);
				this.showNotificationModal('Failed', 'Approval of resource modification failed!', 'danger');
			},
		);
	}

	declineModificationRequest(application: Application): void {
		this.applicationsService.deleteModificationRequest(application.project_application_id).subscribe(
			(): void => {
				this.showNotificationModal('Declined', 'The resource modification request was declined!', 'success');
				this.all_applications.splice(this.all_applications.indexOf(application), 1);
				this.getApplicationNumbers();
			},
			(err: any): void => {
				console.log('error', err.status);
				this.showNotificationModal('Failed', 'Decline of resource modification failed!', 'danger');
			},
		);
	}

	approveCreditExtension(application: Application): void {
		this.applicationsService.approveAdditionalCreditsRequest(application.project_application_id).subscribe(
			(res: Response): void => {
				this.showNotificationModal('Success', 'The credit extension request was approved!', 'success');
				if (!application.project_application_openstack_project) {
					if (res.status === HttpStatusCode.Accepted) {
						this.getApplicationNumbers();
						this.all_applications.splice(this.all_applications.indexOf(application), 1);
					}
				} else {
					const applicationToGet: Application = application;
					applicationToGet.project_application_status = [];
					this.getApplication(applicationToGet);
				}
			},
			(err: any): void => {
				console.log('error', err.status);
				this.showNotificationModal('Failed', 'Approval of credit extension failed!', 'danger');
			},
		);
	}

	declineCreditExtension(application: Application): void {
		this.applicationsService.deleteAdditionalCreditsRequests(application.project_application_id).subscribe(
			(): void => {
				this.showNotificationModal('Declined', 'The credit extension request was declined!', 'success');
				this.all_applications.splice(this.all_applications.indexOf(application), 1);
				this.getApplicationNumbers();
			},
			(err: any): void => {
				console.log('error', err.status);
				this.showNotificationModal('Failed', 'Decline of credit extension failed!', 'danger');
			},
		);
	}

	/**
	 * Get all Applications if user is admin.
	 */
	getSubmittedApplications(): void {
		if (this.is_vo_admin) {
			this.applicationsService.getSubmittedApplications().subscribe((applications: Application[]): void => {
				if (applications.length === 0) {
					this.isLoaded_userApplication = true;
				}
				for (const application of applications) {
					this.all_applications.push(new Application(application));
				}
				this.isLoaded = true;
				for (const app of this.all_applications) {
					this.getFacilityProject(app);
				}
			});
		}
	}

	getApplicationHistory(): void {
		this.applicationsService.getAllApplications().subscribe((applications: Application[]): void => {
			if (applications.length > 0) {
				for (const application of applications) {
					this.applications_history.push(application);
				}
			}
		});
	}

	/**
	 * Emptying all application lists, so applications don't get pushed to the lists multiple times.
	 */
	clearApplicationLists(): void {
		this.all_applications = [];
	}

	/**
	 * Loading Applications dependent from the current tab selected (submitted, credits, lifetime, modification)
	 */
	getApplicationsByTabState(): void {
		this.loading_applications = true;
		if (this.is_vo_admin) {
			this.clearApplicationLists();
			if (this.tab_state === TabStates.SUBMITTED) {
				this.applicationsService.getSubmittedApplications().subscribe((applications: Application[]): void => {
					if (applications.length === 0) {
						this.isLoaded_userApplication = true;
					}
					for (const application of applications) {
						this.all_applications.push(new Application(application));
					}
					for (const app of this.all_applications) {
						this.getFacilityProject(app);
					}
					this.isLoaded = true;
					this.loading_applications = false;
				});
			} else if (this.tab_state === TabStates.CREDITS_EXTENSION) {
				this.applicationsService.getCreditsExtensionRequest().subscribe((credit_applications: Application[]): void => {
					if (credit_applications.length === 0) {
						// bool here?
					}
					for (const credit_application of credit_applications) {
						this.all_applications.push(new Application(credit_application));
					}
					for (const app of this.all_applications) {
						this.getFacilityProject(app);
					}
					this.isLoaded = true;
					this.loading_applications = false;
				});
			} else if (this.tab_state === TabStates.LIFETIME_EXTENSION) {
				this.applicationsService
					.getLifetimeRequestedApplications()
					.subscribe((lifetime_applications: Application[]): void => {
						if (lifetime_applications.length === 0) {
							// bool here?
						}
						for (const lifetime_application of lifetime_applications) {
							this.all_applications.push(new Application(lifetime_application));
						}
						for (const app of this.all_applications) {
							this.getFacilityProject(app);
						}
						this.isLoaded = true;
						this.loading_applications = false;
					});
			} else if (this.tab_state === TabStates.MODIFICATION_EXTENSION) {
				this.applicationsService
					.getModificationRequestedApplications()
					.subscribe((modification_applications: Application[]): void => {
						if (modification_applications.length === 0) {
							// bool here?
						}
						for (const modification_application of modification_applications) {
							this.all_applications.push(new Application(modification_application));
						}
						for (const app of this.all_applications) {
							this.getFacilityProject(app);
						}
						this.isLoaded = true;
						this.loading_applications = false;
					});
			}
		}
	}

	/**
	 * Get all Applications if user is admin.
	 */
	getAllApplications(): void {
		if (this.is_vo_admin) {
			this.applicationsService.getAllApplications().subscribe((applications: Application[]): void => {
				if (applications.length === 0) {
					this.isLoaded_userApplication = true;
				}
				for (const application of applications) {
					this.all_applications.push(new Application(application));
				}
				this.isLoaded = true;
				for (const app of this.all_applications) {
					this.getFacilityProject(app);
				}
			});
		}
	}

	/**
	 * Updates an application with the actual values.
	 *
	 * @param application
	 */
	public getApplication(application: Application): void {
		const index: number = this.all_applications.indexOf(application);

		this.applicationsService.getApplication(application.project_application_id.toString()).subscribe(
			(aj: Application): void => {
				const newApp: Application = aj;
				this.all_applications[index] = newApp;
				this.getFacilityProject(newApp);
			},
			(error: any): void => {
				console.log(error);
			},
		);
	}

	/**
	 * Remove Application from facility , where it is for confirmation
	 *
	 * @param application the application
	 */
	removeApplicationFromFacilityConfirmation(application: Application): void {
		this.groupservice.removeGroupFromResource(application.project_application_perun_id.toString()).subscribe(
			(): void => {
				this.getApplication(application);
				this.switchReassignLocked(false);
				this.showNotificationModal('Success', 'The application was removed from the compute center', 'success');
			},
			(): void => {
				this.showNotificationModal('Failed', 'The application was removed from the compute center', 'danger');
			},
		);
	}

	/**
	 * Create a new Group in perun with the specific attributes.
	 *
	 * @param application
	 * @param compute_center
	 */
	public createOpenStackProjectGroup(application: Application, compute_center: string): void {
		this.groupservice.createGroupOpenStack(application.project_application_id, compute_center).subscribe(
			(result: { [key: string]: string }): void => {
				if (result['Error']) {
					this.showNotificationModal('Failed', result['Error'], 'danger');
				} else {
					const applicationToGet: Application = application;
					applicationToGet.project_application_status = [];
					this.showNotificationModal('Success', 'The  project was assigned to the facility.', 'success');
					this.getApplication(applicationToGet);
					this.switchApproveLocked(false);
				}
			},
			(error: any): void => {
				console.log(error);
				if ('error' in error && 'error' in error['error'] && error['error']['error'] === 'locked') {
					this.showNotificationModal('Failed', 'Project is locked and could not be created!', 'danger');
				} else {
					this.showNotificationModal('Failed', 'Project could not be created!', 'danger');
				}
			},
		);
	}

	public resetNotificationModal(): void {
		this.notificationModalTitle = 'Notification';
		this.notificationModalMessage = 'Please wait...';
		this.notificationModalIsClosable = false;
		this.notificationModalType = 'info';
		this.notificationClientInfo = [];
	}

	/**
	 * Bugfix not scrollable site after closing modal
	 */
	removeModalOpen(): void {
		document.body.classList.remove('modal-open');
	}

	showClientsLimitsModal(
		compute_center_id: string,
		application: Application,
		is_modification_request: boolean = false,
	): void {
		const initialState = { compute_center_id, application, is_modification_request };

		this.bsModalRef = this.modalService.show(ClientLimitsComponent, { initialState });
		this.subscribeToBsModalRef();
	}

	showNotificationModal(
		notificationModalTitle: string,
		notificationModalMessage: string,
		notificationModalType: string,
	) {
		const initialState = { notificationModalTitle, notificationModalType, notificationModalMessage };
		if (this.bsModalRef) {
			this.bsModalRef.hide();
		}

		this.bsModalRef = this.modalService.show(NotificationModalComponent, { initialState });
		this.bsModalRef.setClass('modal-lg');
	}

	/**
	 * Function to listen to modal results.
	 */
	subscribeToBsModalRef(): void {
		this.subscription.add(
			this.bsModalRef.content.event.subscribe((result: any) => {
				if ('createSimpleVM' in result) {
					this.createSimpleVmProjectGroup(result['application'], result['compute_center_id']);
				}
				if ('approveModification' in result) {
					this.approveModificationRequest(result['application']);
				}
				if ('closed' in result) {
					this.switchApproveLocked(false);
				}
			}),
		);
	}

	public createSimpleVmProjectGroup(app: Application, compute_center_id?: string): void {
		this.showNotificationModal('Info', 'Creating Project...', 'info');

		const application_id: string = app.project_application_id as string;
		if (compute_center_id && compute_center_id !== 'undefined') {
			this.groupservice.createGroupByApplication(application_id, compute_center_id).subscribe(
				(res: any): void => {
					if (!res['client_available'] && !res['created']) {
						this.showNotificationModal(
							'Failed',
							`The client ${res['client_name']} has not the necessary resources left!`,
							'danger',
						);
					} else {
						this.all_applications.splice(this.all_applications.indexOf(app), 1);
						this.getApplicationNumbers();
						this.showNotificationModal('Success', 'The project was created!', 'success');
						this.switchApproveLocked(false);
						// this.reloadApplicationList(application_id)
					}
				},
				(error: object): void => {
					console.log(error);
					if ('error' in error && 'error' in error['error'] && error['error']['error'] === 'locked') {
						this.showNotificationModal('Failed', 'Project is locked and could not be created!', 'danger');
					} else {
						this.showNotificationModal('Failed', 'Project could not be created!', 'danger');
					}
				},
			);
		} else {
			if (this.computeCenters.length > 0) {
				this.roundRobinCreateSimpleVmProjectGroup(app);
			} else {
				this.showNotificationModal('Failed', 'Project could not be created!', 'danger');
				this.approveLocked = false;
			}
		}
	}

	roundRobinCreateSimpleVmProjectGroup(application: Application): void {
		const application_id: string = application.project_application_id as string;
		this.groupservice.createGroupByApplication(application_id, undefined).subscribe(
			(res: any): void => {
				if (!res['client_available'] && !res['created']) {
					this.showNotificationModal(
						'Failed',
						'Project could not be created as no clients with necessary resources are available.',
						'danger',
					);
					this.switchApproveLocked(false);
				} else {
					this.showNotificationModal('Success', `The project was created in ${res['client']} !`, 'success');
					this.all_applications = [];
					this.getSubmittedApplications();
					this.applicationsService.getExtensionRequestsCounter().subscribe((result: any): void => {
						this.numberOfProjectApplications = result['applications_submitted_vo'];
					});
					this.switchApproveLocked(false);
				}
			},
			(error: object): void => {
				console.log(error);
				if ('error' in error && 'error' in error['error'] && error['error']['error'] === 'locked') {
					this.showNotificationModal('Failed', 'Project is locked and could not be created!', 'danger');
				} else {
					this.showNotificationModal('Failed', 'Project could not be created!', 'danger');
				}
			},
		);
	}

	resetApplicationPI(application: Application): void {
		this.applicationsService.resetPIValidation(application).subscribe((app: Application) => {
			this.all_applications[this.all_applications.indexOf(application)] = new Application(app);
		});
	}

	assignGroupToFacility(group_id: string, application_id: string, compute_center: string): void {
		if (compute_center !== 'undefined') {
			this.groupservice.assignGroupToResource(group_id, compute_center).subscribe(
				(): void => {
					for (const app of this.all_applications) {
						if (app.project_application_id.toString() === application_id.toString()) {
							this.getApplication(app);
							break;
						}
					}
					this.switchAssignLocked(false);
					this.showNotificationModal('Success', 'The  project was assigned to the facility.', 'success');
				},
				(error: object): void => {
					console.log(error);
					this.showNotificationModal('Failed', 'Project could not be created!', 'danger');
				},
			);
		} else {
			this.showNotificationModal('Failed', 'You need to select an compute center!', 'danger');
		}
	}

	/**
	 * Decline an application.
	 *
	 * @param app
	 */

	public declineApplication(app: Application): void {
		const idx: number = this.all_applications.indexOf(app);
		this.applicationsService.declineApplication(app.project_application_id).subscribe(
			(): void => {
				let message: string = 'The Application was declined.';
				if (app.project_application_openstack_project && app.project_application_perun_id) {
					message = `The Application was declined. The perun id was ${app.project_application_perun_id},
					please remember to delete the perun group.`;
				}
				this.showNotificationModal('Success', message, 'success');
				this.all_applications.splice(idx, 1);
				this.getApplicationNumbers();
			},
			(): void => {
				this.showNotificationModal('Failed', 'Application could not be declined!', 'danger');
				this.changeTabState(this.tab_state);
			},
		);
	}

	switchReassignLocked(check: boolean): void {
		this.reassignLocked = check;
	}

	switchAssignLocked(check: boolean): void {
		this.assignLocked = check;
	}

	switchApproveLocked(check: boolean): void {
		this.approveLocked = check;
	}
}
