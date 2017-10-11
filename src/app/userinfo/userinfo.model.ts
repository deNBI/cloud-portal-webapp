export class  Userinfo{

  private _Id: number;
  private _FirstName: string;
  private _LastName: string;

  constructor(){
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


}
