import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NewsComponent } from './news.component';
import { NewsSlideComponent } from './news-slide/news-slide.component';

/**
 * Userinfo module.
 */
@NgModule({
	imports: [
		CarouselModule,
		CommonModule,
	],

	declarations: [
		NewsComponent,
		NewsSlideComponent,
	],
	exports: [NewsComponent],
})
export class NewsModule {
}
