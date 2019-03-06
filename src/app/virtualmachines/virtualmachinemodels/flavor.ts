import ***REMOVED***FlavorType***REMOVED*** from './flavorType';

export class Flavor ***REMOVED***
    private _id: string;
    private _name: string;
    private _vcpus: number;
    private _ram: number;
    private _rootdisk: number;
    private _gpu: number;
    private _epheremal_disk: number;
    private _type: FlavorType;
    private _simple_vm: boolean;


    get id(): string ***REMOVED***
        return this._id;
    ***REMOVED***

    set id(value: string) ***REMOVED***
        this._id = value;
    ***REMOVED***

    get name(): string ***REMOVED***
        return this._name;
    ***REMOVED***

    set name(value: string) ***REMOVED***
        this._name = value;
    ***REMOVED***

    get vcpus(): number ***REMOVED***
        return this._vcpus;
    ***REMOVED***

    set vcpus(value: number) ***REMOVED***
        this._vcpus = value;
    ***REMOVED***

    get ram(): number ***REMOVED***
        return this._ram;
    ***REMOVED***

    set ram(value: number) ***REMOVED***
        this._ram = value;
    ***REMOVED***

    get rootdisk(): number ***REMOVED***
        return this._rootdisk;
    ***REMOVED***

    set rootdisk(value: number) ***REMOVED***
        this._rootdisk = value;
    ***REMOVED***

    get gpu(): number ***REMOVED***
        return this._gpu;
    ***REMOVED***

    set gpu(value: number) ***REMOVED***
        this._gpu = value;
    ***REMOVED***

    get epheremal_disk(): number ***REMOVED***
        return this._epheremal_disk;
    ***REMOVED***

    set epheremal_disk(value: number) ***REMOVED***
        this._epheremal_disk = value;
    ***REMOVED***

    get type(): FlavorType ***REMOVED***
        return this._type;
    ***REMOVED***

    set type(value: FlavorType) ***REMOVED***
        this._type = value;
    ***REMOVED***

    get simple_vm(): boolean ***REMOVED***
        return this._simple_vm;
    ***REMOVED***

    set simple_vm(value: boolean) ***REMOVED***
        this._simple_vm = value;
    ***REMOVED***


***REMOVED***





