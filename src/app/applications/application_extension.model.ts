export class ApplicationExtension {

    private _Id: number;
    private _Lifetime: number;
    private _VMsRequested: number;
    private _CoresPerVM: number;
    private _RamPerVM: number;
    private _VolumeLimit: number;
    private _VolumeCounter: number;
    private _ObjectStorage: number;
    private _SpecialHardware: string[];
    private _Comment: string;
    private _DateSubmitted: string;
    private _OpenStackProject: boolean;
    private _TotalCores: number;
    private _TotalRAM: number;

    constructor() {
    }


    get Lifetime(): number {
        return this._Lifetime;
    }

    set Lifetime(value: number) {
        this._Lifetime = value;
    }




    get OpenStackProject(): boolean {
        return this._OpenStackProject
    }

    set OpenStackProject(value: boolean) {
        this._OpenStackProject = value;
    }


    get Id(): number {
        return this._Id;
    }

    set Id(value: number) {
        this._Id = value;
    }


    set Comment(value: string) {
        this._Comment = value;
    }

    get Comment(): string {
        return this._Comment;
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

    get VolumeLimit(): number {
        return this._VolumeLimit;
    }

    set VolumeLimit(value: number) {
        this._VolumeLimit = value;
    }


    get VolumeCounter(): number {
        return this._VolumeCounter;
    }

    set VolumeCounter(value: number) {
        this._VolumeCounter = value;
    }

    get ObjectStorage(): number {
        return this._ObjectStorage;
    }

    set ObjectStorage(value: number) {
        this._ObjectStorage = value;
    }

    get SpecialHardware(): string[] {
        return this._SpecialHardware;
    }

    set SpecialHardware(value: string[]) {
        this._SpecialHardware = value;
    }


    get DateSubmitted(): string {
        return this._DateSubmitted;
    }

    set DateSubmitted(value: string) {
        this._DateSubmitted = value;
    }


}
