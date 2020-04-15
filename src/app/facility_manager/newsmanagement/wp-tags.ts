/**
 * Class which models news saved in wordPress
 */
export class WordPressTag {
  private _id: string;
  private _name: string;

  constructor(tag?: WordPressTag) {
    if (tag) {
      this._id = tag.id;
      this._name = tag.name;
    }
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
}
