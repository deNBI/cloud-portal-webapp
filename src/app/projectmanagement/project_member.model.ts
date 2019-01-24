export class ProjectMember ***REMOVED***
    get Email(): string ***REMOVED***
        return this._Email;
    ***REMOVED***

    set Email(value: string) ***REMOVED***
        this._Email = value;
    ***REMOVED***

    private _Id: number;
    private _MemberId: number;
    private _Username: string;
    private _IsPi: boolean;
    private _ElixirId: string;
    private _Email: string;


    constructor(Id: number, Username: string, MemberId: number) ***REMOVED***
        this._Id = Id;
        this._Username = Username;
        this._MemberId = MemberId;

    ***REMOVED***


    get ElixirId(): string ***REMOVED***
        return this._ElixirId
    ***REMOVED***

    set ElixirId(value: string) ***REMOVED***
        this._ElixirId = value;
    ***REMOVED***

    get IsPi(): boolean ***REMOVED***
        return this._IsPi;
    ***REMOVED***

    set IsPi(value: boolean) ***REMOVED***
        this._IsPi = value;
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
