import { Component, EventEmitter, Injectable } from '@angular/core'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { AbstractBaseModalComponent } from '../abstract-base-modal/abstract-base-modal.component'

@Injectable({
	providedIn: 'root'
})
@Component({
	selector: 'app-view-public-key',
	templateUrl: './view-public-key.component.html',
	styleUrl: './view-public-key.component.scss'
})
export class ViewPublicKeyComponent extends AbstractBaseModalComponent {
	publicKeyMemberName: string
	publicKeyToShow: string

	constructor(
		protected bsModalRef: BsModalRef,
		protected modalService: BsModalService
	) {
		super(bsModalRef, modalService)
	}

	showViewPublicKeyModal(publicKeyMemberName: string, publicKeyToShow: string): EventEmitter<void> {
		const initialState = {
			publicKeyMemberName,
			publicKeyToShow
		}
		console.log('show 2 public')

		return this.showBaseModal(ViewPublicKeyComponent, initialState)
	}
}
