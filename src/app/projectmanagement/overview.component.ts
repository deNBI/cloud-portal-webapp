import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, Inject } from '@angular/core'
import moment from 'moment'
import { forkJoin, Observable, Subscription } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { DOCUMENT, NgIf, NgClass, NgFor, NgStyle } from '@angular/common'
import { Chart } from 'chart.js'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'

import { environment } from '../../environments/environment'
import { ProjectMemberApplication } from './project_member_application'
import { Userinfo } from '../userinfo/userinfo.model'
import { UserService } from '../api-connector/user.service'
import { Application } from '../applications/application.model/application.model'
import { GroupService } from '../api-connector/group.service'
import { ApplicationBaseClassComponent } from '../shared/shared_modules/baseClass/application-base-class.component'
import { FacilityService } from '../api-connector/facility.service'
import { ApplicationsService } from '../api-connector/applications.service'
import { FullLayoutComponent } from '../layouts/full-layout.component'
import { Flavor } from '../virtualmachines/virtualmachinemodels/flavor'
import { FlavorType } from '../virtualmachines/virtualmachinemodels/flavorType'
import { FlavorService } from '../api-connector/flavor.service'
import { CreditsService } from '../api-connector/credits.service'
import { is_vo } from '../shared/globalvar'
import {
	CLOUD_PORTAL_SUPPORT_MAIL,
	CREDITS_WIKI,
	NEW_SVM_PORTAL_LINK,
	OPENSTACK_LINK,
	PUBLIC_DOI_ENDPOINT,
	PUBLICATIONS_LINK,
	SIMPLE_VM_LINK,
	STATUS_LINK,
	WIKI_PUBLICATIONS,
	KUBERNETES_LINK,
	TERMINATION_SURVEY_LINK
} from '../../links/links'
import { Doi } from '../applications/doi/doi'
import { Application_States, ExtensionRequestType } from '../shared/shared_modules/baseClass/abstract-base-class'
import { ProjectMember } from './project_member.model'
import { ModificationRequestComponent } from './modals/modification-request/modification-request.component'
import { ApplicationModification } from 'app/applications/application_modification.model'
import { LifetimeRequestComponent } from './modals/lifetime-request/lifetime-request.component'
import { CreditsRequestComponent } from './modals/credits-request/credits-request.component'
import { ExtensionEntryComponent } from './modals/testimonial/extension-entry.component'
import { WITHDRAWAL_TYPES, WithdrawModalComponent } from './modals/withdraw/withdraw-modal.component'
import { ApplicationRequestType } from '../shared/enums/application-request-type'
import { TerminationRequestComponent } from './modals/termination-request/termination-request.component'
import { ViewPublicKeyComponent } from '../shared/modal/view-public-key/view-public-key.component'
import { LeaveProjectComponent } from './modals/leave-project/leave-project.component'
import { NotificationModalComponent } from '../shared/modal/notification-modal'
import { DeleteApplicationModal } from './modals/delete-member-application-modal/delete-application-modal.component'
import { AddUserModalComponent } from './modals/add-user-modal/add-user-modal.component'
import { UserApplicationsModalComponent } from './modals/user-applications-modal/user-applications-modal.component'
import { ConfirmationActions } from 'app/shared/modal/confirmation_actions'
import { ConfirmationModalComponent } from 'app/shared/modal/confirmation-modal.component'
import { ApplicationProgressComponent } from './application-progress/application-progress.component'
import { ApplicationDetailComponent } from '../applications/application-detail/application-detail.component'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'
import { FormsModule } from '@angular/forms'
import { TextColorDirective, TextBgColorDirective, BadgeComponent } from '@coreui/angular'
import { TestimonialFormComponent } from '../shared/shared_modules/testimonial-forms/testimonial-form.component'
import { HasstatusinlistPipe } from '../pipe-module/pipes/hasstatusinlist.pipe'
import { IsMigratedProjectPipe } from '../pipe-module/pipes/isMigratedProject'

/**
 * Projectoverview component.
 */
@Component({
	selector: 'app-project-overview',
	templateUrl: 'overview.component.html',
	imports: [
		NgIf,
		ApplicationProgressComponent,
		NgClass,
		NgFor,
		ApplicationDetailComponent,
		NgStyle,
		BsDropdownModule,
		FormsModule,
		TextColorDirective,
		TextBgColorDirective,
		BadgeComponent,
		TestimonialFormComponent,
		HasstatusinlistPipe,
		IsMigratedProjectPipe
	]
})
export class OverviewComponent extends ApplicationBaseClassComponent implements OnInit, OnDestroy {
	bsModalRef: BsModalRef
	protected readonly ConfirmationActions = ConfirmationActions

	modificationRequestDisabled: boolean = false
	lifetimeExtensionDisabled: boolean = false
	creditsExtensionDisabled: boolean = false
	vo_name: string = environment.voName
	WIKI_PUBLICATIONS: string = WIKI_PUBLICATIONS
	CREDITS_WIKI: string = CREDITS_WIKI
	CLOUD_PORTAL_SUPPORT_MAIL: string = CLOUD_PORTAL_SUPPORT_MAIL
	PUBLICATIONS_LINK: string = PUBLICATIONS_LINK
	PUBLIC_DOI_ENDPOINT: string = PUBLIC_DOI_ENDPOINT
	SIMPLE_VM_LINK: string = SIMPLE_VM_LINK
	OPENSTACK_LINK: string = OPENSTACK_LINK
	KUBERNETES_LINK: string = KUBERNETES_LINK
	STATUS_LINK: string = STATUS_LINK
	NEW_SVM_PORTAL_LINK: string = NEW_SVM_PORTAL_LINK
	@ViewChild('creditsChart') creditsCanvas: ElementRef
	project_id: string
	application_id: string
	credits: number = 0
	errorMessage: string
	showInformationCollapse: boolean = false
	newDoi: string
	doiError: string
	remove_members_clicked: boolean
	dois: Doi[]
	disabledDoiInput: boolean = false

	project_application: Application

	loaded: boolean = true
	userinfo: Userinfo
	allSet: boolean = false
	supportMails: string[] = []
	toggleLocked: boolean = false
	resourceDataLoaded: boolean = false
	creditHistoryLoaded: boolean = false
	project_members_loaded: boolean = false
	vmsInUse: number
	maximumVMs: number
	coresInUse: number
	ramInUse: number
	memberApplicationsLoaded: boolean = false
	title: string = 'Project Overview'

	simple_vm_logo: string = 'static/webapp/assets/img/simpleVM_Logo.svg'
	openstack_logo: string = 'static/webapp/assets/img/openstack_plain_red.svg'
	kubernetes_logo: string = 'static/webapp/assets/img/kubernetes_logo.svg'
	checked_member_list: ProjectMember[] = []
	// modal variables for User list
	public project_members: ProjectMember[] = []
	public isLoaded: boolean = false
	creditsChart: any
	ExtensionRequestType: typeof ExtensionRequestType = ExtensionRequestType
	Application_States: typeof Application_States = Application_States
	private subscription: Subscription = new Subscription()
	private updateCreditsUsedIntervals: ReturnType<typeof setTimeout>
	private updateCreditsHistoryIntervals: ReturnType<typeof setTimeout>

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
		private terminationRequestComponent: TerminationRequestComponent,
		private viewPublicKeyComponent: ViewPublicKeyComponent,
		private leaveProjectComponent: LeaveProjectComponent,
		private deleteApplicationModal: DeleteApplicationModal,
		private addUserModalComponent: AddUserModalComponent,
		private userApplicationsModalComponent: UserApplicationsModalComponent,
		notificationModal: NotificationModalComponent,
		@Inject(DOCUMENT) private document: Document,
		cdrRef: ChangeDetectorRef
	) {
		super(userService, applicationsService, facilityService, notificationModal, cdrRef)
	}

	calculateProgressBar(numberToRoundUp: number): string {
		return Math.ceil(numberToRoundUp * 100).toString()
	}

	async delay(ms: number): Promise<any> {
		// tslint:disable-next-line:typedef
		return new Promise((resolve: any) => {
			setTimeout(resolve, ms)
		})
	}

	ngOnInit(): void {
		this.activatedRoute.params.subscribe((paramsId: any): void => {
			try {
				if (this.updateCreditsUsedIntervals) {
					clearInterval(this.updateCreditsUsedIntervals)
				}
				if (this.updateCreditsHistoryIntervals) {
					clearInterval(this.updateCreditsHistoryIntervals)
					this.creditHistoryLoaded = false
					this.creditsChart = undefined
				}
			} catch (error: any) {
				console.log(error)
			}

			this.subscription.unsubscribe()
			this.subscription = new Subscription()
			this.modificationRequestDisabled = false
			this.lifetimeExtensionDisabled = false
			this.creditsExtensionDisabled = false
			this.disabledDoiInput = false
			this.resourceDataLoaded = false
			this.creditHistoryLoaded = false
			this.errorMessage = null
			this.isLoaded = false
			this.project_members_loaded = false
			this.errorMessage = null
			this.isLoaded = false
			this.project_application = null
			this.project_members = []
			this.application_id = paramsId.id
			this.is_vo_admin = is_vo

			this.getApplication()
			this.getUserinfo()
			this.getListOfFlavors()
			this.getListOfTypes()
		})
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe()
		try {
			if (this.updateCreditsUsedIntervals) {
				clearInterval(this.updateCreditsUsedIntervals)
			}
			if (this.updateCreditsHistoryIntervals) {
				clearInterval(this.updateCreditsHistoryIntervals)
			}
		} catch (error: any) {
			console.log(error)
		}
	}

	getApplication(): void {
		this.subscription.add(
			this.applicationsService.getFullApplicationByUserPermissions(this.application_id).subscribe(
				(aj: Application): void => {
					if (aj.project_application_name === '') {
						this.isLoaded = false
						this.errorMessage = 'Not found'

						return
					}
					this.modificationRequestDisabled = false
					this.lifetimeExtensionDisabled = false

					this.project_application = aj

					this.setSupportMails(this.project_application)

					if (this.project_application.project_application_perun_id) {
						this.getUsedResources()
						if (
							this.project_application.user_is_admin ||
							this.project_application.show_member_names ||
							this.is_vo_admin
						) {
							this.getMembersOfTheProject()
						}
						if (this.project_application.credits_allowed && !this.project_application.credits_loop_started) {
							this.project_application.setCreditsLoopStarted()
							this.startUpdateCreditUsageLoop()
						}
					}
					this.getDois()
					this.getUserProjectApplications()

					this.isLoaded = true

					this.activatedRoute.fragment.subscribe(fragment => {
						if (fragment !== null) {
							this.scrollTo(fragment)
						}
					})
				},
				(error: any): void => {
					this.isLoaded = false
					if (error.status === 403) {
						this.errorMessage = 'You are not allowed to view the requested project.'
					} else {
						const errorobj: any = error.error
						this.errorMessage = errorobj['error']
					}
				}
			)
		)
	}

	scrollTo(element: any): void {
		setTimeout(() => {
			document.getElementById(element).scrollIntoView({
				behavior: 'smooth',
				block: 'start',
				inline: 'nearest'
			})
		}, 1500)
	}

	getUserinfo(): void {
		this.subscription.add(
			this.userService.getUserInfo().subscribe((userinfo: Userinfo): void => {
				this.userinfo = userinfo
			})
		)
	}

	/**
	 * gets a list of all available Flavors from the flavorservice and puts them into the array flavorList
	 */
	getListOfFlavors(): void {
		this.subscription.add(
			this.flavorService.getListOfFlavorsAvailable().subscribe((flavors: Flavor[]): void => {
				this.flavorList = flavors
			})
		)
	}

	/**
	 * gets a list of all available types of flavors from the flavorservice and uses them in the function setListOfTypes
	 */
	getListOfTypes(): void {
		this.subscription.add(
			this.flavorService.getListOfTypesAvailable().subscribe((types: FlavorType[]): void => this.setListOfTypes(types))
		)
	}

	getDois(): void {
		this.subscription.add(
			this.groupService.getGroupDois(this.application_id).subscribe((dois: Doi[]): void => {
				this.dois = dois
			})
		)
	}

	showResourceModal(tempModification: ApplicationModification): void {
		if (this.modificationRequestDisabled) {
			return
		}

		this.modificationRequestDisabled = true

		const initialState = {
			project: this.project_application,
			preSavedModification: tempModification
		}
		this.bsModalRef = this.modalService.show(ModificationRequestComponent, { initialState })
		this.bsModalRef.setClass('modal-xl')
		this.subscribeForExtensionResult(this.ExtensionRequestType.MODIFICATION)
	}

	showWithDrawExtensionModal(): void {
		this.showWithdrawModal(this.project_application.lifetime_extension_request_id, WITHDRAWAL_TYPES.EXTENSION)
	}

	showWithDrawModificationModal(): void {
		this.showWithdrawModal(this.project_application.modification_extension_request_id, WITHDRAWAL_TYPES.MODIFICATION)
	}

	showWithdrawModal(target_id: string | number, type: WITHDRAWAL_TYPES): void {
		const initialState = {
			target_id,
			type
		}
		this.bsModalRef = this.modalService.show(WithdrawModalComponent, { initialState, class: 'modal-lg' })
		this.subscription.add(
			this.bsModalRef.content.event.subscribe((event: boolean): void => {
				if (event) {
					this.getApplication()
				}
			})
		)
	}

	showApplicationRequestModal(type: ApplicationRequestType): void {
		const initialState = {
			dois: this.dois,
			application_id: this.application_id,
			[`is${type}`]: true
		}

		this.bsModalRef = this.modalService.show(ExtensionEntryComponent, { initialState, class: 'modal-xl' })

		this.subscription.add(
			this.bsModalRef.content.event.subscribe((event: any): void => {
				if (event.reloadDoi) {
					this.getDois()
				} else if (event.showModification) {
					this.showResourceModal(null)
				} else if (event.showExtension) {
					this.showLifetimeExtensionModal()
				} else if (event.showTermination) {
					this.showTerminationModal()
				}
			})
		)
	}

	showUserApplicationModal(): void {
		this.userApplicationsModalComponent.showAddUserApplicationModal(this.project_application).subscribe(() => {
			this.getMembersOfTheProject()
		})
	}

	showAddMemberModal(): void {
		const invitationLink: string = this.getAddUserInvitationLink()
		this.addUserModalComponent.showAddUserModalComponent(this.project_application, invitationLink)
	}

	showDeleteApplicationModal(): void {
		this.deleteApplicationModal.showDeleteApplicationModal(this.project_application)
	}

	showLeaveTerminationModal(): void {
		this.leaveProjectComponent.showLeaveProjectModal(this.project_application, this.userinfo).subscribe()
	}

	showTerminationModal(): void {
		this.terminationRequestComponent.showTerminationRequestModal(this.project_application).subscribe(() => {
			this.getApplication()
			this.notificationModal.showWarningNotificationModal(
				'Feedback Survey',
				`
					<div>
					<p>Thank you for using the de.NBI Cloud for your recent project!</p>
					<p>We would appreciate your feedback to enhance our services. Please take a few moments to complete our short survey:</p>
					<p><strong><a class="alert-link" href="${TERMINATION_SURVEY_LINK}" target="_blank">Survey Link</a></strong></p>
					</div>
				`
			)
		})
	}

	showLifetimeExtensionModal(): void {
		if (this.lifetimeExtensionDisabled) {
			return
		}

		this.lifetimeExtensionDisabled = true

		const initialState = {
			project: this.project_application,
			life_time_string: `${this.project_application.project_application_date_approved} - ${this.project_application.date_end}`
		}
		this.bsModalRef = this.modalService.show(LifetimeRequestComponent, { initialState })
		this.bsModalRef.setClass('modal-lg')
		this.subscribeForExtensionResult(this.ExtensionRequestType.EXTENSION)
	}

	showCreditsExtensionModal(): void {
		if (this.creditsExtensionDisabled) {
			return
		}

		this.creditsExtensionDisabled = true

		const initialState = {
			project: this.project_application,
			flavorList: this.flavorList
		}
		this.bsModalRef = this.modalService.show(CreditsRequestComponent, { initialState })
		this.bsModalRef.setClass('modal-lg')
		this.subscribeForExtensionResult(this.ExtensionRequestType.CREDIT)
	}

	subscribeForExtensionResult(type: ExtensionRequestType): void {
		this.subscription.add(
			this.bsModalRef.content.event.subscribe((result: any) => {
				if ('reload' in result && result['reload']) {
					if (type === this.ExtensionRequestType.EXTENSION) {
						this.lifetimeExtensionDisabled = true
					} else if (type === this.ExtensionRequestType.MODIFICATION) {
						this.modificationRequestDisabled = true
					} else if (type === this.ExtensionRequestType.CREDIT) {
						this.creditsExtensionDisabled = true
					}
					this.fullLayout.getGroupsEnumeration()
					this.getApplication()
				} else if ('backToInput' in result && 'modification' in result) {
					this.modificationRequestDisabled = false
					this.showResourceModal(result['modification'])
				} else if (type === this.ExtensionRequestType.EXTENSION) {
					this.lifetimeExtensionDisabled = false
				} else if (type === this.ExtensionRequestType.MODIFICATION) {
					this.modificationRequestDisabled = false
				} else if (type === this.ExtensionRequestType.CREDIT) {
					this.creditsExtensionDisabled = false
				}
			})
		)
	}

	fetchCreditHistoryOfProject(): void {
		this.creditHistoryLoaded = false
		if (this.project_application !== null && this.project_application.credits_allowed) {
			this.subscription.add(
				this.creditsService
					.getCreditsUsageHistoryOfProject(Number(this.project_application.project_application_perun_id.toString()))
					.subscribe((response: any): void => {
						if (response['data_points'] !== undefined) {
							const data_points: number[] = response['data_points']
							if (this.creditsChart !== undefined) {
								this.creditsChart.data.labels = response['time_points']
								this.creditsChart.data.datasets[0].data = data_points
								this.creditsChart.update()
							} else {
								this.creditsChart = new Chart(this.creditsCanvas.nativeElement, {
									type: 'line',
									data: {
										labels: response['time_points'],
										datasets: [
											{
												label: 'Credit Usage',
												data: data_points,
												borderColor: 'rgba(54, 162, 235, 1)',
												backgroundColor: 'rgba(54, 162, 235, 0.2)'
											}
										]
									},
									options: {
										animation: {
											duration: 0
										},
										layout: {
											padding: {
												left: 25,
												right: 25,
												top: 25,
												bottom: 50
											}
										},
										responsive: true
									}
								})
							}
						}
						if (!this.creditHistoryLoaded) {
							this.creditHistoryLoaded = true
						}
					})
			)
		}
	}

	startUpdateCreditUsageLoop(): void {
		if (
			!this.project_application.credits_allowed ||
			!this.project_application ||
			!this.project_application.project_application_perun_id
		) {
			return
		}
		this.getCurrentCreditsOfProject()
		this.fetchCreditHistoryOfProject()

		this.updateCreditsUsedIntervals = setInterval((): any => this.getCurrentCreditsOfProject(), 10000)

		this.updateCreditsHistoryIntervals = setInterval((): any => this.fetchCreditHistoryOfProject(), 30000)
	}

	getCurrentCreditsOfProject(): void {
		if (
			this.project_application &&
			this.project_application.project_application_perun_id &&
			this.project_application.credits_allowed
		) {
			this.subscription.add(
				this.creditsService
					.getCurrentCreditsOfProject(this.project_application.project_application_perun_id.toString())
					.subscribe(
						(credits: number): void => {
							if (this.project_application !== null) {
								this.project_application.project_application_current_credits = credits
							}
						},
						(err: any): void => {
							console.log(err.message)
						}
					)
			)
		}
	}

	/**
	 * If the application is an openstack application, the requested/approved resources will be set for maximum VMs.
	 * For SimpleVM also the VMs in use are set.
	 */
	getUsedResources(): void {
		this.resourceDataLoaded = false

		if (!this.project_application?.project_application_openstack_project) {
			this.subscription.add(
				this.groupService
					.getGroupResources(this.project_application.project_application_perun_id.toString())
					.subscribe((res: any): void => {
						this.vmsInUse = res['used_vms']
						this.maximumVMs = res['number_vms']
						this.coresInUse = res['cores_used']
						this.ramInUse = res['ram_used']
						this.resourceDataLoaded = true
					})
			)
		} else {
			this.maximumVMs = this.calculateNumberOfVMs(this.project_application?.flavors)
			this.resourceDataLoaded = true
		}
	}

	/**
	 * Calculates the number of approved VMs for OpenStack Projects
	 *
	 * @param flavors the list of flavors requested in the project
	 */
	calculateNumberOfVMs(flavors: Flavor[]): number {
		let numberOfVMs: number = 0
		flavors.forEach((flavor: any): void => {
			numberOfVMs += flavor['counter']
		})

		return numberOfVMs
	}

	isNewDoi(): boolean {
		for (const doi of this.dois) {
			if (doi.identifier === this.newDoi) {
				return false
			}
		}

		return true
	}

	deleteDoi(doi: Doi): void {
		this.subscription.add(
			this.groupService.deleteGroupDoi(doi.id).subscribe((dois: Doi[]): void => {
				this.dois = dois
			})
		)
	}

	toggleDoiDisabledInput(): void {
		this.disabledDoiInput = !this.disabledDoiInput
	}

	toggleMemberNameVisibility(): void {
		this.toggleLocked = true
		this.groupService.toggleVisibility(this.project_application.project_application_perun_id).subscribe(
			(res: any): void => {
				this.project_application.show_member_names = res['show_member_names']
				this.toggleLocked = false
			},
			() => {
				this.toggleLocked = false
			}
		)
	}

	switchToggleLocked(check: boolean): void {
		this.toggleLocked = check
	}

	addDoi(): void {
		this.toggleDoiDisabledInput()
		if (this.isNewDoi()) {
			this.subscription.add(
				this.groupService.addGroupDoi(this.application_id, this.newDoi).subscribe(
					(dois: Doi[]): void => {
						this.doiError = null
						this.newDoi = null
						this.dois = dois
					},
					(): void => {
						this.doiError = `DOI ${this.newDoi} was already added by another Project!`
						this.toggleDoiDisabledInput()
					},
					(): void => {
						this.toggleDoiDisabledInput()
						this.newDoi = null
					}
				)
			)
		} else {
			this.doiError = `DOI ${this.newDoi} was already added by this Project!`
			this.newDoi = null
			this.toggleDoiDisabledInput()
		}
	}

	/**
	 * Get all user applications for a project.
	 */
	getUserProjectApplications(): void {
		if (this.project_application.isApproved() && this.project_application.project_application_perun_id) {
			this.memberApplicationsLoaded = false
			this.subscription.add(
				this.groupService
					.getGroupApplications(this.project_application.project_application_perun_id)
					.subscribe((applications: any): void => {
						const newProjectApplications: ProjectMemberApplication[] = []
						if (applications.length === 0) {
							this.project_application.project_application_member_applications = []

							this.memberApplicationsLoaded = true
						}
						for (const application of applications) {
							const dateApplicationCreated: moment.Moment = moment(application['createdAt'], 'YYYY-MM-DD HH:mm:ss.SSS')
							const membername: string = application['displayName']

							const newMemberApplication: ProjectMemberApplication = new ProjectMemberApplication(
								application['id'],
								membername,
								`${dateApplicationCreated.date()}.${
									dateApplicationCreated.month() + 1
								}.${dateApplicationCreated.year()}`
							)
							newProjectApplications.push(newMemberApplication)
							this.project_application.project_application_member_applications = newProjectApplications
							this.memberApplicationsLoaded = true
						}
					})
			)
		}
	}

	setSupportMails(project: Application): void {
		if (
			typeof project.project_application_compute_center?.Support !== 'undefined' &&
			project.project_application_compute_center?.Support
		) {
			this.supportMails = project.project_application_compute_center.Support.toString().split(',')
		} else {
			this.supportMails = []
		}
	}

	/**
	 * Get all members of a project.
	 */
	getMembersOfTheProject(): void {
		this.project_members_loaded = false
		this.subscription.add(
			this.groupService
				.getGroupMembers(this.project_application.project_application_perun_id.toString())
				.subscribe((members: ProjectMember[]): void => {
					this.project_members = members
					if (this.project_application.user_is_admin) {
						if (
							this.project_application &&
							this.project_application.credits_allowed &&
							!this.project_application.credits_loop_started
						) {
							this.project_application.setCreditsLoopStarted()
							this.startUpdateCreditUsageLoop()
						}
					}
					this.project_members_loaded = true
					this.isLoaded = true
				})
		)
	}

	setAllMembersChecked(): void {
		if (!this.allSet) {
			this.project_members.forEach((member: ProjectMember): void => {
				if (
					!this.isMemberChecked(member) &&
					this.userinfo.MemberId.toString() !== member.memberId.toString() &&
					!member.isPi
				) {
					this.checked_member_list.push(member)
				}
			})
			this.allSet = true
		} else {
			this.checked_member_list = []
			this.allSet = false
		}
	}
	isMemberChecked(member: ProjectMember): boolean {
		return this.checked_member_list.some(checked_member => checked_member.memberId === member.memberId)
	}
	indexOfMemberChecked(member_id): number {
		return this.checked_member_list.findIndex(member => member.memberId === member_id)
	}

	checkIfAllMembersChecked(): void {
		let all_set: boolean = true
		this.project_members.forEach((member: ProjectMember): void => {
			if (!this.isMemberChecked(member) && this.userinfo.MemberId !== member.memberId && !member.isPi) {
				all_set = false
			}
		})

		this.allSet = all_set
	}

	checkUnCheckMember(member: ProjectMember): void {
		const indexOf: number = this.indexOfMemberChecked(member.memberId)
		if (indexOf !== -1) {
			this.checked_member_list.splice(indexOf, 1)
			this.allSet = false
		} else {
			this.checked_member_list.push(member)
			this.checkIfAllMembersChecked()
		}
	}

	showConfirmationModalRemoveMembers(): void {
		const action = this.ConfirmationActions.REMOVE_MEMBERS
		const member_names_as_string = this.checked_member_list
			.map(member => `${member.firstName} ${member.lastName}`)
			.join('<br>')
		const initialState = {
			application: this.project_application,
			action,
			additional_msg: member_names_as_string
		}

		this.bsModalRef = this.modalService.show(ConfirmationModalComponent, { initialState, class: 'modal-lg' })
		this.subscribeToBsModalRef()
	}

	showConfirmationModalRemoveMember(member: ProjectMember): void {
		const action = this.ConfirmationActions.REMOVE_MEMBER
		const initialState = {
			application: this.project_application,
			action,
			additional_msg: `${member.firstName} ${member.lastName}`
		}

		this.bsModalRef = this.modalService.show(ConfirmationModalComponent, { initialState, class: 'modal-lg' })
		this.subscription.add(
			this.bsModalRef.content.event.subscribe((event: any) => {
				const eventAction: ConfirmationActions = event.action
				if (eventAction === ConfirmationActions.REMOVE_MEMBER) {
					this.removeMember(member)
				}
			})
		)
	}

	subscribeToBsModalRef(): void {
		this.subscription.add(
			this.bsModalRef.content.event.subscribe((event: any) => {
				const action: ConfirmationActions = event.action
				switch (action) {
					case ConfirmationActions.REMOVE_MEMBERS: {
						this.removeCheckedMembers()
						break
					}
					default:
						break
				}
			})
		)
	}

	removeCheckedMembers(): void {
		this.remove_members_clicked = true

		const members_in: ProjectMember[] = []

		const observables: Observable<number>[] = this.checked_member_list.map(
			(member: ProjectMember): Observable<any> =>
				this.groupService.removeMember(
					Number(this.project_application.project_application_perun_id),
					member.memberId,
					this.project_application.project_application_compute_center.FacilityId
				)
		)
		forkJoin(observables).subscribe((): void => {
			this.project_members.forEach((member: ProjectMember): void => {
				if (!this.isMemberChecked(member)) {
					members_in.push(member)
				}
			})
			this.project_members = members_in
			this.checked_member_list = []
			this.allSet = false
			this.remove_members_clicked = false
		})
		this.allSet = false
	}

	getAddUserInvitationLink(): string {
		return `https://signup.aai.lifescience-ri.eu/fed/registrar/?vo=${this.vo_name}&group=${this.project_application.project_application_shortname}`
	}

	copyToClipboard(text: string): void {
		document.addEventListener('copy', (clipEvent: ClipboardEvent): void => {
			clipEvent.clipboardData.setData('text/plain', text)
			clipEvent.preventDefault()
			document.removeEventListener('copy', null)
		})
		document.execCommand('copy')
	}

	public promoteAdmin(userid: number, username: string): void {
		this.groupService
			.addAdmin(
				this.project_application.project_application_perun_id,
				userid,
				this.project_application.project_application_compute_center.FacilityId
			)
			.toPromise()
			.then((result: any): void => {
				if (result.status === 200) {
					this.notificationModal.showSuccessFullNotificationModal('Success', `${username} promoted to Admin`)

					this.getMembersOfTheProject()
				} else {
					this.notificationModal.showDangerNotificationModal('Failed', `${username} could not be promoted to Admin!`)
				}
			})
			.catch((): void => {
				this.notificationModal.showDangerNotificationModal('Failed', `${username} could not be promoted to Admin!`)
			})
	}

	public removeAdmin(userid: number, name: string): void {
		if (this.userinfo.Id.toString() === userid.toString()) {
			return
		}

		this.groupService
			.removeAdmin(
				this.project_application.project_application_perun_id,
				userid,
				this.project_application.project_application_compute_center.FacilityId
			)
			.toPromise()
			.then((result: any): void => {
				if (result.status === 200) {
					this.notificationModal.showSuccessFullNotificationModal('Success', `${name} was removed as Admin`)

					this.getMembersOfTheProject()
				} else {
					this.notificationModal.showDangerNotificationModal('Failed', `${name} could not be removed as Admin!`)
				}
			})
			.catch((): void => {
				this.notificationModal.showDangerNotificationModal('Failed', `${name} could not be removed as Admin!`)
			})
	}

	/**
	 * Remove a member from a group.
	 *
	 * @param memberid of the member
	 */
	public removeMember(member: ProjectMember): void {
		if (this.userinfo.MemberId.toString() === member.memberId.toString()) {
			return
		}
		const indexOf: number = this.indexOfMemberChecked(member.memberId)
		if (indexOf !== -1) {
			this.checked_member_list.splice(indexOf, 1)
			this.allSet = false
		}

		this.subscription.add(
			this.groupService
				.removeMember(
					this.project_application.project_application_perun_id,
					member.memberId,
					this.project_application.project_application_compute_center.FacilityId
				)
				.subscribe(
					(result: any): void => {
						if (result.status === 200) {
							this.notificationModal.showSuccessFullNotificationModal(
								'Success',
								`Member ${member.firstName} ${member.lastName}  removed from the group`
							)
							this.getMembersOfTheProject()
						} else {
							this.notificationModal.showDangerNotificationModal(
								'Failed',
								`Member ${member.firstName} ${member.lastName}   could not be removed !`
							)
						}
					},
					(): void => {
						this.notificationModal.showDangerNotificationModal(
							'Failed',
							`Member ${member.firstName} ${member.lastName}   could not be removed !`
						)
					}
				)
		)
	}

	showPublicKeyModal(member: ProjectMember): void {
		this.viewPublicKeyComponent.showViewPublicKeyModal(`${member.firstName} ${member.lastName}`, member.publicKey)
	}

	protected readonly ApplicationRequestType = ApplicationRequestType
}
