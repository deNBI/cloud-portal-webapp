/**
 * Application Extension class.
 */
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
    private _ExtendedCredits: number;
    private _RequestedFlavors: {
        [id: string]: {
            counter: number, tag: string, ram: number, rootdisk: number,
            vcpus: number, gpu: number, epheremal_disk: number
        }
    };

    constructor() {
        this._RequestedFlavors = {};

    }

    /**
     * Add Flavor to requested flavor list.
     * @param {string} name name of the flavor
     * @param {number} counter how many flavors
     * @param {string} tag tag of the flavor
     * @param {number} ram ram of the flavor
     * @param {number} rootdisk rootdisk of the flavor
     * @param {number} vcpus vcpus of the flavor
     * @param {number} gpu gpu of the flavors
     * @param {number} epheremal_disk epheremal_disk of the flavor
     */
    public addFlavorToRequested(name: string, counter: number, tag: string, ram: number, rootdisk: number,
                                vcpus: number, gpu: number, epheremal_disk: number): void {
        this._RequestedFlavors[name] = {
            counter: counter,
            tag: tag,
            ram: ram,
            rootdisk: rootdisk,
            vcpus: vcpus,
            gpu: gpu,
            epheremal_disk: epheremal_disk
        };
    }

    get RequestedFlavors(): {
        [id: string]: {
            counter: number, tag: string, ram: number, rootdisk: number,
            vcpus: number, gpu: number, epheremal_disk: number
        }
    } {
        return this._RequestedFlavors
    }

    set RequestedFlavors(value: {
        [id: string]: {
            counter: number, tag: string, ram: number, rootdisk: number,
            vcpus: number, gpu: number, epheremal_disk: number
        }
    }) {
        this._RequestedFlavors = value;
    }

    get TotalCores(): number {
        return this._TotalCores;
    }

    set TotalCores(value: number) {
        this._TotalCores = value;
    }

    get TotalRAM(): number {
        return this._TotalRAM;
    }

    set TotalRAM(value: number) {
        this._TotalRAM = value;
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

    get ExtendedCredits(): number {
      return this._ExtendedCredits;
    }

    set ExtendedCredits(value: number) {
      this._ExtendedCredits = value;
    }
}
