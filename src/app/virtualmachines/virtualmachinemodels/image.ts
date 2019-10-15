
/**
 * Image class.
 */
export class Image {
  private _id: string;
  private _name: string;
  private _status: string;
  private _tags: string[];
  private _description: string;
  private _is_snapshot: boolean;
  private _logo_url: string;

  get logo_url(): string {
    return this._logo_url

  }

  set logo_url(value: string) {
    this._logo_url = value;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }

  get tags(): string[] {
    return this._tags;
  }

  set tags(value: string[]) {
    this._tags = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get is_snapshot(): boolean {
    return this._is_snapshot;
  }

  set is_snapshot(value: boolean) {
    this._is_snapshot = value;
  }
}
