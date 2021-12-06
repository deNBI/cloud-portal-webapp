import {
	Component, OnInit, OnDestroy, Input,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NewsService } from '../api-connector/news.service';
import { News } from './news.model';

@Component({
	selector: 'app-news',
	templateUrl: './news.component.html',
	styleUrls: ['./news.component.scss'],
	providers: [NewsService],
})
export class NewsComponent implements OnInit, OnDestroy {

	@Input() tags: string[] = [];
	@Input() facility: number = -1;
	@Input() cards_per_page: number = 3;
	@Input() max_news_amount: number = 6;
	subscription: Subscription = new Subscription();
	news: News[] = [];
	news_loaded: boolean = false;
	error_on_loading: boolean = false;
	error_message: string = 'No News to display.';
	custom_options: OwlOptions = {
		rewind: true,
		autoplay: true,
		margin: 10,
		autoplayTimeout: 10000,
		autoplaySpeed: 1000,
		autoplayHoverPause: true,
		autoplayMouseleaveTimeout: 5000,
		mouseDrag: false,
		touchDrag: false,
		pullDrag: false,
		dots: true,
		navSpeed: 700,
		navText: ['<i class=\'fa fa-chevron-left\'></i>',
			'<i class=\'fa fa-chevron-right\'></i>'],
		responsive: {
			0: {
				items: 1,
			},
			550: {
				items: 2,

			},
			800: {
				items: 3,
			},
			1200: {
				items: 4,
			},
		},
		nav: true,
	};

	constructor(private news_service: NewsService) {
		// eslint-disable-next-line no-empty-function
	}

	ngOnInit(): void {
		this.subscription = new Subscription();
		this.get_news();
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	get_news(): void {
		this.subscription.add(
			this.news_service.getNewsByTags(this.max_news_amount, this.tags).subscribe(
				(news: News[]) => {
					console.log('also login from component');
					console.log(news);
					this.news = news;
					this.news_loaded = true;
				},
				(error: any) => {
					console.log('log from compoentn');
					console.log(error);
					this.news_loaded = true;
					this.error_on_loading = true;
				},
			),
		);
	}

}
