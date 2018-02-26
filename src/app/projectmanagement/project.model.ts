export class Project ***REMOVED***
  get UserIsAdmin(): boolean ***REMOVED***
    return this._UserIsAdmin;
  ***REMOVED***

  set UserIsAdmin(value: boolean) ***REMOVED***
    this._UserIsAdmin = value;
  ***REMOVED***

  private _Id: number;
  private _Name: string;
  private _Description: string;
  private _DateCreated: string;
  private _DaysRunning: number;
  private _UserIsAdmin: boolean;
  private _UserIsPi: boolean;
  private _ComputeCenter:string;


  constructor(Id: number, Name: string, Description: string, DateCreated: string, DaysRunning: number, UserIsAdmin: boolean, UserIsPi: boolean,ComputeCenter: string) ***REMOVED***
    this._Id = Id;
    this._Name = Name;
    this._Description = Description;
    this._DateCreated = DateCreated;
    this._DaysRunning = DaysRunning;
    this._UserIsAdmin = UserIsAdmin;
    this._UserIsPi = UserIsPi;
    this._ComputeCenter= ComputeCenter;
  ***REMOVED***

//todo exdend with additional information


  get ComputeCenter(): string ***REMOVED***
    return this._ComputeCenter
  ***REMOVED***

  set ComputeCenter(value: string) ***REMOVED***
    this._ComputeCenter = value;
  ***REMOVED***

  get Id(): number ***REMOVED***
    return this._Id;
  ***REMOVED***

  set Id(value: number) ***REMOVED***
    this._Id = value;
  ***REMOVED***

  get Name(): string ***REMOVED***
    return this._Name;
  ***REMOVED***

  set Name(value: string) ***REMOVED***
    this._Name = value;
  ***REMOVED***

  get Description(): string ***REMOVED***
    return this._Description;
  ***REMOVED***

  set Description(value: string) ***REMOVED***
    this._Description = value;
  ***REMOVED***

  get DateCreated(): string ***REMOVED***
    return this._DateCreated;
  ***REMOVED***

  set DateCreated(value: string) ***REMOVED***
    this._DateCreated = value;
  ***REMOVED***

  get DaysRunning(): number ***REMOVED***
    return this._DaysRunning;
  ***REMOVED***

  set DaysRunning(value: number) ***REMOVED***
    this._DaysRunning = value;
  ***REMOVED***


  get UserIsPi(): boolean ***REMOVED***
    return this._UserIsPi;
  ***REMOVED***

  set UserIsPi(value: boolean) ***REMOVED***
    this._UserIsPi = value;
  ***REMOVED***


***REMOVED***
