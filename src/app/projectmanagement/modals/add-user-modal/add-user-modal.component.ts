import { Component, EventEmitter, Injectable } from '@angular/core'
import { CLOUD_PORTAL_REGISTER_LINK, WIKI_MEMBER_MANAGEMENT } from '../../../../links/links'
import { BsModalService } from 'ngx-bootstrap/modal'
import { AbstractBaseModalComponent } from '../../../shared/modal/abstract-base-modal/abstract-base-modal.component'
import { Application } from '../../../applications/application.model/application.model'
import { ClipboardModule } from 'ngx-clipboard';

@Injectable({
	providedIn: 'root'
})
@Component({
    selector: 'app-add-user-modal',
    templateUrl: './add-user-modal.component.html',
    styleUrl: './add-user-modal.component.scss',
    imports: [ClipboardModule]
})
export class AddUserModalComponent extends AbstractBaseModalComponent {
	invitation_link: string
	application: Application

	constructor(protected modalService: BsModalService) {
		super(modalService)
	}

	showAddUserModalComponent(application: Application, invitation_link: string): EventEmitter<boolean> {
		const initialState = {
			invitation_link,
			application
		}

		return this.showBaseModal(AddUserModalComponent, initialState)
	}

	protected readonly CLOUD_PORTAL_REGISTER_LINK = CLOUD_PORTAL_REGISTER_LINK
	protected readonly WIKI_MEMBER_MANAGEMENT = WIKI_MEMBER_MANAGEMENT
}
