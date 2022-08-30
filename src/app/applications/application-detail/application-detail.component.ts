import { Component, Input, OnInit } from '@angular/core';
import { Application } from '../application.model/application.model';
import { ApplicationBaseClassComponent } from '../../shared/shared_modules/baseClass/application-base-class.component';
import { ApplicationsService } from '../../api-connector/applications.service';
import { UserService } from '../../api-connector/user.service';
import { FacilityService } from '../../api-connector/facility.service';
import { is_vo } from '../../shared/globalvar';
import { CreditsService } from '../../api-connector/credits.service';
import { Application_States } from '../../shared/shared_modules/baseClass/abstract-base-class';

/**
 * Class which displays the details of an application.
 */
@Component({
	selector: 'app-application-detail',
	templateUrl: './application-detail.component.html',
	styleUrls: ['./application-detail.component.scss'],
	providers: [FacilityService, UserService, ApplicationsService, CreditsService],
})
export class ApplicationDetailComponent extends ApplicationBaseClassComponent implements OnInit {
	PI_USER_TAB: number = 0;
	INFORMATION_TAB: number = 1;
	RESOURCE_TAB: number = 2;
	CREDITS_TAB: number = 3;
	MODIFICATION_TAB: number = 4;
	EXTENSION_TAB: number = 5;
	COMMENT_TAB: number = 6;
	PI_USER_TAB_ACTIVE: boolean = true;
	INFORMATION_TAB_ACTIVE: boolean = false;
	RESOURCE_TAB_ACTIVE: boolean = false;
	CREDITS_TAB_ACTIVE: boolean = false;
	MODIFICATION_TAB_ACTIVE: boolean = false;
	EXTENSION_TAB_ACTIVE: boolean = false;
	COMMENT_TAB_ACTIVE: boolean = false;

	@Input() application: Application;
	@Input() default_tab: number = this.PI_USER_TAB;

	creditsService: CreditsService;
	is_vo_admin: boolean = false;
	current_credits: number = 0;
	Application_States: typeof Application_States = Application_States;

	setAllTabsFalse(): void {
		this.PI_USER_TAB_ACTIVE = false;
		this.INFORMATION_TAB_ACTIVE = false;
		this.RESOURCE_TAB_ACTIVE = false;
		this.CREDITS_TAB_ACTIVE = false;
		this.MODIFICATION_TAB_ACTIVE = false;
		this.EXTENSION_TAB_ACTIVE = false;
		this.COMMENT_TAB_ACTIVE = false;
	}

	setTab(tab_num: number): void {
		this.setAllTabsFalse();
		switch (tab_num) {
			case this.PI_USER_TAB:
				this.PI_USER_TAB_ACTIVE = true;
				break;
			case this.INFORMATION_TAB:
				this.INFORMATION_TAB_ACTIVE = true;
				break;
			case this.RESOURCE_TAB:
				this.RESOURCE_TAB_ACTIVE = true;
				break;
			case this.CREDITS_TAB:
				this.CREDITS_TAB_ACTIVE = true;
				break;
			case this.MODIFICATION_TAB:
				this.MODIFICATION_TAB_ACTIVE = true;
				break;
			case this.EXTENSION_TAB:
				this.EXTENSION_TAB_ACTIVE = true;
				break;
			case this.COMMENT_TAB:
				this.COMMENT_TAB_ACTIVE = true;
				break;
			default:
				break;
		}
	}

	constructor(
		applicationsService: ApplicationsService,
		userService: UserService,
		facilityService: FacilityService,
		creditsService: CreditsService,
	) {
		super(userService, applicationsService, facilityService);
		this.creditsService = creditsService;
	}

	ngOnInit(): void {
		this.setTab(this.default_tab);

		this.getMemberDetailsByElixirId(this.application);
		if (this.application.credits_allowed) {
			this.getCurrentCredits();
		}
		this.is_vo_admin = is_vo;
	}

	getCurrentCredits(): void {
		this.creditsService
			.getCurrentCreditsOfProject(Number(this.application.project_application_perun_id.toString()))
			.toPromise()
			.then((credits: number): void => {
				this.current_credits = credits;
			})
			.catch((err: Error): void => console.log(err.message));
	}
}
