import ***REMOVED***Vmclient***REMOVED*** from './vmclient';

export class SnapshotModel ***REMOVED***

    private _snapshot_openstackid: string;
    private _snapshot_client: Vmclient;
    private _snapshot_name: string;
    private _snapshot_created: boolean;

    private _snapshot_project: string;
    private _snapshot_status: string;

    get snapshot_openstackid(): string ***REMOVED***
        return this._snapshot_openstackid;
    ***REMOVED***

    set snapshot_openstackid(value: string) ***REMOVED***
        this._snapshot_openstackid = value;
    ***REMOVED***

    get snapshot_client(): Vmclient ***REMOVED***
        return this._snapshot_client;
    ***REMOVED***

    set snapshot_client(value: Vmclient) ***REMOVED***
        this._snapshot_client = value;
    ***REMOVED***

    get snapshot_name(): string ***REMOVED***
        return this._snapshot_name;
    ***REMOVED***

    set snapshot_name(value: string) ***REMOVED***
        this._snapshot_name = value;
    ***REMOVED***

    get snapshot_created(): boolean ***REMOVED***
        return this._snapshot_created;
    ***REMOVED***

    set snapshot_created(value: boolean) ***REMOVED***
        this._snapshot_created = value;
    ***REMOVED***

    get snapshot_project(): string ***REMOVED***
        return this._snapshot_project;
    ***REMOVED***

    set snapshot_project(value: string) ***REMOVED***
        this._snapshot_project = value;
    ***REMOVED***

    get snapshot_status(): string ***REMOVED***
        return this._snapshot_status;
    ***REMOVED***

    set snapshot_status(value: string) ***REMOVED***
        this._snapshot_status = value;
    ***REMOVED***
***REMOVED***
