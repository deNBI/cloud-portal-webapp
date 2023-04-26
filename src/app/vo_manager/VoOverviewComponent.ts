import { ngxCsv } from 'ngx-csv/ngx-csv';
import {
	Component, OnInit, QueryList, ViewChildren,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, take } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { VoService } from '../api-connector/vo.service';
import { ProjectMember } from '../projectmanagement/project_member.model';
import { GroupService } from '../api-connector/group.service';
import { ComputecenterComponent } from '../projectmanagement/computecenter.component';
import { IResponseTemplate } from '../api-connector/response-template';
import { FacilityService } from '../api-connector/facility.service';
import { FullLayoutComponent } from '../layouts/full-layout.component';
import { Application } from '../applications/application.model/application.model';
import { AbstractBaseClass, Application_States } from '../shared/shared_modules/baseClass/abstract-base-class';
import {
	NgbdSortableHeaderDirective,
	SortEvent,
} from '../shared/shared_modules/directives/nbd-sortable-header.directive';
import { ProjectSortService } from '../shared/shared_modules/services/project-sort.service';
import { ProjectEmailModalComponent } from '../shared/modal/email/project-email-modal/project-email-modal.component';

/**
 * Vo Overview component.
 */
@Component({
	selector: 'app-vo-overview',
	templateUrl: 'voOverview.component.html',
	providers: [VoService, GroupService, FacilityService, ProjectSortService],
})
export class VoOverviewComponent extends AbstractBaseClass implements OnInit {
	title: string = 'VO Overview';
	public emailSubject: string;
	public emailReply: string = '';
	public emailText: string;
	public emailStatus: number = 0;

	public emailHeader: string;
	public emailVerify: string;
	public emailType: number;
	public emailAdminsOnly: boolean = false;
	public expiredTemplated: boolean = false;

	public removalDate: Date = new Date();
	public selectedProject: Application;
	selectedEmailProjects: Application[] = [];
	computecenters: ComputecenterComponent[] = [];
	bsModalRef: BsModalRef;

	show_openstack_projects: boolean = true;
	show_simple_vm_projects: boolean = true;
	show_simple_vm: boolean = true;
	show_openstack: boolean = true;

	selectedProjectType: string = 'ALL';
	selectedFacility: string | number = 'ALL';

	public newsletterSubscriptionCounter: number;
	isLoaded: boolean = false;
	member_id: number;
	projects: Application[] = [];
	projects_filtered: Application[] = [];

	// modal variables for User list
	public usersModalProjectMembers: ProjectMember[] = [];
	public usersModalProjectID: number;
	public usersModalProjectName: string;
	public managerFacilities: [string, number][];

	projectMailTemplates: string[] = [];
	@ViewChildren(NgbdSortableHeaderDirective) headers: QueryList<NgbdSortableHeaderDirective>;

	applictions$: Observable<Application[]>;
	total$: Observable<number>;

	// public selectedFacility: [string, number];

	constructor(
		private fullLayout: FullLayoutComponent,
		private sanitizer: DomSanitizer,
		private voService: VoService,
		private groupservice: GroupService,
		private facilityService: FacilityService,
		public sortProjectService: ProjectSortService,
		private modalService: BsModalService,
	) {
		super();
	}

	ngOnInit(): void {
		this.getVoProjects();
		this.getComputeCenters();
		this.voService.getNewsletterSubscriptionCounter().subscribe((result: IResponseTemplate): void => {
			this.newsletterSubscriptionCounter = result.value as number;
		});
	}

	selectAllFilteredProjects(): void {
		this.selectedEmailProjects = [];

		// get all the applications
		this.applictions$.pipe(take(1)).subscribe(applications => {
			// set the selected state of all projects to true
			applications.forEach(application => {
				application.is_project_selected = true;
				this.toggleSelectedEmailApplication(application, application.is_project_selected);
			});
		});
	}

	unselectAll(): void {
		this.sortProjectService.applications.forEach((pr: Application) => {
			pr.is_project_selected = false;
			this.toggleSelectedEmailApplication(pr, pr.is_project_selected);
		});
		//		this.selectedEmailProjects = []; // clear the selectedEmailProjects list
	}

	unselectAllFilteredProjects(): void {
		// get all the applications
		this.applictions$.pipe(take(1)).subscribe(applications => {
			// set the selected state of all projects to false
			applications.forEach(application => {
				application.is_project_selected = false;
				this.toggleSelectedEmailApplication(application, application.is_project_selected);
			});
		});
	}

	toggleSelectedEmailApplication(application: Application, isChecked: boolean): void {
		const index = this.selectedEmailProjects.indexOf(application);

		if (isChecked) {
			// checkbox was checked
			if (index === -1) {
				// application is not in the list, so add it
				this.selectedEmailProjects.push(application);
			}
		} else {
			// checkbox was unchecked
			// application is in the list, so remove it
			this.selectedEmailProjects.splice(index, 1);
		}
	}

	openProjectMailsModal(): void {
		const initialState = { selectedProjects: this.selectedEmailProjects };

		this.bsModalRef = this.modalService.show(ProjectEmailModalComponent, { initialState, class: 'modal-lg' });
	}

	onSort({ column, direction }: SortEvent) {
		// resetting other headers
		this.headers.forEach(header => {
			if (header.appSortable !== column) {
				header.direction = '';
			}
		});

		this.sortProjectService.sortColumn = column;
		this.sortProjectService.sortDirection = direction;
	}

	getApplicationInfos(): void {
		this.voService.getVoProjectResourcesTimeframes().subscribe();

		this.voService.getVoProjectCounter().subscribe();
		this.voService.getVoProjectDates().subscribe();
	}

	sendEmail(subject: string, message: string, reply?: string): void {
		if (reply) {
			reply = reply.trim();
		}
		switch (this.emailType) {
			case 0: {
				this.sendMailToVo(
					subject,
					message,
					this.selectedFacility.toString(),
					this.selectedProjectType,
					this.emailAdminsOnly,
					this.expiredTemplated,
					this.removalDate,
					reply,
				);
				break;
			}
			case 1: {
				this.sendNewsletterToVo(subject, message, this.selectedProjectType, this.emailAdminsOnly, reply);
				break;
			}
			default:
		}
	}

	sendTestBug(): void {
		this.voService.sendTestError().subscribe();
	}

	sendNewsletterToVo(
		subject: string,
		message: string,
		selectedProjectType: string,
		adminsOnly: boolean,
		reply?: string,
	): void {
		this.voService
			.sendNewsletterToVo(
				encodeURIComponent(subject),
				encodeURIComponent(message),
				selectedProjectType,
				adminsOnly,
				encodeURIComponent(reply),
			)
			.subscribe((result: IResponseTemplate): void => {
				if ((result.value as boolean) === true) {
					this.emailStatus = 1;
				} else {
					this.emailStatus = 2;
				}
			});
	}

	sendMailToVo(
		subject: string,
		message: string,
		facility: string,
		type: string,
		adminsOnly: boolean,
		expiredTemplate: boolean,
		removalDate: Date,
		reply?: string,
	): void {
		this.voService
			.sendMailToVo(
				encodeURIComponent(subject),
				encodeURIComponent(message),
				facility,
				type,
				adminsOnly,
				expiredTemplate,
				removalDate,
				encodeURIComponent(reply),
			)
			.subscribe((result: IResponseTemplate): void => {
				if ((result.value as boolean) === true) {
					this.emailStatus = 1;
				} else {
					this.emailStatus = 2;
				}
				this.selectedProjectType = 'ALL';
				this.selectedFacility = 'ALL';
			});
	}

	dayChanged(date: { year: number; month: number; day: number }): void {
		this.removalDate.setDate(date.day);
		this.removalDate.setMonth(date.month - 1);
		this.removalDate.setFullYear(date.year);
	}

	setEmailType(type: number): void {
		this.emailType = type;
		switch (this.emailType) {
			case 0: {
				this.emailHeader = 'Send email to selected members of the VO';
				break;
			}
			case 1: {
				this.emailHeader = 'Send newsletter to VO';
				break;
			}
			default:
		}
		this.emailVerify = 'Are you sure you want to send this newsletter to all members of the de.NBI VO?';
	}

	getFacilityName(): string {
		if (this.selectedFacility === 'ALL') {
			return 'of the de.NBI VO';
		} else {
			const temp_cc = this.computecenters.find(cc => cc.FacilityId === this.selectedFacility);
			if (temp_cc === undefined) {
				return 'of the de.NBI VO';
			} else {
				return `of the facility "${temp_cc.Name}"`;
			}
		}
	}

	getMailConfinementByProjectType(): string {
		switch (this.selectedProjectType) {
			case 'ALL_GM':
				return 'of all active projects';
			case 'EXP':
				return 'of all expired projects';
			case 'SVP':
				return 'of all SimpleVM projects';
			case 'OVP':
				return 'of all OpenStack projects';
			case 'WSH':
				return 'of all Workshops';
			default:
				return '';
		}
	}

	adjustVerifyText(): void {
		switch (this.emailType) {
			case 0: {
				this.emailVerify = `Are you sure you want to send this email to all ${
					this.emailAdminsOnly ? ' group administrators' : 'members'
				} ${this.getMailConfinementByProjectType()} ${this.getFacilityName()} ?`;
				break;
			}
			case 1: {
				this.emailVerify = `Are you sure you want to send this newsletter to all members ${this.getMailConfinementByProjectType()} ${this.getFacilityName()} ?`;
				break;
			}
			default:
				this.emailVerify = 'Are you sure you want to send this?';
		}
		if (this.selectedProjectType !== 'EXP') {
			this.expiredTemplated = false;
		}
	}

	getVoProjects(): void {
		this.projects = [];
		this.voService.getAllGroupsWithDetails().subscribe((applications: Application[]): void => {
			for (const application of applications) {
				if (application.project_application_lifetime > 0) {
					application.lifetime_reached = this.lifeTimeReached(application.lifetime_days, application.DaysRunning);
				}
				this.projects.push(application);
			}
			this.sortProjectService.applications = this.projects;
			this.applictions$ = this.sortProjectService.applications$;
			this.total$ = this.sortProjectService.total$;

			this.isLoaded = true;
		});
	}

	resetEmailModal(): void {
		this.emailHeader = null;
		this.emailSubject = null;
		this.emailText = null;
		this.emailType = null;
		this.emailVerify = null;
		this.emailReply = '';
		this.emailStatus = 0;
		this.emailAdminsOnly = false;
	}

	public resetNotificationModal(): void {
		this.notificationModalTitle = 'Notification';
		this.notificationModalMessage = 'Please wait...';
		this.notificationModalIsClosable = false;
		this.notificationModalType = 'info';
	}

	/**
	 * Get all computecenters.
	 */
	getComputeCenters(): void {
		this.facilityService.getComputeCenters().subscribe((result: any): void => {
			for (const cc of result) {
				const compute_center: ComputecenterComponent = new ComputecenterComponent(
					cc['compute_center_facility_id'],
					cc['compute_center_name'],
					cc['compute_center_login'],
					cc['compute_center_support_mail'],
				);
				this.computecenters.push(compute_center);
			}
		});
	}

	/**
	 * Bugfix not scrollable site after closing modal
	 */
	removeModalOpen(): void {
		document.body.classList.remove('modal-open');
	}

	public terminateProject(): void {
		this.voService.terminateProject(this.selectedProject.project_application_perun_id).subscribe(
			(): void => {
				const indexAll: number = this.projects.indexOf(this.selectedProject, 0);
				if (!this.selectedProject.project_application_openstack_project) {
					this.projects.splice(indexAll, 1);
					this.sortProjectService.applications = this.projects;
				} else {
					this.getProjectStatus(this.projects[indexAll]);
				}
				this.fullLayout.getGroupsEnumeration();
				if (this.selectedProject.project_application_openstack_project) {
					this.updateNotificationModal(
						'Success',
						'The request to terminate the project was forwarded to the facility manager.',
						true,
						'success',
					);
				} else {
					this.updateNotificationModal('Success', 'The  project was terminated.', true, 'success');
				}
			},
			(error: any): void => {
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
			},
		);
	}

	getProjectStatus(project: Application): void {
		this.voService.getProjectStatus(project.project_application_perun_id).subscribe((res: any): void => {
			project.project_application_statuses = res['status'];
		});
	}

	suspendProject(project: Application): void {
		this.voService.removeResourceFromGroup(project.project_application_perun_id).subscribe((): void => {
			this.getProjectStatus(project);
			project.project_application_compute_center = null;
		});
	}

	resumeProject(project: Application): void {
		this.voService.resumeProject(project.project_application_perun_id).subscribe((): void => {
			this.getProjectStatus(project);
		});
	}

	declineTermination(project: Application): void {
		this.voService.declineTermination(project.project_application_perun_id).subscribe(
			(): void => {
				this.updateNotificationModal('Success', 'The termination was successfully declined', true, 'success');
				const indexAll: number = this.projects.indexOf(project, 0);
				this.getProjectStatus(this.projects[indexAll]);
			},
			(): void => {
				this.updateNotificationModal('Failed', 'The status change was not successful.', true, 'danger');
			},
		);
	}

	setProtected(project: Application, set: boolean): void {
		this.voService.setProtected(project.project_application_perun_id, set).subscribe(
			(result: any): void => {
				this.updateNotificationModal(
					'Success',
					result['result'] === 'set'
						? 'The project was successfully set as protected.'
						: 'The status "Protected" was removed successfully',
					true,
					'success',
				);
				const indexAll: number = this.projects.indexOf(project, 0);
				this.getProjectStatus(this.projects[indexAll]);
			},
			(error: any): void => {
				if (error['status'] === 500) {
					this.updateNotificationModal('Failed', 'The status change was not successful.', true, 'danger');
				}
			},
		);
	}

	getMembersOfTheProject(projectid: number, projectname: string): void {
		this.voService.getVoGroupRichMembers(projectid).subscribe((members: ProjectMember[]): void => {
			this.usersModalProjectID = projectid;
			this.usersModalProjectName = projectname;
			this.usersModalProjectMembers = members;
		});
	}

	showMembersOfTheProject(projectid: number, projectname: string): void {
		this.getMembersOfTheProject(projectid, projectname);
	}

	exportTSV(): void {
		const data = [];
		this.sortProjectService.sorted_applications.forEach(application => {
			const entry = {};
			for (const key in application) {
				if (typeof application[key] === 'object') {
					if (key === 'project_application_pi') {
						entry['project_application_pi_name'] = application[key].username;
						entry['project_application_pi_email'] = application[key].email;
						entry['project_application_pi_affiliations'] = JSON.stringify(application[key].user_affiliations);
					} else if (key === 'project_application_statuses') {
						const statuses_strings = [];
						application[key].forEach(status => {
							statuses_strings.push(Application_States[status]);
						});
						entry[key] = JSON.stringify(statuses_strings);
					} else if (key === 'project_credit_request') {
						if (application[key] == null) {
							entry['project_credit_requested'] = 'FALSE';
							entry['project_credit_request_id'] = 'NONE';
							entry['project_credit_request_comment'] = 'NONE';
							entry['project_credit_request_date_submitted'] = 'NONE';
							entry['project_credit_request_extra_credits'] = 'NONE';
							entry['project_credit_request_user_name'] = 'NONE';
							entry['project_credit_request_user_email'] = 'NONE';
						} else {
							entry['project_credit_requested'] = 'TRUE';
							entry['project_credit_request_id'] = JSON.stringify(application[key].Id);
							entry['project_credit_request_comment'] = application[key].comment;
							entry['project_credit_request_date_submitted'] = JSON.stringify(application[key].date_submitted);
							entry['project_credit_request_extra_credits'] = JSON.stringify(application[key].extra_credits);
							entry['project_credit_request_user_name'] = JSON.stringify(application[key].user.username);
							entry['project_credit_request_user_email'] = JSON.stringify(application[key].user.email);
						}
					} else if (key === 'project_application_edam_terms') {
						const edam_names = [];
						application[key].forEach(edam => {
							edam_names.push(edam.name);
						});
						entry['project_application_edam_terms'] = JSON.stringify(edam_names);
					} else if (key === 'flavors') {
						const flavor_names = [];
						application[key].forEach(flavor => {
							flavor_names.push(flavor.name);
						});
					} else if (key === 'dissemination') {
						/* empty */
					} else if (key === 'project_application_compute_center') {
						entry[key] = application[key].Name;
						entry['project_application_compute_center_id'] = application[key].FacilityId;
					} else {
						entry[key] = JSON.stringify(application[key]);
					}
				} else {
					entry[key] = application[key];
				}
			}
			data.push(entry);
		});
		if (data.length > 0) {
			// create CSV file first for convenience
			const currentDate = new Date().toISOString().split('T')[0];
			// eslint-disable-next-line
			const csv = new ngxCsv(data, 'cloud_projects_' + currentDate, {
				showLabels: true,
				headers: Object.keys(data[0]),
				fieldSeparator: '\t',
				noDownload: true,
			});
			// create TSV file and download it
			const link = document.createElement('a');
			link.href = `data:text/tab-separated-values,${encodeURIComponent(csv.getCsv())}`;
			link.download = `cloud_projects_${currentDate}.tsv`;
			link.click();
		}
	}
}
