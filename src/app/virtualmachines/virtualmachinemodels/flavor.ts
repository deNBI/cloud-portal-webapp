import { FlavorType } from './flavorType';

/**
 * Flavor Class.
 */
export class Flavor {
	id: string;
	name: string;
	vcpus: number;
	ram: number;
	rootdisk: number;
	gpu: number;
	ephemeral_disk: number;
	type: FlavorType;
	simple_vm: boolean;
	comment: string;
	counter: number;
	credits_per_hour: number;
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
		if (flavor['credits_costs_per_hour']) {
			this.credits_per_hour = flavor['credits_costs_per_hour'];
		}
	}

	public setDisabled(disabled: boolean): void {
		this.disabled = disabled;
	}
}
