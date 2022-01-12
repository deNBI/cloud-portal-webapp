import { ComputecenterComponent } from '../../projectmanagement/computecenter.component';
import { GPUSpecification } from './gpu-specification';

/**
 * ResourceMachine class.
 */

export class ResourceMachine {
	id: string;
	compute_center: ComputecenterComponent;
	name: string;
	ram_public_factor: number = 1;
	ram_private_factor: number = 1;
	cores: number = 0;
	cores_private_factor: number = 1;
	cores_public_factor: number = 1;
	gpu_slots: number = 0;
	gpu_used: GPUSpecification[] = [];
	public_count: number = 0;
	private_count: number = 0;
	ram: number = 0;
	type: string = 'GENERAL_PURPOSE';
	local_disk_storage: number = 0;
	local_disk_encrypted: boolean = false;

	constructor(resourceMachine: ResourceMachine | null) {
		if (resourceMachine) {
			this.id = resourceMachine.id;
			this.compute_center = resourceMachine.compute_center;
			this.name = resourceMachine.name;
			// eslint-disable-next-line no-multi-assign,no-param-reassign
			this.ram_public_factor = resourceMachine.ram_public_factor = 1;
			// eslint-disable-next-line no-multi-assign,no-param-reassign
			this.ram_private_factor = resourceMachine.ram_private_factor = 1;
			this.cores = resourceMachine.cores;
			this.local_disk_storage = resourceMachine.local_disk_storage;
			this.local_disk_encrypted = resourceMachine.local_disk_encrypted;
			this.cores_private_factor = resourceMachine.cores_private_factor;
			this.cores_public_factor = resourceMachine.cores_public_factor;
			this.gpu_slots = resourceMachine.gpu_slots;
			this.gpu_used = resourceMachine.gpu_used;
			this.public_count = resourceMachine.public_count;
			this.private_count = resourceMachine.private_count;
			this.ram = resourceMachine.ram;
			this.type = resourceMachine.type;
			if (this.gpu_used.length < this.gpu_slots) {
				while (this.gpu_used.length < this.gpu_slots) {
					this.gpu_used.push(new GPUSpecification(null));
				}
			}
		}
	}

	changeGpuUsed(): void {
		if (this.gpu_slots < this.gpu_used.length) {
			this.gpu_used = this.gpu_used.slice(0, this.gpu_slots);
		} else {
			while (this.gpu_slots > this.gpu_used.length) {
				this.gpu_used.push(new GPUSpecification(null));
			}
		}
	}
}
