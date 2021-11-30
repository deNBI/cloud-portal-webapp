import {
	Component, OnInit, OnDestroy, Input,
} from '@angular/core';
import { Subscription } from 'rxjs';
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

	get_news(): void {}

}
