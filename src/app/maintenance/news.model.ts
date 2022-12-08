import { ApiSettings } from '../api-connector/api-settings.service'

export class News {
	id: number
	title: string
	date: string
	full_text: string
	short_text: string
	url: string
	preview_image: string
	horizontal: boolean
	pinned: boolean
	object_fit: string = 'cover'

	constructor(news?: Partial<News>) {
		Object.assign(this, news)
		if (this.preview_image) {
			this.preview_image =
				ApiSettings.getWagtailBase().substring(0, ApiSettings.getWagtailBase().length - 1) + this.preview_image
		}
	}
}
