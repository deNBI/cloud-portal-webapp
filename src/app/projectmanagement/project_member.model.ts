/**
 * Project Member class.
 */
export class ProjectMember {
  get Email(): string {
    return this._Email;
  }

  set Email(value: string) {
    this._Email = value;
  }

  private _Id: number | string;
  private _MemberId: number | string;
  private _Username: string;
  private _IsPi: boolean;
  private _ElixirId: string;
  private _Email: string;

  constructor(Id: number | string, Username: string, MemberId: number | string) {
    this._Id = Id;
    this._Username = Username;
    this._MemberId = MemberId;

  }

  get ElixirId(): string {
    return this._ElixirId
  }

  set ElixirId(value: string) {
    this._ElixirId = value;
  }

  get IsPi(): boolean {
    return this._IsPi;
  }

  set IsPi(value: boolean) {
    this._IsPi = value;
  }

  get Id(): number | string {
    return this._Id;
  }

  set Id(value: number | string) {
    this._Id = value;
  }

  get Username(): string {
    return this._Username;
  }

  set Username(value: string) {
    this._Username = value;
  }

  get MemberId(): number | string {
    return this._MemberId;
  }

  set MemberId(value: number | string) {
    this._MemberId = value;
  }
}
