import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core'
import { Subscription } from 'rxjs'

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { MaintenanceTimeFrame } from '../vo_manager/maintenance/maintenanceTimeFrame.model'
import { MaintenanceService } from '../api-connector/maintenance.service'
import { UserService } from '../api-connector/user.service'
import { NotificationModalComponent } from '../shared/modal/notification-modal'

@Component({
	selector: 'app-maintenance-alert',
	templateUrl: './maintenance-alert.component.html',
	styleUrls: ['./maintenance-alert.component.scss'],
	providers: [MaintenanceService],
	standalone: false
})
export class MaintenanceAlertComponent implements OnInit, OnDestroy {
	subscription: Subscription = new Subscription()
	maintenanceTimeFrames: MaintenanceTimeFrame[]
	numberOfConfirmableTimeframes: number = 0
	frames_loaded: boolean = false
	error_on_loading: boolean = false
	bsModalRef: BsModalRef
	@Output() confirmEventEmitter: EventEmitter<any> = new EventEmitter<any>()

	constructor(
		private maintenanceService: MaintenanceService,
		private userService: UserService,
		private modalService: BsModalService
	) {}

	ngOnInit(): void {
		this.subscription = new Subscription()
		this.get_timeframes()
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe()
	}

	showNotificationModal(
		notificationModalTitle: string,
		notificationModalMessage: string,
		notificationModalType: string
	) {
		const initialState = { notificationModalTitle, notificationModalType, notificationModalMessage }
		if (this.bsModalRef) {
			this.bsModalRef.hide()
		}

		this.bsModalRef = this.modalService.show(NotificationModalComponent, { initialState })
		this.bsModalRef.setClass('modal-lg')
	}

	getNumberOfConfirmableTimeframes(): void {
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

	confirmTakenNote(): void {
		this.subscription.add(
			this.userService.getUserInfo().subscribe(
				(login: any): void => {
					this.maintenanceService.confirmNote(login['ElixirId'], this.maintenanceTimeFrames).subscribe(() => {
						this.confirmEventEmitter.emit()
						this.getNumberOfConfirmableTimeframes()
						this.showNotificationModal(
							'Success',
							'You have successfully confirmed that you are aware of the maintenance periods.',
							'success'
						)
					})
				},
				() => {
					this.showNotificationModal('Failed', 'The confirmation of the awareness failed!', 'danger')
				}
			)
		)
	}
	get_timeframes(): void {
		this.subscription.add(
			this.maintenanceService.getFutureMaintenanceTimeFrames().subscribe({
				next: (mtf: MaintenanceTimeFrame[]) => {
					this.maintenanceTimeFrames = mtf.sort((a, b) => {
						if (a.start_time < b.start_time) {
							return -1
						} else if (a.start_time > b.start_time) {
							return 1
						} else {
							return 0
						}
					})
					this.error_on_loading = false
					this.frames_loaded = true
				},
				error: () => {
					this.error_on_loading = true
					this.frames_loaded = true
				}
			})
		)
		this.getNumberOfConfirmableTimeframes()
	}
}
