/**
 * Resource class.
 */
export class Resources ***REMOVED***

    private _resource_name: string;
    private _totalRam: number = 0;
    private _totalCores: number = 0;
    private _totalVms: number = 0;
    private _totalVolumeLimit: number = 0;
    private _totalVolumeCounter: number = 0;
    private _totalObjectStorage: number = 0;
    private _totalGPU: number = 0;

    constructor(resource_name: string, totalRam: number, totalCores: number, totalVms: number, totalVolumeLimit: number,
                totalVolumeCounter: number, totalObjectStorage: number,  totalGPU: number) ***REMOVED***
        this._resource_name = resource_name;
        this._totalRam = totalRam;
        this._totalCores = totalCores;
        this._totalVms = totalVms;
        this._totalVolumeLimit = totalVolumeLimit;
        this._totalVolumeCounter = totalVolumeCounter;
        this._totalObjectStorage = totalObjectStorage;
        this._totalGPU = totalGPU;
    ***REMOVED***

    get resource_name(): string ***REMOVED***
        return this._resource_name;
    ***REMOVED***

    set resource_name(value: string) ***REMOVED***
        this._resource_name = value;
    ***REMOVED***

    get totalRam(): number ***REMOVED***
        return this._totalRam;
    ***REMOVED***

    set totalRam(value: number) ***REMOVED***
        this._totalRam = value;
    ***REMOVED***

    get totalCores(): number ***REMOVED***
        return this._totalCores;
    ***REMOVED***

    set totalCores(value: number) ***REMOVED***
        this._totalCores = value;
    ***REMOVED***

    get totalVms(): number ***REMOVED***
        return this._totalVms;
    ***REMOVED***

    set totalVms(value: number) ***REMOVED***
        this._totalVms = value;
    ***REMOVED***

    get totalVolumeLimit(): number ***REMOVED***
        return this._totalVolumeLimit;
    ***REMOVED***

    set totalVolumeLimit(value: number) ***REMOVED***
        this._totalVolumeLimit = value;
    ***REMOVED***

    get totalVolumeCounter(): number ***REMOVED***
        return this._totalVolumeCounter;
    ***REMOVED***

    set totalVolumeCounter(value: number) ***REMOVED***
        this._totalVolumeCounter = value;
    ***REMOVED***

    get totalObjectStorage(): number ***REMOVED***
        return this._totalObjectStorage;
    ***REMOVED***

    set totalObjectStorage(value: number) ***REMOVED***
        this._totalObjectStorage = value;
    ***REMOVED***

    get totalGPU(): number ***REMOVED***
        return this._totalGPU;
    ***REMOVED***

    set totalGPU(value: number) ***REMOVED***
        this._totalGPU = value;
    ***REMOVED***

***REMOVED***
