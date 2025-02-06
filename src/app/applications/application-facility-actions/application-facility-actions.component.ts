import { Component, EventEmitter, Input, Output } from '@angular/core'

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { ConfirmationActions } from 'app/shared/modal/confirmation_actions'
import { Subscription } from 'rxjs'
import { Application } from '../application.model/application.model'
import { ComputecenterComponent } from '../../projectmanagement/computecenter.component'
import { ApplicationTabStates } from '../../shared/enums/application-tab-states'
import { AbstractBaseClass, Application_States } from '../../shared/shared_modules/baseClass/abstract-base-class'
import { FacilityService } from '../../api-connector/facility.service'
import { NotificationModalComponent } from '../../shared/modal/notification-modal'
import { ConfirmationModalComponent } from '../../shared/modal/confirmation-modal.component'
import { ApplicationsService } from '../../api-connector/applications.service'

@Component({
    selector: 'app-application-facility-actions',
    templateUrl: './application-facility-actions.component.html',
    styleUrl: './application-facility-actions.component.scss',
    standalone: false
})
export class ApplicationFacilityActionsComponent extends AbstractBaseClass {
	private subscription: Subscription = new Subscription()

	protected readonly ConfirmationActions = ConfirmationActions
	protected readonly ApplicationTabStates = ApplicationTabStates
	@Input() application: Application
	@Input() tabState: ApplicationTabStates = ApplicationTabStates.SUBMITTED
	@Input() computeCenters: ComputecenterComponent[] = []
	@Output() reloadNumbersTrigger: EventEmitter<void> = new EventEmitter()
	@Output() removeApplicationTrigger: EventEmitter<number | string> = new EventEmitter()
	isCollapsed: boolean = true
	bsModalRef: BsModalRef
	@Output() switchCollapseEvent: EventEmitter<void> = new EventEmitter()
	@Output() reloadApplicationTrigger: EventEmitter<void> = new EventEmitter()

	constructor(
		private facilityService: FacilityService,
		private modalService: BsModalService,
		private applicationsService: ApplicationsService
	) {
		super()
	}

	switchCollaps() {
		this.isCollapsed = !this.isCollapsed;
		this.switchCollapseEvent.emit();
	}

	triggerRemoveApplication() {
		this.removeApplicationTrigger.emit(this.application.project_application_id)
	}

	triggerReloadNumbers() {
		this.reloadNumbersTrigger.emit()
	}

	triggerReloadApplication(): void {
		this.reloadApplicationTrigger.emit()
	}

	declineApplication(): void {
		this.showNotificationModal('Decline Application', 'Waiting..', 'info')

		this.facilityService
			.declineFacilityApplication(
				this.application.project_application_compute_center.FacilityId,
				this.application.project_application_id
			)
			.subscribe(
				(): void => {
					this.showNotificationModal('Success', 'Successfully declined the application.', 'success')
					this.triggerReloadNumbers()
					this.triggerRemoveApplication()

					//	this.getAllApplicationsHistory(this.selectedFacility['FacilityId']);
				},
				(): void => {
					this.showNotificationModal('Failed', 'Failed to decline the application.', 'danger')
				}
			)
	}

	public approveExtension(): void {
		this.applicationsService.approveAdditionalLifetime(this.application.project_application_id).subscribe(
			(): void => {
				this.showNotificationModal('Success', 'Successfully approved extension!', 'success')
				this.triggerReloadNumbers()
				this.triggerRemoveApplication()
			},
			(): void => {
				this.showNotificationModal('Failed', 'The approval of the extension request has failed.', 'danger')
			}
		)
	}

	/**
	 * Decline an extension request.
	 *
	 * @param application_id
	 */
	public declineExtension(): void {
		this.applicationsService.declineAdditionalLifetime(this.application.project_application_id).subscribe(
			(): void => {
				this.showNotificationModal('Success', 'Successfully declined extension!', 'success')
				this.triggerReloadNumbers()
				this.triggerRemoveApplication()
			},
			(): void => {
				this.showNotificationModal('Failed', 'The decline of the extension request has failed.', 'danger')
			}
		)
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

	approveApplication(): void {
		this.showNotificationModal('Approving Application', 'Waiting..', 'info')
		this.facilityService
			.approveFacilityApplication(
				this.application.project_application_compute_center.FacilityId,
				this.application.project_application_id
			)
			.subscribe(
				(): void => {
					this.showNotificationModal('Success', 'Successfully approved the application.', 'success')
					this.triggerReloadNumbers()
					this.triggerRemoveApplication()

					//	this.getAllApplicationsHistory(this.selectedFacility['FacilityId']);
				},
				(): void => {
					this.showNotificationModal('Failed', 'Failed to approve the application.', 'danger')
				}
			)
	}

	showConfirmationModal(action: ConfirmationActions): void {
		const initialState = {
			application: this.application,
			action
		}

		this.bsModalRef = this.modalService.show(ConfirmationModalComponent, { initialState, class: 'modal-lg' })
		this.subscribeToBsModalRef()
	}

	approveModification(): void {
		this.applicationsService.approveModificationRequest(this.application.project_application_id).subscribe(
			(): void => {
				this.showNotificationModal('Success', 'Successfully approved modification!', 'success')
				this.triggerReloadNumbers()
				this.triggerRemoveApplication()
			},
			(): void => {
				this.showNotificationModal('Failed', 'The approval of the modification request has failed.', 'danger')
			}
		)
	}

	declineModification(): void {
		this.applicationsService.declineModificationRequest(this.application.project_application_id).subscribe(
			(): void => {
				this.showNotificationModal('Success', 'Successfully declined modification!', 'success')
				this.triggerReloadNumbers()
				this.triggerRemoveApplication()
			},
			(): void => {
				this.showNotificationModal('Failed', 'The decline of the modification request has failed.', 'danger')
			}
		)
	}

	approveTermination(): void {
		this.facilityService
			.approveTerminationByFM(
				this.application.project_application_perun_id,
				this.application.project_application_compute_center.FacilityId
			)
			.subscribe(
				(): void => {
					this.triggerReloadNumbers()
					this.triggerRemoveApplication()
					this.showNotificationModal('Success', 'The  project was terminated.', 'success')
				},
				(error: any): void => {
					if (error['status'] === 409) {
						this.showNotificationModal(
							'Failed',
							`The project could not be terminated. Reason: ${error['error']['reason']} for ${error['error']['openstackid']}`,

							'danger'
						)
					} else {
						this.showNotificationModal('Failed', 'The project could not be terminated.', 'danger')
					}
				}
			)
	}

	declineTermination(): void {
		this.facilityService
			.declineTerminationByFM(
				this.application.project_application_perun_id,
				this.application.project_application_compute_center.FacilityId
			)
			.subscribe(
				(): void => {
					this.triggerReloadNumbers()
					this.triggerRemoveApplication()
					this.showNotificationModal('Success', 'The termination of the project was declined.', 'success')
				},
				(error: any): void => {
					if (error['status'] === 409) {
						this.showNotificationModal(
							'Failed',
							`The decline of the project was not successful. Reason: ${error['error']['reason']} for ${error['error']['openstackid']}`,

							'danger'
						)
					} else {
						this.showNotificationModal('Failed', 'The decline of the project failed.', 'danger')
					}
				}
			)
	}

	subscribeToBsModalRef(): void {
		this.subscription.add(
			this.bsModalRef.content.event.subscribe((event: any) => {
				const action: ConfirmationActions = event.action
				switch (action) {
					case ConfirmationActions.APPROVE_APPLICATION: {
						this.approveApplication()
						break
					}
					case ConfirmationActions.DECLINE_APPLICATION: {
						this.declineApplication()
						break
					}
					case ConfirmationActions.DECLINE_EXTENSION: {
						this.declineExtension()
						break
					}
					case ConfirmationActions.APPROVE_EXTENSION: {
						this.approveExtension()
						break
					}
					case ConfirmationActions.DECLINE_MODIFICATION: {
						this.declineModification()
						break
					}
					case ConfirmationActions.APPROVE_MODIFICATION: {
						this.approveModification()
						break
					}
					case ConfirmationActions.APPROVE_TERMINATION: {
						this.approveTermination()
						break
					}
					case ConfirmationActions.DECLINE_TERMINATION: {
						this.declineTermination()
						break
					}
					default:
						break
				}
			})
		)
	}

	ngOnInit() {}

	protected readonly Application_States = Application_States
}
