/**
 * Class which models news saved in wordPress
 */
export class WordPressNews {
  private _id: string;
  private _title: string;
  private _time: string;
  private _text: string;
  private _excerpt: string;
  private _tags: string [] = [];
  private _facility: number[] = [];
  private _status: string;

  constructor(news?: WordPressNews) {
    if (news) {
      this._id = news.id;
      this._title = news.title;
      this._time = news.time;
      this._text = news.text;
      this._excerpt = news.excerpt;
      this._tags = news.tags;
      this._facility = news.facility;
      this._status = news.status;
    }
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

  get time(): string {
    return this._time;
  }

  set time(value: string) {
    this._time = value;
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

  get tags(): string[] {
    return this._tags;
  }

  set tags(value: string[]) {
    this._tags = value;
  }

  get facility(): number[] {
    return this._facility;
  }

  set facility(value: number[]) {
    this._facility = value;
  }
}
