import {
	Component, OnInit, OnDestroy, Input, ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { TESTIMONIAL_PAGE_LINK, CLOUD_PORTAL_SUPPORT_MAIL } from '../../../../links/links';
import { NewsService } from '../../../api-connector/news.service';
import { Application } from '../../../applications/application.model/application.model';

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
	@Input() project_application: Application;
	@Input() testimonialSent: boolean;
	image_url: string = '';
	submissionSuccessful: boolean = false;

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(private newsService: NewsService) {
		// eslint-disable-next-line no-empty-function
	}

	ngOnInit(): void {
		this.subscription = new Subscription();
		this.getTestimonialData();
	}

	getTestimonialData(): void {
		this.subscription.add(
			this.newsService
				.getTestimonial(this.project_application.project_application_id.toString())
				.subscribe((result: any): void => {
					console.log(result);
				}),
		);
	}

	printFile(event): void {
		console.log(event);
	}
	sendTestimonial(): void {
		this.testimonialSent = true;
		this.subscription.add(
			this.newsService
				.sendTestimonialDraft(
					this.title,
					this.text,
					this.excerpt,
					this.contributor,
					this.institution,
					this.workgroup,
					this.simple_vm,
					this.image_url,
					this.project_application.project_application_id.toString(),
				)
				.subscribe((result: any): any => {
					this.submissionSuccessful = result['created'];
					this.testimonialModal.show();
				}),
		);
	}

	autosaveTestimonial(): void {
		this.testimonialSent = false;
		this.subscription.add(
			this.newsService
				.autoSaveTestimonialDraft(
					`${this.title}`,
					this.text,
					this.excerpt,
					this.contributor,
					this.institution,
					this.workgroup,
					this.simple_vm,
					this.project_application.project_application_id.toString(),
				)
				.subscribe((result: any): void => {
					console.log('AUTOSAVE');
					console.log(result);
					// adjust so toast or something like that get's shown
				}),
		);
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
}
