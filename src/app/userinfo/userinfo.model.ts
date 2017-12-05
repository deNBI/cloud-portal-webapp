export class Userinfo {

  private _Id: number;
  private _FirstName: string;
  private _LastName: string;
  private _MemberId: number;
  private _ElixirId: string;
  private _PublicKey: string;
  private _UserLogin: string;

  constructor() {
    this.LastName = " ";
    this.FirstName = " ";
    this.Id = -1;
  }

  get Id(): number {
    return this._Id;
  }

  set Id(value: number) {
    this._Id = value;
  }

  get FirstName(): string {
    return this._FirstName;
  }

  set FirstName(value: string) {
    this._FirstName = value;
  }

  get LastName(): string {
    return this._LastName;
  }

  set LastName(value: string) {
    this._LastName = value;
  }

  get MemberId(): number {
    return this._MemberId;
  }

  set MemberId(value: number) {
    this._MemberId = value;
  }

  set ElxirId(value: string) {
    this._ElixirId = value;
  }

  get ElxirId() {
    return this._ElixirId
  }

  set PublicKey(value: string) {
    this._PublicKey = value;
  }

  get PublicKey() {
    return this._PublicKey
  }

  set UserLogin(value: string) {

    this._UserLogin = value;
  }

  get UserLogin() {
    return this._UserLogin
  }

}
