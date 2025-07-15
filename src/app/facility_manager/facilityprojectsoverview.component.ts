import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core'
import { debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs'
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal'

import { ProjectMember } from '../projectmanagement/project_member.model'
import { environment } from '../../environments/environment'
import { ApiSettings } from '../api-connector/api-settings.service'
import { GroupService } from '../api-connector/group.service'
import { UserService } from '../api-connector/user.service'
import { FacilityService } from '../api-connector/facility.service'
import { NewsService } from '../api-connector/news.service'
import { Application } from '../applications/application.model/application.model'
import {
	NgbdSortableHeaderDirective,
	SortEvent
} from '../shared/shared_modules/directives/nbd-sortable-header.directive'
import { ProjectSortService } from '../shared/shared_modules/services/project-sort.service'
import { AbstractBaseClass } from '../shared/shared_modules/baseClass/abstract-base-class'
import { ProjectEmailModalComponent } from '../shared/modal/email/project-email-modal/project-email-modal.component'
import { MembersListModalComponent } from '../shared/modal/members/members-list-modal.component'
import { EmailService } from '../api-connector/email.service'
import { CsvMailTemplateModel } from '../shared/classes/csvMailTemplate.model'
import { ProjectCsvTemplatedEmailModalComponent } from '../shared/modal/email/project-csv-templated-email-modal/project-csv-templated-email-modal.component'
import { NotificationModalComponent } from '../shared/modal/notification-modal'
import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common'
import { FormsModule } from '@angular/forms'
import {
	TextColorDirective,
	TextBgColorDirective,
	BadgeComponent,
	InputGroupComponent,
	ButtonDirective,
	DropdownComponent,
	DropdownToggleDirective,
	DropdownMenuDirective,
	DropdownItemDirective
} from '@coreui/angular'
import { NgbPagination, NgbHighlight } from '@ng-bootstrap/ng-bootstrap'
import { ApplicationBadgesComponent } from '../shared/shared_modules/components/applications/application-badges/application-badges.component'
import { NgSelectComponent } from '@ng-select/ng-select'
import { HasStatusPipe } from '../pipe-module/pipes/has-status.pipe'
import { HasstatusinlistPipe } from '../pipe-module/pipes/hasstatusinlist.pipe'
import { InListPipe } from '../pipe-module/pipes/in-list.pipe'
import { ApplicationPage } from 'app/shared/models/application.page'
import { BasePaginationComponent } from 'app/shared/shared_modules/components/pagination/base-pagination.component'
import { ApplicationFilter } from 'app/shared/classes/application-filter'
import { ApplicationListModalComponent } from 'app/shared/modal/application-list/application-list.modal.component'
import { ApplicationFilterInputComponent } from 'app/shared/shared_modules/components/applications/application-filter-input/application-filter-input.component'
import { ApplicationStatusBadgesComponent } from 'app/shared/shared_modules/components/applications/application-status-badges/application-status-badges.component'
import { ExtendedFacilityNews } from './newsmanagement/facility-news'

/**
 * Facility Project overview component.
 */
@Component({
	selector: 'app-facility-projects',
	templateUrl: 'facilityprojectsoverview.component.html',
	providers: [FacilityService, UserService, GroupService, ApiSettings, NewsService, ProjectSortService],
	imports: [
		NgIf,
		FormsModule,
		NgFor,
		TextColorDirective,
		TextBgColorDirective,
		BadgeComponent,
		NgbPagination,
		InputGroupComponent,
		ButtonDirective,
		NgbdSortableHeaderDirective,
		ApplicationBadgesComponent,
		NgbHighlight,
		ModalModule,
		NgClass,
		NgSelectComponent,
		AsyncPipe,
		HasStatusPipe,
		HasstatusinlistPipe,
		InListPipe,
		BasePaginationComponent,
		ApplicationFilterInputComponent,
		ApplicationStatusBadgesComponent,
		DropdownComponent,
		ButtonDirective,
		DropdownToggleDirective,
		DropdownMenuDirective,
		DropdownItemDirective
	]
})
export class FacilityProjectsOverviewComponent extends AbstractBaseClass implements OnInit {
	@Input() voRegistrationLink: string = environment.voRegistrationLink

	title: string = 'Projects Overview'
	filter: string

	membersLoaded: boolean = false
	public memberFilter: string = ''
	filteredMembers: object[] = []
	selectedMember: object[] = []
	applicationPage: ApplicationPage = new ApplicationPage()
	applicationFilter: ApplicationFilter = new ApplicationFilter()
	activeApplications: Application[] = []
	filteredActiveApplications: Application[] = []
	activeProjectsFilterTerm: string = ''

	isLoaded: boolean = false
	show_openstack_projects: boolean = true
	show_simple_vm_projects: boolean = true
	details_loaded: boolean = false
	selectedEmailProjects: Application[] = []
	bsModalRef: BsModalRef
	userElixirSearchPI: boolean = true
	userElixirSearchAdmin: boolean = true
	userElixirSearchMember: boolean = true
	userElixirIdFilter: string
	projectsLoaded: boolean = false
	textFilterSubject = new Subject<string>()

	/**
	 * Approved group status.
	 *
	 * @type {number}
	 */
	STATUS_APPROVED: number = 2

	selectedProjectType: string = 'ALL'

	// modal variables for User list
	public selectedProjectForSearch: Application
	public usersModalProjectMembers: ProjectMember[] = []
	allFacilityMembers: object[] = []
	public usersModalProjectID: number
	public usersModalProjectName: string
	public selectedProject: Application
	public userSearchValue: string
	validElixirIdFilter: boolean = false

	public emailSubject: string
	public emailText: string
	public emailStatus: number = 0
	public emailReply: string = ''
	public sendNews: boolean
	public alternative_emailText: string = ''
	public news_tags: string[] = []
	FILTER_DEBOUNCE_TIME: number = 500

	public managerFacilities: [string, number][] = []
	public selectedFacility: [string, number]
	projects_filtered: Application[] = []
	facilitySupportMails: string = ''
	supportMailEditing: boolean = false
	recipientsInfo: string = ''
	PREDEFINED_TAGS: string[] = ['downtime', 'openstack', 'simplevm', 'maintenance', 'update']

	@ViewChildren(NgbdSortableHeaderDirective) headers: QueryList<NgbdSortableHeaderDirective>

	applictions$: Observable<Application[]>
	total$: Observable<number>

	constructor(
		private facilityService: FacilityService,
		private modalService: BsModalService,
		private emailService: EmailService,
		private notificationModal: NotificationModalComponent
	) {
		super()
	}

	setRecipientsString(): void {
		switch (this.selectedProjectType) {
			case 'ALL':
				this.recipientsInfo = `ALL Projects`
				break
			case 'OVP':
				this.recipientsInfo = `OpenStack Projects`
				break
			case 'SVP':
				this.recipientsInfo = `SimpleVm Projects`
				break
			case 'USER':
				this.recipientsInfo = `Specific Members`
				break
			default:
				// eslint-disable-next-line no-case-declarations
				const pro: Application = this.filteredActiveApplications.find(
					(project: Application): boolean =>
						project.project_application_perun_id.toString() === this.selectedProjectType.toString()
				)
				if (pro) {
					this.recipientsInfo = `${pro.project_application_shortname} (${pro.project_application_perun_id})`
				} else {
					this.recipientsInfo = ''
				}
				break
		}
	}

	setEmailSubject(): void {
		switch (this.selectedProjectType) {
			case 'ALL':
				this.emailSubject = `[${this.selectedFacility['Facility']}]`
				break
			case 'OVP':
				this.emailSubject = `[${this.selectedFacility['Facility']}: OpenStack]`
				break
			case 'SVP':
				this.emailSubject = `[${this.selectedFacility['Facility']}: SimpleVm]`
				break
			case 'USER':
				this.emailSubject = `[${this.selectedFacility['Facility']}: Specific Members]`
				break
			default:
				// eslint-disable-next-line no-case-declarations
				const pro: Application = this.filteredActiveApplications.find(
					(project: Application): boolean =>
						project.project_application_perun_id.toString() === this.selectedProjectType.toString()
				)
				if (pro) {
					this.emailSubject = `[${this.selectedFacility['Facility']}: ${pro.project_application_shortname}]`
				} else {
					this.emailSubject = `[${this.selectedFacility['Facility']}]`
				}
				break
		}
	}

	ngOnInit(): void {
		this.textFilterSubject.pipe(debounceTime(600), distinctUntilChanged()).subscribe(filter => {
			this.userElixirIdFilter = ''

			this.applicationFilter.textFilter = filter
			this.getSelectedFacilityProjects()
		})

		this.facilityService.getManagerFacilities().subscribe((result: any): void => {
			this.managerFacilities = result
			this.selectedFacility = this.managerFacilities[0]
			this.emailSubject = `[${this.selectedFacility['Facility']}]`
			this.getFacilityProjects(this.managerFacilities[0]['FacilityId'])
			this.getActiveFacilityProjects(this.managerFacilities[0]['FacilityId'])

			this.title = `${this.title}:${this.selectedFacility['Facility']}`
		})
		this.sendNews = true

		/** needs refactoring in case we introduce tags to wagtail
				 * this.newsService.getAvailableTagsFromWordPress().subscribe((tags: WordPressTag[]): void => {
			if (!(('code' in tags) && tags['code'] === 'wp-die')) {
				if (tags) {
					this.availableNewsTags = tags;
				}
			}
		}); * */
	}

	onCsvFileSelected(event): void {
		const inputElement = event.target as HTMLInputElement
		if (inputElement.files && inputElement.files.length > 0) {
			this.emailService.sendCsvTemplate(inputElement.files[0]).subscribe(
				(csvTemplate: CsvMailTemplateModel) => {
					this.openProjectMailsModal(inputElement.files[0], csvTemplate)
				},
				(error: CsvMailTemplateModel) => {
					console.log(error['error'])
					this.openProjectMailsModal(inputElement.files[0], error['error'])
				}
			)
		}
	}

	openProjectCSVMailModal(): void {
		this.bsModalRef = this.modalService.show(ProjectCsvTemplatedEmailModalComponent, { class: 'modal-lg' })
	}

	onSort({ column, direction }: SortEvent) {
		// resetting other headers
		this.headers.forEach(header => {
			if (header.appSortable !== column) {
				header.direction = ''
			}
		})

		this.applicationFilter.sortDirection = direction
		this.applicationFilter.sortColumn = column
		this.getSelectedFacilityProjects()
	}

	filterMembers(bare_searchString: string): void {
		this.filteredMembers = []
		const searchString: string = bare_searchString.trim().toLowerCase()

		this.allFacilityMembers.forEach((member: object): void => {
			if (
				member['elixirId'].toLowerCase().includes(searchString) ||
				member['email'].toLowerCase().includes(searchString) ||
				member['firstName'].toLowerCase().includes(searchString) ||
				member['lastName'].toLowerCase().includes(searchString)
			) {
				this.filteredMembers.push(member)
			}
		})
	}

	getRunningApplicationsThatNeedIntroduction(): void {
		this.facilityService
			.getAllProjectsThatStillDemandAnIntroductionCourse(this.selectedFacility['FacilityId'])
			.subscribe((applications: Application[]): void => {
				const initialState = {
					applications: applications
				}
				this.bsModalRef = this.modalService.show(ApplicationListModalComponent, { initialState, class: 'modal-xl' })
			})
	}

	checkValidElixirIdFilter(): void {
		this.validElixirIdFilter = this.userElixirIdFilter && this.userElixirIdFilter.includes('@elixir-europe.org')
	}

	getProjectsByMemberElixirId(): void {
		// tslint:disable-next-line:max-line-length
		this.userElixirIdFilter = this.userElixirIdFilter.trim()
		this.applicationFilter = new ApplicationFilter()
		if (this.userElixirIdFilter && this.userElixirIdFilter.includes('@elixir-europe.org')) {
			this.projectsLoaded = false

			this.facilityService
				.getFacilityGroupsByMemberElixirId(
					this.selectedFacility['FacilityId'],
					this.userElixirIdFilter,
					this.userElixirSearchPI,
					this.userElixirSearchAdmin,
					this.userElixirSearchMember
				)
				.subscribe((applications: Application[]): void => {
					for (const group of applications) {
						if (group.project_application_lifetime > 0) {
							group.lifetime_reached = this.lifeTimeReached(group.lifetime_days, group.DaysRunning)
						}
					}
					this.applicationPage.results = applications
					this.projectsLoaded = true
				})
		} else {
			this.projectsLoaded = true
		}
	}

	/**
	 * Gets projects and sets email subject prefix when selected facility changes.
	 */
	onChangeSelectedFacility(): void {
		this.isLoaded = false
		this.textFilterSubject.next('')

		this.applicationPage = new ApplicationPage()

		this.getSelectedFacilityProjects()
		this.emailSubject = `[${this.selectedFacility['Facility']}]`
	}

	showMembersModal(application: Application): void {
		const initialState = {
			projectId: application.project_application_perun_id,
			projectName: application.project_application_shortname,
			facilityId: this.selectedFacility['FacilityId']
		}

		this.bsModalRef = this.modalService.show(MembersListModalComponent, { initialState, class: 'modal-lg' })
	}

	getProjectLifetime(): void {
		this.details_loaded = true
	}

	selectAllFilteredProjects(): void {
		this.selectedEmailProjects = []

		this.applicationPage.results.forEach(application => {
			if (!application.hasTerminatedStatus()) {
				application.is_project_selected = true
				this.toggleSelectedEmailApplication(application, application.is_project_selected)
			}
		})
	}

	unselectAll(): void {
		this.applicationPage.results.forEach((pr: Application) => {
			pr.is_project_selected = false
			this.toggleSelectedEmailApplication(pr, pr.is_project_selected)
		})
		this.selectedEmailProjects = []
		//		this.selectedEmailProjects = []; // clear the selectedEmailProjects list
	}

	unselectAllFilteredProjects(): void {
		// get all the applications
		// set the selected state of all projects to false
		this.applicationPage.results.forEach(application => {
			application.is_project_selected = false
			this.toggleSelectedEmailApplication(application, application.is_project_selected)
		})
	}

	toggleSelectedEmailApplication(application: Application, isChecked: boolean): void {
		const index = this.selectedEmailProjects.indexOf(application)

		if (isChecked) {
			// checkbox was checked
			if (index === -1) {
				// application is not in the list, so add it
				this.selectedEmailProjects.push(application)
			}
		} else {
			// checkbox was unchecked
			// application is in the list, so remove it
			this.selectedEmailProjects.splice(index, 1)
		}
	}

	/**
	 * Returns the name of the project with the id of the selectedProjectType
	 */
	getProjectNameBySelectedProjectTypeAsId(): string {
		const id: string = this.selectedProjectType
		if (!id) {
			return 'NOT_FOUND'
		}
		const project: Application = this.filteredActiveApplications.find(
			(element: Application): boolean => element.project_application_perun_id.toString() === id.toString()
		)
		if (project) {
			return project.project_application_shortname
		}

		return 'NOT_FOUND'
	}

	getSelectedFacilityProjects(): void {
		this.getFacilityProjects(this.selectedFacility['FacilityId'])
		this.getActiveFacilityProjects(this.selectedFacility['FacilityId'])
	}

	setSelectedProjectType(type: string) {
		this.selectedProjectType = type
		this.setEmailSubject()
		this.setRecipientsString()
	}

	filterActiveProjectsByFilterTerm(): void {
		if (this.activeProjectsFilterTerm) {
			this.filteredActiveApplications = this.activeApplications.filter((application: Application) => {
				const filterTermLowercase = this.activeProjectsFilterTerm.toLowerCase()

				return (
					application.project_application_perun_id.toString().toLowerCase() === filterTermLowercase ||
					application.project_application_shortname.toLowerCase().includes(filterTermLowercase) ||
					application.project_application_name.toLowerCase().includes(filterTermLowercase)
				)
			})
		} else {
			this.filteredActiveApplications = [...this.activeApplications]
		}
	}

	getActiveFacilityProjects(facility_id: string): void {
		this.activeApplications = []
		this.activeProjectsFilterTerm = ''
		this.facilityService
			.getFacilityActiveProjectsNameAndIds(facility_id)
			.subscribe((activeApplications: Application[]) => {
				this.activeApplications = activeApplications
				this.filterActiveProjectsByFilterTerm()
			})
	}
	getFacilityProjects(facility: string): void {
		this.projectsLoaded = false
		this.userElixirIdFilter = ''

		// tslint:disable-next-line:max-line-length
		this.facilityService
			.getFacilityAllowedGroupsWithDetailsAndSpecificStatus(facility, this.applicationFilter, this.applicationPage)
			.subscribe((applicationPage: ApplicationPage): void => {
				for (const group of applicationPage.results) {
					if (group.project_application_lifetime > 0) {
						group.lifetime_reached = this.lifeTimeReached(group.lifetime_days, group.DaysRunning)
					}
				}
				this.projectsLoaded = true

				this.isLoaded = true
			})
		this.facilityService.getAllMembersOfFacility(facility, this.STATUS_APPROVED).subscribe(
			(result: any[]): void => {
				this.membersLoaded = true
				this.allFacilityMembers = result
			},
			(error: any): void => {
				console.log(error)
				this.membersLoaded = false
			}
		)
	}

	/**
	 * Adds or deletes tags from the list of tags to add to the news when the corresponding checkbox gets clicked.
	 *
	 * @param tag the tag which gets added/deleted.
	 */

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
	sendMailToFacility(
		facility: string,
		subject: string,
		message: string,
		reply?: string,
		send?: any,
		alternative_news_text?: string
	): void {
		this.emailStatus = 0
		if (this.selectedProjectType === 'USER') {
			const tempMailList: string[] = []
			// tslint:disable-next-line:no-for-each-push
			this.selectedMember.forEach((member: object): void => {
				tempMailList.push(member['email'])
			})
			this.selectedProjectType = tempMailList.join(',')
		}
		if (reply) {
			reply = reply.trim()
		}

		const extObj: any = {
			title: subject,
			facility: facility,
			text: message,
			tags: this.news_tags,
			is_current_motd: false,
			send_news: send,
			reply: reply,
			type: this.selectedProjectType,
			alternative_message: alternative_news_text
		}
		const extNews: ExtendedFacilityNews = new ExtendedFacilityNews(extObj)

		this.facilityService
			.sendMailToFacility(
				// TODO: adjust to ExtendedFacilityNews
				extNews
			)
			.subscribe(
				(result: any): void => {
					if (result.status === 201) {
						this.emailStatus = 1
					} else {
						this.emailStatus = 2
					}
				},
				(): void => {
					this.emailStatus = 2
				},
				(): void => {
					this.filteredMembers = []
					this.selectedProjectType = 'ALL'
					this.emailReply = ''
					this.selectedMember = []
					this.memberFilter = ''
				}
			)
	}

	/**
	 * Sets the member selected in the mail modal as the member to send the mail to.
	 *
	 * @param member the selected member
	 */

	setSelectedUserForMail(member: object): void {
		if (!this.selectedMember.includes(member)) {
			this.selectedMember.push(member)
		}
	}

	removeSelectedUserForMail(member: object): void {
		const index: number = this.selectedMember.indexOf(member)
		if (index > -1) {
			this.selectedMember.splice(index, 1)
		}
	}

	getMembersOfTheProject(projectid: number, projectname: string): void {
		this.facilityService
			.getFacilityGroupRichMembers(projectid, this.selectedFacility['FacilityId'])
			.subscribe((members: ProjectMember[]): void => {
				this.usersModalProjectID = projectid
				this.usersModalProjectName = projectname
				this.usersModalProjectMembers = members
			})
	}

	public resetEmailModal(): void {
		this.selectedProjectType = 'ALL'
		this.activeProjectsFilterTerm = ''
		this.recipientsInfo = ''
		this.emailSubject = `[${this.selectedFacility['Facility']}]`
		this.emailText = null
		this.emailReply = null
		this.emailStatus = 0
		this.sendNews = true
		this.alternative_emailText = ''
		this.news_tags = []
		this.selectedMember = []
	}

	getFacilitySupportMails(): void {
		this.facilityService.getSupportMails(this.selectedFacility['FacilityId']).subscribe((result: any) => {
			this.facilitySupportMails = result['body']
			if (this.facilitySupportMails === '' || this.facilitySupportMails === null) {
				this.facilitySupportMails = 'example@mail1.com, example@mail2.com'
			}
		})
	}

	openProjectMailsModal(csvFile: File = null, csvTemplate: CsvMailTemplateModel = null): void {
		let initialState = {}

		if (csvFile) {
			initialState = {
				selectedProjects: csvTemplate.valid_projects,
				csvFile,
				csvMailTemplate: csvTemplate
			}
		} else {
			initialState = { selectedProjects: this.selectedEmailProjects }
		}
		this.bsModalRef = this.modalService.show(ProjectEmailModalComponent, { initialState, class: 'modal-lg' })
	}

	setFacilitySupportMails(supportMails: string): void {
		const facilityId = this.selectedFacility['FacilityId']
		this.facilityService.setSupportMails(facilityId, supportMails).subscribe((result: any): void => {
			if (result.ok) {
				this.notificationModal.showSuccessFullNotificationModal(
					'Facility support mails changed',
					'You successfully changed the facility support mails.'
				)
			} else {
				this.notificationModal.showDangerNotificationModal(
					"Couldn't change facility support mails",
					'An error occurred while trying to change the facility support mails.'
				)
			}
		})
	}

	toggleSupportMailEditing(): void {
		this.supportMailEditing = !this.supportMailEditing
	}
}
