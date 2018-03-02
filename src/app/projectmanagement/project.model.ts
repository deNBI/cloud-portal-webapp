export class Project {
  get UserIsAdmin(): boolean {
    return this._UserIsAdmin;
  }

  set UserIsAdmin(value: boolean) {
    this._UserIsAdmin = value;
  }

  private _Id: number;
  private _Name: string;
  private _Description: string;
  private _DateCreated: string;
  private _DaysRunning: number;
  private _UserIsAdmin: boolean;
  private _UserIsPi: boolean;
  private _ComputeCenter:string;
  private _ComputeCenterDetails:{};


  constructor(Id: number, Name: string, Description: string, DateCreated: string, DaysRunning: number, UserIsAdmin: boolean, UserIsPi: boolean,ComputeCenter: string) {
    this._Id = Id;
    this._Name = Name;
    this._Description = Description;
    this._DateCreated = DateCreated;
    this._DaysRunning = DaysRunning;
    this._UserIsAdmin = UserIsAdmin;
    this._UserIsPi = UserIsPi;
    this._ComputeCenter= ComputeCenter;
  }

//todo exdend with additional information

  get ComputeCenterDetails(){
    return this._ComputeCenterDetails;
  }
  set ComputecenterDetails(value:{}){
    this._ComputeCenterDetails=value;
  }
  get ComputeCenter(): string {
    return this._ComputeCenter
  }

  set ComputeCenter(value: string) {
    this._ComputeCenter = value;
  }

  get Id(): number {
    return this._Id;
  }

  set Id(value: number) {
    this._Id = value;
  }

  get Name(): string {
    return this._Name;
  }

  set Name(value: string) {
    this._Name = value;
  }

  get Description(): string {
    return this._Description;
  }

  set Description(value: string) {
    this._Description = value;
  }

  get DateCreated(): string {
    return this._DateCreated;
  }

  set DateCreated(value: string) {
    this._DateCreated = value;
  }

  get DaysRunning(): number {
    return this._DaysRunning;
  }

  set DaysRunning(value: number) {
    this._DaysRunning = value;
  }


  get UserIsPi(): boolean {
    return this._UserIsPi;
  }

  set UserIsPi(value: boolean) {
    this._UserIsPi = value;
  }


}
