import {Client} from '../../vo_manager/clients/client.model';

/**
 * Snapshot class.
 */
export class SnapshotModel {

    private _snapshot_openstackid: string;
    private _snapshot_client: Client;
    private _snapshot_name: string;
    private _snapshot_created: boolean;

    private _snapshot_project: string;
    private _snapshot_status: string;

    get snapshot_openstackid(): string {
        return this._snapshot_openstackid;
    }

    set snapshot_openstackid(value: string) {
        this._snapshot_openstackid = value;
    }

    get snapshot_client(): Client {
        return this._snapshot_client;
    }

    set snapshot_client(value: Client) {
        this._snapshot_client = value;
    }

    get snapshot_name(): string {
        return this._snapshot_name;
    }

    set snapshot_name(value: string) {
        this._snapshot_name = value;
    }

    get snapshot_created(): boolean {
        return this._snapshot_created;
    }

    set snapshot_created(value: boolean) {
        this._snapshot_created = value;
    }

    get snapshot_project(): string {
        return this._snapshot_project;
    }

    set snapshot_project(value: string) {
        this._snapshot_project = value;
    }

    get snapshot_status(): string {
        return this._snapshot_status;
    }

    set snapshot_status(value: string) {
        this._snapshot_status = value;
    }
}
