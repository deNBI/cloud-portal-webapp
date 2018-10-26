export class ProjectMemberApplication ***REMOVED***

    private _Id: number;
    private _Name: string;
    private _DateCreated: string;
    private _UserIsVoMember:boolean;


    constructor(Id: number, Name: string, DateCreated: string) ***REMOVED***
        this._Id = Id;
        this._Name = Name;
        this._DateCreated = DateCreated;


    ***REMOVED***

    get UserIsVoMember():boolean***REMOVED***
        return this._UserIsVoMember;
    ***REMOVED***

    set UserIsVoMember(value:boolean)***REMOVED***
        this._UserIsVoMember=value;
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


    get DateCreated(): string ***REMOVED***
        return this._DateCreated;
    ***REMOVED***

    set DateCreated(value: string) ***REMOVED***
        this._DateCreated = value;
    ***REMOVED***


***REMOVED***
