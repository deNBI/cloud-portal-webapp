import { Component, OnInit, OnDestroy, ViewChild, inject } from '@angular/core'
import { Subscription } from 'rxjs'
import { MatomoTracker } from 'ngx-matomo-client'
import { Workshop } from '../workshop.model'
import { GroupService } from '../../../api-connector/group.service'
import { UrlData } from '../workshop-urlinfo.model'
import { WorkshopService } from '../../../api-connector/workshop.service'
import { ProjectMember } from '../../../projectmanagement/project_member.model'
import { WorkshopVM } from '../workshop-vm.model'
import { WIKI_WORKSHOPS, CLOUD_PORTAL_SUPPORT_MAIL, LIFESCIENCE_HOSTEL_SIGNUP } from '../../../../links/links'
import { WorkshopTimeFrame } from '../workshopTimeFrame.model'

interface MemberVm {
	projectMember: ProjectMember
	workshopVmLink: { [key: number]: WorkshopVM[] }
}

@Component({
	selector: 'app-overview',
	templateUrl: './workshop-overview.component.html',
	styleUrls: ['./workshop-overview.component.scss'],
	providers: [GroupService, WorkshopService]
})
export class WorkshopOverviewComponent implements OnInit, OnDestroy {
	private readonly tracker = inject(MatomoTracker)
	title: string = 'Workshop management'

	@ViewChild('confirmInterferingSlotModal') confirmInterfereModal: any

	WIKI_WORKSHOPS: string = WIKI_WORKSHOPS
	LIFESCIENCE_HOSTEL_SIGNUP: string = LIFESCIENCE_HOSTEL_SIGNUP
	CLOUD_PORTAL_SUPPORT_MAIL: string = CLOUD_PORTAL_SUPPORT_MAIL
	subscription: Subscription = new Subscription()
	resend_info: boolean = false
	sending_mails = false
	sending_done = false
	newWorkShopTimeFrame: WorkshopTimeFrame = null
	workshops: Workshop[] = []
	selectedWorkshop: Workshop
	memberVms: MemberVm[] = []
	workshopTimeFramesLoaded: boolean = false
	errorLoadingTimeFrames: boolean = false
	workshopTimeFrames: WorkshopTimeFrame[] = []
	loadedVmsForWorkshop: number[] = []
	projects: [string, number][] = []
	selectedProject: [string, number]
	errorMessage: string = null
	isLoaded: boolean = false
	projectWorkshopsLoading: boolean = false
	projectWorkshopsLoaded: boolean = false
	projectMembersLoading: boolean = false
	projectMembersLoaded: boolean = false
	informationTitle: string = ''
	informationType: string = ''
	informationMessage: string = ''
	deleting: boolean = false
	deleteSuccess: boolean = false
	invalidShortname: boolean = true
	invalidLongname: boolean = true
	newWorkshop: boolean = false
	workshopCreationMessage: { message: string; success: boolean } = { message: '', success: false }
	listOfOverlaps: WorkshopTimeFrame[] = []

	@ViewChild('creationStatusModal') creationStatusModal: any

	constructor(
		private workshopService: WorkshopService,
		private groupService: GroupService
	) {
		 
	}

	ngOnInit(): void {
		this.tracker.trackPageView('Workshop Overview')
		this.newWorkShopTimeFrame = new WorkshopTimeFrame({
			id: null,
			end_time: new Date(),
			start_time: new Date(),
			workshop: new Workshop(),
			project: null,
			description: ''
		})
		this.getProjects()
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe()
	}

	getProjects(): void {
		this.projects = []
		this.subscription.add(
			this.groupService.getSimpleVmByUserWhereWorkshopAndAdmin().subscribe((projects: any) => {
				for (const project of projects) {
					this.projects.push(project)
				}
				this.isLoaded = true
			})
		)
	}

	projectChange(): void {
		this.resetsOnProjectChange()
		this.getWorkshopsForProject()
		this.getMembersOfTheProject()
		this.loadCalenderForSelectedProject()
	}

	dayChanged(date: { year: number; month: number; day: number }): void {
		this.newWorkShopTimeFrame.start_time.setDate(date.day)
		this.newWorkShopTimeFrame.start_time.setMonth(date.month - 1)
		this.newWorkShopTimeFrame.start_time.setFullYear(date.year)

		this.newWorkShopTimeFrame.end_time.setDate(date.day)
		this.newWorkShopTimeFrame.end_time.setMonth(date.month - 1)
		this.newWorkShopTimeFrame.end_time.setFullYear(date.year)
	}

	startTimeChanged(time: { hour: number; minute: number }): void {
		this.newWorkShopTimeFrame.start_time.setHours(time.hour)
		this.newWorkShopTimeFrame.start_time.setMinutes(time.minute)
	}

	endTimeChanged(time: { hour: number; minute: number }): void {
		this.newWorkShopTimeFrame.end_time.setHours(time.hour)
		this.newWorkShopTimeFrame.end_time.setMinutes(time.minute)
	}

	createNewTimeFrame(): void {
		if (this.checkTimeFrameOverlap()) {
			this.confirmInterfereModal.show()
		} else {
			this.processAddAfterConfirm()
		}
	}

	datesOverlap(first_start: number, first_end: number, second_start: number, second_end: number): boolean {
		return (
			(first_start >= second_start && first_start <= second_end) ||
			(first_end >= second_start && first_end <= second_end) ||
			(second_start >= first_start && second_start <= first_end) ||
			(second_end >= first_start && second_end <= first_end)
		)
	}

	checkTimeFrameOverlap(): boolean {
		// eslint-disable-next-line prefer-const
		let interferingTimeframes: WorkshopTimeFrame[] = []

		this.workshopTimeFrames.forEach((wstf: WorkshopTimeFrame) => {
			const start_time: number = new Date(wstf.start_time).getTime()
			const end_time: number = new Date(wstf.end_time).getTime()
			if (
				this.datesOverlap(
					start_time,
					end_time,
					this.newWorkShopTimeFrame.start_time.getTime(),
					this.newWorkShopTimeFrame.end_time.getTime()
				)
			) {
				interferingTimeframes.push(wstf)
			}
		})
		this.listOfOverlaps = interferingTimeframes

		return interferingTimeframes.length > 0
	}

	processAddAfterConfirm(): void {
		this.workshopService.addWorkshopTimeFrame(this.selectedProject[1], this.newWorkShopTimeFrame).subscribe({
			next: () => {
				this.loadCalenderForSelectedProject()
				this.informationTitle = 'Success'
				this.informationType = 'info'
				this.informationMessage = 'The new timeframe got successfully added to the calender!'
			},
			error: () => {
				this.informationTitle = 'Error'
				this.informationType = 'danger'
				this.informationMessage = 'An error occured while adding the timeframe to the calender!'
			}
		})
	}

	deleteWorkshopTimeFrame(timeframe: WorkshopTimeFrame): void {
		this.workshopService.removeWorkshopTimeFrame(this.selectedProject[1], timeframe).subscribe({
			next: () => {
				this.loadCalenderForSelectedProject()
				this.informationTitle = 'Success'
				this.informationType = 'info'
				this.informationMessage = 'The selected timeframe got successfully removed from the calender!'
			},
			error: () => {
				this.informationTitle = 'Error'
				this.informationType = 'danger'
				this.informationMessage = 'An error occured while removing the timeframe from the calender!'
			}
		})
	}

	getWorkshopsForProject(): void {
		this.projectWorkshopsLoading = true
		this.subscription.add(
			this.workshopService.getWorkshops(this.selectedProject[1]).subscribe((workshops: Workshop[]) => {
				this.workshops = workshops
				this.selectedWorkshop = new Workshop()
				this.projectWorkshopsLoading = false
				this.projectWorkshopsLoaded = true
			})
		)
	}

	getMembersOfTheProject(): void {
		this.projectMembersLoading = true
		this.memberVms = []
		this.subscription.add(
			this.groupService
				.getWorkshopMembers(this.selectedProject[1].toString())
				.subscribe((members: ProjectMember[]): void => {
					for (const member of members) {
						const workshopVmLink: { [key: number]: WorkshopVM[] } = {}
						const membervm: MemberVm = { projectMember: member, workshopVmLink }
						this.memberVms.push(membervm)
						this.projectMembersLoading = false
						this.projectMembersLoaded = true
					}
				})
		)
	}

	workshopChange(workshop: Workshop): void {
		this.selectedWorkshop = workshop
		this.newWorkShopTimeFrame = new WorkshopTimeFrame({ workshop: this.selectedWorkshop, start_time: new Date() })
		this.newWorkshop = false
		this.invalidShortname = true
		this.invalidLongname = true
		this.loadVmsForSelectedProject()
	}

	loadCalenderForSelectedProject(): void {
		this.workshopTimeFramesLoaded = false
		this.subscription.add(
			this.workshopService.loadWorkshopCalender(this.selectedProject[1]).subscribe({
				next: (wsTimeFrames: WorkshopTimeFrame[]) => {
					this.workshopTimeFrames = wsTimeFrames.sort((a, b) => {
						if (a.start_time < b.start_time) {
							return -1
						} else if (a.start_time > b.start_time) {
							return 1
						} else {
							return 0
						}
					})
					this.workshopTimeFramesLoaded = true
					this.errorLoadingTimeFrames = false
				},
				error: () => {
					this.workshopTimeFramesLoaded = true
					this.errorLoadingTimeFrames = true
				}
			})
		)
	}

	loadVmsForSelectedProject(): void {
		if (this.loadedVmsForWorkshop.includes(this.selectedWorkshop.id)) {
			return
		}

		this.subscription.add(
			this.workshopService.loadWorkshopWithVms(this.selectedWorkshop.id).subscribe((workshopIncoming: Workshop) => {
				for (let workshop of this.workshops) {
					if (workshop.id === workshopIncoming.id) {
						workshop = workshopIncoming
						this.loadedVmsForWorkshop.push(workshop.id)
						this.addVmsToProjectMembers(workshop)
						this.getUrlDataForWorkshopVms(workshop)
					}
				}
			})
		)
	}

	addVmsToProjectMembers(workshop: Workshop): void {
		for (const member of this.memberVms) {
			if (!(workshop.id in member.workshopVmLink)) {
				member.workshopVmLink[workshop.id] = []
			}
			for (const vm of workshop.vm_list) {
				if (member.projectMember.elixirId === vm.elixirid) {
					member.workshopVmLink[workshop.id].push(vm)
				}
			}
		}
	}

	resetSendingMails(): void {
		this.resend_info = false
		this.sending_mails = false
		this.sending_done = false
	}

	sendWorkshopVMsEmailInfo(): void {
		this.sending_mails = true
		this.sending_done = false
		const vms: WorkshopVM[] = []
		for (const memberVm of this.memberVms) {
			for (const wvm of memberVm.workshopVmLink[this.selectedWorkshop.id]) {
				if (this.resend_info) {
					vms.push(wvm)
				} else if (!wvm.email_sent) {
					vms.push(wvm)
				}
			}
		}

		for (const vm of vms) {
			this.sendWorkshopVMEMailInfo(vm)
		}
		this.sending_done = true
		this.sending_mails = false
	}

	sendWorkshopVMEMailInfo(workshop_vm: WorkshopVM): void {
		this.subscription.add(
			this.workshopService.sendWorkshopVmEmail(this.selectedWorkshop.id, workshop_vm?.vm?.openstackid).subscribe(
				(upd_workshop_vm: WorkshopVM) => {
					for (const memberVm of this.memberVms) {
						for (const wvm of memberVm.workshopVmLink[this.selectedWorkshop.id]) {
							if (wvm === workshop_vm) {
								const idx: number = memberVm.workshopVmLink[this.selectedWorkshop.id].indexOf(wvm)
								memberVm.workshopVmLink[this.selectedWorkshop.id][idx].email_sent = upd_workshop_vm.email_sent
							}
						}
					}
				},
				(error: any) => {
					if ('error' in error) {
						console.log(error)
					}
				}
			)
		)
	}

	getUrlDataForWorkshopVms(workshop: Workshop): void {
		for (const member of this.memberVms) {
			if (!(workshop.id in member.workshopVmLink)) {
				continue
			}
			for (const vm of member.workshopVmLink[workshop.id]) {
				if (vm.vm.openstackid && vm.vm.openstackid !== '') {
					vm.setLoadingUrlData(true)
					this.subscription.add(
						this.workshopService
							.getResenvUrlForWorkshopVm(workshop.id, vm.vm.openstackid)
							.subscribe((urlData: UrlData) => {
								vm.setLoadingUrlData(false)
								vm.setUrlData(urlData)
							})
					)
				}
			}
		}
	}

	cleanupWorkshop(): void {
		const selectedId = this.selectedWorkshop.id
		this.selectedWorkshop = new Workshop()
		this.deleting = true
		this.subscription.add(
			this.workshopService.deleteWorkshop(selectedId).subscribe((result: boolean) => {
				this.deleting = false
				if (result) {
					this.deleteSuccess = true
					for (const workshop of this.workshops) {
						if (workshop.id === selectedId) {
							this.workshops.splice(this.workshops.indexOf(workshop), 1)
						}
					}
				} else {
					this.deleteSuccess = false
				}
			})
		)
	}

	resetsOnProjectChange(): void {
		this.projectWorkshopsLoading = false
		this.projectWorkshopsLoaded = false

		this.projectWorkshopsLoading = false
		this.projectMembersLoaded = false

		this.workshops = []
		this.memberVms = []
		this.loadedVmsForWorkshop = []

		this.newWorkshop = false
		this.invalidLongname = true
		this.invalidShortname = true
	}

	checkShortname(shortname: string): void {
		this.invalidShortname = shortname.length < 3 || shortname.length > 8 || !/^[a-zA-Z0-9\s]*$/.test(shortname)
	}

	checkLongname(longname: string): void {
		this.invalidLongname = longname.length < 3 || longname.length > 256 || !this.isASCII(longname)
	}

	isASCII(testString: string): boolean {
		// eslint-disable-next-line no-control-regex
		return /^[\x00-\x7F]*$/.test(testString)
	}

	blankWorkshop(): void {
		this.newWorkshop = true
		this.selectedWorkshop = new Workshop()
	}

	createNewWorkshop(): void {
		this.selectedWorkshop.shortname = this.selectedWorkshop.shortname.replace(/\s/g, '')
		this.subscription.add(
			this.workshopService.createWorkshop(this.selectedProject[1], this.selectedWorkshop).subscribe(
				(workshop: Workshop) => {
					this.workshops.push(workshop)
					this.workshopChange(workshop)
					this.workshopCreationMessage = { message: 'Workshop created successfully!', success: true }
					this.creationStatusModal.show()
				},
				(error: any) => {
					if ('error' in error) {
						this.selectedWorkshop.longname = ''
						this.invalidLongname = true
						this.selectedWorkshop.shortname = ''
						this.invalidShortname = true
						if (error['error']['error'] === 'unique_constraint') {
							this.workshopCreationMessage = {
								message: 'Workshop name already taken! Please select another name.',
								success: false
							}
						} else {
							this.workshopCreationMessage = { message: 'An error occured. Please try again!', success: false }
						}
						this.creationStatusModal.show()
					}
				}
			)
		)
	}
}
