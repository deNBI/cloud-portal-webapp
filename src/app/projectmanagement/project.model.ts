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
  private _DateEnd: string;
  private _DaysRunning: number;
  private _LifetimeDays: number;
  private _Lifetime: number;
  private _UserIsAdmin: boolean;
  private _UserIsPi: boolean;
  private _ComputeCenter:[string,number];
  private _ComputeCenterDetails:[string,string][];
  private _PerunId:number;


  constructor(Id: number, Name: string, Description: string, DateCreated: string, DaysRunning: number, UserIsAdmin: boolean, UserIsPi: boolean,ComputeCenter: [string,number]) ***REMOVED***
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

  get LifetimeDays():number***REMOVED***
    return this._LifetimeDays
  ***REMOVED***
   set LifetimeDays(value:number)***REMOVED***
    this._LifetimeDays=value;
  ***REMOVED***

  get Lifetime():number***REMOVED***
    return this._Lifetime;
  ***REMOVED***
  set Lifetime(value:number)***REMOVED***
    this._Lifetime=value;
  ***REMOVED***
  get ComputeCenterDetails()***REMOVED***
    return this._ComputeCenterDetails;
  ***REMOVED***
  set ComputecenterDetails(value:[string,string][])***REMOVED***
    this._ComputeCenterDetails=value;
  ***REMOVED***
  get ComputeCenter(): [string,number] ***REMOVED***
    return this._ComputeCenter
  ***REMOVED***

  set ComputeCenter(value: [string,number]) ***REMOVED***
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

   get DateEnd(): string ***REMOVED***
    return this._DateEnd;
  ***REMOVED***

  set DateEnd(value: string) ***REMOVED***
    this._DateEnd = value;
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
