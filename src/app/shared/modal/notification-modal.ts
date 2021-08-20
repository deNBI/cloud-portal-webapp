import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
	           selector: 'app-notification-modal',
	           templateUrl: './notification-modal.component.html',
})
export class NotificationModalComponent {

	notificationModalTitle: string;
	notificationModalType: string;
	notificationModalMessage: string;

	constructor(public bsModalRef: BsModalRef) {
		// eslint-disable-next-line no-empty-function
	}

}
