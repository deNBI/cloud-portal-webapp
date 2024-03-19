import { ClientLimit } from './client-limit.model';

/**
 * Clientclass
 */
export class Client {
	id: string;
	host: string;
	status: string;
	port: string;
	version: string;
	features: string[];

	limits: ClientLimit;

	activated: boolean;
	forc_url: string;
	bibigrid_available: boolean;
	location: string;

	constructor(client?: Partial<Client>, host?: string, port?: string, location?: string, id?: string) {
		if (client) {
			Object.assign(this, client);
		} else {
			this.host = host;
			this.port = port;
			this.location = location;
			this.id = id;
		}
	}

	setLimit(limit_dict: any) {
		const limit = new ClientLimit();
		limit.maxVolumeLimit = limit_dict['volume_storage_limit'] || 0;
		limit.assignedVolumesStorage = limit_dict['assigned_volume_gb'] || 0;
		limit.currentUsedVolumeStorage = limit_dict['current_used_volume_storage'] || 0;
		limit.newVolumeLimit = limit_dict['new_volume_gb'] || 0;

		limit.maxVolumes = limit_dict['volume_counter_limit'] || 0;
		limit.assignedVolumes = limit_dict['assigned_volumes'] || 0;
		limit.currentUsedVolumes = limit_dict['current_used_volumes'] || 0;
		limit.newVolumes = limit_dict['new_volumes'] || 0;

		limit.maxVMs = limit_dict['vms_limit'] || 0;
		limit.assignedVMs = limit_dict['assigned_instances'] || 0;
		limit.currentUsedVms = limit_dict['current_used_vms'] || 0;
		limit.newVms = limit_dict['additional_instances'] || 0;

		limit.maxCores = limit_dict['cores_limit'] || 0;
		limit.assignedCores = limit_dict['assigned_cores'] || 0;
		limit.currentUsedCores = limit_dict['current_used_cores'] || 0;
		limit.newCores = limit_dict['new_cores'] || 0;

		limit.maxRam = limit_dict['ram_limit'] || 0;
		limit.assignedRam = limit_dict['assigned_ram'] || 0;
		limit.currentUsedRam = limit_dict['current_used_ram'] || 0;
		limit.newRam = limit_dict['new_ram'] || 0;
		this.limits = limit;
	}
}
