export class ApplicationExtension {
  private _Id: number;
  private _Lifetime: number;

  constructor() {
  }


  get Lifetime(): number {
    return this._Lifetime;
  }

  set Lifetime(value: number) {
    this._Lifetime = value;
  }

  get Id(): number {
    return this._Id;
  }

  set Id(value: number) {
    this._Id = value;
  }


}
