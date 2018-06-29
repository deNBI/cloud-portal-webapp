export class Application ***REMOVED***
  private _Id: number;
  private _Name: string;
  private _Shortname: string;
  private _Institute: string;
  private _Workgroup: string;
  private _Lifetime: number;
  private _VMsRequested: number;
  private _CoresPerVM: number;
  private _RamPerVM: number;
  private _VolumeLimit: number;
  private _VolumeCounter: number;
  private _ObjectStorage: number;
  private _SpecialHardware: number;
  private _Description: string;
  private _Comment: string;
  private _DateSubmitted: string;
  private _DateStatusChanged: string;
  private _User: number;
  private _UserEmail: number;
  private _Status: number;
  private _ComputeCenter: [string,number];
  private _OpenStackProject: boolean;
  private _ComputeCenterDetails:[string,string][];
  private _DaysRunning: number;



  constructor() ***REMOVED***
  ***REMOVED***

  get DaysRunning():number***REMOVED***
    return this._DaysRunning;
  ***REMOVED***

  set DaysRunning(value:number)***REMOVED***
    this._DaysRunning=value;
  ***REMOVED***
  get OpenStackProject(): boolean ***REMOVED***
    return this._OpenStackProject
  ***REMOVED***

  set OpenStackProject(value: boolean) ***REMOVED***
    this._OpenStackProject = value;
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

  set Comment(value: string)***REMOVED***
    this._Comment = value;
  ***REMOVED***

  get Comment():string ***REMOVED***
    return this._Comment;
  ***REMOVED***
  get Shortname(): string ***REMOVED***
    return this._Shortname;
  ***REMOVED***

  set Shortname(value: string) ***REMOVED***
    this._Shortname = value;
  ***REMOVED***

  get Institute(): string ***REMOVED***
    return this._Institute;
  ***REMOVED***

  set Institute(value: string) ***REMOVED***
    this._Institute = value;
  ***REMOVED***

  get Workgroup(): string ***REMOVED***
    return this._Workgroup;
  ***REMOVED***

  set Workgroup(value: string) ***REMOVED***
    this._Workgroup = value;
  ***REMOVED***

  get Lifetime(): number ***REMOVED***
    return this._Lifetime;
  ***REMOVED***

  set Lifetime(value: number) ***REMOVED***
    this._Lifetime = value;
  ***REMOVED***

  get VMsRequested(): number ***REMOVED***
    return this._VMsRequested;
  ***REMOVED***

  set VMsRequested(value: number) ***REMOVED***
    this._VMsRequested = value;
  ***REMOVED***

  get CoresPerVM(): number ***REMOVED***
    return this._CoresPerVM;
  ***REMOVED***

  set CoresPerVM(value: number) ***REMOVED***
    this._CoresPerVM = value;
  ***REMOVED***

  get RamPerVM(): number ***REMOVED***
    return this._RamPerVM;
  ***REMOVED***

  set RamPerVM(value: number) ***REMOVED***
    this._RamPerVM = value;
  ***REMOVED***

  get VolumeLimit(): number ***REMOVED***
    return this._VolumeLimit;
  ***REMOVED***

  set VolumeLimit(value: number) ***REMOVED***
    this._VolumeLimit = value;
  ***REMOVED***


    get VolumeCounter(): number ***REMOVED***
    return this._VolumeCounter;
  ***REMOVED***

  set VolumeCounter(value: number) ***REMOVED***
    this._VolumeCounter = value;
  ***REMOVED***

  get ObjectStorage(): number ***REMOVED***
    return this._ObjectStorage;
  ***REMOVED***

  set ObjectStorage(value: number) ***REMOVED***
    this._ObjectStorage = value;
  ***REMOVED***

  get SpecialHardware(): number ***REMOVED***
    return this._SpecialHardware;
  ***REMOVED***

  set SpecialHardware(value: number) ***REMOVED***
    this._SpecialHardware = value;
  ***REMOVED***

  get Description(): string ***REMOVED***
    return this._Description;
  ***REMOVED***

  set Description(value: string) ***REMOVED***
    this._Description = value;
  ***REMOVED***

  get DateSubmitted(): string ***REMOVED***
    return this._DateSubmitted;
  ***REMOVED***

  set DateSubmitted(value: string) ***REMOVED***
    this._DateSubmitted = value;
  ***REMOVED***

  get DateStatusChanged(): string ***REMOVED***
    return this._DateStatusChanged;
  ***REMOVED***

  set DateStatusChanged(value: string) ***REMOVED***
    this._DateStatusChanged = value;
  ***REMOVED***

  get User(): number ***REMOVED***
    return this._User;
  ***REMOVED***

  set User(value: number) ***REMOVED***
    this._User = value;
  ***REMOVED***

  get Status(): number ***REMOVED***
    return this._Status;
  ***REMOVED***

  set Status(value: number) ***REMOVED***
    this._Status = value;
  ***REMOVED***


  get UserEmail(): number ***REMOVED***
    return this._UserEmail;
  ***REMOVED***

  set UserEmail(value: number) ***REMOVED***
    this._UserEmail = value;
  ***REMOVED***
***REMOVED***
