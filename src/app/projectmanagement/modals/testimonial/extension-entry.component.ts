import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { TESTIMONIAL_PAGE_LINK, WIKI_PUBLICATIONS } from '../../../../links/links';
import { Doi } from '../../../applications/doi/doi';
import { GroupService } from '../../../api-connector/group.service';

@Component({
	selector: 'app-extension-entry',
	templateUrl: './extension-entry.component.html',
	styleUrls: ['./extension-entry.component.scss'],
	providers: [GroupService],
})
export class ExtensionEntryComponent implements OnDestroy {
	private subscription: Subscription = new Subscription();
	public event: EventEmitter<any> = new EventEmitter();
	TESTIMONIAL_PAGE_LINK = TESTIMONIAL_PAGE_LINK;

	WIKI_PUBLICATIONS: string = WIKI_PUBLICATIONS;

	newDoi: string;
	doiError: string;
	dois: Doi[];
	application_id: string | number;
	disableInput: boolean = false;

	constructor(public bsModalRef: BsModalRef, private groupService: GroupService) {
		// eslint-disable-next-line no-empty-function
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
		this.event.emit({ reloadDoi: false, showExtension: true });
	}

	isNewDoi(): boolean {
		for (const doi of this.dois) {
			if (doi.identifier === this.newDoi) {
				return false;
			}
		}

		return true;
	}

	toggleDisabledInput(): void {
		this.disableInput = !this.disableInput;
	}

	addDoi(): void {
		this.toggleDisabledInput();
		if (this.isNewDoi()) {
			this.subscription.add(
				this.groupService.addGroupDoi(this.application_id, this.newDoi).subscribe(
					(dois: Doi[]): void => {
						this.doiError = null;
						this.newDoi = null;
						this.dois = dois;
						this.event.emit({ reloadDoi: true });
					},
					(): void => {
						this.doiError = `DOI ${this.newDoi} was already added by another Project!`;
						this.toggleDisabledInput();
					},
					(): void => {
						this.toggleDisabledInput();
						this.newDoi = null;
					},
				),
			);
		} else {
			this.doiError = `DOI ${this.newDoi} was already added by this Project!`;
			this.newDoi = null;
			this.toggleDisabledInput();
		}
	}

	deleteDoi(doi: Doi): void {
		this.subscription.add(
			this.groupService.deleteGroupDoi(doi.id).subscribe((dois: Doi[]): void => {
				this.dois = dois;
				this.event.emit({ reloadDoi: true });
			}),
		);
	}
}
