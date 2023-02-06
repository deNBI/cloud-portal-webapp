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
	use_ssl: boolean;

	maxVolumes: number;
	assignedVolumes: number;
	currentUsedVolumes: number;
	newVolumes: number;

	maxVMs: number;
	assignedVMs: number;
	currentUsedVms: number;
	newVms: number;

	maxVolumeLimit: number;
	currentUsedVolumeStorage: number;
	assignedVolumesStorage: number;
	newVolumeLimit: number;

	maxCores: number;
	assignedCores: number;
	currentUsedCores: number;
	newCores: number;

	maxRam: number;
	assignedRam: number;
	currentUsedRam: number;
	newRam: number;

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

	// constructor(host: string, port: string, location: string, id: string) {
	// 	this.host = host;
	// 	this.port = port;
	// 	this.location = location;
	// 	this.id = id;
	// }
}
