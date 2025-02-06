import { Component, EventEmitter, Injectable } from '@angular/core'
import { KeyService } from 'app/api-connector/key.service'
import { BlacklistedResponse } from 'app/api-connector/response-interfaces'
import { AbstractBaseModalComponent } from 'app/shared/modal/abstract-base-modal/abstract-base-modal.component'
import { NotificationModalComponent } from 'app/shared/modal/notification-modal'
import { BsModalService } from 'ngx-bootstrap/modal'

@Injectable({ providedIn: 'root' })
@Component({
    selector: 'app-set-public-key-modal',
    templateUrl: './set-public-key-modal.component.html',
    styleUrl: './set-public-key-modal.component.scss',
    standalone: false
})
export class SetPublicKeyModalComponent extends AbstractBaseModalComponent {
	acknowledgement_given: boolean = false
	public_key: string
	validated_key: boolean = false
	blocked_key: boolean = false
	current_key_blocked: boolean = false

	constructor(
		protected modalService: BsModalService,
		private keyService: KeyService
	) {
		super(modalService)
	}
	showSetPublicKeyModal(userlogin: string): EventEmitter<void> {
		const initialState = {
			userlogin
		}

		return this.showBaseModal(SetPublicKeyModalComponent, initialState)
	}
	isKeyBlocked(): void {
		this.keyService.isBlocked(this.public_key.trim()).subscribe((res: BlacklistedResponse) => {
			this.blocked_key = res.blacklisted
		})
	}

	validateKey(): void {
		this.keyService.validateKey(this.public_key.trim()).subscribe(
			(res: any) => {
				this.validated_key = res['status'] === 'valid'
			},
			() => {
				this.validated_key = false
			}
		)
	}

	importKey(): void {
		const re: RegExp = /\+/gi

		this.keyService.postKey(this.public_key.replace(re, '%2B').trim()).subscribe({
			next: (): void => {
				this.event.emit()
				const initialState = {
					notificationModalTitle: 'Success',
					notificationModalType: 'info',
					notificationModalMessage: 'The new public key got successfully set'
				}
				this.modalService.show(NotificationModalComponent, { initialState })
			},
			error: (): any => {
				const initialState = {
					notificationModalTitle: 'Error',
					notificationModalType: 'danger',
					notificationModalMessage:
						'We were not able successfully set a new public key. Please enter a valid public key!'
				}
				this.modalService.show(NotificationModalComponent, { initialState })
			}
		})
	}
}
