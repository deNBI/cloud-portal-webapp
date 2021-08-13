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
	maxVolumes: number;
	assignedVolumes: number;
	maxVMs: number;
	assignedVMs: number;
	location: string;
	maxVolumeLimit: number;
	assignedVolumesStorage: number;
	newVolumes: number;
	newVms: number;
	newVolumeLimit: number;
	activated: boolean;
	forc_url: string;
	bibigrid_available: boolean;

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
