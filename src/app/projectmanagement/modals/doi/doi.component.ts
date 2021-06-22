import {
	Component, EventEmitter, OnDestroy, OnInit,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { WIKI_PUBLICATIONS } from '../../../../links/links';
import { Doi } from '../../../applications/doi/doi';
import { GroupService } from '../../../api-connector/group.service';

@Component({
	selector: 'app-doi',
	templateUrl: './doi.component.html',
	styleUrls: ['./doi.component.scss'],
	providers: [GroupService],
})
export class DoiComponent implements OnInit, OnDestroy {

	WIKI_PUBLICATIONS: string = WIKI_PUBLICATIONS;

	newDoi: string;
	doiError: string;
	dois: Doi[];
	application_id: string | number;

	doiQuestionModal: boolean = true;
	doiModal: boolean = false;

	private subscription: Subscription = new Subscription();
	public event: EventEmitter<any> = new EventEmitter();

	constructor(
		public bsModalRef: BsModalRef,
		private groupService: GroupService,
	) {
		// eslint-disable-next-line no-empty-function
	}

	ngOnInit(): void {
	}

	ngOnDestroy() {
		if (this.doiQuestionModal) {
			this.event.emit({ newDoi: false });
		}
	}

	isNewDoi(): boolean {
		for (const doi of this.dois) {
			if (doi.identifier === this.newDoi) {
				return false;
			}
		}

		return true;
	}

	addDoi(): void {
		this.document.getElementById('add_doi_btn').toggleAttribute('disabled');
		this.document.getElementById('doi_input_field').toggleAttribute('disabled');
		if (this.isNewDoi()) {
			this.groupService.addGroupDoi(this.application_id, this.newDoi).subscribe(
				(dois: Doi[]): void => {
					this.doiError = null;
					this.newDoi = null;
					this.dois = dois;
				},
				(): void => {
					this.doiError = `DOI ${this.newDoi} was already added by another Project!`;
					this.document.getElementById('add_doi_btn').toggleAttribute('disabled');
					this.document.getElementById('doi_input_field').toggleAttribute('disabled');
				},
				(): void => {
					this.document.getElementById('add_doi_btn').toggleAttribute('disabled');
					this.document.getElementById('doi_input_field').toggleAttribute('disabled');
					this.newDoi = null;
				},
			);
		} else {
			this.doiError = `DOI ${this.newDoi} was already added by this Project!`;
			this.newDoi = null;
			this.document.getElementById('add_doi_btn').toggleAttribute('disabled');
			this.document.getElementById('doi_input_field').toggleAttribute('disabled');
		}
	}

	deleteDoi(doi: Doi): void {
		this.groupService.deleteGroupDoi(doi.id).subscribe((dois: Doi[]): void => {
			this.dois = dois;
			this.event.emit({ deletedDoi: true });
		});
	}

	setDoiModalState(): void {
		this.doiQuestionModal = false;
		this.doiModal = true;
	}

}
