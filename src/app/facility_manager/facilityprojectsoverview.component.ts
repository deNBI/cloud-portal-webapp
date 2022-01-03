import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Project } from '../projectmanagement/project.model';
import { ProjectMember } from '../projectmanagement/project_member.model';
import { environment } from '../../environments/environment';
import { ApiSettings } from '../api-connector/api-settings.service';
import { GroupService } from '../api-connector/group.service';
import { UserService } from '../api-connector/user.service';
import { FacilityService } from '../api-connector/facility.service';
import { NewsService } from '../api-connector/news.service';
import { ComputecenterComponent } from '../projectmanagement/computecenter.component';
import { FilterBaseClass } from '../shared/shared_modules/baseClass/filter-base-class';
import { IResponseTemplate } from '../api-connector/response-template';
import { WordPressTag } from './newsmanagement/wp-tags';

/**
 * Facility Project overview component.
 */
@Component({
	selector: 'app-facility-projects',
	templateUrl: 'facilityprojectsoverview.component.html',
	providers: [FacilityService, UserService, GroupService, ApiSettings, NewsService],
})
export class FacilityProjectsOverviewComponent extends FilterBaseClass implements OnInit {

	@Input() voRegistrationLink: string = environment.voRegistrationLink;

	title: string = 'Projects Overview';
	filter: string;

	membersLoaded: boolean = false;
	public memberFilter: string = '';
	filteredMembers: object[] = [];
	selectedMember: object[] = [];
	facility_members: object[] = [];

	filterChanged: Subject<string> = new Subject<string>();
	isLoaded: boolean = false;
	projects: Project[] = [];
	details_loaded: boolean = false;
	/**
	 * Approved group status.
	 *
	 * @type {number}
	 */
	STATUS_APPROVED: number = 2;

	selectedProjectType: string = 'ALL';

	// modal variables for User list
	public selectedProjectForSearch: Project;
	public usersModalProjectMembers: ProjectMember[] = [];
	allFacilityMembers: object[] = [];
	public usersModalProjectID: number;
	public usersModalProjectName: string;
	public selectedProject: Project;
	public userSearchValue: string;

	public emailSubject: string;
	public emailText: string;
	public emailStatus: number = 0;
	public emailReply: string = '';
	public sendNews: boolean;
	public alternative_emailText: string = '';
	public news_tags: string = '';
	FILTER_DEBOUNCE_TIME: number = 500;

	public managerFacilities: [string, number][] = [];
	public selectedFacility: [string, number];
	private availableNewsTags: WordPressTag[] = [];
	private selectedTags: string[] = [];
	projects_filtered: Project[] = [];

	constructor(
private groupService: GroupService,
							private facilityService: FacilityService,
							private newsService: NewsService,
	) {
		super();
	}

	setEmailSubject(): void {
		switch (this.selectedProjectType) {
			case 'ALL':
				this.emailSubject = `[${this.selectedFacility['Facility']}]`;
				break;
			case 'OVP':
				this.emailSubject = `[${this.selectedFacility['Facility']}: OpenStack]`;
				break;
			case 'SVP':
				this.emailSubject = `[${this.selectedFacility['Facility']}: SimpleVm]`;
				break;
			case 'USER':
				this.emailSubject = `[${this.selectedFacility['Facility']}: Specific Members]`;
				break;
			default:
				// eslint-disable-next-line no-case-declarations
				const pro: Project = this.projects.find((project: Project): boolean => project.Id.toString() === this.selectedProjectType.toString());
				if (pro) {
					this.emailSubject = `[${this.selectedFacility['Facility']}: ${pro.Name}]`;
				} else {
					this.emailSubject = `[${this.selectedFacility['Facility']}]`;

				}
				break;
		}
	}

	ngOnInit(): void {
		this.facilityService.getManagerFacilities().subscribe((result: any): void => {
			this.managerFacilities = result;
			this.selectedFacility = this.managerFacilities[0];
			this.emailSubject = `[${this.selectedFacility['Facility']}]`;
			this.getFacilityProjects(this.managerFacilities[0]['FacilityId']);
			this.title = `${this.title}:${this.selectedFacility['Facility']}`;

		});
		this.sendNews = true;

		this.filterChanged
			.pipe(
				debounceTime(this.FILTER_DEBOUNCE_TIME),
				distinctUntilChanged(),
			)
			.subscribe((): void => {
				this.applyFilter();
			});
		/** needs refactoring in case we introduce tags to wagtail
		 * this.newsService.getAvailableTagsFromWordPress().subscribe((tags: WordPressTag[]): void => {
			if (!(('code' in tags) && tags['code'] === 'wp-die')) {
				if (tags) {
					this.availableNewsTags = tags;
				}
			}
		}); * */
	}

	searchForUserInFacility(searchString: string): void {
		this.facilityService.getFilteredMembersOfFacility(searchString);
	}

	filterMembers(bare_searchString: string): void {
		this.filteredMembers = [];
		const searchString: string = bare_searchString.toLowerCase();

		this.allFacilityMembers.forEach((member: object): void => {

			if (member['elixirId'].toLowerCase().includes(searchString)
				|| member['email'].toLowerCase().includes(searchString)
				|| member['firstName'].toLowerCase().includes(searchString)
				|| member['lastName'].toLowerCase().includes(searchString)) {
				this.filteredMembers.push(member);
			}
		});
	}

	getProjectsByMemberElixirId(): void {
		// tslint:disable-next-line:max-line-length
		this.facilityService.getFacilityGroupsByMemberElixirId(this.managerFacilities[0]['FacilityId'], this.filter)
			.subscribe((result: any): void => {
				this.projects_filtered = [];
				const facility_projects: any = result;
				const is_pi: boolean = false;
				const is_admin: boolean = false;
				for (const group of facility_projects) {
					const dateCreated: moment.Moment = group['createdAt'];
					const dateDayDifference: number = Math.ceil(moment().diff(dateCreated, 'days', true));
					const groupid: string = group['id'];
					const currentCredits: number = Number(group['current_credits']);
					const approvedCredits: number = Number(group['approved_credits']);
					const tmp_facility: any = group['compute_center'];
					let shortname: string = group['shortname'];
					let compute_center: ComputecenterComponent = null;
					const lifetime: number = group['lifetime'];
					if (!shortname) {
						shortname = group['name'];
					}
					if (tmp_facility) {
						compute_center = new ComputecenterComponent(
							tmp_facility['compute_center_facility_id'],
							tmp_facility['compute_center_name'],
							tmp_facility['compute_center_login'],
							tmp_facility['compute_center_support_mail'],
						);
					}
					const newProject: Project = new Project(
						Number(groupid),
						shortname,
						group['description'],
						moment(dateCreated).format('DD.MM.YYYY'),
						dateDayDifference,
						is_pi,
						is_admin,
						compute_center,
						currentCredits,
						approvedCredits,
					);
					newProject.project_application_status = group['status'];
					if (lifetime !== -1) {
						const expirationDate: string = moment(moment(dateCreated).add(lifetime, 'months').toDate()).format('DD.MM.YYYY');
						const lifetimeDays: number = Math.abs(moment(moment(expirationDate, 'DD.MM.YYYY')
							.toDate()).diff(moment(dateCreated), 'days'));

						newProject.LifetimeDays = lifetimeDays;
						newProject.DateEnd = expirationDate;
						newProject.LifetimeReached = this.lifeTimeReached(lifetimeDays, dateDayDifference);
					}
					newProject.RealName = group['name'];
					newProject.Lifetime = lifetime;
					newProject.OpenStackProject = group['openstack_project'];
					this.projects_filtered.push(newProject);
				}
			});
	}

	applyFilter(): void {
		if (this.filter) {
			this.filter = this.filter.trim();
		}
		if (this.filter && this.filter.includes('@elixir-europe')) {
			this.getProjectsByMemberElixirId();

		}

		this.projects_filtered = this.projects.filter((project: Project): boolean => this.checkFilter(project));

	}

	checkFilter(project: Project): boolean {
		if (this.filter === '' || !this.filter) {
			return this.isFilterProjectStatus(project.project_application_status, project.LifetimeReached);
		} else {
			return (this.isFilterLongProjectName(project.RealName, this.filter)
				|| this.isFilterProjectId(project.Id.toString(), this.filter))
				|| (this.isFilterProjectName(project.Name, this.filter)
					&& this.isFilterProjectStatus(project.project_application_status, project.LifetimeReached));
		}
	}

	/**
	 * Gets projects and sets email subject prefix when selected facility changes.
	 */
	onChangeSelectedFacility(): void {
		this.getFacilityProjects(this.selectedFacility['FacilityId']);
		this.emailSubject = `[${this.selectedFacility['Facility']}]`;
	}

	getProjectLifetime(project: Project): void {
		this.details_loaded = false;
		if (!project.Lifetime) {
			this.groupService.getLifetime(project.Id).subscribe((time: IResponseTemplate): void => {
				const lifetime: number = time.value as number;
				const dateCreated: Date = moment(project.DateCreated, 'DD.MM.YYYY').toDate();

				if (lifetime !== -1) {
					const expirationDate: string = moment(moment(dateCreated).add(lifetime, 'months').toDate()).format('DD.MM.YYYY');
					const lifetimeDays: number = Math.abs(
						moment(moment(expirationDate, 'DD.MM.YYYY').toDate()).diff(moment(dateCreated), 'days'),
					);

					/*  eslint-disable */
					project.LifetimeDays = lifetimeDays;
					project.DateEnd = expirationDate;
				}
				project.Lifetime = lifetime;
				this.details_loaded = true;
				/* eslint-enable */
			});
		} else {
			this.details_loaded = true;
		}
	}

	/**
	 * Returns the name of the project with the id of the selectedProjectType
	 */
	getProjectNameBySelectedProjectTypeAsId(): string {
		const id: string = this.selectedProjectType;
		if (!id) {
			return 'NOT_FOUND';
		}
		const project: Project = this.projects.find((element: Project): boolean => element.Id.toString() === id.toString());
		if (project) {
			return project.Name;
		}

		return 'NOT_FOUND';
	}

	getFacilityProjects(facility: string): void {
		this.projects = [];

		// tslint:disable-next-line:max-line-length
		this.facilityService.getFacilityAllowedGroupsWithDetailsAndSpecificStatus(facility, this.STATUS_APPROVED).subscribe((result: any): void => {
			const facility_projects: any = result;
			const is_pi: boolean = false;
			const is_admin: boolean = false;
			for (const group of facility_projects) {
				const dateCreated: moment.Moment = group['createdAt'];
				const dateDayDifference: number = Math.ceil(moment().diff(dateCreated, 'days', true));
				const groupid: string = group['id'];

				const currentCredits: number = Number(group['current_credits']);
				const approvedCredits: number = Number(group['approved_credits']);
				const tmp_facility: any = group['compute_center'];
				let shortname: string = group['shortname'];
				let compute_center: ComputecenterComponent = null;
				const lifetime: number = group['lifetime'];

				if (!shortname) {
					shortname = group['name'];
				}
				if (tmp_facility) {
					compute_center = new ComputecenterComponent(
						tmp_facility['compute_center_facility_id'],
						tmp_facility['compute_center_name'],
						tmp_facility['compute_center_login'],
						tmp_facility['compute_center_support_mail'],
					);
				}

				const newProject: Project = new Project(
					Number(groupid),
					shortname,
					group['description'],
					moment(dateCreated).format('DD.MM.YYYY'),
					dateDayDifference,
					is_pi,
					is_admin,
					compute_center,
					currentCredits,
					approvedCredits,
				);
				newProject.project_application_status = group['status'];

				if (lifetime !== -1) {
					const expirationDate: string = moment(moment(dateCreated).add(lifetime, 'months').toDate()).format('DD.MM.YYYY');
					const lifetimeDays: number = Math.abs(moment(moment(expirationDate, 'DD.MM.YYYY')
						.toDate()).diff(moment(dateCreated), 'days'));

					newProject.LifetimeDays = lifetimeDays;
					newProject.DateEnd = expirationDate;
					newProject.LifetimeReached = this.lifeTimeReached(lifetimeDays, dateDayDifference);

				}
				newProject.RealName = group['name'];
				newProject.Lifetime = lifetime;
				newProject.OpenStackProject = group['openstack_project'];

				this.projects.push(newProject);
			}
			this.applyFilter();
			this.isLoaded = true;

		});
		this.facilityService.getAllMembersOfFacility(facility, this.STATUS_APPROVED).subscribe(
			(result: any[]): void => {
				this.membersLoaded = true;
				this.allFacilityMembers = result;
			},
			(error: any): void => {
				console.log(error);
				this.membersLoaded = false;
			},
		);

	}

	/**
	 * Adds or deletes tags from the list of tags to add to the news when the corresponding checkbox gets clicked.
	 *
	 * @param tag the tag which gets added/deleted.
	 */
	manageTags(tag: WordPressTag): void {
		const index: number = this.selectedTags.indexOf(tag.id.toString());
		if (index > -1) {
			this.selectedTags.splice(index, 1);
		} else {
			this.selectedTags.push(tag.id.toString());
		}
	}

	/**
	 * Sends an email to users and also posts it as a news in WordPress via newsManager if selected.
	 *
	 * @param facility the facility of the users which shall be informed
	 * @param subject the subject as a string
	 * @param message the message as a string
	 * @param reply the reply-address
	 * @param send boolean if it should be sent to WordPress
	 * @param alternative_news_text the news text for WordPress, in case it shall be different from the original text
	 * @param selectedMember the specific member the mail is sent to in case one specific member is chosen
	 */
	sendMailToFacility(facility: string, subject: string, message: string, reply?: string, send?: any, alternative_news_text?: string): void {
		this.emailStatus = 0;
		if (this.selectedProjectType === 'USER') {
			const tempMailList: string[] = [];
			// tslint:disable-next-line:no-for-each-push
			this.selectedMember.forEach((member: object): void => {
				tempMailList.push(member['email']);
			});
			this.selectedProjectType = tempMailList.join(',');
			console.log(this.selectedProjectType);
		}
		if (reply) {
			reply = reply.trim();
		}
		const chosenTags: string = this.selectedTags.toString();
		this.facilityService.sendMailToFacility(
			facility,
			encodeURIComponent(subject),
			encodeURIComponent(message),
			this.selectedProjectType,
			encodeURIComponent(reply),
			send,
			encodeURIComponent(alternative_news_text),
			chosenTags,
		).subscribe(
			(result: any): void => {
				if (result.status === 201) {
					this.emailStatus = 1;
				} else {
					this.emailStatus = 2;
				}
			},
			(): void => {
				this.emailStatus = 2;
			},
			(): void => {
				this.filteredMembers = [];
				this.selectedProjectType = 'ALL';
				this.emailReply = '';
				this.selectedMember = [];
				this.memberFilter = '';
			},
		);

	}

	/**
	 * Sets the member selected in the mail modal as the member to send the mail to.
	 *
	 * @param member the selected member
	 */

	setSelectedUserForMail(member: object): void {
		if (!this.selectedMember.includes(member)) {
			this.selectedMember.push(member);
		}
	}

	removeSelectedUserForMail(member: object): void {
		const index: number = this.selectedMember.indexOf(member);
		if (index > -1) {
			this.selectedMember.splice(index, 1);
		}
	}

	getMembersOfTheProject(projectid: number, projectname: string): void {
		this.facilityService.getFacilityGroupRichMembers(projectid, this.selectedFacility['FacilityId'])
			.subscribe((members: ProjectMember[]): void => {
				this.usersModalProjectID = projectid;
				this.usersModalProjectName = projectname;
				this.usersModalProjectMembers = members;

			});
	}

	public showMembersOfTheProject(project_id: number, projectname: string): void {
		this.getMembersOfTheProject(project_id, projectname);

	}

	public resetEmailModal(): void {
		this.selectedProjectType = 'ALL';
		this.emailSubject = `[${this.selectedFacility['Facility']}]`;
		this.emailText = null;
		this.emailReply = null;
		this.emailStatus = 0;
		this.sendNews = true;
		this.alternative_emailText = '';
		this.news_tags = '';
		this.selectedMember = [];
	}

}
