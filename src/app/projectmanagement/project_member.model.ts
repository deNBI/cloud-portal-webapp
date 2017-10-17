export class ProjectMember ***REMOVED***
  private _Id: number;
  private _MemberId: number;
  private _Username: string;


  constructor(Id: number, Username: string, MemberId: number) ***REMOVED***
    this._Id = Id;
    this._Username = Username;
    this._MemberId = MemberId;
  ***REMOVED***

  get Id(): number ***REMOVED***
    return this._Id;
  ***REMOVED***

  set Id(value: number) ***REMOVED***
    this._Id = value;
  ***REMOVED***

  get Username(): string ***REMOVED***
    return this._Username;
  ***REMOVED***

  set Username(value: string) ***REMOVED***
    this._Username = value;
  ***REMOVED***

  get MemberId(): number ***REMOVED***
    return this._MemberId;
  ***REMOVED***

  set MemberId(value: number) ***REMOVED***
    this._MemberId = value;
  ***REMOVED***
***REMOVED***
