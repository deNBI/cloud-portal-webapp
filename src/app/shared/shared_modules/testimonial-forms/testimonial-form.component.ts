import {
	Component, OnInit, OnDestroy, Input, ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { TESTIMONIAL_PAGE_LINK, CLOUD_PORTAL_SUPPORT_MAIL } from '../../../../links/links';
import { NewsService } from '../../../api-connector/news.service';

@Component({
	selector: 'app-testimonial-form',
	templateUrl: './testimonial-form.component.html',
	styleUrls: ['./testimonial-form.component.scss'],
	providers: [NewsService],
})
export class TestimonialFormComponent implements OnInit, OnDestroy {
	subscription: Subscription = new Subscription();

	TESTIMONIAL_PAGE_LINK: string = TESTIMONIAL_PAGE_LINK;
	CLOUD_PORTAL_SUPPORT_MAIL: string = CLOUD_PORTAL_SUPPORT_MAIL;
	@ViewChild('testimonialModal') testimonialModal: ModalDirective;
	@ViewChild(NgForm, { static: false }) testimonialForm: NgForm;

	@Input() title: string = '';
	text: string = '';
	excerpt: string = '';
	@Input() contributor: string = '';
	@Input() institution: string = '';
	@Input() workgroup: string = '';
	@Input() simple_vm: boolean = false;
	@Input() project_application_id: string;
	@Input() testimonialSent: boolean;
	image_url: string = '';
	submissionSuccessful: boolean = false;

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(private newsService: NewsService) {
		// eslint-disable-next-line no-empty-function
	}

	ngOnInit(): void {
		this.subscription = new Subscription();
	}
	sendTestimonial(): void {
		this.testimonialSent = true;
		this.subscription.add(
			this.newsService
				.sendTestimonialDraft(
					`${this.title} DRAFT`,
					this.text,
					this.excerpt,
					this.contributor,
					this.institution,
					this.workgroup,
					this.simple_vm,
					this.image_url,
					this.project_application_id,
				)
				.subscribe((result: any): any => {
					this.submissionSuccessful = result['created'];
					this.testimonialModal.show();
				}),
		);
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
}
