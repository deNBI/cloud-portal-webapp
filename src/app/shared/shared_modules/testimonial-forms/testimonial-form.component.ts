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
	formData: FormData = new FormData();

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
				)
				.subscribe((): any => {
					this.newsService.sendTestimonialDraftPicture(this.formData, '123').subscribe();
				}),
		);
	}

	printPhoto(event): void {
		const fileList: FileList = event.target.files;
		console.log(event);
		if (fileList.length < 1) {
			return;
		}

		const file: File = fileList[0];
		console.log(file);

		this.formData.append('uploadFile', file);
		this.newsService.sendTestimonialDraftPicture(this.formData, '123').subscribe((): void => {
			console.log('test');
		});

		/* let headers = new Headers();
			 In Angular 5, including the header Content-Type can invalidate your request
			headers.append('Content-Type', 'multipart/form-data');
			headers.append('Accept', 'application/json'); */

		// let options = new RequestOptions({ headers: headers });

		/* this.http.post(`${this.apiEndPoint}`, formData, options)
				.map(res => res.json())
				.catch(error => Observable.throw(error))
				.subscribe(
					data => console.log('success'),
					error => console.log(error)
				); */
	}

	send_testimonial_test(): void {
		const dct: any = {
			txt: this.text,
			exc: this.excerpt,
			con: this.contributor,
			inst: this.institution,
			wkg: this.workgroup,
			svm: this.simple_vm,
		};
		console.log(dct);
	}
	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
}
