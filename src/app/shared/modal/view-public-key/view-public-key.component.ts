import { Component, EventEmitter, Injectable, ChangeDetectionStrategy, inject } from '@angular/core'
import { BsModalService } from 'ngx-bootstrap/modal'
import { AbstractBaseModalComponent } from '../abstract-base-modal/abstract-base-modal.component'
import { ClipboardModule } from 'ngx-clipboard'

@Injectable({
	providedIn: 'root'
})
@Component({
	selector: 'app-view-public-key',
	templateUrl: './view-public-key.component.html',
	styleUrl: './view-public-key.component.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [ClipboardModule]
})
export class ViewPublicKeyComponent extends AbstractBaseModalComponent {
	protected modalService: BsModalService

	publicKeyMemberName: string
	publicKeyToShow: string

	constructor() {
		const modalService = inject(BsModalService)

		super(modalService)

		this.modalService = modalService
	}

	showViewPublicKeyModal(publicKeyMemberName: string, publicKeyToShow: string): EventEmitter<void> {
		const initialState = {
			publicKeyMemberName,
			publicKeyToShow
		}

		return this.showBaseModal(ViewPublicKeyComponent, initialState)
	}
}
