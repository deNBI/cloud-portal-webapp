import {
	Component, EventEmitter, Injectable, OnDestroy, OnInit, Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Application } from '../../../applications/application.model/application.model';
import { ApplicationLifetimeExtension } from '../../../applications/application_extension.model';
import { CreditsService } from '../../../api-connector/credits.service';
import { EdamOntologyTerm } from '../../../applications/edam-ontology-term';
import { ResultComponent } from '../result/result.component';
import { ApplicationsService } from '../../../api-connector/applications.service';
import { AbstractBaseClass } from '../../../shared/shared_modules/baseClass/abstract-base-class';
import { NotificationModalComponent } from '../../../shared/modal/notification-modal';

@Injectable({ providedIn: 'root' })
@Component({
	selector: 'app-adjust-lifetime-request',
	templateUrl: './adjust-lifetime-request.component.html',
	providers: [ApplicationsService],
})
export class AdjustLifetimeRequestComponent {
	bsModalRef = BsModalRef;
	modalId: number | string | undefined;

	application: Application;
		@Output() onConfirmation: EventEmitter<boolean> = new EventEmitter();

		constructor(
				private modalService: BsModalService,
				private applicationsService: ApplicationsService,
		) {
		}

		hide(): void {
			this.onConfirmation.emit(false);

			this.modalService.hide(this.modalId);
		}

		showAdjustLifetimeExtensionModal(application: Application): EventEmitter<boolean> {
			const initialState = {
				application,
			};
			const bsModalRef: BsModalRef = this.modalService.show(AdjustLifetimeRequestComponent, { initialState });
			bsModalRef.setClass('modal-lg');
			this.modalId = bsModalRef.id;

			return bsModalRef.content.onConfirmation;
		}

		adjustLifetimeExtension(): void {
			this.applicationsService.adjustLifetimeExtension(this.application.project_lifetime_request).subscribe(
				(): void => {
					this.onConfirmation.emit(true);

				},
			);
		}

}
