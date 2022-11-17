import {Component, OnInit} from '@angular/core';
import {forkJoin, Subscription} from 'rxjs';
import {Userinfo} from './userinfo.model';
import {ApiSettings} from '../api-connector/api-settings.service';
import {KeyService} from '../api-connector/key.service';
import {UserService} from '../api-connector/user.service';
import {GroupService} from '../api-connector/group.service';
import {IResponseTemplate} from '../api-connector/response-template';
import {LIFESCIENCE_LINKING_ACCOUNTS, WIKI_LINK_ACCOUNTS} from '../../links/links';
import {ProjectEnumeration} from '../projectmanagement/project-enumeration';
import {ApplicationsService} from "../api-connector/applications.service";
import {VirtualmachineService} from "../api-connector/virtualmachine.service";
import {VirtualMachine} from "../virtualmachines/virtualmachinemodels/virtualmachine";
import {VirtualMachineStates} from "../virtualmachines/virtualmachinemodels/virtualmachinestates";
import {Application} from "../applications/application.model/application.model";
import {Project} from "@playwright/test";
import {CLOUD_PORTAL_SUPPORT_MAIL} from "../../links/links";
import {ProjectMember} from "../projectmanagement/project_member.model";
import {application} from "express";

/**
 * UserInformation component.
 */
@Component({
	selector: 'app-userinfo',
	templateUrl: 'userinfo.component.html',
	providers: [GroupService, UserService, ApiSettings, KeyService],
})
export class UserInfoComponent implements OnInit {

	CLOUD_PORTAL_SUPPORT_MAIL: string = CLOUD_PORTAL_SUPPORT_MAIL;

	/**
	 * Information of the logged in User
	 */
	userInfo: Userinfo;

	/**
	 * If the user has subscribed to the newsletter.
	 */
	newsletterSubscribed: boolean;

	/**
	 * New requested public key.
	 */
	newPublicKey: string;

	/**
	 * If every data is loaded.
	 *
	 * @type {boolean}
	 */
	isLoaded: boolean = false;

	/**
	 * If the data used for summary of leave-vo-modal is collected
	 *
	 * @type {boolean}
	 */
	summaryLoaded: boolean = false;

	userIsProjectPi: boolean = false;

	userIsLoneAdmin: boolean = false;

	userIsOpenStackUser: boolean = false;

	/**
	 * summary of projects the user is member of
	 *
	 * @type {ProjectEnumeration[]}
	 */
	userProjects: Application[] = [];




	/**
	 * summary of vms the user has
	 *
	 * @type {VirtualMachine[]}
	 */
	userVirtualMachines: VirtualMachine[] = [];

	/**
	 * If the user is part of a project.
	 *
	 * @type {boolean}
	 */
	isProjectMember: boolean = true;

	/**
	 * If freemium is active.
	 *
	 * @type {boolean}
	 */
	freemiumActive: boolean = false;

	/**
	 * Email requested to change.
	 */
	emailChange: string;

	title: string = 'Profile';
	/**
	 * Text refering to newsletter registration
	 */
	dsgvo_text: string = 'By activating this option, you agree that your preferred e-mail address may be used for the newsletter. '
		+ 'You will receive the newsletter until you deactivate the option in the settings again.';
	WIKI_LINK_ACCOUNTS: string = WIKI_LINK_ACCOUNTS;
	LIFESCIENCE_LINKING_ACCOUNTS: string = LIFESCIENCE_LINKING_ACCOUNTS;

	constructor(private groupService: GroupService, private userService: UserService,
							private keyService: KeyService, private applicationsService: ApplicationsService,
							private vmService: VirtualmachineService,
	) {
		this.groupService = groupService;
		this.userService = userService;
		this.keyService = keyService;
		this.applicationsService = applicationsService;
		this.vmService = vmService;
	}

	requestChangePreferredMailUser(email: string): void {
		this.userService.requestChangePreferredMailUser(email).subscribe((): void => {
			this.getPendingPreferredMailUser();
		});
	}

	getPendingPreferredMailUser(): void {
		this.userService.getPendingPreferredMailUser().subscribe((res: IResponseTemplate): void => {
			this.userInfo.PendingEmails = res.value as string[];
		});
	}

	ngOnInit(): void {
		this.getUserinfo();
		this.isFreemiumActive();
		this.isUserSimpleVmMember();
	}

	isFreemiumActive(): void {
		this.groupService.isFreemiumActive().subscribe((result: IResponseTemplate): void => {
			this.freemiumActive = result.value as boolean;
		});
	}

	importKey(publicKey: string): void {
		const re: RegExp = /\+/gi;

		this.keyService.postKey(publicKey.replace(re, '%2B')).subscribe((): void => {
			this.getUserPublicKey();
		});
	}

	getUserPublicKey(): void {
		this.keyService.getKey().subscribe((key: IResponseTemplate): void => {
			this.userInfo.PublicKey = key.value as string;
			this.isLoaded = true;
		});
	}

	getUserinfo(): void {
		this.userService.getUserInfo().subscribe((userinfo: Userinfo): void => {
			this.userInfo = userinfo;
			this.title = this.title.concat(': ', this.userInfo.FirstName, ' ', this.userInfo.LastName);

			forkJoin(this.userService.getNewsletterSubscription(), this.userService.getPendingPreferredMailUser()).subscribe(
				(res: IResponseTemplate[]): void => {
					this.newsletterSubscribed = res[0].value as boolean;
					this.userInfo.PendingEmails = res[1].value as string[];

					this.isLoaded = true;
				},
			);
		});
	}

	isUserSimpleVmMember(): void {
		this.groupService.getSimpleVmByUser().subscribe((result: any): void => {
			this.isProjectMember = result.length > 0;
		});
	}

	setNewsletterSubscription(): void {
		if (this.newsletterSubscribed) {
			this.userService.setNewsletterSubscriptionWhenSubscribed().subscribe();
		} else {
			this.userService.setNewsletterSubscriptionWhenNotSubscribed().subscribe();
		}
	}

	validatePublicKey(): boolean {
		return /ssh-rsa AAAA[0-9A-Za-z+/]+[=]{0,3}( [^@]+@[^@]+)?/.test(this.newPublicKey);
	}

	joinFreemium(): void {
		this.groupService.addMemberToFreemium().subscribe();
	}

	isUserPi(): boolean {
		return this.userProjects.some((app: Application) => app.user_is_pi);
	}

	isUserLoneAdmin(userId: number, userProjectMembers: ProjectMember[][]): boolean {
		for (const project_members of userProjectMembers) {
			const groupAdmins: ProjectMember[] = project_members.filter((singleMember: ProjectMember) => {
				return singleMember.isAdmin;
			});

			if (groupAdmins.length === 1) {
				if (groupAdmins[0].userId.toString() === userId.toString()) {
					return true;
				}
			}
		}

		return false;

	}

	isOpenStackUser(): boolean {
		return this.userProjects.some((app: Application) => app.project_application_openstack_project);
	}

	leaveVirtualOrganisation(): void {
		// TODO: request to endpoint to delete member/user and remove user from all groups - if not done automatically by perun
	}

	/**
	 *
	 * @param userProjectMembers
	 */
	transformUserResults(userProjectMembers: ProjectMember[][]): void {
		this.userIsProjectPi = this.isUserPi();
		this.userIsLoneAdmin = this.isUserLoneAdmin(this.userInfo.Id, userProjectMembers);
		this.userIsOpenStackUser = this.isOpenStackUser();
		this.summaryLoaded = true;
	}

	/**
	 * Collects data to show for user, when opening Leave Virtual Organisation Modal.
	 */
	getUserSummary(): void {

		if (!this.summaryLoaded) {

			this.groupService.getGroupsEnumeration().subscribe({
				next: (res_enumerations: ProjectEnumeration[]) => {
					const application_ids: string[] = res_enumerations.map((pr: ProjectEnumeration) => pr.application_id);

					forkJoin(application_ids.map(app_id => this.applicationsService.getFullApplicationByUserPermissions(app_id))).subscribe(
						{
							next: (userProjectResult: Application[]) => {
								this.userProjects = userProjectResult;
								const group_ids: string[] = this.userProjects.map((user_application: Application) => user_application.project_application_perun_id.toString());
								forkJoin(group_ids.map(group_id => this.groupService.getGroupMembers(group_id))).subscribe(
									{
										next: (project_members: ProjectMember[][]) => {
											this.transformUserResults(project_members);
										}
									}
								)
							}
						});
					const vmFilter: string[] = [
						VirtualMachineStates.ACTIVE,
						VirtualMachineStates.SHUTOFF,
						VirtualMachineStates.CLIENT_OFFLINE,
					];
					VirtualMachineStates.IN_PROCESS_STATES.forEach((state: string) => vmFilter.push(state));
					this.vmService.getVmsFromLoggedInUser(0, 25, '', vmFilter, false, false, true).subscribe({
						next: (res: VirtualMachine[]) => {
							this.userVirtualMachines = res;
						}
					});
				},
				error: () => {
				},
			});

		}
	}
}
