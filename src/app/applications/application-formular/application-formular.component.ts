import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core'
import { NgForm, FormsModule } from '@angular/forms'

import { Flavor } from '../../virtualmachines/virtualmachinemodels/flavor'
import { FlavorService } from '../../api-connector/flavor.service'
import { FlavorType } from '../../virtualmachines/virtualmachinemodels/flavorType'
import { environment } from '../../../environments/environment'
import { EdamOntologyTerm } from '../edam-ontology-term'
import { ApplicationsService } from '../../api-connector/applications.service'
import { ApplicationBaseClassComponent } from '../../shared/shared_modules/baseClass/application-base-class.component'
import { FullLayoutComponent } from '../../layouts/full-layout.component'
import { CreditsService } from '../../api-connector/credits.service'
import { Application } from '../application.model/application.model'
import { is_vo } from '../../shared/globalvar'
import {
	CREDITS_WIKI,
	OPENSTACK_LINK,
	POLICY_LINK,
	PROJECT_TYPES_LINK,
	SIMPLE_VM_LINK,
	SURVEY_LINK,
	WIKI_WORKSHOPS,
	WIKI_PERSONAL_DATA,
	GDPR_LINK,
	CLOUD_PORTAL_SUPPORT_MAIL,
	LIFESCIENCE_LINKING_ACCOUNTS,
	WIKI_LINKING_ACCOUNTS,
	WIKI_PRINCIPAL_INVESTIGATOR,
	WIKI_CLOUD_TERMS_LINK,
	WIKI_BACKUP_LINK
} from '../../../links/links'
import { UserService } from '../../api-connector/user.service'
import { Userinfo } from '../../userinfo/userinfo.model'
import { User } from '../application.model/user.model'
import { NotificationModalComponent } from '../../shared/modal/notification-modal'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { NgIf, NgClass, NgFor } from '@angular/common'
import {
	MinAmoutValidatorDirective,
	IntegerValidatorDirective,
	MaxAmoutValidatorDirective
} from '../numberValidations.directive'
import { AccordionModule } from 'ngx-bootstrap/accordion'
import { NgSelectComponent } from '@ng-select/ng-select'
import { ModalModule } from 'ngx-bootstrap/modal'
import { RouterLink } from '@angular/router'
import { DisseminationPlatform } from '../application.model/dissemination-platform'
import { DisseminationPlatformSelectedPipe } from 'app/pipe-module/pipes/platform-selected.pipe'
import { ApplicationDissemination } from '../application-dissemination'
import { AllowedDisseminationInformationPipe } from 'app/pipe-module/pipes/allowed-dissemination-information.pipe'

/**
 * Application formular component.
 */
@Component({
	selector: 'app-application-formular',
	templateUrl: './application-formular.component.html',
	styleUrls: ['./application-formular.component.scss'],
	providers: [FlavorService, ApplicationsService, CreditsService],
	imports: [
		NgIf,
		FormsModule,
		NgClass,
		MinAmoutValidatorDirective,
		IntegerValidatorDirective,
		MaxAmoutValidatorDirective,
		AccordionModule,
		NgFor,
		NgSelectComponent,
		ModalModule,
		RouterLink,
		DisseminationPlatformSelectedPipe,
		AllowedDisseminationInformationPipe
	]
})
export class ApplicationFormularComponent extends ApplicationBaseClassComponent implements OnInit {
	@Input() openstack_project: boolean = false
	@Input() simple_vm_project: boolean = false
	@Input() kubernetes_access: boolean = false
	@Input() title: string
	@Input() application: Application
	@Input() is_validation: boolean = false
	@Input() hash: string
	DEFAULT_SHORTNAME_MAX_LENGTH: number = 15
	shortNameMaxLength: number = 15

	userinfo: Userinfo
	valid_pi_affiliations
	unknownPiAffiliationsConfirmation: boolean = false
	pi_responsibility_checked: boolean = false
	edam_ontology_terms: EdamOntologyTerm[] = []
	isLoaded: boolean = false
	submitting: boolean = false
	test_name: string = ''
	all_dissemination_checked: boolean = false
	initiated_validation: boolean = false
	dissemination_platform_count: number = 0
	flavorList: Flavor[] = []
	production: boolean = environment.production
	dissemination_information_open: boolean = true
	invalid_shortname: boolean = false
	invalid_longname: boolean = false
	invalid_description: boolean = false
	simple_vm_min_vm: boolean = false
	error: string[]
	CREDITS_WIKI: string = CREDITS_WIKI
	CLOUD_PORTAL_SUPPORT_MAIL: string = CLOUD_PORTAL_SUPPORT_MAIL
	LIFESCIENCE_LINKING_ACCOUNTS: string = LIFESCIENCE_LINKING_ACCOUNTS
	WIKI_LINKING_ACCOUNTS: string = WIKI_LINKING_ACCOUNTS
	WIKI_PRINCIPAL_INVESTIGATOR: string = WIKI_PRINCIPAL_INVESTIGATOR
	SURVEY_LINK: string = SURVEY_LINK
	POLICY_LINK: string = POLICY_LINK
	WIKI_WORKSHOPS: string = WIKI_WORKSHOPS
	OPENSTACK_LINK: string = OPENSTACK_LINK
	PROJECT_TYPES_LINK: string = PROJECT_TYPES_LINK
	SIMPLE_VM_LINK: string = SIMPLE_VM_LINK
	WIKI_CLOUD_TERMS_LINK: string = WIKI_CLOUD_TERMS_LINK
	WIKI_PERSONAL_DATA: string = WIKI_PERSONAL_DATA
	WIKI_BACKUP_LINK: string = WIKI_BACKUP_LINK
	GDPR_LINK: string = GDPR_LINK
	survey_link_visible: boolean = false
	private nameCheckPipe = new Subject<string>()
	shortnameChecking: boolean = false
	shortNameTaken: boolean = false

	MAX_LIFETIME_DEFAULT: number = 6
	max_lifetime: number = this.MAX_LIFETIME_DEFAULT

	acknowledgeModalTitle: string = 'Acknowledge'
	acknowledgeModalType: string = 'info'

	availablePlatforms: DisseminationPlatform[] = []
	selectedDisseminationPlatforms: DisseminationPlatform[] = []

	application_id: string | number
	ontology_search_keyword: string = 'term'
	@ViewChild(NgForm, { static: true }) application_form: NgForm
	// /**
	//  * List of flavor types.
	//  */
	// public typeList: FlavorType[] = [];

	constructor(
		private creditsService: CreditsService,
		private flavorService: FlavorService,
		private fullLayout: FullLayoutComponent,
		userService: UserService,
		applicationsService: ApplicationsService,
		cdrRef: ChangeDetectorRef,
		notificationModal: NotificationModalComponent
	) {
		super(userService, applicationsService, null, notificationModal, cdrRef)
	}

	ngOnInit(): void {
		this.getUserinfo()
		this.getListOfFlavors()
		this.getDisseminationPlatforms()
		this.getListOfTypes()
		this.is_vo_admin = is_vo
		this.nameCheckPipe.pipe(debounceTime(600), distinctUntilChanged()).subscribe(value => {
			this.checkIfNameIsTaken(value)
		})

		if (this.openstack_project) {
			this.simple_vm_min_vm = true
		}
		this.applicationsService.getEdamOntologyTerms().subscribe((terms: EdamOntologyTerm[]): void => {
			this.edam_ontology_terms = terms
			this.initiateFormWithApplication()
		})
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onAllDissChange(event: any): void {
		if (this.all_dissemination_checked) {
			this.application.dissemination.setAllInformationTrue()
		} else {
			this.application.dissemination.setAllInformationFalse()
		}
	}

	getDisseminationPlatforms(): void {
		this.applicationsService.getDisseminationPlatforms().subscribe((platforms: DisseminationPlatform[]): void => {
			this.availablePlatforms = platforms
		})
	}

	isPlatformSelected(platform: DisseminationPlatform): boolean {
		console.log(platform)
		console.log(this.application.dissemination.platforms)

		return this.application.dissemination.platforms.includes(platform)
	}

	updateSelectedPlatforms(platform: DisseminationPlatform, isSelected: boolean): void {
		if (isSelected) {
			if (!this.application.dissemination.platforms.includes(platform)) {
				this.application.dissemination.platforms.push(platform)
			}
		} else {
			this.application.dissemination.platforms = this.application.dissemination.platforms.filter(p => p !== platform)
		}
	}

	setDefaulShortnameLength(): void {
		this.shortNameMaxLength = this.DEFAULT_SHORTNAME_MAX_LENGTH
	}

	checkIfNameIsTaken(shortname: string): void {
		this.shortnameChecking = true

		this.applicationsService
			.checkForTakenShortname(shortname, this.application?.project_application_id)
			.subscribe((result: boolean): void => {
				const nameExists: boolean = result['exists']
				this.shortnameChecking = false
				this.shortNameTaken = nameExists
			})
	}

	checkValidityComment(): boolean {
		if (this.extraResourceCommentRequired) {
			if (this.application.project_application_comment?.length < 50) {
				return false
			} else {
				const regExp = /[a-zA-Z]/g

				return regExp.test(this.application.project_application_comment)
			}
		} else {
			return true
		}
	}

	getUserinfo(): void {
		this.userService.getUserInfo().subscribe((userinfo: Userinfo) => {
			this.userinfo = userinfo
			this.valid_pi_affiliations = this.userinfo.validateAffiliations()
		})
	}

	clearApplication(): void {
		this.application = new Application(null)
		this.application.project_application_openstack_project = this.openstack_project
		if (this.openstack_project) {
			this.application.project_application_object_storage = 0
		}
		this.application.project_application_volume_counter = 3
		this.application.project_application_volume_limit = 20
	}

	initiateFormWithApplication(): void {
		if (this.application && !this.initiated_validation && this.is_validation) {
			this.openstack_project = this.application.project_application_openstack_project

			if (this.application.project_application_shortname.length > 15) {
				this.shortNameMaxLength = this.application.project_application_shortname.length
			}

			this.simple_vm_project = !this.openstack_project
			this.application.project_application_pi = new User()

			//	this.searchTermsInEdamTerms();
			if (this.application.dissemination?.someAllowed() || this.application.project_application_report_allowed) {
				this.project_application_report_allowed = true
			}
			if (this.simple_vm_project) {
				this.simple_vm_min_vm = this.application.flavors.length > 0
			}
			if (this.application.project_application_nfdi && this.application.project_application_nfdi.length > 0) {
				this.max_lifetime = 12
			}
			this.initiated_validation = true
		} else {
			this.application = new Application(null)
			this.application.dissemination = new ApplicationDissemination()
			this.application.project_application_openstack_project = this.openstack_project
			this.application.project_application_kubernetes_access = this.kubernetes_access
			if (this.openstack_project) {
				this.application.project_application_object_storage = 0
			}
			this.application.project_application_volume_counter = 0
			this.application.project_application_volume_limit = 0
		}
		this.isLoaded = true
	}

	checkIfTypeGotSimpleVmFlavor(type: FlavorType): boolean {
		for (const flav of this.flavorList) {
			if (flav.type.shortcut === type.shortcut && flav.simple_vm) {
				return true
			}
		}

		return false
	}

	selectEvent(item: EdamOntologyTerm): void {
		this.application.addEdamTerm(item)
	}

	onChangeFlavor(flavor: Flavor, value: number): void {
		this.application.setFlavorInFlavors(flavor, value)
		this.valuesChanged(flavor, value)
		if (this.simple_vm_project) {
			this.checkIfMinVmIsSelected()
		}
	}

	count_platform(checked: boolean): void {
		if (checked) {
			this.dissemination_platform_count += 1
		} else {
			this.dissemination_platform_count += 1
		}
	}

	/**
	 * Check if shortname is valid.
	 *
	 * @param shortname
	 */
	public checkShortname(shortname: string): void {
		this.invalid_shortname = !/^[a-zA-Z0-9\s]*$/.test(shortname)
		if (!this.invalid_shortname) {
			this.shortnameChecking = true
			this.nameCheckPipe.next(shortname)
		}
	}

	public checkLongname(longname: string): void {
		this.invalid_longname = !/^[a-zA-Z0-9-_\s]*$/.test(longname)
	}

	public checkDescription(description: string): void {
		this.invalid_description = !this.isASCII(description)
	}

	/**
	 * gets a list of all available Flavors from the flavorservice and puts them into the array flavorList
	 */
	getListOfFlavors(): void {
		this.flavorService.getListOfFlavorsAvailable().subscribe((flavors: Flavor[]): void => {
			this.flavorList = flavors
		})
	}

	/**
	 * Gets a list of all available types of flavors from the flavorservice and uses them in the function setListOfTypes
	 */
	getListOfTypes(): void {
		this.flavorService.getListOfTypesAvailable().subscribe((types: FlavorType[]): void => {
			this.setListOfTypes(types)
		})
	}

	checkIfMinVmIsSelected(): void {
		this.simple_vm_min_vm = this.application.flavors.length > 0
	}

	searchTermsInEdamTerms(): void {
		const tmp: EdamOntologyTerm[] = []
		// tslint:disable-next-line:no-for-each-push typedef
		this.application.project_application_edam_terms.forEach(ele => {
			// tslint:disable-next-line:typedef
			// @ts-ignore
			// tslint:disable-next-line:typedef
			const td = this.edam_ontology_terms.find(term => term.term === ele)
			tmp.push(td)
		})
		this.application.project_application_edam_terms = tmp
	}

	onSubmit(): void {
		this.error = null
		this.submitting = true
		if (
			this.application.project_application_volume_counter <= 0 ||
			this.application.project_application_volume_counter === null
		) {
			this.application.project_application_volume_limit = 0
		}

		this.applicationsService.addNewApplication(this.application).subscribe(
			(application: Application): void => {
				this.clearApplication()
				this.submitting = false
				this.survey_link_visible = true
				this.application_id = application.project_application_id

				this.updateNotificationModal('Success', 'The application was submitted', true, 'success')
				this.fullLayout.getGroupsEnumeration()

				this.notificationModalStay = false
			},
			(error: object): void => {
				this.survey_link_visible = false

				const error_json: object = error
				this.error = []
				for (const key of Object.keys(error_json)) {
					this.error.push(key.split('_')[2])
				}

				this.updateNotificationModal(
					'Failed',
					'The application was not submitted, please check the required fields and try again.',
					true,
					'danger'
				)
				this.notificationModalStay = true
			}
		)
	}

	/**
	 * Sends a request to the BE to get the initital credits for a new application.
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	calculateInitialCredits(form: NgForm): void {
		this.creditsService
			.getCreditsForApplication(this.application.flavors, this.application.project_application_lifetime)
			.toPromise()
			.then((credits: number): void => {
				this.application.project_application_initial_credits = credits
			})
			.catch((err: any): void => console.log(err))
	}

	approveApplication(form: NgForm): any {
		this.calculateInitialCredits(form)
		this.application_id = this.application.project_application_id
		this.applicationsService.validateApplicationAsPIByHash(this.hash, this.application).subscribe(
			(): void => {
				this.fullLayout.getGroupsEnumeration()

				this.updateNotificationModal(
					'Success',
					'You have been confirmed as the PI responsible for the project and the application has been successfully confirmed by you.',
					true,
					'success'
				)
				this.notificationModalStay = false
			},
			(): void => {
				this.updateNotificationModal(
					'Failed',
					'The application and your state as the PI were not successfully confirmed.',
					true,
					'danger'
				)
				this.notificationModalStay = true
			}
		)
	}

	/**
	 * Creates a test application
	 *
	 * @param name of the new test application
	 */
	sendTestApplication(name: string): void {
		const default_flav: Flavor = this.flavorList.find((fl: Flavor): boolean => fl.name === 'de.NBI default')

		this.application.project_application_bmbf_project = 'BMBF'
		this.application.project_application_horizon2020 = 'horizon'
		this.application.setFlavorInFlavors(default_flav, 3)
		this.application.project_application_pi_approved = true
		this.application.project_application_comment = 'TestApplication'
		this.application.project_application_description = 'TestApplication'
		this.application.project_application_institute = 'TestApplication'
		this.application.project_application_lifetime = 3
		this.application.project_application_name = name
		this.application.project_application_openstack_project = this.openstack_project
		this.application.project_application_report_allowed = false
		this.application.project_application_shortname = name.substr(0, 15)
		this.application.project_application_volume_counter = 3
		this.application.project_application_volume_limit = 20
		this.application.project_application_workgroup = 'TestApplication'
		this.application.project_application_initial_credits = 5952

		this.applicationsService.addNewApplication(this.application).subscribe(
			(application: Application): void => {
				this.clearApplication()
				this.submitting = false
				this.application_id = application.project_application_id
				this.updateNotificationModal('Success', 'The application was submitted', true, 'success')
				this.notificationModalStay = false
				this.fullLayout.getGroupsEnumeration()
			},
			(error: object): void => {
				const error_json: object = error
				this.error = []
				for (const key of Object.keys(error_json)) {
					this.error.push(key.split('_')[2])
				}

				this.updateNotificationModal(
					'Failed',
					'The application was not submitted, please check the required fields and try again.',
					true,
					'danger'
				)
				this.notificationModalStay = true
			}
		)
	}

	toggleProjectPart(checked: boolean, project_part: string): void {
		switch (project_part) {
			case 'horizon': {
				if (!checked) {
					this.application.project_application_horizon2020 = ''
				}
				break
			}
			case 'elixir': {
				if (!checked) {
					this.application.project_application_elixir_project = ''
				}
				break
			}
			case 'bmbf': {
				if (!checked) {
					this.application.project_application_bmbf_project = ''
				}
				break
			}
			case 'nfdi': {
				if (!checked) {
					this.application.project_application_nfdi = ''
					this.max_lifetime = this.MAX_LIFETIME_DEFAULT
				} else {
					this.max_lifetime = 12
				}
				break
			}
			default: {
				break
			}
		}
	}

	togglePersonalDataType(checked: boolean, data_type: string) {
		switch (data_type) {
			case 'person_related': {
				if (!checked) {
					this.application.project_application_no_personal_data = false
					this.application.project_application_nonsensitive_data = false
					this.application.project_application_sensitive_data = false
				}
				break
			}
			case 'no_personal_data': {
				if (checked) {
					this.application.project_application_nonsensitive_data = false
					this.application.project_application_sensitive_data = false
				}
				break
			}
			case 'nonsensitive': {
				if (checked) {
					this.application.project_application_no_personal_data = false
				}
				break
			}
			case 'sensitive': {
				if (checked) {
					this.application.project_application_no_personal_data = false
				}
				break
			}
			default:
				break
		}
	}
}
