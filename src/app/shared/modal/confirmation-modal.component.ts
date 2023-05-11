import {
		Component, EventEmitter, OnDestroy, OnInit,
} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {Application} from '../../applications/application.model/application.model';


enum ConfirmationTypes {
		ENABLE,
		DISABLE,
		APPROVE,
		DECLINE

}

export enum ConfirmationActions {
		DECLINE_MODIFICATION,
		DECLINE_EXTENSION,
		DECLINE_CREDITS,
		DECLINE_APPLICATION,
		APPROVE_MODIFICATION,
		APPROVE_EXTENSION,
		APPROVE_CREDITS,
		APPROVE_APPLICATION,
		DISABLE_APPLICATION,
		ENABLE_APPLICATION,
}

@Component({
		selector: 'app-confirmation-modal',
		templateUrl: './confirmation-modal.component.html',
		providers: [],
})
export class ConfirmationModalComponent implements OnDestroy, OnInit {
		protected readonly ConfirmationTypes = ConfirmationTypes;


		application: Application = null;
		modalTitle: string = '';
		modalMessage: string = '';
		application_center: string = '';
		action: ConfirmationActions;
		type: ConfirmationTypes;
		request_failed: boolean = false;
		public event: EventEmitter<any> = new EventEmitter<any>();

		constructor(public bsModalRef: BsModalRef) {
				// eslint-disable-next-line no-empty-function
		}

		confirmAction(): void {
				const actionsMap = {
						[ConfirmationActions.DECLINE_MODIFICATION]: {action: ConfirmationActions.DECLINE_MODIFICATION},
						[ConfirmationActions.DECLINE_EXTENSION]: {action: ConfirmationActions.DECLINE_EXTENSION},
						[ConfirmationActions.DECLINE_CREDITS]: {action: ConfirmationActions.DECLINE_CREDITS},
						[ConfirmationActions.DECLINE_APPLICATION]: {action: ConfirmationActions.DECLINE_APPLICATION},
						[ConfirmationActions.APPROVE_MODIFICATION]: {action: ConfirmationActions.APPROVE_MODIFICATION},
						[ConfirmationActions.APPROVE_EXTENSION]: {action: ConfirmationActions.APPROVE_EXTENSION},
						[ConfirmationActions.APPROVE_CREDITS]: {action: ConfirmationActions.APPROVE_CREDITS},
						[ConfirmationActions.APPROVE_APPLICATION]: {
								action: ConfirmationActions.APPROVE_APPLICATION,
								selectedCenter: this.application_center
						},
						[ConfirmationActions.DISABLE_APPLICATION]: {action: ConfirmationActions.DISABLE_APPLICATION},
						[ConfirmationActions.ENABLE_APPLICATION]: {action: ConfirmationActions.ENABLE_APPLICATION}
				};

				const selectedAction = actionsMap[this.action];

				if (selectedAction) {
						this.event.emit({
								...selectedAction,
								application: this.application
						});
				} else {
						this.request_failed = true;
				}
		}


		sendClosed(): void {
				this.event.emit({
						closed: true,
				});
		}

		buttonText(): string {
				switch (this.type) {
						case ConfirmationTypes.ENABLE:
								return 'Enabling'
						case ConfirmationTypes.DISABLE:
								return 'Disabling'
						case ConfirmationTypes.APPROVE:
								return 'Approval';
						case ConfirmationTypes.DECLINE:
								return 'Declination';
						default:
								break;
				}

				return '';
		}

		ngOnInit() {
				this.request_failed = false;
				const confirmationData = {
						[ConfirmationActions.DECLINE_MODIFICATION]: {
								title: 'Confirm decline of modification request',
								type: ConfirmationTypes.DECLINE,
								message: 'Do you really want to decline the modification request'
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
						}
				};

				const data = confirmationData[this.action];

				if (data) {
						this.modalTitle = data.title;
						this.type = data.type;
						this.modalMessage = data.message;
				}
		}

		ngOnDestroy(): void {
				this.bsModalRef.hide();
		}


}
