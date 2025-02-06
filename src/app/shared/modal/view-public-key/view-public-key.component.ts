import { Component, EventEmitter, Injectable } from '@angular/core'
import { BsModalService } from 'ngx-bootstrap/modal'
import { AbstractBaseModalComponent } from '../abstract-base-modal/abstract-base-modal.component'

@Injectable({
	providedIn: 'root'
})
@Component({
    selector: 'app-view-public-key',
    templateUrl: './view-public-key.component.html',
    styleUrl: './view-public-key.component.scss',
    standalone: false
})
export class ViewPublicKeyComponent extends AbstractBaseModalComponent {
	publicKeyMemberName: string
	publicKeyToShow: string

	constructor(protected modalService: BsModalService) {
		super(modalService)
	}

	showViewPublicKeyModal(publicKeyMemberName: string, publicKeyToShow: string): EventEmitter<void> {
		const initialState = {
			publicKeyMemberName,
			publicKeyToShow
		}

		return this.showBaseModal(ViewPublicKeyComponent, initialState)
	}
}
