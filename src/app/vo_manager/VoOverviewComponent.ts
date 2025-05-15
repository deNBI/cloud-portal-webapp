import { Component, EventEmitter, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core'
import { debounceTime, distinctUntilChanged, Observable, Subject, Subscription } from 'rxjs'
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal'
import * as FileSaver from 'file-saver'

import { VoService } from '../api-connector/vo.service'
import { ProjectMember } from '../projectmanagement/project_member.model'
import { GroupService } from '../api-connector/group.service'
import { ComputecenterComponent } from '../projectmanagement/computecenter.component'
import { IResponseTemplate } from '../api-connector/response-template'
import { FacilityService } from '../api-connector/facility.service'
import { FullLayoutComponent } from '../layouts/full-layout.component'
import { Application } from '../applications/application.model/application.model'
import { AbstractBaseClass } from '../shared/shared_modules/baseClass/abstract-base-class'
import {
	NgbdSortableHeaderDirective,
	SortEvent
} from '../shared/shared_modules/directives/nbd-sortable-header.directive'
import { ConfirmationModalComponent } from '../shared/modal/confirmation-modal.component'
import { ConfirmationActions } from '../shared/modal/confirmation_actions'
import { MembersListModalComponent } from '../shared/modal/members/members-list-modal.component'
import { ProjectCsvTemplatedEmailModalComponent } from '../shared/modal/email/project-csv-templated-email-modal/project-csv-templated-email-modal.component'
import { ProjectEmailModalComponent } from 'app/shared/modal/email/project-email-modal/project-email-modal.component'
import { NotificationModalComponent } from '../shared/modal/notification-modal'
import { TerminateProjectModalComponent } from './modals/terminate-project-modal/terminate-project-modal.component'
import { DeclineProjectTerminationModalComponent } from './modals/decline-project-termination-modal/decline-project-termination-modal.component'
import { ApplicationListModalComponent } from 'app/shared/modal/application-list/application-list.modal.component'
import {
	TextColorDirective,
	TextBgColorDirective,
	BadgeComponent,
	InputGroupComponent,
	ButtonDirective
} from '@coreui/angular'
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule } from '@angular/forms'
import { NgIf, NgFor, NgClass } from '@angular/common'
import { ApplicationBadgesComponent } from '../shared/shared_modules/components/applications/application-badges/application-badges.component'
import { DatePickerComponent } from '../shared/datepicking/datepicker.component'
import { HasstatusinlistPipe } from '../pipe-module/pipes/hasstatusinlist.pipe'
import { IsFutureTimePipe } from '../pipe-module/pipes/futureTime.pipe'
import { HasStatusNotInListPipe } from '../pipe-module/pipes/has-status-not-in-list.pipe'
import { ApplicationPage } from 'app/shared/models/application.page'
import { ApplicationFilter } from 'app/shared/classes/application-filter'
import { BasePaginationComponent } from '../shared/shared_modules/components/pagination/base-pagination.component'
import { ApplicationFilterInputComponent } from '../shared/shared_modules/components/applications/application-filter-input/application-filter-input.component'
import { ApplicationStatusBadgesComponent } from 'app/shared/shared_modules/components/applications/application-status-badges/application-status-badges.component'

/**
 * Vo Overview component.
 */
@Component({
	selector: 'app-vo-overview',
	templateUrl: 'voOverview.component.html',
	providers: [VoService, GroupService, FacilityService],
	imports: [
		TextColorDirective,
		TextBgColorDirective,
		BadgeComponent,
		FormsModule,
		NgIf,
		InputGroupComponent,
		ButtonDirective,
		NgbdSortableHeaderDirective,
		NgFor,
		ApplicationBadgesComponent,
		NgbHighlight,
		ModalModule,
		DatePickerComponent,
		NgClass,
		HasstatusinlistPipe,
		IsFutureTimePipe,
		HasStatusNotInListPipe,
		BasePaginationComponent,
		ApplicationFilterInputComponent,
		ApplicationStatusBadgesComponent,
		ProjectCsvTemplatedEmailModalComponent,
		ProjectEmailModalComponent,
	]
})
export class VoOverviewComponent extends AbstractBaseClass implements OnInit, OnDestroy {
	title: string = 'VO Overview'
	public emailSubject: string
	public emailReply: string = ''
	public emailText: string
	public emailStatus: number = 0

	public emailHeader: string
	public emailVerify: string
	public emailType: number
	public emailAdminsOnly: boolean = false
	public expiredTemplated: boolean = false

	public removalDate: Date = new Date()
	public selectedProject: Application
	selectedEmailProjects: Application[] = []
	computecenters: ComputecenterComponent[] = []
	bsModalRef: BsModalRef
	subscription: Subscription = new Subscription()
	protected readonly ConfirmationActions = ConfirmationActions
	userElixirSearchPI: boolean = true
	userElixirSearchAdmin: boolean = true
	userElixirSearchMember: boolean = true
	projectsLoaded: boolean = false

	validElixirIdFilter: boolean = false
	tsvTaskRunning: boolean = false
	numberOfTsvs: number = 0
	checkTSVTimer: ReturnType<typeof setTimeout>
	checkTSVTimeout: number = 10000

	selectedProjectType: string = 'ALL'
	selectedFacility: string | number = 'ALL'
	userElixirIdFilter: string
	textFilterSubject = new Subject<string>()

	public newsletterSubscriptionCounter: number
	member_id: number

	// modal variables for User list
	public usersModalProjectMembers: ProjectMember[] = []
	public usersModalProjectID: number
	public usersModalProjectName: string
	public managerFacilities: [string, number][]
	applicationPage: ApplicationPage = new ApplicationPage()
	applicationFilter: ApplicationFilter = new ApplicationFilter()
	projectMailTemplates: string[] = []
	@ViewChildren(NgbdSortableHeaderDirective) headers: QueryList<NgbdSortableHeaderDirective>

	applictions$: Observable<Application[]>
	total$: Observable<number>

	// public selectedFacility: [string, number];

	constructor(
		private fullLayout: FullLayoutComponent,
		private voService: VoService,
		private facilityService: FacilityService,
		private modalService: BsModalService,
		private notificationModal: NotificationModalComponent,
		private terminateProjectModalComponent: TerminateProjectModalComponent,
		private declineProjectTerminationModalComponent: DeclineProjectTerminationModalComponent,
		private confirmationModalComponent: ConfirmationModalComponent
	) {
		super()
	}

	ngOnInit(): void {
		this.textFilterSubject.pipe(debounceTime(600), distinctUntilChanged()).subscribe(filter => {
			this.userElixirIdFilter = ''

			this.applicationFilter.textFilter = filter
			this.getVoProjects()
		})

		this.getVoProjects()
		this.getComputeCenters()
		this.voService.getNewsletterSubscriptionCounter().subscribe((result: IResponseTemplate): void => {
			this.newsletterSubscriptionCounter = result.value as number
		})
		this.getTSVInformation()
	}

	ngOnDestroy() {
		this.subscription.unsubscribe()
	}

	getTSVInformation(timeout: number = this.checkTSVTimeout): void {
		this.stopCheckTSVTimer()
		this.subscription.add(
			this.voService.getTsvInformation().subscribe(
				(result: any): void => {
					this.tsvTaskRunning = result[0]
					this.numberOfTsvs = result[1]
					if (result[0] !== true) {
						this.stopCheckTSVTimer()
					} else {
						this.checkTSVTimer = setTimeout((): void => {
							this.getTSVInformation()
						}, timeout)
					}
				},
				() => {
					this.tsvTaskRunning = true
					this.numberOfTsvs = 0
					this.checkTSVTimer = setTimeout((): void => {
						this.getTSVInformation()
					}, timeout)
				}
			)
		)
	}

	stopCheckTSVTimer(): void {
		if (this.checkTSVTimer) {
			clearTimeout(this.checkTSVTimer)
		}
	}

	selectAllFilteredProjects(): void {
		this.selectedEmailProjects = []

		this.applicationPage.results.forEach(application => {
			if (!application.hasTerminatedStatus()) {
				application.is_project_selected = true
				this.toggleSelectedEmailApplication(application)
			}
		})
	}

	showConfirmationModal(application: Application, action: ConfirmationActions): void {
		const event: EventEmitter<any> = this.confirmationModalComponent.showConfirmationModal(application, action)
		this.subscribeToBsModalRef(event)
	}

	showMembersModal(application: Application): void {
		const initialState = {
			projectId: application.project_application_perun_id,
			projectName: application.project_application_shortname
		}

		this.bsModalRef = this.modalService.show(MembersListModalComponent, { initialState, class: 'modal-lg' })
	}

	subscribeToBsModalRef(event: EventEmitter<ConfirmationActions>): void {
		this.subscription.add(
			event.subscribe((result: any) => {
				let action = null
				if ('action' in result) {
					action = result['action']
				}

				if (ConfirmationActions.ENABLE_APPLICATION === action) {
					this.enableProject(result['application'])
				}
				if (ConfirmationActions.DISABLE_APPLICATION === action) {
					this.disableProject(result['application'])
				}
			})
		)
	}

	unselectAll(): void {
		this.applicationPage.results.forEach((pr: Application) => {
			pr.is_project_selected = false
			this.toggleSelectedEmailApplication(pr)
		})
		this.selectedEmailProjects = []
		//		this.selectedEmailProjects = []; // clear the selectedEmailProjects list
	}

	unselectAllFilteredProjects(): void {
		// get all the applications
		// set the selected state of all projects to false
		this.applicationPage.results.forEach(application => {
			application.is_project_selected = false
			this.toggleSelectedEmailApplication(application)
		})
	}

	toggleSelectedEmailApplication(application: Application): void {
		const index = this.selectedEmailProjects.indexOf(application)

		if (application.is_project_selected) {
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

	openProjectMailsModal(): void {
		let initialState = { selectedProjects: this.selectedEmailProjects }
		this.bsModalRef = this.modalService.show(ProjectEmailModalComponent, { initialState, class: 'modal-lg' })
	}

	openProjectCSVMailModal(): void {
		this.bsModalRef = this.modalService.show(ProjectCsvTemplatedEmailModalComponent, { class: 'modal-lg' })
	}

	disableProject(project: Application): void {
		this.voService.setDisabledProject(project.project_application_perun_id).subscribe((upd_app: Application) => {
			const idx = this.applicationPage.results.indexOf(project)
			this.applicationPage.results[idx] = upd_app
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

			this.voService
				.getGroupsByMemberElixirId(
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

	enableProject(project: Application): void {
		this.voService.unsetDisabledProject(project.project_application_perun_id).subscribe((upd_app: Application) => {
			const idx = this.applicationPage.results.indexOf(project)
			this.applicationPage.results[idx] = upd_app
		})
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
		this.getVoProjects()
	}

	getApplicationInfos(): void {
		this.voService.getVoProjectResourcesTimeframes().subscribe()

		this.voService.getVoProjectCounter().subscribe()
		this.voService.getVoProjectDates().subscribe()
	}

	sendEmail(subject: string, message: string, reply?: string): void {
		if (reply) {
			reply = reply.trim()
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
					reply
				)
				break
			}
			case 1: {
				this.sendNewsletterToVo(subject, message, this.selectedProjectType, this.emailAdminsOnly, reply)
				break
			}
			default:
		}
	}

	sendTestBug(): void {
		this.voService.sendTestError().subscribe()
	}

	sendNewsletterToVo(
		subject: string,
		message: string,
		selectedProjectType: string,
		adminsOnly: boolean,
		reply?: string
	): void {
		this.voService
			.sendNewsletterToVo(
				encodeURIComponent(subject),
				encodeURIComponent(message),
				selectedProjectType,
				adminsOnly,
				encodeURIComponent(reply)
			)
			.subscribe((result: IResponseTemplate): void => {
				if ((result.value as boolean) === true) {
					this.emailStatus = 1
				} else {
					this.emailStatus = 2
				}
			})
	}

	sendMailToVo(
		subject: string,
		message: string,
		facility: string,
		type: string,
		adminsOnly: boolean,
		expiredTemplate: boolean,
		removalDate: Date,
		reply?: string
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
				encodeURIComponent(reply)
			)
			.subscribe((result: IResponseTemplate): void => {
				if ((result.value as boolean) === true) {
					this.emailStatus = 1
				} else {
					this.emailStatus = 2
				}
				this.selectedProjectType = 'ALL'
				this.selectedFacility = 'ALL'
			})
	}

	dayChanged(date: { year: number; month: number; day: number }): void {
		this.removalDate.setDate(date.day)
		this.removalDate.setMonth(date.month - 1)
		this.removalDate.setFullYear(date.year)
	}

	setEmailType(type: number): void {
		this.emailType = type
		switch (this.emailType) {
			case 0: {
				this.emailHeader = 'Send email to selected members of the VO'
				break
			}
			case 1: {
				this.emailHeader = 'Send newsletter to VO'
				break
			}
			default:
		}
		this.emailVerify = 'Are you sure you want to send this newsletter to all members of the de.NBI VO?'
	}

	getFacilityName(): string {
		if (this.selectedFacility === 'ALL') {
			return 'of the de.NBI VO'
		} else {
			const temp_cc = this.computecenters.find(cc => cc.FacilityId === this.selectedFacility)
			if (temp_cc === undefined) {
				return 'of the de.NBI VO'
			} else {
				return `of the facility "${temp_cc.Name}"`
			}
		}
	}

	getMailConfinementByProjectType(): string {
		switch (this.selectedProjectType) {
			case 'ALL_GM':
				return 'of all active projects'
			case 'EXP':
				return 'of all expired projects'
			case 'SVP':
				return 'of all SimpleVM projects'
			case 'OVP':
				return 'of all OpenStack projects'
			case 'WSH':
				return 'of all Workshops'
			default:
				return ''
		}
	}

	adjustVerifyText(): void {
		switch (this.emailType) {
			case 0: {
				this.emailVerify = `Are you sure you want to send this email to all ${
					this.emailAdminsOnly ? ' group administrators' : 'members'
				} ${this.getMailConfinementByProjectType()} ${this.getFacilityName()} ?`
				break
			}
			case 1: {
				this.emailVerify = `Are you sure you want to send this newsletter to all members ${this.getMailConfinementByProjectType()} ${this.getFacilityName()} ?`
				break
			}
			default:
				this.emailVerify = 'Are you sure you want to send this?'
		}
		if (this.selectedProjectType !== 'EXP') {
			this.expiredTemplated = false
		}
	}

	getVoProjects(): void {
		this.projectsLoaded = false
		this.userElixirIdFilter = ''
		this.voService
			.getAllGroupsWithDetails(this.applicationFilter, this.applicationPage)
			.subscribe((applicationPage: ApplicationPage): void => {
				for (const application of applicationPage.results) {
					if (application.project_application_lifetime > 0) {
						application.lifetime_reached = this.lifeTimeReached(application.lifetime_days, application.DaysRunning)
					}
				}

				this.projectsLoaded = true
			})
	}

	getRunningApplicationsThatNeedIntroduction(): void {
		this.voService
			.getAllProjectsThatStillDemandAnIntroductionCourse()
			.subscribe((applications: Application[]): void => {
				const initialState = {
					applications: applications
				}
				console.log(initialState)
				this.bsModalRef = this.modalService.show(ApplicationListModalComponent, { initialState, class: 'modal-xl' })
			})
	}

	resetEmailModal(): void {
		this.emailHeader = null
		this.emailSubject = null
		this.emailText = null
		this.emailType = null
		this.emailVerify = null
		this.emailReply = ''
		this.emailStatus = 0
		this.emailAdminsOnly = false
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
					cc['compute_center_support_mail']
				)
				this.computecenters.push(compute_center)
			}
		})
	}

	/**
	 * Bugfix not scrollable site after closing modal
	 */
	removeModalOpen(): void {
		document.body.classList.remove('modal-open')
	}

	removeProjectFromList(application: Application): void {
		const indexAll = this.applicationPage.results.findIndex(
			app => app.project_application_id === application.project_application_id
		)

		if (indexAll !== -1) {
			this.applicationPage.results.splice(indexAll, 1)
		}
	}

	updateProjectByIdx(application: Application): void {
		const indexAll = this.applicationPage.results.findIndex(
			app => app.project_application_id === application.project_application_id
		)

		if (indexAll !== -1) {
			this.getProjectStatus(this.applicationPage.results[indexAll])
		}
	}

	showDescriptionModal(application: Application): void {
		this.notificationModal.showInfoNotificationModal('Description', application.project_application_description)
	}

	showTerminationDeclineModal(application: Application): void {
		this.declineProjectTerminationModalComponent.showTerminationProjectModal(application).subscribe(() => {
			this.updateProjectByIdx(application)
		})
	}

	showTerminationModal(application: Application): void {
		this.terminateProjectModalComponent.showTerminationProjectModal(application).subscribe(() => {
			this.removeProjectFromList(application)
		})
	}

	getProjectStatus(project: Application): void {
		this.voService.getProjectStatus(project.project_application_perun_id).subscribe((res: any): void => {
			project.project_application_statuses = res['status']
		})
	}

	suspendProject(project: Application): void {
		this.voService.removeResourceFromGroup(project.project_application_perun_id).subscribe(
			(): void => {
				this.notificationModal.showSuccessFullNotificationModal('Success', 'The project got suspended successfully')
				this.getProjectStatus(project)
				project.project_application_compute_center = null
			},
			(): void => {
				this.notificationModal.showDangerNotificationModal('Failed', 'The status change was not successful.')
			}
		)
	}

	resumeProject(project: Application): void {
		this.voService.resumeProject(project.project_application_perun_id).subscribe(
			(): void => {
				this.notificationModal.showSuccessFullNotificationModal('Success', 'The project got resumed successfully')
				this.getProjectStatus(project)
			},
			(): void => {
				this.notificationModal.showDangerNotificationModal('Failed', 'The status change was not successful.')
			}
		)
	}

	setProtected(project: Application, set: boolean): void {
		this.voService.setProtected(project.project_application_perun_id, set).subscribe(
			(result: any): void => {
				this.notificationModal.showSuccessFullNotificationModal(
					'Success',
					result['result'] === 'set'
						? 'The project was successfully set as protected.'
						: 'The status "Protected" was removed successfully'
				)
				const indexAll: number = this.applicationPage.results.indexOf(project, 0)
				this.getProjectStatus(this.applicationPage.results[indexAll])
			},
			(error: any): void => {
				if (error['status'] === 500) {
					this.notificationModal.showDangerNotificationModal('Failed', 'The status change was not successful.')
				}
			}
		)
	}

	getMembersOfTheProject(projectid: number, projectname: string): void {
		this.voService.getVoGroupRichMembers(projectid).subscribe((members: ProjectMember[]): void => {
			this.usersModalProjectID = projectid
			this.usersModalProjectName = projectname
			this.usersModalProjectMembers = members
		})
	}

	initiateTsvExport(): void {
		this.tsvTaskRunning = true
		this.voService.getAllProjectsForTsvExport().subscribe((): void => {
			this.getTSVInformation()
		})
	}

	downloadCurrentTSV(): void {
		this.voService.downloadProjectsTsv().subscribe(
			(result): void => {
				const blobn = new Blob([result], {
					type: 'text/tsv'
				})

				const dateTime = new Date()
				FileSaver.saveAs(blobn, `projects-${dateTime.getDate()}-${dateTime.getMonth()}-${dateTime.getFullYear()}.tsv`)
			},
			(err: any) => {
				console.log(`No such file found! - ${err.toString()}`)
			}
		)
	}
}
