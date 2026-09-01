import { Component, EventEmitter, ChangeDetectionStrategy, inject } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap/modal'

import { ApplicationsService } from '../../../api-connector/applications.service'

export enum WITHDRAWAL_TYPES {
	MODIFICATION,
	EXTENSION,
}

@Component({
	selector: 'app-withdrawl-modal',
	templateUrl: './withdraw-modal.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	providers: [ApplicationsService]
})
export class WithdrawModalComponent {
	bsModalRef = inject(BsModalRef)
	private projectService = inject(ApplicationsService)

	target_id: string | number
	type: WITHDRAWAL_TYPES
	event: EventEmitter<boolean> = new EventEmitter()

	withdrawTarget() {
		switch (this.type) {
			case WITHDRAWAL_TYPES.EXTENSION:
				this.projectService.withdrawExtensionRequest(this.target_id).subscribe(() => {
					this.bsModalRef.hide()
					this.event.emit(true)
				})
				break
			case WITHDRAWAL_TYPES.MODIFICATION:
				this.projectService.withdrawModificationRequest(this.target_id).subscribe(() => {
					this.bsModalRef.hide()
					this.event.emit(true)
				})
				break
			default:
				this.event.emit(false)
		}
	}

	protected readonly WITHDRAWAL_TYPES = WITHDRAWAL_TYPES
}
