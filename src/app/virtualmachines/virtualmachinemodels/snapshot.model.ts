import {Vmclient} from "./vmclient";


export class SnapshotModel {

    snapshot_openstackid: string;
    snapshot_client = Vmclient;
    snapshot_name: string;
}
