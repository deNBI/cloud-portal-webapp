/**
 * Class which models news saved in wordPress
 */
export class WordPressNews {
	private _id: string;
	private _title: string;
	private _date: string;
	private _modification_date: string;
	private _text: string;
	private _excerpt: string;
	private _tags: string;
	private _facility: string;
	private _status: string;
	private _url: string;

	constructor(news?: WordPressNews) {
		if (news) {
			this._id = news.id;
			this._title = news.title;
			this._date = news.date;
			this._text = news.text;
			this._excerpt = news.excerpt;
			this._tags = news.tags;
			this._facility = news.facility;
			this._status = news.status;
			this._modification_date = news.modification_date;
			this._url = news.url;
		}
	}

	get url(): string {
		return this._url;
	}

	set url(value: string) {
		this._url = value;
	}

	get modification_date(): string {
		return this._modification_date;
	}

	set modification_date(value: string) {
		this._modification_date = value;
	}

	get status(): string {
		return this._status;
	}

	set status(value: string) {
		this._status = value;
	}

	get id(): string {
		return this._id;
	}

	set id(value: string) {
		this._id = value;
	}

	get title(): string {
		return this._title;
	}

	set title(value: string) {
		this._title = value;
	}

	get date(): string {
		return this._date;
	}

	set date(value: string) {
		this._date = value;
	}

	get text(): string {
		return this._text;
	}

	set text(value: string) {
		this._text = value;
	}

	get excerpt(): string {
		return this._excerpt;
	}

	set excerpt(value: string) {
		this._excerpt = value;
	}

	get tags(): string {
		return this._tags;
	}

	set tags(value: string) {
		this._tags = value;
	}

	get facility(): string {
		return this._facility;
	}

	set facility(value: string) {
		this._facility = value;
	}
}
