import { Component, Injectable, OnDestroy } from '@angular/core'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { Router } from '@angular/router'

@Injectable({ providedIn: 'root' })
@Component({
	selector: 'app-notification-modal',
	templateUrl: './notification-modal.component.html'
})
export class NotificationModalComponent implements OnDestroy {
	notificationModalTitle: string
	notificationModalType: string
	notificationModalMessage: string
	routerRedirectString: string
	modalId: number | string | undefined

	hide(): void {
		this.modalService.hide(this.modalId)
	}

	constructor(
		private router: Router,
		private modalService: BsModalService
	) {
		 
	}

	showNotificationModal(
		notificationModalTitle: string,
		notificationModalMessage: string,
		notificationModalType: string,
		routerRedirectString?: string
	): void {
		const initialState = {
			notificationModalTitle,
			notificationModalType,
			notificationModalMessage,
			routerRedirectString
		}
		const bsModalRef: BsModalRef = this.modalService.show(NotificationModalComponent, { initialState })
		bsModalRef.setClass('modal-lg')
		this.modalId = bsModalRef.id
	}

	showSuccessFullNotificationModal(
		notificationModalTitle: string,
		notificationModalMessage: string,
		routerRedirectString?: string
	): void {
		this.showNotificationModal(notificationModalTitle, notificationModalMessage, 'success', routerRedirectString)
	}

	showDangerNotificationModal(
		notificationModalTitle: string,
		notificationModalMessage: string,
		routerRedirectString?: string
	): void {
		this.showNotificationModal(notificationModalTitle, notificationModalMessage, 'danger', routerRedirectString)
	}

	showWarningNotificationModal(
		notificationModalTitle: string,
		notificationModalMessage: string,
		routerRedirectString?: string
	): void {
		this.showNotificationModal(notificationModalTitle, notificationModalMessage, 'warning', routerRedirectString)
	}

	showInfoNotificationModal(
		notificationModalTitle: string,
		notificationModalMessage: string,
		routerRedirectString?: string
	): void {
		this.showNotificationModal(notificationModalTitle, notificationModalMessage, 'info', routerRedirectString)
	}

	ngOnDestroy(): void {
		if (this.routerRedirectString) {
			void this.router.navigateByUrl(this.routerRedirectString)
		}
	}
}
