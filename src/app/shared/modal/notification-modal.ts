import { Component, Injectable, OnDestroy } from '@angular/core'
import { BsModalService } from 'ngx-bootstrap/modal'
import { Router } from '@angular/router'
import { AbstractBaseModalComponent } from './abstract-base-modal/abstract-base-modal.component'

@Injectable({ providedIn: 'root' })
@Component({
    selector: 'app-notification-modal',
    templateUrl: './notification-modal.component.html',
    standalone: false
})
export class NotificationModalComponent extends AbstractBaseModalComponent implements OnDestroy {
	notificationModalTitle: string
	notificationModalType: string
	notificationModalMessage: string
	routerRedirectString: string

	constructor(
		protected modalService: BsModalService,
		private router: Router
	) {
		super(modalService)
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
		console.log('Show notification')

		this.showBaseModal(NotificationModalComponent, initialState)
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
