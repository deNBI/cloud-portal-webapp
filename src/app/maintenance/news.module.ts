import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CarouselModule } from 'ngx-owl-carousel-o'
import { MaintenanceAlertComponent } from './maintenance-alert.component'
import { NewsSlideComponent } from './news-slide/news-slide.component'

/**
 * Userinfo module.
 */
@NgModule({
	imports: [CarouselModule, CommonModule],

	declarations: [MaintenanceAlertComponent, NewsSlideComponent],
	exports: [MaintenanceAlertComponent],
})
export class NewsModule {}
