import ***REMOVED***ApplicationExtension***REMOVED*** from './application_extension.model';
import ***REMOVED***ComputecenterComponent***REMOVED*** from '../projectmanagement/computecenter.component';
import ***REMOVED***Flavor***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavor';


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
    private _UserAffiliations: string[];
    private _Status: number;
    private _ComputeCenter: ComputecenterComponent;
    private _OpenStackProject: boolean;
    private _DaysRunning: number;
    private _ApplicationExtension: ApplicationExtension;
    private _PerunId: number;
    private _TotalCores: number;
    private _TotalRam: number;
    private _DateApproved: string;
    private _Horizon2020: string;


    private _Dissemination: boolean;
    private _CurrentFlavors: ***REMOVED*** [id: string]: ***REMOVED*** counter: number, tag: string, ram: number, rootdisk: number, vcpus: number, gpu: number, epheremal_disk: number ***REMOVED*** ***REMOVED***;


    constructor() ***REMOVED***
        this._CurrentFlavors = ***REMOVED******REMOVED***;
    ***REMOVED***

    public addFlavorToCurrent(name: string, counter: number, tag: string, ram: number, rootdisk: number, vcpus: number, gpu: number, epheremal_disk: number): void ***REMOVED***
        this._CurrentFlavors[name] = ***REMOVED***
            counter: counter,
            tag: tag,
            ram: ram,
            rootdisk: rootdisk,
            vcpus: vcpus,
            gpu: gpu,
            epheremal_disk: epheremal_disk
        ***REMOVED***;
    ***REMOVED***
     get Dissemination(): boolean ***REMOVED***
        return this._Dissemination;
    ***REMOVED***

    set Dissemination(value: boolean) ***REMOVED***
        this._Dissemination = value;
    ***REMOVED***

    get CurrentFlavors(): ***REMOVED*** [id: string]: ***REMOVED*** counter: number, tag: string, ram: number, rootdisk: number, vcpus: number, gpu: number, epheremal_disk: number ***REMOVED*** ***REMOVED*** ***REMOVED***
        return this._CurrentFlavors
    ***REMOVED***

    set CurrentFlavors(value: ***REMOVED*** [id: string]: ***REMOVED*** counter: number, tag: string, ram: number, rootdisk: number, vcpus: number, gpu: number, epheremal_disk: number ***REMOVED*** ***REMOVED***) ***REMOVED***
        this._CurrentFlavors = value;
    ***REMOVED***

    get DateApproved(): string ***REMOVED***
        return this._DateApproved;
    ***REMOVED***

    set DateApproved(value: string) ***REMOVED***
        this._DateApproved = value;
    ***REMOVED***

    get TotalCores(): number ***REMOVED***
        return this._TotalCores;
    ***REMOVED***

    set TotalCores(value: number) ***REMOVED***
        this._TotalCores = value;
    ***REMOVED***

    get TotalRam(): number ***REMOVED***
        return this._TotalRam;
    ***REMOVED***

    set TotalRam(value: number) ***REMOVED***
        this._TotalRam = value;
    ***REMOVED***

    get UserAffiliations(): string[] ***REMOVED***
        return this._UserAffiliations
    ***REMOVED***

    set UserAffiliations(value: string[]) ***REMOVED***
        this._UserAffiliations = value;
    ***REMOVED***

    get ApplicationExtension(): ApplicationExtension ***REMOVED***
        return this._ApplicationExtension;
    ***REMOVED***

    set ApplicationExtension(value: ApplicationExtension) ***REMOVED***
        this._ApplicationExtension = value;
    ***REMOVED***

    get DaysRunning(): number ***REMOVED***
        return this._DaysRunning;
    ***REMOVED***

    set DaysRunning(value: number) ***REMOVED***
        this._DaysRunning = value;
    ***REMOVED***

    get OpenStackProject(): boolean ***REMOVED***
        return this._OpenStackProject
    ***REMOVED***

    set OpenStackProject(value: boolean) ***REMOVED***
        this._OpenStackProject = value;
    ***REMOVED***


    get ComputeCenter(): ComputecenterComponent ***REMOVED***
        return this._ComputeCenter
    ***REMOVED***

    set ComputeCenter(value: ComputecenterComponent) ***REMOVED***
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

    set Comment(value: string) ***REMOVED***
        this._Comment = value;
    ***REMOVED***

    get Comment(): string ***REMOVED***
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

    get PerunId(): number ***REMOVED***
        return this._PerunId;
    ***REMOVED***

    set PerunId(value: number) ***REMOVED***
        this._PerunId = value;
    ***REMOVED***


    get Horizon2020(): string ***REMOVED***
        return this._Horizon2020;
    ***REMOVED***

    set Horizon2020(value: string) ***REMOVED***
        this._Horizon2020 = value;
    ***REMOVED***
***REMOVED***
