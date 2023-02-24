import { Client } from '../../vo_manager/clients/client.model';

/**
 * Snapshot class.
 */
export class SnapshotModel {
	static MAX_RAM: number = 256;

	snapshot_openstackid: string;
	snapshot_client: Client;
	snapshot_name: string;
	snapshot_created: boolean;

	snapshot_projectid: string;

	snapshot_project: string;
	snapshot_status: string;

	migrate_project_to_simple_vm: boolean = false;
	project_is_migrated_to_simple_vm: boolean = false;

	constructor(snapshot?: Partial<SnapshotModel>) {
		Object.assign(this, snapshot);
		if (snapshot) {
			if (snapshot.snapshot_client) {
				this.snapshot_client = new Client(snapshot.snapshot_client);
			}
		}
	}
}
