import { Component, EventEmitter, Injectable, OnInit } from '@angular/core'
import { BsModalService } from 'ngx-bootstrap/modal'
import { Application } from '../../applications/application.model/application.model'
import { ConfirmationTypes } from './confirmation_types'
import { ConfirmationActions } from './confirmation_actions'
import { AbstractBaseModalComponent } from './abstract-base-modal/abstract-base-modal.component'

@Injectable({
	providedIn: 'root'
})
@Component({
	selector: 'app-confirmation-modal',
	templateUrl: './confirmation-modal.component.html',
	providers: [],
	standalone: false
})
export class ConfirmationModalComponent extends AbstractBaseModalComponent implements OnInit {
	protected readonly ConfirmationTypes = ConfirmationTypes

	application: Application = null
	modalTitle: string = ''
	modalMessage: string = ''
	application_center: string = ''
	additional_msg: string = ''
	action: ConfirmationActions
	type: ConfirmationTypes
	request_failed: boolean = false

	constructor(protected modalService: BsModalService) {
		super(modalService)
	}

	showConfirmationModal(application: Application, action: ConfirmationActions): EventEmitter<any> {
		const initialState = { application, action }

		return this.showBaseModal(ConfirmationModalComponent, initialState)
	}

	confirmAction(): void {
		void this.hide()
		const actionsMap = {
			[ConfirmationActions.DECLINE_MODIFICATION]: { action: ConfirmationActions.DECLINE_MODIFICATION },
			[ConfirmationActions.DECLINE_EXTENSION]: { action: ConfirmationActions.DECLINE_EXTENSION },
			[ConfirmationActions.DECLINE_CREDITS]: { action: ConfirmationActions.DECLINE_CREDITS },
			[ConfirmationActions.DECLINE_APPLICATION]: { action: ConfirmationActions.DECLINE_APPLICATION },
			[ConfirmationActions.APPROVE_MODIFICATION]: { action: ConfirmationActions.APPROVE_MODIFICATION },
			[ConfirmationActions.DECLINE_TERMINATION]: { action: ConfirmationActions.DECLINE_TERMINATION },
			[ConfirmationActions.APPROVE_TERMINATION]: { action: ConfirmationActions.APPROVE_TERMINATION },

			[ConfirmationActions.RESET_PI]: { action: ConfirmationActions.RESET_PI },

			[ConfirmationActions.APPROVE_EXTENSION]: { action: ConfirmationActions.APPROVE_EXTENSION },
			[ConfirmationActions.DELETE_APPLICATION]: { action: ConfirmationActions.DELETE_APPLICATION },

			[ConfirmationActions.APPROVE_CREDITS]: { action: ConfirmationActions.APPROVE_CREDITS },
			[ConfirmationActions.APPROVE_APPLICATION]: {
				action: ConfirmationActions.APPROVE_APPLICATION,
				selectedCenter: this.application_center
			},
			[ConfirmationActions.DISABLE_APPLICATION]: { action: ConfirmationActions.DISABLE_APPLICATION },
			[ConfirmationActions.ENABLE_APPLICATION]: { action: ConfirmationActions.ENABLE_APPLICATION },
			[ConfirmationActions.REMOVE_MEMBERS]: { action: ConfirmationActions.REMOVE_MEMBERS },
			[ConfirmationActions.REMOVE_MEMBER]: { action: ConfirmationActions.REMOVE_MEMBER }
		}

		const selectedAction = actionsMap[this.action]

		if (selectedAction) {
			this.event.emit({
				...selectedAction,
				application: this.application
			})
		} else {
			this.request_failed = true
		}
	}

	sendClosed(): void {
		void this.hide()
		this.event.emit({
			closed: true
		})
	}

	buttonText(): string {
		switch (this.type) {
			case ConfirmationTypes.ENABLE:
				return 'Enabling'
			case ConfirmationTypes.DISABLE:
				return 'Disabling'
			case ConfirmationTypes.APPROVE:
				return 'Approval'
			case ConfirmationTypes.DELETE:
				return 'Deletion'
			case ConfirmationTypes.DECLINE:
				return 'Declination'
			case ConfirmationTypes.RESET_PI:
				return 'Reset PI'
			case ConfirmationTypes.REMOVE:
				return 'Removal'
			default:
				break
		}

		return ''
	}

	ngOnInit() {
		this.request_failed = false
		const confirmationData = {
			[ConfirmationActions.DECLINE_MODIFICATION]: {
				title: 'Confirm decline of modification request',
				type: ConfirmationTypes.DECLINE,
				message: 'Do you really want to decline the modification request'
			},
			[ConfirmationActions.DELETE_APPLICATION]: {
				title: 'Confirm deletion of application',
				type: ConfirmationTypes.DECLINE,
				message: 'Do you really want to delete the application?'
			},
			[ConfirmationActions.DECLINE_APPLICATION]: {
				title: 'Confirm decline of project application',
				type: ConfirmationTypes.DECLINE,
				message: 'Do you really want to decline the project application'
			},
			[ConfirmationActions.DECLINE_EXTENSION]: {
				title: 'Confirm decline of extension request',
				type: ConfirmationTypes.DECLINE,
				message: 'Do you really want to decline the extension request'
			},
			[ConfirmationActions.DECLINE_CREDITS]: {
				title: 'Confirm decline of credit request',
				type: ConfirmationTypes.DECLINE,
				message: 'Do you really want to decline the credit request'
			},
			[ConfirmationActions.APPROVE_APPLICATION]: {
				title: 'Confirm approval of application',
				type: ConfirmationTypes.APPROVE,
				message: 'Do you really want to approve the application'
			},
			[ConfirmationActions.APPROVE_MODIFICATION]: {
				title: 'Confirm approval of modification request',
				type: ConfirmationTypes.APPROVE,
				message: 'Do you really want to approve the modification request'
			},
			[ConfirmationActions.APPROVE_EXTENSION]: {
				title: 'Confirm the approval of the extension request',
				type: ConfirmationTypes.APPROVE,
				message: 'Do you really want to approve the extension request'
			},
			[ConfirmationActions.APPROVE_CREDITS]: {
				title: 'Confirm approval of credits request',
				type: ConfirmationTypes.APPROVE,
				message: 'Do you really want to decline the credit request'
			},
			[ConfirmationActions.DISABLE_APPLICATION]: {
				title: 'Confirm disabling of application',
				type: ConfirmationTypes.DISABLE,
				message: 'Do you really want to disable the application'
			},
			[ConfirmationActions.ENABLE_APPLICATION]: {
				title: 'Confirm enabling of application',
				type: ConfirmationTypes.ENABLE,
				message: 'Do you really want to enable the application'
			},
			[ConfirmationActions.RESET_PI]: {
				title: 'Confirm reset pi',
				type: ConfirmationTypes.RESET_PI,
				message: 'Do you really want to reset the PI'
			},
			[ConfirmationActions.APPROVE_TERMINATION]: {
				title: 'Approve Termination',
				type: ConfirmationTypes.APPROVE,
				message: 'Do you really want to terminate this project'
			},
			[ConfirmationActions.DECLINE_TERMINATION]: {
				title: 'Decline Termination',
				type: ConfirmationTypes.DECLINE,
				message: 'Do you really want to decline the termination of this project'
			},
			[ConfirmationActions.REMOVE_MEMBERS]: {
				title: 'Remove Members',
				type: ConfirmationTypes.REMOVE,
				message: `Do you really want to  remove the member(s) from the project`
			},
			[ConfirmationActions.REMOVE_MEMBER]: {
				title: 'Remove Member',
				type: ConfirmationTypes.REMOVE,
				message: `Do you really want to remove the member from the project`
			}
		}

		const data = confirmationData[this.action]

		if (data) {
			this.modalTitle = data.title
			this.type = data.type
			this.modalMessage = data.message
		}
	}
}
