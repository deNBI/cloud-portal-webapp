import { Component, EventEmitter, Output } from '@angular/core'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'

@Component({
    template: '',
    standalone: false
})
export abstract class AbstractBaseModalComponent {
	modalId: number | string | undefined
	@Output() event: EventEmitter<any> = new EventEmitter()
	bsModalRef: BsModalRef

	constructor(protected modalService: BsModalService) {
		this.modalService.onHidden.subscribe(() => {
			this.modalId = undefined // Reset modalId when any modal is closed
		})
	}

	async hide(): Promise<void> {
		this.modalService.hide(this.modalId)

		//Fix when calling hide and show form within a modal -- if it is called directly after another the new modal won't open
		await this.sleep(300)
	}

	private async sleep(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms))
	}

	showBaseModal(modalType: any, initialState?: any): EventEmitter<any> {
		const bsModalRef: BsModalRef = this.modalService.show(modalType, { initialState })
		this.bsModalRef = bsModalRef
		bsModalRef.setClass('modal-lg')
		this.modalId = bsModalRef.id	

		return bsModalRef.content.event
	}
}
