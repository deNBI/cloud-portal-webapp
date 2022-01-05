import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { VoService } from '../api-connector/vo.service';
import { ProjectMember } from '../projectmanagement/project_member.model';
import { GroupService } from '../api-connector/group.service';
import { ComputecenterComponent } from '../projectmanagement/computecenter.component';
import { FilterBaseClass } from '../shared/shared_modules/baseClass/filter-base-class';
import { IResponseTemplate } from '../api-connector/response-template';
import { FacilityService } from '../api-connector/facility.service';
import { FullLayoutComponent } from '../layouts/full-layout.component';
import { Application } from '../applications/application.model/application.model';

/**
 * Vo Overview component.
 */
@Component({
	selector: 'app-vo-overview',
	templateUrl: 'voOverview.component.html',
	providers: [VoService, GroupService, FacilityService],

})

export class VoOverviewComponent extends FilterBaseClass implements OnInit {

	title: string = 'VO Overview';
	public emailSubject: string;
	public emailReply: string = '';
	public emailText: string;
	public emailStatus: number = 0;
	public emailHeader: string;
	public emailVerify: string;
	public emailType: number;
	public selectedProject: Application;
	computecenters: ComputecenterComponent[] = [];

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

	// public selectedFacility: [string, number];

	constructor(
		private fullLayout: FullLayoutComponent,
		private sanitizer: DomSanitizer,
		private voService: VoService,
		private groupservice: GroupService,
		private facilityService: FacilityService,
	) {
		super();
	}

	ngOnInit(): void {

		this.getVoProjects();
		this.voService.getNewsletterSubscriptionCounter().subscribe((result: IResponseTemplate): void => {
			this.newsletterSubscriptionCounter = result.value as number;

		});
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
				this.sendMailToVo(subject, message, this.selectedFacility.toString(), this.selectedProjectType, reply);
				break;
			}
			case 1: {
				this.sendNewsletterToVo(subject, message, this.selectedProjectType, reply);
				break;
			}
			default:

		}
	}

	sendTestBug(): void {
		this.voService.sendTestError().subscribe();
	}

	applyFilter(): void {
		this.projects_filtered = this.projects.filter((project: Application): boolean => this.checkFilter(project));
	}

	checkFilter(project: Application): boolean {
		let facNameFilter: boolean = true;
		if (project.project_application_compute_center) {
			facNameFilter = this.isFilterFacilityName(project.project_application_compute_center.Name.toLowerCase());
		}

		return facNameFilter
			&& this.isFilterProjectStatus(project.project_application_status, project.lifetime_reached)
			&& this.isFilterProjectName(project.perun_name)
			&& this.isFilterProjectId(project.project_application_perun_id.toString());

	}

	sendNewsletterToVo(subject: string, message: string, selectedProjectType: string, reply?: string): void {
		this.voService.sendNewsletterToVo(encodeURIComponent(subject), encodeURIComponent(message), selectedProjectType, encodeURIComponent(reply))
			.subscribe((result: IResponseTemplate): void => {
				if (result.value as boolean === true) {
					this.emailStatus = 1;
				} else {
					this.emailStatus = 2;
				}
			});

	}

	sendMailToVo(subject: string, message: string, facility: string, type: string, reply?: string): void {
		this.voService.sendMailToVo(encodeURIComponent(subject), encodeURIComponent(message), facility, type, encodeURIComponent(reply))
			.subscribe((result: IResponseTemplate): void => {
				if (result.value as boolean === true) {
					this.emailStatus = 1;
				} else {
					this.emailStatus = 2;
				}
				this.selectedProjectType = 'ALL';
				this.selectedFacility = 'ALL';
			});

	}

	setEmailType(type: number): void {
		this.emailType = type;
		switch (this.emailType) {
			case 0: {
				this.emailHeader = 'Send email to all members of the vo';
				this.emailVerify = 'Are you sure you want to send this email to all members of the vo?';
				break;
			}
			case 1: {
				this.emailHeader = 'Send newsletter to vo';
				this.emailVerify = 'Are you sure you want to send this newsletter?';
				break;
			}
			default:

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
			this.applyFilter();
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
		this.voService.terminateProject(this.selectedProject.project_application_perun_id)
			.subscribe((): void => {
				const indexAll: number = this.projects.indexOf(this.selectedProject, 0);
				if (!this.selectedProject.project_application_openstack_project) {
					this.projects.splice(indexAll, 1);
				} else {
					this.getProjectStatus(this.projects[indexAll]);
				}
				this.fullLayout.getGroupsEnumeration();
				this.applyFilter();
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

	getProjectStatus(project: Application): void {
		this.voService.getProjectStatus(project.project_application_perun_id).subscribe((res: any): void => {
			project.project_application_status = res['status'];
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
			this.getVoProjects();
		});

	}

	setProtected(project: Application, set: boolean): void {
		this.voService.setProtected(project.project_application_perun_id, set).subscribe((result: any): void => {
			this.updateNotificationModal(
				'Success',
				result['result'] === 'set' ? 'The project was successfully set as protected.'
					: 'The status "Protected" was removed successfully',
				true,
				'success',
			);
			const indexAll: number = this.projects.indexOf(project, 0);
			this.getProjectStatus(this.projects[indexAll]);
		}, (error: any): void => {
			if (error['status'] === 500) {
				this.updateNotificationModal('Failed', 'The status change was not successful.', true, 'danger');
			}
		});
	}

	getMembersOfTheProject(projectid: number, projectname: string): void {
		this.voService.getVoGroupRichMembers(projectid)
			.subscribe((members: ProjectMember[]): void => {
				this.usersModalProjectID = projectid;
				this.usersModalProjectName = projectname;
				this.usersModalProjectMembers = members;

			});
	}

	showMembersOfTheProject(projectid: number, projectname: string): void {
		this.getMembersOfTheProject(projectid, projectname);

	}

}
