export class News {
	id;
	title: string;
	posted_at: string;
	text: string;
	tags: string[];
	facility: number;
	link: string;

	constructor(news?: Partial<News>) {
		Object.assign(this, news);
	}
}
