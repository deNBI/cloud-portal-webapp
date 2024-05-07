import {
	Component, EventEmitter, Injectable, OnInit, Output,
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Application } from '../../../applications/application.model/application.model';
import { ApplicationLifetimeExtension } from '../../../applications/application_extension.model';

import { ApplicationsService } from '../../../api-connector/applications.service';

@Injectable({ providedIn: 'root' })
@Component({
	selector: 'app-adjust-lifetime-request',
	templateUrl: './adjust-lifetime-request.component.html',
	providers: [ApplicationsService],
})
export class AdjustLifetimeRequestComponent implements OnInit {
	bsModalRef = BsModalRef;
	modalId: number | string | undefined;
	loaded: boolean = false;

	application: Application;
	adjustedApplicationLifetimeExtension: ApplicationLifetimeExtension;
		@Output() eventSuccess: EventEmitter<boolean> = new EventEmitter();

		constructor(
				private modalService: BsModalService,
				private applicationsService: ApplicationsService,
		) {
		}

		ngOnInit() {
			this.loaded = false;
			this.adjustedApplicationLifetimeExtension = new ApplicationLifetimeExtension(this.application.project_lifetime_request);
			this.loaded = true;
		}

		hide(): void {

			this.modalService.hide(this.modalId);
		}

		showAdjustLifetimeExtensionModal(application: Application): EventEmitter<boolean> {
			const initialState = {
				application,
			};
			const bsModalRef: BsModalRef = this.modalService.show(AdjustLifetimeRequestComponent, { initialState });
			bsModalRef.setClass('modal-lg');
			this.modalId = bsModalRef.id;

			return bsModalRef.content.eventSuccess;
		}

		adjustLifetimeExtension(): void {
			this.loaded = false;
			this.applicationsService.adjustLifetimeExtension(this.adjustedApplicationLifetimeExtension).subscribe((): void => {
				this.eventSuccess.emit(true);
				this.hide();

			}, (): void => {
				this.eventSuccess.emit(false);
				this.hide();

			});
		}

}
