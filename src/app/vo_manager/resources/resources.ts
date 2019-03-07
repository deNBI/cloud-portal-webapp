export class Resources {

    private _resource_name: string;
    private _totalRam = 0;
    private _totalCores = 0;
    private _totalVms = 0;
    private _totalVolumeLimit = 0;
    private _totalVolumeCounter = 0;
    private _totalObjectStorage = 0;
    private _totalFPGA = 0;
    private _totalGPU = 0;


    constructor(resource_name: string, totalRam: number, totalCores: number, totalVms: number, totalVolumeLimit: number,
                totalVolumeCounter: number, totalObjectStorage: number, totalFPGA: number, totalGPU: number) {
        this._resource_name = resource_name;
        this._totalRam = totalRam;
        this._totalCores = totalCores;
        this._totalVms = totalVms;
        this._totalVolumeLimit = totalVolumeLimit;
        this._totalVolumeCounter = totalVolumeCounter;
        this._totalObjectStorage = totalObjectStorage;
        this._totalFPGA = totalFPGA;
        this._totalGPU = totalGPU;
    }

    get resource_name(): string {
        return this._resource_name;
    }

    set resource_name(value: string) {
        this._resource_name = value;
    }

    get totalRam(): number {
        return this._totalRam;
    }

    set totalRam(value: number) {
        this._totalRam = value;
    }

    get totalCores(): number {
        return this._totalCores;
    }

    set totalCores(value: number) {
        this._totalCores = value;
    }

    get totalVms(): number {
        return this._totalVms;
    }

    set totalVms(value: number) {
        this._totalVms = value;
    }

    get totalVolumeLimit(): number {
        return this._totalVolumeLimit;
    }

    set totalVolumeLimit(value: number) {
        this._totalVolumeLimit = value;
    }

    get totalVolumeCounter(): number {
        return this._totalVolumeCounter;
    }

    set totalVolumeCounter(value: number) {
        this._totalVolumeCounter = value;
    }

    get totalObjectStorage(): number {
        return this._totalObjectStorage;
    }

    set totalObjectStorage(value: number) {
        this._totalObjectStorage = value;
    }

    get totalFPGA(): number {
        return this._totalFPGA;
    }

    set totalFPGA(value: number) {
        this._totalFPGA = value;
    }

    get totalGPU(): number {
        return this._totalGPU;
    }

    set totalGPU(value: number) {
        this._totalGPU = value;
    }


}
