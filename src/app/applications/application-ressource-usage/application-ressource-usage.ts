
/**
 * Ressourceusage.
 */
export class ApplicationRessourceUsage {
	number_vms: number
	used_vms: number
	max_volume_storage: number
	used_volume_storage: number
	volume_counter: number
	used_volumes: number
	cores_total: number
	cores_used: number
	ram_total: number
	ram_used: number
	gpus_max: number
	gpus_used: number

	constructor(usage: ApplicationRessourceUsage) {
		this.number_vms = usage.number_vms
		this.used_vms = usage.used_vms
		this.max_volume_storage = usage.max_volume_storage
		this.used_volume_storage = usage.used_volume_storage
		this.volume_counter = usage.volume_counter
		this.used_volumes = usage.used_volumes
		this.cores_total = usage.cores_total
		this.cores_used = usage.cores_used
		this.ram_total = usage.ram_total
		this.ram_used = usage.ram_used
		this.gpus_max = usage.gpus_max
		this.gpus_used = usage.gpus_used
	}



}
