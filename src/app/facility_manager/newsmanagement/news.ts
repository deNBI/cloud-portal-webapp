/**
 * News Class.
 */
export class DenbiNews {
  private _id: number;
  private _title: string;
  private _author: string;
  private _time: string;
  private _text: string;
  private _tag: string;
  private _facility_id: number[] = [];
  private _editable: boolean;

  constructor(news?: DenbiNews) {
    this._editable = true;
    if (news) {
      this._id = news.id;
      this._title = news.title;
      this._author = news.author;
      this._time = news.time;
      this._text = news.text;
      this._tag = news.tag;
      this._facility_id = news.facility_id.slice(0);
      if (news.editable !== undefined || news.editable !== null) {
        this._editable = news.editable;
      }
    }
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get author(): string {
    return this._author;
  }

  set author(value: string) {
    this._author = value;
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

  get tag(): string {
    return this._tag;
  }

  set tag(value: string) {
    this._tag = value;
  }

  get facility_id(): number[] {
    return this._facility_id;
  }

  set facility_id(value: number[]) {
    this._facility_id = value;
  }

  get editable(): boolean {
    return this._editable;
  }

  set editable(value: boolean) {
    this._editable = value;
  }
}
