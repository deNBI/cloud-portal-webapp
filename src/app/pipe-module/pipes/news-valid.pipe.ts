import { Pipe, PipeTransform } from '@angular/core'
import { FacilityNews } from 'app/facility_manager/newsmanagement/facility-news'

@Pipe({
	name: 'newsValid'
})
export class NewsValidationPipe implements PipeTransform {
	transform(news: FacilityNews): boolean {
		if (news.is_current_motd) {
			if (news.motd?.length < 10) return false
		}

		return news.title?.length > 5 && news.text?.length > 30
	}
}
