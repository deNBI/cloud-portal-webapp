/**
 * Userinfo class.
 */
export class Userinfo {

  private _Id: number;
  private _FirstName: string;
  private _LastName: string;
  private _MemberId: number;
  private _ElixirId: string;
  private _PublicKey: string;
  private _UserLogin: string;
  private _Email: string;
  private _PendingEmails: string[];

  constructor(userInfo: any) {
    this._Id = userInfo.Id;
    this._FirstName = userInfo.FirstName;
    this._LastName = userInfo.LastName;
    this._MemberId = userInfo.MemberId;
    this._ElixirId = userInfo.ElixirId;
    this._PublicKey = userInfo.PublicKey;
    this._UserLogin = userInfo.UserLogin;
    this._Email = userInfo.Email;
    this._PendingEmails = userInfo.PendingEmails;
  }

  get PendingEmails(): string[] {
    return this._PendingEmails;
  }

  set PendingEmails(value: string[]) {
    this._PendingEmails = value;
  }

  get Email(): string {
    return this._Email;
  }

  set Email(value: string) {
    this._Email = value;
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

  get ElxirId(): string {
    return this._ElixirId
  }

  set PublicKey(value: string) {
    this._PublicKey = value;
  }

  get PublicKey(): string {
    return this._PublicKey
  }

  set UserLogin(value: string) {

    this._UserLogin = value;
  }

  get UserLogin(): string {
    return this._UserLogin
  }

}
