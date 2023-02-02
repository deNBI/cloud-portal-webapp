import {
	Component, EventEmitter, OnDestroy, OnInit,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Application } from '../../applications/application.model/application.model';

@Component({
	selector: 'app-confirmation-modal',
	templateUrl: './confirmation-modal.component.html',
	providers: [],
})
export class ConfirmationModalComponent implements OnDestroy, OnInit {
	application: Application = null;
	modalTitle: string = '';
	modalMessage: string = '';
	application_center: string = '';
	action: string = '';
	type: string = '';
	request_failed: boolean = false;
	public event: EventEmitter<any> = new EventEmitter<any>();

	constructor(public bsModalRef: BsModalRef) {
		// eslint-disable-next-line no-empty-function
	}

	confirmAction(): void {
		switch (this.action) {
			case 'declineModification':
				this.event.emit({
					action: 'confirmModificationDecline',
					application: this.application,
				});
				break;
			case 'declineExtension':
				this.event.emit({
					action: 'confirmExtensionDecline',
					application: this.application,
				});
				break;
			case 'declineCredits':
				this.event.emit({
					action: 'confirmCreditsDecline',
					application: this.application,
				});
				break;
			case 'declineApplication':
				this.event.emit({
					action: 'confirmApplicationDecline',
					application: this.application,
				});
				break;
			case 'approveModification':
				this.event.emit({
					action: 'confirmModificationApproval',
					application: this.application,
				});
				break;
			case 'approveExtension':
				this.event.emit({
					action: 'confirmExtensionApproval',
					application: this.application,
				});
				break;
			case 'approveCredits':
				this.event.emit({
					action: 'confirmCreditsApproval',
					application: this.application,
				});
				break;
			case 'approveApplication':
				this.event.emit({
					action: 'confirmApplicationApproval',
					application: this.application,
					selectedCenter: this.application_center,
				});
				break;

			default:
				this.request_failed = true;
				break;
		}
	}

	sendClosed(): void {
		this.event.emit({
			closed: true,
		});
	}

	buttonText(): string {
		switch (this.type) {
			case 'Approve':
				return 'Approval';
			case 'Decline':
				return 'Declination';
			default:
				break;
		}

		return '';
	}

	ngOnInit() {
		this.request_failed = false;
		switch (this.action) {
			case 'declineModification':
				this.modalTitle = 'Confirm decline of modification request';
				this.type = 'Decline';
				this.modalMessage = 'Do you really want to decline the modification request';
				break;
			case 'declineExtension':
				this.modalTitle = 'Confirm decline of extension request';
				this.type = 'Decline';
				this.modalMessage = 'Do you really want to decline the extension request';
				break;
			case 'declineCredits':
				this.modalTitle = 'Confirm decline of credit request';
				this.type = 'Decline';
				this.modalMessage = 'Do you really want to decline the credit request';
				break;
			case 'declineApplication':
				this.modalTitle = 'Confirm approval of application';
				this.type = 'Decline';
				this.modalMessage = 'Do you really want to decline the application';
				break;
			case 'approveModification':
				this.modalTitle = 'Confirm approval of modification request';
				this.type = 'Approve';
				this.modalMessage = 'Do you really want to approve the modification request';
				break;
			case 'approveExtension':
				this.modalTitle = 'Confirm the approval of the extension request';
				this.type = 'Approve';
				this.modalMessage = 'Do you really want to approve the extension request';
				break;
			case 'approveCredits':
				this.modalTitle = 'Confirm approval of credits request';
				this.type = 'Approve';
				this.modalMessage = 'Do you really want to decline the credit request';
				break;
			case 'approveApplication':
				this.modalTitle = 'Confirm approval of application';
				this.type = 'Approve';
				this.modalMessage = 'Do you really want to approve the application';
				break;
			default:
				break;
		}
	}

	ngOnDestroy(): void {
		this.bsModalRef.hide();
	}
}
