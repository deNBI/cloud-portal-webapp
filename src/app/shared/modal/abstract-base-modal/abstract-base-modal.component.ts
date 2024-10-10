import { Component, EventEmitter, Output } from '@angular/core'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'

@Component({ template: '' })
export abstract class AbstractBaseModalComponent {
	modalId: number | string | undefined
	@Output() event: EventEmitter<any> = new EventEmitter()

	constructor(
		protected bsModalRef: BsModalRef,
		protected modalService: BsModalService
	) {}

	hide(): void {
		this.modalService.hide(this.modalId)
	}

	showBaseModal(modalType: any, initialState?: any): EventEmitter<any> {
		const bsModalRef: BsModalRef = this.modalService.show(modalType, { initialState })

		bsModalRef.setClass('modal-lg')
		this.modalId = bsModalRef.id

		return bsModalRef.content.event
	}
}
