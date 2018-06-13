export class ProjectMember {
  private _Id: number;
  private _MemberId: number;
  private _Username: string;
  private _IsPi: boolean;


  constructor(Id: number, Username: string, MemberId: number) {
    this._Id = Id;
    this._Username = Username;
    this._MemberId = MemberId;

  }


  get IsPi():boolean{
    return this._IsPi;
  }
  set IsPi(value:boolean){
    this._IsPi=value;
  }
  get Id(): number {
    return this._Id;
  }

  set Id(value: number) {
    this._Id = value;
  }

  get Username(): string {
    return this._Username;
  }

  set Username(value: string) {
    this._Username = value;
  }

  get MemberId(): number {
    return this._MemberId;
  }

  set MemberId(value: number) {
    this._MemberId = value;
  }
}
