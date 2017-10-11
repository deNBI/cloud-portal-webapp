export class SpecialHardware {

  private _Id: number;
  private _Key: string;
  private _Name: string;

  constructor(Id: number, Key: string, Name: string) {
    this._Id = Id;
    this._Key = Key;
    this._Name = Name;
  }

  get Id(): number {
    return this._Id;
  }

  set Id(value: number) {
    this._Id = value;
  }

  get Key(): string {
    return this._Key;
  }

  set Key(value: string) {
    this._Key = value;
  }

  get Name(): string {
    return this._Name;
  }

  set Name(value: string) {
    this._Name = value;
  }


}
