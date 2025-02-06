import { Component, Input, OnInit } from '@angular/core'
import { News } from '../news.model'
import { NgIf, DatePipe } from '@angular/common';

@Component({
    selector: 'app-news-slide',
    templateUrl: './news-slide.component.html',
    styleUrls: ['./news-slide.component.scss'],
    imports: [NgIf, DatePipe]
})
export class NewsSlideComponent implements OnInit {
	window_size: number
	@Input() news: News

	ngOnInit(): void {
		this.window_size = window.innerWidth
	}
}
