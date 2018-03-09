export class Application {
  private _Id: number;
  private _Name: string;
  private _Institute: string;
  private _Workgroup: string;
  private _Lifetime: number;
  private _VMsRequested: number;
  private _CoresPerVM: number;
  private _RamPerVM: number;
  private _DiskSpace: number;
  private _ObjectStorage: number;
  private _SpecialHardware: number;
  private _Description: string;
  private _DateSubmitted: string;
  private _DateStatusChanged: string;
  private _User: number;
  private _UserEmail: number;
  private _Status: number;
  private _ComputeCenter: string;
   private _ComputeCenterDetails:[string,string][];


  constructor() {
  }

    get ComputeCenterDetails(){
    return this._ComputeCenterDetails;
  }
  set ComputecenterDetails(value:[string,string][]){
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

  get Institute(): string {
    return this._Institute;
  }

  set Institute(value: string) {
    this._Institute = value;
  }

  get Workgroup(): string {
    return this._Workgroup;
  }

  set Workgroup(value: string) {
    this._Workgroup = value;
  }

  get Lifetime(): number {
    return this._Lifetime;
  }

  set Lifetime(value: number) {
    this._Lifetime = value;
  }

  get VMsRequested(): number {
    return this._VMsRequested;
  }

  set VMsRequested(value: number) {
    this._VMsRequested = value;
  }

  get CoresPerVM(): number {
    return this._CoresPerVM;
  }

  set CoresPerVM(value: number) {
    this._CoresPerVM = value;
  }

  get RamPerVM(): number {
    return this._RamPerVM;
  }

  set RamPerVM(value: number) {
    this._RamPerVM = value;
  }

  get DiskSpace(): number {
    return this._DiskSpace;
  }

  set DiskSpace(value: number) {
    this._DiskSpace = value;
  }

  get ObjectStorage(): number {
    return this._ObjectStorage;
  }

  set ObjectStorage(value: number) {
    this._ObjectStorage = value;
  }

  get SpecialHardware(): number {
    return this._SpecialHardware;
  }

  set SpecialHardware(value: number) {
    this._SpecialHardware = value;
  }

  get Description(): string {
    return this._Description;
  }

  set Description(value: string) {
    this._Description = value;
  }

  get DateSubmitted(): string {
    return this._DateSubmitted;
  }

  set DateSubmitted(value: string) {
    this._DateSubmitted = value;
  }

  get DateStatusChanged(): string {
    return this._DateStatusChanged;
  }

  set DateStatusChanged(value: string) {
    this._DateStatusChanged = value;
  }

  get User(): number {
    return this._User;
  }

  set User(value: number) {
    this._User = value;
  }

  get Status(): number {
    return this._Status;
  }

  set Status(value: number) {
    this._Status = value;
  }


  get UserEmail(): number {
    return this._UserEmail;
  }

  set UserEmail(value: number) {
    this._UserEmail = value;
  }
}
