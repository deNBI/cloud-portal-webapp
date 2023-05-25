import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { TESTIMONIAL_PAGE_LINK } from '../../../../links/links';

@Component({
	selector: 'app-testimonial-information',
	templateUrl: './testimonial-modal.component.html',
	styleUrls: ['./testimonial-modal.component.scss'],
	providers: [],
})
export class TestimonialModalComponent implements OnDestroy {
	private subscription: Subscription = new Subscription();
	public event: EventEmitter<any> = new EventEmitter();
	TESTIMONIAL_PAGE_LINK = TESTIMONIAL_PAGE_LINK;

	constructor(public bsModalRef: BsModalRef) {
		// eslint-disable-next-line no-empty-function
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.event.emit();
	}
}
