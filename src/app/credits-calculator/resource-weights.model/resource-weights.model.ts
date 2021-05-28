/**
 * Application class.
 */
// eslint-disable-next-line max-classes-per-file
export class ResourceWeight {

	vcpu_weight: VCPUWeight;
	ram_weight: RAMWeight;
	resource_set_date: Date

	constructor(rw: ResourceWeight | null) {
		if (rw) {
			this.vcpu_weight = rw.vcpu_weight;
			this.ram_weight = rw.ram_weight;
			this.resource_set_date = rw.resource_set_date;
		}
	}
}

export class VCPUWeight {
	value: number
	factor: number

	constructor(vw: VCPUWeight | null) {
		if (vw) {
			this.value = vw.value;
			this.factor = vw.factor;
		}
	}
}

export class RAMWeight {
	value: number
	factor: number

	constructor(rw: RAMWeight | null) {
		if (rw) {
			this.value = rw.value;
			this.factor = rw.factor;
		}
	}
}
