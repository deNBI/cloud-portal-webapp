import { Component, OnInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { Userinfo } from './userinfo.model';
import { ApiSettings } from '../api-connector/api-settings.service';
import { KeyService } from '../api-connector/key.service';
import { UserService } from '../api-connector/user.service';
import { GroupService } from '../api-connector/group.service';
import { IResponseTemplate } from '../api-connector/response-template';
import { LIFESCIENCE_LINKING_ACCOUNTS, WIKI_LINK_ACCOUNTS } from '../../links/links';
import { ProjectEnumeration } from '../projectmanagement/project-enumeration';
import { ApplicationsService } from "../api-connector/applications.service";
import { VirtualmachineService } from "../api-connector/virtualmachine.service";
import {VirtualMachine} from "../virtualmachines/virtualmachinemodels/virtualmachine";

/**
 * UserInformation component.
 */
@Component({
	selector: 'app-userinfo',
	templateUrl: 'userinfo.component.html',
	providers: [GroupService, UserService, ApiSettings, KeyService],
})
export class UserInfoComponent implements OnInit {
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

	/**
	 * Subscription to accumulate all requests for summary
	 *
	 * @type {Subscription}
	 */
	// TODO: checkout how to summarize subscriptions on virtualmachine service
	summarySubscription: Subscription = new Subscription();

	/**
	 * summary of projects the user is member of
	 *
	 * @type {ProjectEnumeration[]}
	 */
	userProjects: ProjectEnumeration[] = [];


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
	dsgvo_text: string =		'By activating this option, you agree that your preferred e-mail address may be used for the newsletter. '
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

	/**
	 * Collects data to show for user, when opening Leave Virtual Organisation Modal.
	 */
	getUserSummary(): void {
		if (!this.summaryLoaded) {
			this.userService.getLoggedUser().subscribe({
				next: (res: any) => {
					console.log(res);

					this.groupService.getGroupsEnumeration().subscribe({
						next: (res: ProjectEnumeration[]) => {
							this.userProjects = res.map((pr: ProjectEnumeration) => pr);
							const application_ids: string[] = this.userProjects.map((pr: ProjectEnumeration) => pr.application_id);
							for (let app of application_ids) {
								this.applicationsService.getApplication(app).subscribe({
									next: (resapp: any) => {
										// TODO: need to fork stuff and check where the user is PI, admin or something - if has admin or pi role
										// also show another alert - and especially in case of pi prevent from leaving
									}
								});
							}
							// TODO: get all VMs but not as page - if longer than certain number just [...]
							let vmFilter: string[] = [];
							this.vmService.getVmsFromLoggedInUser(null, null, null, vmFilter, false, false, true).subscribe({
								next: (res: VirtualMachine[]) => {
									this.userVirtualMachines = res;
								}
							});
							this.summaryLoaded = true;
							console.log(res);
						},
						error: () => {},
					});
				},
				error: (err: any) => {
					console.log(err);
				},
			});
		}
	}
}
