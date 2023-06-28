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
	initialTitle: string = '';
	text: string = '';
	initialText: string = '';
	excerpt: string = '';
	initialExcerpt: string = '';
	@Input() contributor: string = '';
	initialContributor: string = '';
	@Input() institution: string = '';
	initialInstitution: string = '';
	@Input() workgroup: string = '';
	initialWorkgroup: string = '';
	@Input() simple_vm: boolean = false;
	@Input() project_application: Application;
	@Input() testimonialSent: boolean;
	initialLoadingSuccessful: boolean = false;
	image_url: string = '';
	submissionSuccessful: boolean = false;
	autosaveTimer: ReturnType<typeof setTimeout>;
	autosaveTimeout: number = 120000;
	userInteractedWithForm: boolean = false;
	autoSaveInProgress: boolean = false;
	showAutosaveSucess: boolean = false;
	autosaveSuccessTimer: ReturnType<typeof setTimeout>;

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(private newsService: NewsService) {
		// eslint-disable-next-line no-empty-function
	}

	ngOnInit(): void {
		this.setInitialData();
		this.subscription = new Subscription();
		this.getTestimonialData();
	}

	setInitialData(): void {
		this.initialTitle = this.title;
		this.initialText = this.text;
		this.initialExcerpt = this.excerpt;
		this.initialContributor = this.contributor;
		this.initialInstitution = this.institution;
		this.initialWorkgroup = this.workgroup;
	}

	checkAutosaveNeed(): void {
		const initial: string[] = [
			this.initialTitle,
			this.initialText,
			this.initialExcerpt,
			this.initialContributor,
			this.initialInstitution,
			this.initialWorkgroup,
		];
		const current: string[] = [this.title, this.text, this.excerpt, this.contributor, this.institution, this.workgroup];
		let setInteractionValue: boolean = false;
		for (let i: number = 0; i < initial.length; i += 1) {
			if (initial[i] !== current[i]) {
				setInteractionValue = true;
				break;
			}
		}
		console.log(this.autosaveTimer);
		this.userInteractedWithForm = setInteractionValue;
		if (!this.autosaveTimer) {
			this.autosaveLoop();
		}
	}
	getTestimonialData(): void {
		this.subscription.add(
			this.newsService
				.getTestimonial(this.project_application.project_application_id.toString())
				.subscribe((result: any): void => {
					this.adjustFormWithSavedData(result);
					this.initialLoadingSuccessful = true;
					if (!this.project_application.project_application_testimonial_submitted) {
						this.autosaveLoop();
					}
				}),
		);
	}

	adjustFormWithSavedData(result: any): void {
		this.title = result['title'];
		this.text = result['testimonials_text'];
		this.excerpt = result['excerpt'];
		this.institution = result['institution'];
		this.workgroup = result['workgroup'];
		this.contributor = result['contributor'];
	}

	stopAutosaveTimer(): void {
		if (this.autosaveTimer) {
			clearTimeout(this.autosaveTimer);
		}
	}

	stopAutosaveSuccessTimer(): void {
		if (this.autosaveSuccessTimer) {
			clearTimeout(this.autosaveSuccessTimer);
		}
	}

	startDisappearTimer(): void {
		this.autosaveSuccessTimer = setTimeout((): void => {
			this.showAutosaveSucess = false;
		}, 5000);
	}

	autosaveLoop(timeout: number = this.autosaveTimeout): void {
		this.stopAutosaveTimer();
		this.autosaveTimer = setTimeout((): void => {
			if (this.userInteractedWithForm) {
				this.autoSaveInProgress = true;
				this.showAutosaveSucess = false;
				this.stopAutosaveSuccessTimer();
				this.subscription.add(
					this.newsService
						.autoSaveTestimonialDraft(
							this.title,
							this.text,
							this.excerpt,
							this.contributor,
							this.institution,
							this.workgroup,
							this.simple_vm,
							this.project_application.project_application_id.toString(),
						)
						.subscribe((): void => {
							this.autoSaveInProgress = false;
							this.showAutosaveSucess = true;
							this.startDisappearTimer();
						}),
				);
			}
			this.autosaveLoop();
		}, timeout);
	}

	printFile(event): void {
		console.log(event);
	}
	sendTestimonial(): void {
		this.testimonialSent = true;
		this.subscription.add(
			this.newsService
				.sendTestimonialDraft(
					`${this.title} FINAL`,
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
					this.project_application.project_application_testimonial_submitted = true;
					this.stopAutosaveTimer();
					this.testimonialModal.show();
				}),
		);
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
}
