export class News {
	id: number;
	title: string;
	date: string;
	full_text: string;
	short_text: string;
	url: string;

	constructor(news?: Partial<News>) {
		Object.assign(this, news);
	}
}
