import { Pipe, PipeTransform } from '@angular/core'
import { FacilityNews } from 'app/facility_manager/newsmanagement/facility-news'

@Pipe({
    name: 'newsValid',
    pure: false,
    standalone: false
})
export class NewsValidationPipe implements PipeTransform {
	transform(news: FacilityNews): boolean {
		if (news.motd?.length < 15) return false

		return news.title?.length >= 5 && news.text?.length >= 25
	}
}

@Pipe({
    name: 'newsTitleValid',
    pure: false,
    standalone: false
})
export class NewsTitleValidationPipe implements PipeTransform {
	transform(news: FacilityNews): boolean {
		return news.title?.length >= 5
	}
}

@Pipe({
    name: 'newsTextValid',
    pure: false,
    standalone: false
})
export class NewsTextValidationPipe implements PipeTransform {
	transform(news: FacilityNews): boolean {
		return news.text?.length >= 25
	}
}

@Pipe({
    name: 'newsMOTDValid',
    pure: false,
    standalone: false
})
export class NewsMOTDValidationPipe implements PipeTransform {
	transform(news: FacilityNews): boolean {
		return news.motd?.length >= 15
	}
}
