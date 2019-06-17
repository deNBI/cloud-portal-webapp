import ***REMOVED***ProjectMemberApplication***REMOVED*** from './project_member_application';
import ***REMOVED***ComputecenterComponent***REMOVED*** from './computecenter.component';

export class Project ***REMOVED***
    get UserIsAdmin(): boolean ***REMOVED***
        return this._UserIsAdmin;
    ***REMOVED***

    set UserIsAdmin(value: boolean) ***REMOVED***
        this._UserIsAdmin = value;
    ***REMOVED***

    private _Id: number | string;
    private _Name: string;
    private _Description: string;
    private _DateCreated: string;
    private _DateEnd: string;
    private _DaysRunning: number;
    private _LifetimeDays: number;
    private _Lifetime: number | string;
    private _UserIsAdmin: boolean;
    private _UserIsPi: boolean;
    private _Status: number;
    private _ComputeCenter: ComputecenterComponent;
    private _PerunId: number;
    private _ProjectMemberApplications: ProjectMemberApplication[];
    private _RealName: string;
    private _OpenStackProject: boolean;
    private _LifetimeReached: number;

    constructor(Id: number | string, Name: string, Description: string, DateCreated: string, DaysRunning: number,
                UserIsAdmin: boolean, UserIsPi: boolean, ComputeCenter: ComputecenterComponent) ***REMOVED***
        this._Id = Id;
        this._Name = Name;
        this._Description = Description;
        this._DateCreated = DateCreated;
        this._DaysRunning = DaysRunning;
        this._UserIsAdmin = UserIsAdmin;
        this._UserIsPi = UserIsPi;
        this._ComputeCenter = ComputeCenter;

    ***REMOVED***

// todo exdend with additional information




    get LifetimeReached(): number ***REMOVED***
        return this._LifetimeReached
    ***REMOVED***

    set LifetimeReached(value: number) ***REMOVED***
        this._LifetimeReached = value;
    ***REMOVED***

    get RealName(): string ***REMOVED***

        return this._RealName
    ***REMOVED***

    set RealName(value: string) ***REMOVED***
        this._RealName = value;
    ***REMOVED***

    get Status(): number ***REMOVED***
        return this._Status;
    ***REMOVED***

    set Status(value: number) ***REMOVED***
        this._Status = value;

    ***REMOVED***


    get ProjectMemberApplications(): ProjectMemberApplication[] ***REMOVED***
        return this._ProjectMemberApplications;
    ***REMOVED***

    set ProjectMemberApplications(value: ProjectMemberApplication[]) ***REMOVED***
        this._ProjectMemberApplications = value;
    ***REMOVED***

    get LifetimeDays(): number ***REMOVED***
        return this._LifetimeDays
    ***REMOVED***

    set LifetimeDays(value: number) ***REMOVED***
        this._LifetimeDays = value;
    ***REMOVED***

    get OpenStackProject(): boolean ***REMOVED***
        return this._OpenStackProject
    ***REMOVED***

    set OpenStackProject(value: boolean) ***REMOVED***
        this._OpenStackProject = value;
    ***REMOVED***

    set Lifetime(value: number | string) ***REMOVED***
        this._Lifetime = value;
    ***REMOVED***

    get Lifetime(): number | string ***REMOVED***
        return this._Lifetime;
    ***REMOVED***

    get ComputeCenter(): ComputecenterComponent ***REMOVED***
        return this._ComputeCenter
    ***REMOVED***

    set ComputeCenter(value: ComputecenterComponent) ***REMOVED***
        this._ComputeCenter = value;
    ***REMOVED***

    get PerunId(): number ***REMOVED***
        return this._PerunId;
    ***REMOVED***

    set PerunId(value: number) ***REMOVED***
        this._PerunId = value;
    ***REMOVED***

    set Id(value: number | string) ***REMOVED***
        this._Id = value;
    ***REMOVED***

    get Id(): number | string ***REMOVED***
        return this._Id;
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
