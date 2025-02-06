import { Component, EventEmitter } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap/modal'

import { ApplicationsService } from '../../../api-connector/applications.service'

export enum WITHDRAWAL_TYPES {
	MODIFICATION,
	EXTENSION,
}

@Component({
    selector: 'app-withdrawl-modal',
    templateUrl: './withdraw-modal.component.html',
    providers: [ApplicationsService],
    standalone: false
})
export class WithdrawModalComponent {
	target_id: string | number
	type: WITHDRAWAL_TYPES
	event: EventEmitter<boolean> = new EventEmitter()

	constructor(
		public bsModalRef: BsModalRef,
		private projectService: ApplicationsService
	) {
		 
	}

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
