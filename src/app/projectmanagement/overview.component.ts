import {
	Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild,
} from '@angular/core';
import * as moment from 'moment';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Chart } from 'chart.js';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '../../environments/environment';
import { ProjectMemberApplication } from './project_member_application';
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
	CLOUD_MAIL,
	CREDITS_WIKI,
	OPENSTACK_LINK,
	PUBLICATIONS_LINK,
	SIMPLE_VM_LINK,
	STATUS_LINK,
	WIKI_MEMBER_MANAGEMENT,
	WIKI_PUBLICATIONS,
} from '../../links/links';
import { Doi } from '../applications/doi/doi';
import { ApiSettings } from '../api-connector/api-settings.service';
import { Application_States, ExtensionRequestType } from '../shared/shared_modules/baseClass/abstract-base-class';
import { ProjectMember } from './project_member.model';
import { ModificationRequestComponent } from './modals/modification-request/modification-request.component';
import { LifetimeRequestComponent } from './modals/lifetime-request/lifetime-request.component';
import { DoiComponent } from './modals/doi/doi.component';
import { CreditsRequestComponent } from './modals/credits-request/credits-request.component';

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
	creditsExtensionDisabled: boolean = false;

	invitation_group_post: string = environment.invitation_group_post;
	voRegistrationLink: string = environment.voRegistrationLink;
	invitation_group_pre: string = environment.invitation_group_pre;
	WIKI_MEMBER_MANAGEMENT: string = WIKI_MEMBER_MANAGEMENT;
	WIKI_PUBLICATIONS: string = WIKI_PUBLICATIONS;
	CREDITS_WIKI: string = CREDITS_WIKI;
	CLOUD_MAIL: string = CLOUD_MAIL;
	PUBLICATIONS_LINK: string = PUBLICATIONS_LINK;
	SIMPLE_VM_LINK: string = SIMPLE_VM_LINK;
	OPENSTACK_LINK: string = OPENSTACK_LINK;
	STATUS_LINK: string = STATUS_LINK;
	@ViewChild('creditsChart') creditsCanvas: ElementRef;
	project_id: string;
	application_id: string;
	credits: number = 0;
	errorMessage: string;
	terminate_confirmation_given: boolean = false;
	showInformationCollapse: boolean = false;
	newDoi: string;
	doiError: string;
	remove_members_clicked: boolean;
	dois: Doi[];
	disabledDoiInput: boolean = false;
	invitation_link: string;
	filteredMembers: any = null;
	project_application: Application;
	application_action: string = '';
	application_member_name: string = '';
	application_action_done: boolean = false;
	application_action_success: boolean;
	application_action_error_message: boolean;
	loaded: boolean = true;
	userinfo: Userinfo;
	allSet: boolean = false;
	renderer: Renderer2;
	supportMails: string[] = [];
	toggleLocked: boolean = false;
	resourceDataLoaded: boolean = false;
	creditHistoryLoaded: boolean = false;
	project_members_loaded: boolean = false;
	vmsInUse: number;
	maximumVMs: number;
	coresInUse: number;
	ramInUse: number;
	title: string = 'Project Overview';

	checked_member_list: number[] = [];
	// modal variables for User list
	public project_members: ProjectMember[] = [];
	public isLoaded: boolean = false;
	public showLink: boolean = true;
	creditsChart: any;
	ExtensionRequestType: typeof ExtensionRequestType = ExtensionRequestType;
	Application_States: typeof Application_States = Application_States;
	private subscription: Subscription = new Subscription();
	private updateCreditsUsedIntervals: ReturnType<typeof setTimeout>;
	private updateCreditsHistoryIntervals: ReturnType<typeof setTimeout>;

	constructor(
		private flavorService: FlavorService,
		private groupService: GroupService,
		private modalService: BsModalService,
		applicationsService: ApplicationsService,
		facilityService: FacilityService,
		userService: UserService,
		private activatedRoute: ActivatedRoute,
		private fullLayout: FullLayoutComponent,
		private router: Router,
		private creditsService: CreditsService,
		@Inject(DOCUMENT) private document: Document,
	) {
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

	ngOnInit(): void {
		this.activatedRoute.params.subscribe((paramsId: any): void => {
			try {
				if (this.updateCreditsUsedIntervals) {
					clearInterval(this.updateCreditsUsedIntervals);
				}
				if (this.updateCreditsHistoryIntervals) {
					clearInterval(this.updateCreditsHistoryIntervals);
					this.creditHistoryLoaded = false;
				}
			} catch (someError) {
				// empty catch
			}

			this.subscription.unsubscribe();
			this.subscription = new Subscription();
			this.modificationRequestDisabled = false;
			this.lifetimeExtensionDisabled = false;
			this.creditsExtensionDisabled = false;
			this.disabledDoiInput = false;
			this.resourceDataLoaded = false;
			this.creditHistoryLoaded = false;
			this.errorMessage = null;
			this.isLoaded = false;
			this.creditHistoryLoaded = false;
			this.project_members_loaded = false;
			this.errorMessage = null;
			this.isLoaded = false;
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

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
		try {
			if (this.updateCreditsUsedIntervals) {
				clearInterval(this.updateCreditsUsedIntervals);
			}
			if (this.updateCreditsHistoryIntervals) {
				clearInterval(this.updateCreditsHistoryIntervals);
			}
		} catch (someError) {
			// empty catch
		}
	}

	getApplication(): void {
		this.subscription.add(
			this.applicationsService
				.getFullApplicationByUserPermissions(this.application_id)
				.subscribe(
					(aj: Application): void => {
						if (aj.project_application_name === '') {
							this.isLoaded = false;
							this.errorMessage = 'Not found';

							return;
						}

						this.project_application = aj;

						this.setSupportMails(this.project_application);

						if (this.project_application.project_application_perun_id) {
							this.getUsedResources();
							if (this.project_application.user_is_admin || this.project_application.show_member_names) {
								this.getMembersOfTheProject();
							}
							if (this.project_application.credits_allowed && !this.project_application.credits_loop_started) {
								this.project_application.setCreditsLoopStarted();
								this.startUpdateCreditUsageLoop();
							}
						}

						this.isLoaded = true;
					},
					(error: any): void => {
						this.isLoaded = false;
						this.errorMessage = `Status: ${error.status.toString()},
                   StatusText: ${error.statusText.toString()},
                   Error Message: ${error.error.toString()}`;
					},
				),
		);
	}

	getUserinfo(): void {
		this.subscription.add(
			this.userService.getUserInfo().subscribe((userinfo: Userinfo): void => {
				this.userinfo = userinfo;
			}),
		);
	}

	/**
	 * gets a list of all available Flavors from the flavorservice and puts them into the array flavorList
	 */
	getListOfFlavors(): void {
		this.subscription.add(
			this.flavorService.getListOfFlavorsAvailable().subscribe((flavors: Flavor[]): void => {
				this.flavorList = flavors;
			}),
		);
	}

	/**
	 * gets a list of all available types of flavors from the flavorservice and uses them in the function setListOfTypes
	 */
	getListOfTypes(): void {
		this.subscription.add(
			this.flavorService.getListOfTypesAvailable().subscribe((types: FlavorType[]): void => this.setListOfTypes(types)),
		);
	}

	getDois(): void {
		this.subscription.add(
			this.groupService.getGroupDois(this.application_id).subscribe((dois: Doi[]): void => {
				this.dois = dois;
			}),
		);
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

	showDoiModal(): void {
		const initialState = {
			dois: this.dois,
			application_id: this.application_id,
		};

		this.bsModalRef = this.modalService.show(DoiComponent, { initialState });
		this.bsModalRef.setClass('modal-lg');
		this.subscription.add(
			this.bsModalRef.content.event.subscribe(
				(result: any) => {
					if ('reloadDoi' in result && result['reloadDoi']) {
						this.getDois();
					} else if ('reloadDoi' in result && !result['reloadDoi']) {
						this.showLifetimeExtensionModal();
					}
				},
			),
		);
	}

	showLifetimeExtensionModal(): void {
		if (this.lifetimeExtensionDisabled) {
			return;
		}

		this.lifetimeExtensionDisabled = true;

		const initialState = {
			project: this.project_application,
			life_time_string: `${this.project_application.project_application_date_approved} - ${this.project_application.date_end}`,
		};
		this.bsModalRef = this.modalService.show(LifetimeRequestComponent, { initialState });
		this.bsModalRef.setClass('modal-lg');
		this.subscribeForExtensionResult(this.ExtensionRequestType.EXTENSION);
	}

	showCreditsExtensionModal(): void {
		if (this.creditsExtensionDisabled) {
			return;
		}

		this.creditsExtensionDisabled = true;

		const initialState = {
			project: this.project_application,
			flavorList: this.flavorList,
		};
		this.bsModalRef = this.modalService.show(CreditsRequestComponent, { initialState });
		this.bsModalRef.setClass('modal-lg');
		this.subscribeForExtensionResult(this.ExtensionRequestType.CREDIT);
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
						} else if (type === this.ExtensionRequestType.CREDIT) {
							this.creditsExtensionDisabled = true;
						}
						this.fullLayout.getGroupsEnumeration();
						this.getApplication();
					} else if (type === this.ExtensionRequestType.EXTENSION) {
						this.lifetimeExtensionDisabled = false;
					} else if (type === this.ExtensionRequestType.MODIFICATION) {
						this.modificationRequestDisabled = false;
					} else if (type === this.ExtensionRequestType.CREDIT) {
						this.creditsExtensionDisabled = false;
					}
				},
			),
		);
	}

	fetchCreditHistoryOfProject(): void {
		this.creditHistoryLoaded = false;
		if (this.project_application != null && this.project_application.credits_allowed) {
			this.creditsService.getCreditsUsageHistoryOfProject(Number(this.project_application.project_application_perun_id.toString())).toPromise()
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
					if (!this.creditHistoryLoaded) {
						this.creditHistoryLoaded = true;
					}
				}).catch((err: Error): void => console.log(err.message));
		}
	}

	startUpdateCreditUsageLoop(): void {
		if (!this.project_application.credits_allowed || !this.project_application || !this.project_application.project_application_perun_id) {
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
		if (this.project_application && this.project_application.project_application_perun_id && this.project_application.credits_allowed) {
			this.subscription.add(
				this.creditsService.getCurrentCreditsOfProject(this.project_application.project_application_perun_id.toString())
					.subscribe(
						(credits: number): void => {
							if (this.project_application != null) {
								this.project_application.project_application_current_credits = credits;
							}
						},
						(err: Error): void => {
							console.log(err.message);
						},
					),
			);
		}
	}

	approveMemberApplication(application: number, membername: string): void {
		this.loaded = false;
		this.application_action_done = false;
		this.subscription.add(
			this.groupService.approveGroupApplication(Number(this.project_application.project_application_perun_id), application)
				.subscribe((tmp_application: any): void => {
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

				}),
		);
	}

	/**
	 * Checks if user is able to start a machine, when the
	 * project is a SimpleVM project.
	 */
	isAbleToStart(): boolean {
		if (this.resourceDataLoaded) {
			if (!this.project_application?.project_application_openstack_project) {
				if ((this.vmsInUse < this.maximumVMs)
					&& (this.project_application.user_is_admin || !this.project_application.prevent_machines_starting)) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * If the application is an openstack application, the requested/approved resources will be set for maximum VMs.
	 * For SimpleVM also the VMs in use are set.
	 */
	getUsedResources(): void {
		this.resourceDataLoaded = false;

		if (!this.project_application?.project_application_openstack_project) {
			this.subscription.add(
				this.groupService.getGroupResources(this.project_application.project_application_perun_id.toString()).subscribe(
					(res: any): void => {
						this.vmsInUse = res['used_vms'];
						this.maximumVMs = res['number_vms'];
						this.coresInUse = res['cores_used'];
						this.ramInUse = res['ram_used'];
						this.resourceDataLoaded = true;
					},
				),
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

	isNewDoi(): boolean {
		for (const doi of this.dois) {
			if (doi.identifier === this.newDoi) {
				return false;
			}
		}

		return true;
	}

	deleteDoi(doi: Doi): void {
		this.subscription.add(
			this.groupService.deleteGroupDoi(doi.id).subscribe((dois: Doi[]): void => {
				this.dois = dois;
			}),
		);
	}

	toggleDoiDisabledInput(): void {
		this.disabledDoiInput = !this.disabledDoiInput;
	}

	toggleMemberNameVisibility(): void {
		this.toggleLocked = true;
		this.groupService.toggleVisibility(this.project_application.project_application_perun_id)
			.subscribe((res: any): void => {
				this.project_application.show_member_names = res['show_member_names'];
				this.toggleLocked = false;
			}, () => {
				this.toggleLocked = false;
			});
	}

	toggleStartingOfMachines(): void {
		this.toggleLocked = true;
		this.groupService.toggleStartingMachines(this.project_application.project_application_perun_id)
			.subscribe((res: any): void => {
				this.project_application.prevent_machines_starting = res['prevent_starting'];
				this.toggleLocked = false;
			}, () => {
				this.toggleLocked = false;
			});
	}

	switchToggleLocked(check: boolean): void {
		this.toggleLocked = check;
	}

	addDoi(): void {
		this.toggleDoiDisabledInput();
		if (this.isNewDoi()) {
			this.subscription.add(
				this.groupService.addGroupDoi(this.application_id, this.newDoi).subscribe(
					(dois: Doi[]): void => {
						this.doiError = null;
						this.newDoi = null;
						this.dois = dois;
					},
					(): void => {
						this.doiError = `DOI ${this.newDoi} was already added by another Project!`;
						this.toggleDoiDisabledInput();
					},
					(): void => {
						this.toggleDoiDisabledInput();
						this.newDoi = null;
					},
				),
			);
		} else {
			this.doiError = `DOI ${this.newDoi} was already added by this Project!`;
			this.newDoi = null;
			this.toggleDoiDisabledInput();
		}
	}

	requestProjectTermination(): void {
		this.updateNotificationModal('Waiting', 'Termination request will be submitted...', true, 'info');

		this.subscription.add(
			this.groupService.requestProjectTermination(this.project_application.project_application_perun_id).subscribe((): void => {
				this.fullLayout.getGroupsEnumeration();
				this.getApplication();
				this.updateNotificationModal('Success', 'Termination was requested!', true, 'success');
			}),
		);
	}

	rejectMemberApplication(application: number, membername: string): void {
		this.loaded = false;
		this.application_action_done = false;
		this.subscription.add(
			this.groupService.rejectGroupApplication(Number(this.project_application.project_application_perun_id), application)
				.subscribe((tmp_application: any): void => {
					this.project_application.project_application_member_applications = [];

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

				}),
		);
	}

	/**
	 * Get all user applications for a project.
	 */
	getUserProjectApplications(): void {
		this.loaded = false;
		this.subscription.add(
			this.groupService.getGroupApplications(this.project_application.project_application_perun_id).subscribe((applications: any): void => {

				const newProjectApplications: ProjectMemberApplication[] = [];
				if (applications.length === 0) {
					this.project_application.project_application_member_applications = [];

					this.loaded = true;

				}
				for (const application of applications) {
					const dateApplicationCreated: moment.Moment = moment(application['createdAt'], 'YYYY-MM-DD HH:mm:ss.SSS');
					const membername: string = application['displayName'];

					const newMemberApplication: ProjectMemberApplication = new ProjectMemberApplication(
						application['id'],
						membername,
						`${dateApplicationCreated.date()}.${(dateApplicationCreated.month() + 1)}.${dateApplicationCreated.year()}`,
					);
					newProjectApplications.push(newMemberApplication);
					this.project_application.project_application_member_applications = newProjectApplications;
					this.loaded = true;

				}

			}),
		);
	}

	setSupportMails(project: Application): void {
		if (typeof (project.project_application_compute_center?.Support) !== 'undefined'
			&& project.project_application_compute_center?.Support) {
			this.supportMails = project.project_application_compute_center.Support.toString().split(',');
		} else {
			this.supportMails = [];
		}
	}

	/**
	 * Get all members of a project.
	 */
	getMembersOfTheProject(): void {
		this.project_members_loaded = false;
		this.subscription.add(
			this.groupService.getGroupMembers(this.project_application.project_application_perun_id.toString())
				.subscribe((members: ProjectMember[]): void => {
					this.project_members = members;
					if (this.project_application.user_is_admin) {

						if (this.project_application
							&& this.project_application.credits_allowed
							&& !this.project_application.credits_loop_started) {
							this.project_application.setCreditsLoopStarted();
							this.startUpdateCreditUsageLoop();
						}
					}
					this.project_members_loaded = true;
					this.isLoaded = true;
				}),
		);

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

	removeCheckedMembers():
		void {
		this.remove_members_clicked = true;

		const members_in:
			ProjectMember[] = [];

		const observables: Observable<number>[] = this.checked_member_list
			.map((id: number): Observable<any> => this.groupService.removeMember(
				Number(this.project_application.project_application_perun_id),
				id,
				this.project_application.project_application_compute_center.FacilityId,
			));
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
		const uri: string = this.invitation_group_pre + this.project_application.perun_name
			+ this.invitation_group_post + this.project_application.perun_name;
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
		this.subscription.add(
			this.userService.getFilteredMembersOfdeNBIVo(searchString).subscribe((result: any): void => {
				this.filteredMembers = [];
				for (const entry of result) {
					let member_exist: boolean = false;

					for (const projectMember of this.project_members) {
						if (projectMember.memberId === entry.member_id) {
							member_exist = true;
							break;

						}

					}
					if (!member_exist) {
						this.filteredMembers.push(entry);

					}

				}
			}),
		);
	}

	public addMember(memberid: number, firstName: string, lastName: string): void {
		this.subscription.add(
			this.groupService.addMember(
				this.project_application.project_application_perun_id,
				memberid,
				this.project_application.project_application_compute_center.FacilityId,
			).subscribe(
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
			),
		);
	}

	public addAdmin(memberId: number, userId: number, firstName: string, lastName: string): void {
		this.subscription.add(
			this.groupService.addMember(
				this.project_application.project_application_perun_id,
				memberId,
				this.project_application.project_application_compute_center.FacilityId,
			).subscribe(
				(): void => {
					this.subscription.add(
						this.groupService.addAdmin(
							this.project_application.project_application_perun_id,
							userId,
							this.project_application.project_application_compute_center.FacilityId,
						).subscribe(
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
										'Info',
										`${firstName} ${lastName} is already a admin of the project.`,
										true,
										'info',
									);
								} else {
									this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
								}
							},
						),
					);
				},
				(): void => {
					this.subscription.add(
						this.groupService.addAdmin(
							this.project_application.project_application_perun_id,
							userId,
							this.project_application.project_application_compute_center.FacilityId,
						).subscribe(
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
										'Info',
										`${firstName} ${lastName} is already a admin of the project.`,
										true,
										'info',
									);
								} else {
									this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
								}
							},
						),
					);
				},
			),
		);
	}

	public promoteAdmin(userid: number, username: string): void {
		this.groupService.addAdmin(
			this.project_application.project_application_perun_id,
			userid,
			this.project_application.project_application_compute_center.FacilityId,
		).toPromise()
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

	public removeAdmin(userid: number, name: string): void {
		if (this.userinfo.Id.toString() === userid.toString()) {
			return;
		}

		this.groupService.removeAdmin(
			this.project_application.project_application_perun_id,
			userid,
			this.project_application.project_application_compute_center.FacilityId,
		).toPromise()
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
	 * Remove a member from a group.
	 *
	 * @param memberid of the member
	 * @param name  of the member
	 */
	public removeMember(memberid: number, name: string): void {
		if (this.userinfo.MemberId.toString() === memberid.toString()) {
			return;
		}
		const indexOf: number = this.checked_member_list.indexOf(memberid);
		if (indexOf !== -1) {
			this.checked_member_list.splice(indexOf, 1);
			this.allSet = false;
		}
		this.subscription.add(
			this.groupService.removeMember(
				this.project_application.project_application_perun_id,
				memberid,
				this.project_application.project_application_compute_center.FacilityId,
			).subscribe(
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
			),
		);
	}

	/**
	 * Leave a project
	 *
	 * @param memberid of the member
	 * @param projectname of the project
	 */
	public leaveProject(memberid: number, projectname: string): void {
		if (this.project_application.project_application_pi.elixir_id === this.userinfo.ElixirId) {
			this.updateNotificationModal(
				'Denied',
				'You cannot leave projects as PI. Please contact cloud@denbi.de for further steps.',
				true,
				'danger',
			);
		} else {
			this.subscription.add(
				this.groupService.leaveGroup(
					this.project_application.project_application_perun_id,
					memberid,
					this.project_application.project_application_compute_center.FacilityId,
				).subscribe(
					(result: any): void => {

						if (result.status === 200) {
							this.updateNotificationModal(
								'Success',
								`You were removed from the project ${projectname}`,
								true,
								'success',
							);
							void this.router.navigate(['/userinfo']);
							this.fullLayout.getGroupsEnumeration();

						} else {
							this.updateNotificationModal(
								'Failed',
								`Failed to leave the project ${projectname}!`,
								true,
								'danger',
							);
						}
					},
					(): void => {
						this.updateNotificationModal(
							'Failed',
							`Failed to leave the project ${projectname}!`,
							true,
							'danger',
						);
					},
				),
			);
		}

	}

	/**
	 * Delete an application.
	 */
	public deleteApplication(): void {
		this.subscription.add(
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
			),
		);
	}

}
