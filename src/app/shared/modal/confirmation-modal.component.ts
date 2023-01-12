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
	action: string = '';
	request_failed: boolean = false;
	public event: EventEmitter<any> = new EventEmitter<any>();

	constructor(public bsModalRef: BsModalRef) {
		// eslint-disable-next-line no-empty-function
	}

	confirmDecline(): void {
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

	ngOnInit() {
		this.request_failed = false;
		switch (this.action) {
			case 'declineModification':
				this.modalTitle = 'Confirm decline of modification request';
				this.modalMessage = 'Do you really want to decline the modification request';
				break;
			case 'declineExtension':
				this.modalTitle = 'Confirm decline of extension request';
				this.modalMessage = 'Do you really want to decline the extension request';
				break;
			case 'declineCredits':
				this.modalTitle = 'Confirm decline of credit request';
				this.modalMessage = 'Do you really want to decline the credit request';
				break;
			default:
				break;
		}
	}

	ngOnDestroy(): void {
		this.bsModalRef.hide();
	}
}
