import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotificationModalComponent } from '../../modal/notification-modal';

export class SharedModal {

	/**
	 * Modal reference to be changed/showed/hidden depending on chosen modal.
	 */
	bsModalRef: BsModalRef;

	constructor(protected modalService: BsModalService) {
		// eslint-disable-next-line no-empty-function
	}

	hideCurrentModal() {
		if (this.bsModalRef) {
			this.modalService.hide(this.bsModalRef.id);
		}
	}

	showNotificationModal(
		notificationModalTitle: string,
	                      notificationModalMessage: string,
	                      notificationModalType: string,
	) {
		this.hideCurrentModal();

		const initialState = { notificationModalTitle, notificationModalType, notificationModalMessage };

		this.bsModalRef = this.modalService.show(NotificationModalComponent, { initialState });
		this.bsModalRef.setClass('modal-lg');
	}
}
