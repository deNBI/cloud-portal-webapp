import {Client} from '../../vo_manager/clients/client.model';

/**
 * Snapshot class.
 */
export class SnapshotModel {

  snapshot_openstackid: string;
  snapshot_client: Client;
  snapshot_name: string;
  snapshot_created: boolean;

  snapshot_project: string;
  snapshot_status: string;
}
