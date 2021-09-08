import { VirtualMachine } from '../virtualmachinemodels/virtualmachine';
import { Client } from '../../vo_manager/clients/client.model';

/**
 * Volume class.
 */
export class Volume {
	volume_name: string;
	volume_project: string;
	volume_projectid: string;
	volume_openstackid: string;
	volume_storage: number;
	volume_path: string;
	volume_virtualmachine: VirtualMachine;
	volume_client: Client;
	volume_created_by_user: boolean;
	volume_status: string;
	volume_device: string;
	error_msg: string;

	constructor(volume?: Partial<Volume>) {
		Object.assign(this, volume);

		if (volume) {
			this.volume_client = new Client(volume.volume_client);
			if (volume.volume_virtualmachine) {
				this.volume_virtualmachine = new VirtualMachine(volume.volume_virtualmachine);
			}
		}
	}
}
