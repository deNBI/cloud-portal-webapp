export class FacilityNews {
	private _id;
	private _title: string;
	private _date: string;
	private _text: string;
	private _motd: string;
	private _tags: string[];
	private _facility: number;

	constructor(news?: FacilityNews) {
		if (news) {
			this._id = news.id;
			this._title = news.title;
			this._date = news.date;
			this._text = news.text;
			this._motd = news.motd;
			this._tags = news.tags;
			this._facility = news.facility;
		}
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

	get motd(): string {
		return this._motd;
	}

	set motd(value: string) {
		this._motd = value;
	}

	get tags(): string[] {
		return this._tags;
	}

	set tags(value: string[]) {
		this._tags = value;
	}

	get facility(): number {
		return this._facility;
	}

	set facility(value: number) {
		this._facility = value;
	}
}
