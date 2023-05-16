import {
	Component, OnInit, OnDestroy, Input,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { TESTIMONIAL_PAGE_LINK } from '../../../../links/links';
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

	@Input() title: string = '';
	text: string = '';
	excerpt: string = '';
	@Input() contributor: string = '';
	@Input() institution: string = '';
	@Input() workgroup: string = '';
	@Input() simple_vm: boolean = false;
	photography: any = null;

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(private newsService: NewsService) {
		// eslint-disable-next-line no-empty-function
	}

	ngOnInit(): void {
		this.subscription = new Subscription();
	}

	sendTestimonial(): void {
		this.send_testimonial_test();
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
					this.photography,
				)
				.subscribe((): any => {
					console.log('yep');
				}),
		);
	}

	send_testimonial_test(): void {
		const dct: any = {
			txt: this.text,
			exc: this.excerpt,
			con: this.contributor,
			inst: this.institution,
			wkg: this.workgroup,
			svm: this.simple_vm,
			phot: this.photography,
		};
		console.log(dct);
	}
	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
}
