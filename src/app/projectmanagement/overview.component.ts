import {
	Component, ElementRef, Inject, Input, OnDestroy, OnInit, Renderer2, ViewChild,
} from '@angular/core';
import * as moment from 'moment';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AutocompleteComponent } from 'angular-ng-autocomplete';
import { DOCUMENT } from '@angular/common';
import { Chart } from 'chart.js';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from '../../environments/environment';
import { ProjectMemberApplication } from './project_member_application';
import { ComputecenterComponent } from './computecenter.component';
import { Userinfo } from '../userinfo/userinfo.model';
import { UserService } from '../api-connector/user.service';
import { Application } from '../applications/application.model/application.model';
import { GroupService } from '../api-connector/group.service';
import { ApplicationBaseClassComponent } from '../shared/shared_modules/baseClass/application-base-class.component';
import { FacilityService } from '../api-connector/facility.service';
import { ApplicationsService } from '../api-connector/applications.service';
import { FullLayoutComponent } from '../layouts/full-layout.component';
import { Flavor } from '../virtualmachines/virtualmachinemodels/flavor';
import { FlavorType } from '../virtualmachines/virtualmachinemodels/flavorType';
import { FlavorService } from '../api-connector/flavor.service';
import { CreditsService } from '../api-connector/credits.service';
import { is_vo } from '../shared/globalvar';
import {
	CREDITS_WIKI, WIKI_MEMBER_MANAGEMENT, WIKI_PUBLICATIONS, CLOUD_MAIL,
} from '../../links/links';
import { Doi } from '../applications/doi/doi';
import { EdamOntologyTerm } from '../applications/edam-ontology-term';
import { ApiSettings } from '../api-connector/api-settings.service';
import { Application_States, ExtensionRequestType } from '../shared/shared_modules/baseClass/abstract-base-class';
import { ApplicationLifetimeExtension } from '../applications/application_extension.model';
import { ApplicationCreditRequest } from '../applications/application_credit_request';
import { ProjectMember } from './project_member.model';
import { Project } from './project.model';
import { ModificationRequestComponent } from './modals/modification-request/modification-request.component';
import { LifetimeRequestComponent } from './modals/lifetime-request/lifetime-request.component';
import { DoiComponent } from './modals/doi/doi.component';

/**
 * Projectoverview component.
 */
@Component({
	selector: 'app-project-overview',
	templateUrl: 'overview.component.html',
	providers: [FlavorService, ApplicationsService,
		FacilityService, UserService, GroupService, ApiSettings, CreditsService],
})
export class OverviewComponent extends ApplicationBaseClassComponent implements OnInit, OnDestroy {

	bsModalRef: BsModalRef;
	modificationRequestDisabled: boolean = false;
	lifetimeExtensionDisabled: boolean = false;

	@Input() invitation_group_post: string = environment.invitation_group_post;
	@Input() voRegistrationLink: string = environment.voRegistrationLink;
	@Input() invitation_group_pre: string = environment.invitation_group_pre;
	WIKI_MEMBER_MANAGEMENT: string = WIKI_MEMBER_MANAGEMENT;
	WIKI_PUBLICATIONS: string = WIKI_PUBLICATIONS;
	CREDITS_WIKI: string = CREDITS_WIKI;
	CLOUD_MAIL: string = CLOUD_MAIL;

	@ViewChild(NgForm) simpleVmForm: NgForm;
	@ViewChild('creditsChart') creditsCanvas: ElementRef;
	private subscription: Subscription = new Subscription();

	project_id: string;
	application_id: string;
	project: Project;
	credits: number = 0;

	errorMessage: string;
	terminate_confirmation_given: boolean = false;

	/**
	 * id of the extension status.
	 *
	 * @type {number}
	 */
	extension_status: number = 0;

	/**
	 * defines weither the request is an extension (1), modification (2) or credit (3) request.
	 *
	 * @type {number}, initialized with 0
	 */
	request_type: number = ExtensionRequestType.NONE;
	showInformationCollapse: boolean = false;
	newDoi: string;
	doiError: string;
	remove_members_clicked: boolean;
	life_time_string: string;
	dois: Doi[];
	isAdmin: boolean = false;
	invitation_link: string;
	filteredMembers: any = null;
	project_application: Application;
	project_extension: ApplicationLifetimeExtension;
	project_credit_request: ApplicationCreditRequest;
	application_action: string = '';
	application_member_name: string = '';
	application_action_done: boolean = false;
	application_action_success: boolean;
	application_action_error_message: boolean;
	projects: Project[] = [];
	loaded: boolean = true;
	userinfo: Userinfo;
	allSet: boolean = false;
	renderer: Renderer2;
	smallExampleFlavor: Flavor;
	largeExampleFlavor: Flavor;
	smallExamplePossibleHours: number = 0;
	largeExamplePossibleHours: number = 0;
	creditsPerHourSmallExample: number;
	creditsPerHourLargeExample: number;
	smallExamplePossibleDays: string = '';
	largeExamplePossibleDays: string = '';
	supportMails: string[] = [];

	resourceDataLoaded: boolean = false;
	vmsInUse: number;
	maximumVMs: number;
	coresInUse: number;
	ramInUse: number;

	title: string = 'Project Overview';
	@ViewChild('edam_ontology') edam_ontology: AutocompleteComponent;

	checked_member_list: number[] = [];

	// modal variables for User list
	public project_members: ProjectMember[] = [];
	public isLoaded: boolean = false;
	public showLink: boolean = true;
	private project_application_extra_credits: number;
	public project_application_extra_credits_comment: string;
	private updateCreditsUsedIntervals: ReturnType<typeof setTimeout>;
	private updateCreditsHistoryIntervals: ReturnType<typeof setTimeout>;
	credits_allowed: boolean = false;
	creditsChart: any;
	ExtensionRequestType: typeof ExtensionRequestType = ExtensionRequestType;
	Application_States: typeof Application_States = Application_States;

	constructor(private flavorService: FlavorService,
		private groupService: GroupService,
		private modalService: BsModalService,
		applicationsService: ApplicationsService,
		facilityService: FacilityService,
		userService: UserService,
		private activatedRoute: ActivatedRoute,
		private fullLayout: FullLayoutComponent,
		private router: Router,
		private creditsService: CreditsService,
		@Inject(DOCUMENT) private document: Document) {
		super(userService, applicationsService, facilityService);
	}

	calculateProgressBar(numberToRoundUp: number): string {
		return Math.ceil(numberToRoundUp * 100).toString();
	}

	async delay(ms: number): Promise<any> {
		// tslint:disable-next-line:typedef
		return new Promise((resolve: any) => {
			setTimeout(resolve, ms);
		});
	}

	showResourceModal(): void {
		if (this.modificationRequestDisabled) {
			return;
		}

		this.modificationRequestDisabled = true;

		const initialState = {
			project: this.project_application,
		};
		this.bsModalRef = this.modalService.show(ModificationRequestComponent, { initialState });
		this.bsModalRef.setClass('modal-lg');
		this.subscribeForExtensionResult(this.ExtensionRequestType.MODIFICATION);
	}

	showLifetimeExtensionModal(): void {
		if (this.lifetimeExtensionDisabled) {
			return;
		}

		this.lifetimeExtensionDisabled = true;

		const initialState = {
			project: this.project_application,
			life_time_string: `${this.project.DateCreated} -  ${this.project.DateEnd}`,
		};
		this.bsModalRef = this.modalService.show(LifetimeRequestComponent, { initialState });
		this.bsModalRef.setClass('modal-lg');
		this.subscribeForExtensionResult(this.ExtensionRequestType.EXTENSION);
	}

	showDoiModal(): void {
		const initialState = {
			dois: this.dois,
			application_id: this.application_id,
		};

		this.bsModalRef = this.modalService.show(DoiComponent, { initialState });
		this.bsModalRef.setClass('modal-lg');
		this.subscription.add(
			this.bsModalRef.content.event.subscribe(
				() => {
					this.showLifetimeExtensionModal();
				},
			),
		);
	}

	subscribeForExtensionResult(type: ExtensionRequestType): void {
		this.subscription.add(
			this.bsModalRef.content.event.subscribe(
				(result: any) => {
					if ('reload' in result && result['reload']) {
						if (type === this.ExtensionRequestType.EXTENSION) {
							this.lifetimeExtensionDisabled = true;
						} else if (type === this.ExtensionRequestType.MODIFICATION) {
							this.modificationRequestDisabled = true;
						}
						this.fullLayout.getGroupsEnumeration();
						this.getApplication();
					} else if (type === this.ExtensionRequestType.EXTENSION) {
						this.lifetimeExtensionDisabled = false;
					} else if (type === this.ExtensionRequestType.MODIFICATION) {
						this.modificationRequestDisabled = false;
					}
				},
			),
		);
	}

	setModalOpen(bool: boolean): void {
		// tslint:disable-next-line:typedef
		void (async () => {
			await this.delay(750).then().catch(); // needed, because bootstraps class-toggle-function seems to be too slow
			if (bool) {
				this.document.body.classList.add('modal-open');
			} else {
				this.document.body.classList.remove('modal-open');
			}
		}
		)().then().catch();
	}

	fetchCreditHistoryOfProject(): void {
		if (this.project != null) {
			this.creditsService.getCreditsUsageHistoryOfProject(Number(this.project.Id.toString())).toPromise()
				.then((response: {}): void => {
					if (response['data_points'] !== undefined) {
						const data_points: number[] = response['data_points'];

						this.creditsChart = new Chart(this.creditsCanvas.nativeElement, {
							type: 'line',
							data: {
								labels: response['time_points'],
								datasets: [{
									label: 'Credit Usage',
									data: data_points,
									borderColor: 'rgba(54, 162, 235, 1)',
									backgroundColor: 'rgba(54, 162, 235, 0.2)',
								}],
							},
							options: {
								animation: {
									duration: 0,
								},
								layout: {
									padding: {
										left: 25,
										right: 25,
										top: 25,
										bottom: 50,
									},
								},
								responsive: true,
							},
						});
					}
				}).catch((err: Error): void => console.log(err.message));
		}
	}

	updateExampleCredits(numberOfCredits: number): void {
		const totalHoursSmall: number = Math.round((numberOfCredits / this.creditsPerHourSmallExample) * 100) / 100;
		const totalHoursLarge: number = Math.round((numberOfCredits / this.creditsPerHourLargeExample) * 100) / 100;
		this.smallExamplePossibleHours = totalHoursSmall;
		this.largeExamplePossibleHours = totalHoursLarge;
		this.smallExamplePossibleDays = this.updateCreditsDaysString(totalHoursSmall);
		this.largeExamplePossibleDays = this.updateCreditsDaysString(totalHoursLarge);
	}

	updateCreditsDaysString(hours: number): string {
		let days: number = 0;
		const minutes: number = Math.floor((hours % 1) * 60);
		if (hours > 24) {
			days = Math.floor(hours / 24);
		}
		hours = Math.floor(hours % 24);

		return `${days} day(s), ${hours} hour(s) and ${minutes} minute(s)`;
	}

	startUpdateCreditUsageLoop(): void {

		if (!this.credits_allowed || !this.project_application || !this.project_application.project_application_perun_id) {
			return;
		}
		this.getCurrentCreditsOfProject();
		this.fetchCreditHistoryOfProject();

		this.updateCreditsUsedIntervals = setInterval(
			(): any => this.getCurrentCreditsOfProject(),
			10000,
		);

		this.updateCreditsHistoryIntervals = setInterval(
			(): any => this.fetchCreditHistoryOfProject(),
			30000,
		);

	}

	getCurrentCreditsOfProject(): void {
		if (this.project_application && this.project_application.project_application_perun_id) {
			this.subscription.add(this.creditsService.getCurrentCreditsOfProject(
				this.project_application.project_application_perun_id.toString(),
			).subscribe(
				(credits: number): void => {
					if (this.project != null) {
						this.project.CurrentCredits = credits;
					}
				},
				(err: Error): void => {
					console.log(err.message);
				},
			));
		}

	}

	initExampleFlavors(): void {
		const standardFlavors: Flavor[] = this.flavorList
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			.filter((fl: Flavor, nu: number, arr: Flavor[]): boolean => fl.type.long_name === 'Standard Flavours');
		const highMemFlavors: Flavor[] = this.flavorList
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			.filter((fl: Flavor, nu: number, arr: Flavor[]): boolean => fl.type.long_name === 'High Memory Flavours');
		standardFlavors.sort((fl1: Flavor, fl2: Flavor): number => fl1.vcpus - fl2.vcpus);
		highMemFlavors.sort((fl1: Flavor, fl2: Flavor): number => fl1.vcpus - fl2.vcpus);
		if (standardFlavors.length !== 0) {
			this.smallExampleFlavor = standardFlavors[0];
			this.creditsService.getCreditsPerHour(this.smallExampleFlavor.vcpus, this.smallExampleFlavor.ram).toPromise()
				.then((credits: number): void => {
					this.creditsPerHourSmallExample = credits * 4;
				}).catch((err: Error): void => console.log(err.message));
		}
		if (highMemFlavors.length !== 0) {
			this.largeExampleFlavor = highMemFlavors[0];
			this.creditsService.getCreditsPerHour(this.largeExampleFlavor.vcpus, this.largeExampleFlavor.ram).toPromise()
				.then((credits: number): void => {
					this.creditsPerHourLargeExample = credits;
				}).catch((err: Error): void => console.log(err.message));
		}
	}

	approveMemberApplication(project: number, application: number, membername: string): void {
		this.loaded = false;
		this.application_action_done = false;
		this.groupService.approveGroupApplication(project, application).subscribe((tmp_application: any): void => {
			if (tmp_application['state'] === 'APPROVED') {
				this.application_action_success = true;
			} else if (tmp_application['message']) {
				this.application_action_success = false;

				this.application_action_error_message = tmp_application['message'];

			} else {
				this.application_action_success = false;
			}

			this.application_action = 'approved';
			this.application_member_name = membername;
			this.application_action_done = true;
			this.getUserProjectApplications();
			this.getMembersOfTheProject();
			this.loaded = true;

		});
	}

	initiateLifetimeExtension(): void {
		this.project_extension = new ApplicationLifetimeExtension(null);
		this.project_extension.project_application_id = this.project_application.project_application_id;
		this.project_extension.extra_lifetime = 0;
		this.project_extension.comment = '';
	}

	initiateCreditRequest(): void {
		this.project_credit_request = new ApplicationCreditRequest(null);
		this.project_credit_request.project_application_id = this.project_application.project_application_id;
		this.project_credit_request.comment = '';
		this.project_credit_request.extra_credits = 0;
	}

	getApplication(): void {
		this.applicationsService
			.getApplication(this.application_id)
			.subscribe(
				(aj: Application): void => {
					if (aj.project_application_name === '') {
						this.isLoaded = false;
						this.errorMessage = 'Not found';

						return;
					}

					this.project_application = aj;
					this.credits_allowed = aj.credits_allowed;

					if (this.project_application) {
						this.applicationsService.getApplicationPerunId(this.application_id).subscribe((id: any): void => {
							if (id['perun_id']) {
								this.project_id = id['perun_id'];
								this.getProject();
							}
						});
						if (this.project_application?.project_lifetime_request) {
							this.project_extension = this.project_application.project_lifetime_request;
						} else {
							this.initiateLifetimeExtension();

						}
						if (this.project_application?.project_credit_request) {
							this.project_credit_request = this.project_application.project_credit_request;
						} else {
							this.initiateCreditRequest();
						}
						this.startUpdateCreditUsageLoop();

					}

					this.isLoaded = true;
				},
				(error: any): void => {
					this.isLoaded = false;
					this.errorMessage = `Status: ${error.status.toString()},
                   StatusText: ${error.statusText.toString()},
                   Error Message: ${error.error.toString()}`;
				},
			);
	}

	public requestCreditsModification(): void {
		this.project_credit_request.project_application_id = this.project_application.project_application_id;
		this.applicationsService.requestAdditionalCredits(this.project_credit_request)
			.subscribe((result: { [key: string]: string }): void => {
				if (result['Error']) {
					this.extension_status = 2;
				} else {
					this.fullLayout.getGroupsEnumeration();

					this.extension_status = 1;
				}
				this.getApplication();
			});
	}

	/**
	 * gets a list of all available Flavors from the flavorservice and puts them into the array flavorList
	 */
	getListOfFlavors(): void {
		this.flavorService.getListOfFlavorsAvailable().subscribe((flavors: Flavor[]): void => {
			this.flavorList = flavors;
		});
	}

	/**
	 * gets a list of all available types of flavors from the flavorservice and uses them in the function setListOfTypes
	 */
	getListOfTypes(): void {
		this.flavorService.getListOfTypesAvailable().subscribe((types: FlavorType[]): void => this.setListOfTypes(types));
	}

	setLifetime(): void {

		// tslint:disable-next-line:max-line-length
		this.life_time_string = `${this.project.DateCreated} -  ${this.project.DateEnd}`;
	}

	ngOnInit(): void {
		this.activatedRoute.params.subscribe((paramsId: any): void => {
			this.errorMessage = null;
			this.isLoaded = false;
			this.project = null;
			this.project_application = null;
			this.project_members = [];
			this.application_id = paramsId.id;
			this.getApplication();
			this.getUserinfo();
			this.getListOfFlavors();
			this.getListOfTypes();
			this.getDois();
			this.is_vo_admin = is_vo;

		});
	}

	/**
	 * Checks if user is able to start a machine, when the
	 * project is a SimpleVM project.
	 */
	isAbleToStart(): boolean {
		if (this.resourceDataLoaded) {
			if (!this.project?.OpenStackProject) {
				if (this.vmsInUse < this.maximumVMs) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * If the application is an openstack application, the requested/approved resources will be set for maximum VMs.
	 * For SimpleVM also the VMs in use are set.
	 *
	 * @param groupid the id of the group of the application in perun
	 */
	getUsedResources(groupid: string): void {
		if (!this.project?.OpenStackProject) {
			this.groupService.getGroupResources(groupid).subscribe(
				(res: any): void => {
					this.vmsInUse = res['used_vms'];
					this.maximumVMs = res['number_vms'];
					this.coresInUse = res['cores_used'];
					this.ramInUse = res['ram_used'];
					this.resourceDataLoaded = true;
				},
			);
		} else {
			this.maximumVMs = this.calculateNumberOfVMs(this.project_application?.flavors);
			this.resourceDataLoaded = true;
		}
	}

	/**
	 * Calculates the number of approved VMs for OpenStack Projects
	 *
	 * @param flavors the list of flavors requested in the project
	 */
	calculateNumberOfVMs(flavors: Flavor[]): number {
		let numberOfVMs: number = 0;
		flavors.forEach((flavor: any): void => {
			numberOfVMs += flavor['counter'];
		});

		return numberOfVMs;
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
		try {
			if (this.updateCreditsUsedIntervals) {
				clearInterval(this.updateCreditsUsedIntervals);
			}
		} catch (someError) {
			// empty catch
		}
	}

	getDois(): void {
		this.groupService.getGroupDois(this.application_id).subscribe((dois: Doi[]): void => {
			this.dois = dois;
		});
	}

	isNewDoi(): boolean {
		for (const doi of this.dois) {
			if (doi.identifier === this.newDoi) {
				return false;
			}
		}

		return true;
	}

	deleteDoi(doi: Doi): void {
		this.groupService.deleteGroupDoi(doi.id).subscribe((dois: Doi[]): void => {
			this.dois = dois;
		});
	}

	addDoi(): void {
		this.document.getElementById('add_doi_btn').toggleAttribute('disabled');
		this.document.getElementById('doi_input_field').toggleAttribute('disabled');
		if (this.isNewDoi()) {
			this.groupService.addGroupDoi(this.application_id, this.newDoi).subscribe(
				(dois: Doi[]): void => {
					this.doiError = null;
					this.newDoi = null;
					this.dois = dois;
				},
				(): void => {
					this.doiError = `DOI ${this.newDoi} was already added by another Project!`;
					this.document.getElementById('add_doi_btn').toggleAttribute('disabled');
					this.document.getElementById('doi_input_field').toggleAttribute('disabled');
				},
				(): void => {
					this.document.getElementById('add_doi_btn').toggleAttribute('disabled');
					this.document.getElementById('doi_input_field').toggleAttribute('disabled');
					this.newDoi = null;
				},
			);
		} else {
			this.doiError = `DOI ${this.newDoi} was already added by this Project!`;
			this.newDoi = null;
			this.document.getElementById('add_doi_btn').toggleAttribute('disabled');
			this.document.getElementById('doi_input_field').toggleAttribute('disabled');
		}
	}

	requestProjectTermination(): void {
		this.updateNotificationModal('Waiting', 'Termination request will be submitted...', true, 'info');

		this.groupService.requestProjectTermination(this.project.Id).subscribe((): void => {
			this.fullLayout.getGroupsEnumeration();
			this.getApplication();
			this.updateNotificationModal('Success', 'Termination was requested!', true, 'success');

		});
	}

	/**
	 * Get the facility of an application.
	 *
	 * @param app
	 */
	getFacilityProject():
		void {

		if (!this.project_application.ComputeCenter
			&& !this.project_application.hasSubmittedStatus()
			&& !(this.project_application.hasTerminatedStatus())) {
			this.groupService.getFacilityByGroup(
				this.project_application.project_application_perun_id.toString(),
			).subscribe((res: object): void => {

				const login: string = res['Login'];
				const support: string = res['Support'];
				const facilityname: string = res['Facility'];
				const facilityId: number = res['FacilityId'];
				if (facilityId) {
					this.project_application.ComputeCenter = new ComputecenterComponent(facilityId.toString(), facilityname, login, support);
				}

			});
		}

	}

	rejectMemberApplication(project: number, application: number, membername: string): void {
		this.loaded = false;
		this.application_action_done = false;

		this.groupService.rejectGroupApplication(project, application)
			.subscribe((tmp_application: any): void => {
				this.project.ProjectMemberApplications = [];

				if (tmp_application['state'] === 'REJECTED') {
					this.application_action_success = true;

				} else if (tmp_application['message']) {
					this.application_action_success = false;

					this.application_action_error_message = tmp_application['message'];
				} else {
					this.application_action_success = false;
				}
				this.application_action = 'rejected';
				this.application_member_name = membername;
				this.application_action_done = true;
				this.getUserProjectApplications();
				this.loaded = true;

			});
	}

	/**
	 * Get all user applications for a project.
	 *
	 * @param projectId id of the project
	 */
	getUserProjectApplications(): void {
		this.loaded = false;
		this.groupService.getGroupApplications(this.project.Id).subscribe((applications: any): void => {

			const newProjectApplications: ProjectMemberApplication[] = [];
			if (applications.length === 0) {
				this.project.ProjectMemberApplications = [];

				this.loaded = true;

			}
			for (const application of applications) {
				const dateApplicationCreated: moment.Moment = moment(application['createdAt'], 'YYYY-MM-DD HH:mm:ss.SSS');
				const membername: string = application['displayName'];

				const newMemberApplication: ProjectMemberApplication = new ProjectMemberApplication(
					application['id'], membername,
					`${dateApplicationCreated.date()}.${(dateApplicationCreated.month() + 1)}.${dateApplicationCreated.year()}`,
				);
				newProjectApplications.push(newMemberApplication);
				this.project.ProjectMemberApplications = newProjectApplications;
				this.loaded = true;

			}

		});

	}

	getProject(): void {

		this.groupService.getGroupDetails(this.project_id).subscribe((group: any): void => {
			const dateCreated: moment.Moment = group['createdAt'];
			const dateDayDifference: number = Math.ceil(moment().diff(dateCreated, 'days', true));
			const is_pi: boolean = group['is_pi'];
			const groupid: string = group['id'];
			const facility: any = group['compute_center'];
			const shortname: string = group['shortname'];
			const currentCredits: number = Number(group['current_credits']);
			const approvedCredits: number = Number(group['approved_credits']);

			const realname: string = group['name'];
			let compute_center: ComputecenterComponent = null;

			if (facility) {
				compute_center = new ComputecenterComponent(
					facility['compute_center_facility_id'], facility['compute_center_name'],
					facility['compute_center_login'], facility['compute_center_support_mail'],
				);
			}
			this.isAdmin = is_pi;

			const newProject: Project = new Project(
				groupid,
				shortname,
				group['description'],
				moment(dateCreated).format('DD.MM.YYYY'),
				dateDayDifference,
				is_pi,
				this.isAdmin,
				compute_center,
				currentCredits,
				approvedCredits,
			);
			const lifetime: number | string = group['lifetime'] as number;
			if (lifetime !== -1) {
				const expirationDate: string = moment(moment(dateCreated).add(lifetime, 'months').toDate()).format('DD.MM.YYYY');
				const lifetimeDays: number = Math.abs(moment(moment(expirationDate, 'DD.MM.YYYY').toDate())
					.diff(moment(dateCreated), 'days'));
				newProject.DateEnd = expirationDate;
				newProject.LifetimeDays = lifetimeDays;

			}
			newProject.OpenStackProject = group['openstack_project'];
			newProject.RealName = realname;
			this.project = newProject;
			this.setSupportMails(this.project);
			this.setLifetime();
			this.getMembersOfTheProject();
			if (this.project_application?.project_application_perun_id) {
				// this.startUpdateCreditUsageLoop();
			}
			this.getUsedResources(groupid);

		});

	}

	setSupportMails(project: Project): void {
		if (typeof (project.ComputeCenter?.Support) !== 'undefined' && project.ComputeCenter?.Support) {
			this.supportMails = project.ComputeCenter.Support.toString().split(',');
		} else {
			this.supportMails = [];
		}
	}

	/**
	 * Get all members of a project.
	 *
	 * @param projectId id of the project
	 * @param projectName
	 */
	getMembersOfTheProject(): void {
		this.groupService.getGroupMembers(this.project_id).subscribe((members: ProjectMember[]): void => {

			this.project_members = members;

			if (this.isAdmin) {
				this.groupService.getGroupAdminIds(this.project_id).subscribe((result: any): void => {
					const adminIds: any = result['adminIds'];
					this.project_members.forEach((member: ProjectMember): void => {
						// eslint-disable-next-line no-param-reassign
						member.IsPi = adminIds.indexOf(member.userId) !== -1;
					});

					this.isLoaded = true;
					this.startUpdateCreditUsageLoop();
				});
			}
		});
	}

	setAllMembersChecked(): void {
		if (!this.allSet) {
			this.project_members.forEach((member: ProjectMember): void => {
				if (!this.isMemberChecked(parseInt(member.memberId.toString(), 10))
					&& this.userinfo.MemberId.toString() !== member.memberId.toString()) {
					this.checked_member_list.push(parseInt(member.memberId.toString(), 10));
				}
			});
			this.allSet = true;
		} else {
			this.checked_member_list = [];
			this.allSet = false;
		}
	}

	isMemberChecked(id: number): boolean {
		return this.checked_member_list.indexOf(id) > -1;

	}

	checkIfAllMembersChecked(): void {
		let all_set: boolean = true;
		this.project_members.forEach((member: ProjectMember): void => {
			if (!this.isMemberChecked(parseInt(member.memberId.toString(), 10)) && this.userinfo.MemberId !== member.memberId) {
				all_set = false;

			}
		});

		this.allSet = all_set;

	}

	checkUnCheckMember(id: number): void {
		const indexOf: number = this.checked_member_list.indexOf(id);
		if (indexOf !== -1) {
			this.checked_member_list.splice(indexOf, 1);
			this.allSet = false;

		} else {
			this.checked_member_list.push(id);
			this.checkIfAllMembersChecked();

		}

	}

	removeCheckedMembers(groupId: number | string):
		void {
		this.remove_members_clicked = true;

		const members_in:
			ProjectMember[] = [];

		const observables: Observable<number>[] = this.checked_member_list
			.map((id: number): Observable<any> => this.groupService.removeMember(groupId, id, this.project.ComputeCenter.FacilityId));
		forkJoin(observables).subscribe((): void => {

			this.project_members.forEach((member: ProjectMember): void => {

				if (!this.isMemberChecked(parseInt(member.memberId.toString(), 10))) {
					members_in.push(member);

				}

			});
			this.project_members = members_in;
			this.checked_member_list = [];
			this.allSet = false;
			this.remove_members_clicked = false;

		});
		this.allSet = false;
	}

	setAddUserInvitationLink(): void {
		const uri: string = this.invitation_group_pre + this.project.RealName + this.invitation_group_post + this.project.RealName;
		this.invitation_link = uri;

	}

	copyToClipboard(text: string): void {
		document.addEventListener('copy', (clipEvent: ClipboardEvent): void => {
			clipEvent.clipboardData.setData('text/plain', (text));
			clipEvent.preventDefault();
			document.removeEventListener('copy', null);
		});
		document.execCommand('copy');
	}

	filterMembers(searchString: string): void {
		this.userService.getFilteredMembersOfdeNBIVo(searchString).subscribe((result: object): void => {
			this.filteredMembers = result;
		});
	}

	isPi(member: ProjectMember): string {
		if (member.IsPi) {
			return '#005AA9';
		} else {
			return 'black';
		}

	}

	getUserinfo(): void {
		this.userService.getUserInfo().subscribe((userinfo: any): void => {
			this.userinfo = new Userinfo(userinfo);
		});
	}

	public addMember(groupid: number, memberid: number, firstName: string, lastName: string): void {
		this.groupService.addMember(groupid, memberid, this.project.ComputeCenter.FacilityId).subscribe(
			(result: any): void => {
				if (result.status === 200) {
					this.updateNotificationModal('Success', `Member ${firstName} ${lastName} added.`, true, 'success');
					this.getMembersOfTheProject();
				} else {

					this.updateNotificationModal('Failed', 'Member could not be added!', true, 'danger');
				}
			},
			(error: any): void => {

				if (error['name'] === 'AlreadyMemberException') {
					this.updateNotificationModal('Info', `${firstName} ${lastName} is already a member of the project.`, true, 'info');
				} else {
					this.updateNotificationModal('Failed', 'Member could not be added!', true, 'danger');
				}
			},
		);

	}

	public addAdmin(groupId: number, memberId: number, userId: number, firstName: string, lastName: string): void {
		this.groupService.addMember(groupId, memberId, this.project.ComputeCenter.FacilityId).subscribe(
			(): void => {
				this.groupService.addAdmin(groupId, userId, this.project.ComputeCenter.FacilityId).subscribe(
					(result: any): void => {

						if (result.status === 200) {
							this.updateNotificationModal('Success', `Admin ${firstName} ${lastName} added.`, true, 'success');
							this.getMembersOfTheProject();
						} else {
							this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
						}
					},
					(error: any): void => {
						if (error['name'] === 'AlreadyAdminException') {
							this.updateNotificationModal(
								'Info', `${firstName} ${lastName} is already a admin of the project.`,
								true, 'info',
							);
						} else {
							this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
						}
					},
				);
			},
			(): void => {
				this.groupService.addAdmin(groupId, userId, this.project.ComputeCenter.FacilityId).subscribe(
					(result: any): void => {

						if (result.status === 200) {
							this.updateNotificationModal('Success', `Admin ${firstName} ${lastName} added.`, true, 'success');
							this.getMembersOfTheProject();

						} else {
							this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
						}
					},
					(error: any): void => {
						if (error['name'] === 'AlreadyAdminException') {
							this.updateNotificationModal(
								'Info', `${firstName} ${lastName} is already a admin of the project.`,
								true, 'info',
							);
						} else {
							this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
						}
					},
				);
			},
		);
	}

	public promoteAdmin(groupid: number, userid: number, username: string): void {

		this.groupService.addAdmin(groupid, userid, this.project.ComputeCenter.FacilityId).toPromise()
			.then((result: any): void => {

				if (result.status === 200) {
					this.updateNotificationModal('Success', `${username} promoted to Admin`, true, 'success');
					this.getMembersOfTheProject();

				} else {
					this.updateNotificationModal('Failed', `${username} could not be promoted to Admin!`, true, 'danger');
				}
			}).catch((): void => {
				this.updateNotificationModal('Failed', `${username} could not be promoted to Admin!`, true, 'danger');
			});
	}

	public removeAdmin(groupid: number, userid: number, name: string): void {

		this.groupService.removeAdmin(groupid, userid, this.project.ComputeCenter.FacilityId).toPromise()
			.then((result: any): void => {

				if (result.status === 200) {
					this.updateNotificationModal('Success', `${name} was removed as Admin`, true, 'success');
					this.getMembersOfTheProject();
				} else {
					this.updateNotificationModal('Failed', `${name} could not be removed as Admin!`, true, 'danger');
				}
			}).catch((): void => {
				this.updateNotificationModal('Failed', `${name} could not be removed as Admin!`, true, 'danger');
			});
	}

	/**
	 * Remove an member from a group.
	 *
	 * @param groupid  of the group
	 * @param memberid of the member
	 * @param name  of the member
	 */
	public removeMember(groupid: number, memberid: number, name: string): void {
		const indexOf: number = this.checked_member_list.indexOf(memberid);
		if (indexOf !== -1) {
			this.checked_member_list.splice(indexOf, 1);
			this.allSet = false;
		}

		this.groupService.removeMember(groupid, memberid, this.project.ComputeCenter.FacilityId).subscribe(
			(result: any): void => {

				if (result.status === 200) {
					this.updateNotificationModal('Success', `Member ${name}  removed from the group`, true, 'success');
					this.getMembersOfTheProject();

				} else {
					this.updateNotificationModal('Failed', `Member ${name}  could not be removed !`, true, 'danger');
				}
			},
			(): void => {
				this.updateNotificationModal('Failed', `Member ${name}  could not be removed !`, true, 'danger');
			},
		);
	}

	/**
	 * Delete an application.
	 *
	 * @param application_id
	 */
	public deleteApplication(): void {
		this.applicationsService.deleteApplication(this.project_application.project_application_id).subscribe(
			(): void => {
				this.updateNotificationModal('Success', 'The application has been successfully removed', true, 'success');
				this.fullLayout.getGroupsEnumeration();
				// eslint-disable-next-line no-void
				void this.router.navigate(['/userinfo']);
			},
			(): void => {
				this.updateNotificationModal('Failed', 'Application could not be removed!', true, 'danger');
			},
		);

	}

}
