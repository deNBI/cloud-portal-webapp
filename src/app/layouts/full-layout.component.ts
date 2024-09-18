import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import moment from 'moment'
import { ApiSettings } from '../api-connector/api-settings.service'
import { ClientService } from '../api-connector/client.service'
import { FacilityService } from '../api-connector/facility.service'
import { UserService } from '../api-connector/user.service'
import { GroupService } from '../api-connector/group.service'
import { VoService } from '../api-connector/vo.service'
import { IResponseTemplate } from '../api-connector/response-template'
import { ApplicationBaseClassComponent } from '../shared/shared_modules/baseClass/application-base-class.component'
import { ApplicationsService } from '../api-connector/applications.service'
import { ProjectEnumeration } from '../projectmanagement/project-enumeration'
import { environment } from '../../environments/environment'
import { is_vo } from '../shared/globalvar'
import { Application_States } from '../shared/shared_modules/baseClass/abstract-base-class'
import { WIKI, WIKI_FAQ, STATUS_LINK } from '../../links/links'
import { MaintenanceTimeFrame } from '../vo_manager/maintenance/maintenanceTimeFrame.model'
import { MaintenanceService } from '../api-connector/maintenance.service'
import { UserInfoComponent } from '../userinfo/userinfo.component'

/**
 * FullLayout component.
 */
@Component({
	selector: 'app-dashboard',
	templateUrl: './full-layout.component.html',
	providers: [ApplicationsService, VoService, GroupService, UserService, FacilityService, ClientService, ApiSettings]
})
export class FullLayoutComponent extends ApplicationBaseClassComponent implements OnInit {
	public year: number = new Date().getFullYear()
	public disabled: boolean = false
	public status: { isopen: boolean } = { isopen: false }
	is_vo_admin: boolean = false
	public is_facility_manager: boolean = false
	public is_simple_vm_manager: boolean = false
	public vm_project_member: boolean = false
	public login_name: string = ''
	public production: boolean = environment.production
	show_projects: boolean = false
	navbar_state: string = 'closed'
	overview_state: string = 'closed'
	show_overviews: boolean = false
	brand_logo: string = 'static/webapp/assets/img/denbi-logo-color.svg'
	// brand_logo_minimized: string = 'static/webapp/assets/img/denbi-logo-minimized.svg';
	simple_vm_logo: string = 'static/webapp/assets/img/simpleVM_Logo.svg'
	openstack_logo: string = 'static/webapp/assets/img/openstack_plain_red.svg'
	kubernetes_logo: string = 'static/webapp/assets/img/kubernetes_logo.svg'

	has_workshops: boolean = false
	missing_consents: string[] = []
	maintenanceTimeframes: MaintenanceTimeFrame[] = []
	maintenanceTimeframesLoaded: boolean = false
	checkMaintenanceTimer: ReturnType<typeof setTimeout>
	checkMaintenanceTimeout: number = 180000
	numberOfConfirmableTimeframes: number = 0
	confirmedInSession: boolean = false

	TITLE: string = ''

	project_enumeration: ProjectEnumeration[] = []

	facilityIds: number[] = []
	Application_States: typeof Application_States = Application_States

	WIKI: string = WIKI
	WIKI_FAQ: string = WIKI_FAQ
	STATUS_LINK: string = STATUS_LINK

	constructor(
		private maintenanceService: MaintenanceService,
		private groupService: GroupService,
		userService: UserService,
		facilityService: FacilityService,
		applicationsService: ApplicationsService,
		private cd: ChangeDetectorRef
	) {
		super(userService, applicationsService, facilityService, cd)
	}

	componentAdded(component: any): void {
		this.TITLE = component.title
		if (component instanceof UserInfoComponent) {
			const child: UserInfoComponent = component
			child.confirmEventEmitter.subscribe(() => {
				this.confirmedInSession = true
			})
		}
		this.maintenanceInformationLoop()
		this.cd.detectChanges()
	}

	public get_is_vo_admin(): boolean {
		return this.is_vo_admin
	}

	maintenanceInformationLoop(timeout: number = this.checkMaintenanceTimeout): void {
		this.stopCheckMaintenanceTimer()
		this.getMaintenanceTimeFrames()
		this.checkMaintenanceTimer = setTimeout((): void => {
			this.maintenanceInformationLoop()
		}, timeout)
	}

	stopCheckMaintenanceTimer(): void {
		if (this.checkMaintenanceTimer) {
			clearTimeout(this.checkMaintenanceTimer)
		}
	}

	public get_is_facility_manager(): void {
		this.facilityService.getManagerFacilities().subscribe((result: any): void => {
			if (result.length > 0) {
				this.is_facility_manager = true
				let svm_manager: boolean = false
				for (const facility of result) {
					if (facility['SimpleVM']) {
						svm_manager = true
						break
					}
				}
				this.is_simple_vm_manager = svm_manager
			}
		})
	}

	is_vm_project_member(): void {
		this.groupService.getSimpleVmByUser().subscribe((result: any): void => {
			if (result.length > 0) {
				this.vm_project_member = true
			}
		})
	}

	is_workshop_admin(): void {
		this.groupService.getSimpleVmByUserWhereWorkshopAndAdmin().subscribe((result: any): void => {
			if (result.length > 0) {
				this.has_workshops = true
			}
		})
	}

	getGroupsEnumeration(): void {
		this.groupService.getGroupsEnumeration().subscribe((res: ProjectEnumeration[]): void => {
			this.project_enumeration = res
			this.project_enumeration.forEach((enumeration: ProjectEnumeration): void => {
				this.pushAdditionalStates(enumeration)
			})
			this.project_enumeration.sort((firstProject: ProjectEnumeration, secondProject: ProjectEnumeration): number => {
				if (firstProject.is_open_stack && !secondProject.is_open_stack) {
					return -1
				}
				if (!firstProject.is_open_stack && secondProject.is_open_stack) {
					return 1
				}

				return 0
			})
		})
	}

	ngOnInit(): void {
		this.getGroupsEnumeration()
		this.is_vm_project_member()
		this.is_workshop_admin()
		this.get_is_facility_manager()
		this.getLoginName()
		this.getMissingConsents()
		this.getMaintenanceTimeFrames()
		this.maintenanceInformationLoop()

		this.is_vo_admin = is_vo
	}

	getMaintenanceTimeFrames(): void {
		this.maintenanceService.getFutureMaintenanceTimeFrames().subscribe({
			next: (mtf: MaintenanceTimeFrame[]) => {
				this.maintenanceTimeframes = mtf.sort((a, b) => {
					if (a.start_time < b.start_time) {
						return -1
					} else if (a.start_time > b.start_time) {
						return 1
					} else {
						return 0
					}
				})
				this.maintenanceTimeframesLoaded = true
			},
			error: () => {
				this.maintenanceTimeframesLoaded = false
			}
		})
		this.userService.getUserInfo().subscribe(
			(login: any): void => {
				this.maintenanceService.getNumberOfUnconfirmedTimeFrames(login['ElixirId']).subscribe((nxt: any) => {
					this.numberOfConfirmableTimeframes = nxt['confirmable']
				})
			},
			() => {
				console.log('An error occurred')
			}
		)
	}

	getLoginName(): void {
		this.userService.getLoginElixirName().subscribe((login: IResponseTemplate): void => {
			this.login_name = login.value as string
		})
	}

	getMissingConsents(): void {
		this.userService.getMissingConsents().subscribe((missingConsents: string[]) => {
			this.missing_consents = missingConsents
		})
	}

	toggleOverviews(): void {
		this.show_overviews = !this.show_overviews
	}

	toggleProjectsNav(): void {
		this.show_projects = !this.show_projects
	}

	/**
	 * Adding additional state numbers to list for expires soon (18), new project (19) and lifetime expired (20)
	 *
	 * @param enumeration
	 */
	pushAdditionalStates(enumeration: ProjectEnumeration): void {
		const days_left: number = this.getDaysLeft(enumeration)
		const days_running: number = this.getDaysRunning(enumeration)
		if (enumeration.project_application_statuses.includes(Application_States.APPROVED)) {
			if (days_left < 14 && days_left >= 0) {
				enumeration.project_application_statuses.push(Application_States.EXPIRES_SOON)
			} else if (days_left < 0) {
				enumeration.project_application_statuses.push(Application_States.EXPIRED)
			}
			if (days_running < 14) {
				enumeration.project_application_statuses.push(Application_States.APPROVED_LAST_2_WEEKS)
			}
		}
	}

	getDaysLeft(projEnum: ProjectEnumeration): number {
		const expirationDate: string = moment(
			moment(projEnum.project_start_date).add(projEnum.project_lifetime, 'months').toDate()
		).format('DD.MM.YYYY')
		const lifetimeDays: number = Math.abs(
			moment(moment(expirationDate, 'DD.MM.YYYY').toDate()).diff(moment(projEnum.project_start_date), 'days')
		)

		const daysRunning: number = this.getDaysRunning(projEnum)

		return lifetimeDays - daysRunning
	}

	getDaysRunning(projectEnumeration: ProjectEnumeration): number {
		return Math.ceil(
			Math.abs(Date.now() - new Date(projectEnumeration.project_start_date).getTime()) / (1000 * 3600 * 24)
		)
	}
}
