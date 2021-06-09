import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ApplicationModification } from '../../../applications/application_modification.model';
import { ResultComponent } from '../result/result.component';

@Component({
	selector: 'app-modification-request',
	templateUrl: './modification-request.component.html',
	styleUrls: ['./modification-request.component.scss'],
})
export class ModificationRequestComponent implements OnInit {

	old_project_modification: ApplicationModification;
	project_modification: ApplicationModification;

	constructor(
		public bsModalRef: BsModalRef,
		private modalService: BsModalService,
		// eslint-disable-next-line no-empty-function
	) {}

	ngOnInit(): void {
		console.log(this.project_modification);
	}

	showSubmitModal(): void {
		this.modalService.show(ResultComponent);
	}

}
