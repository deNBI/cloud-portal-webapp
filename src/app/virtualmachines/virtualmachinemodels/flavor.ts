import { FlavorType } from './flavorType';

/**
 * Flavor Class.
 */
export class Flavor {
	id: string;
	name: string;
	vcpus: number;
	ram_gib: number;
	ram_mb: number;
	rootdisk: number;
	gpu: number = 0;
	ephemeral_disk: number = 0;
	type: FlavorType;
	simple_vm: boolean;
	comment: string;
	counter: number;
	credits_costs_per_hour: number;
	compute_center: number;
	disabled: boolean;

	constructor(flavor?: Partial<Flavor>) {
		Object.assign(this, flavor);
		if (flavor) {
			if (flavor.type) {
				this.type = new FlavorType(flavor.type);
			}
		}
		this.disabled = false;
	}

	public setDisabled(disabled: boolean): void {
		this.disabled = disabled;
	}
}
