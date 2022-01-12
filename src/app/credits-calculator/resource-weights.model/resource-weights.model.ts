/**
 * Application class.
 */
// eslint-disable-next-line max-classes-per-file
export interface IResourceWeight {
	vcpus: IVCPUWeight[];
	memory_mb: IRAMWeight[];
	resource_set_timestamp: number;
}

export interface IVCPUWeight {
	value: number;
	weight: number;
}

export interface IRAMWeight {
	value: number;
	weight: number;
}

export class ResourceWeight {

	vcpus: VCPUWeight[];
	memory_mb: RAMWeight[];
	resource_set_timestamp: number;
	resource_set_date: Date;
	used: boolean = false;

	constructor(rw: IResourceWeight) {
		this.vcpus = [];
		this.memory_mb = [];
		for (const vw of rw.vcpus) {
			this.vcpus.push(new VCPUWeight(vw));
		}
		for (const mw of rw.memory_mb) {
			this.memory_mb.push(new RAMWeight(mw));
		}

		this.sort_all();

		this.resource_set_timestamp = rw.resource_set_timestamp;
		this.resource_set_date = new Date(rw.resource_set_timestamp * 1000);
	}

	sort_all(): void {
		this.vcpus.sort(
			(a, b)	=>	(a.value < b.value ? -1 : 1),
		);
		this.memory_mb.sort(
			(a, b)	=>	(a.value < b.value ? -1 : 1),
		);
	}

	set_used(): void {
		this.used = true;
	}

	set_unused(): void {
		this.used = false;
	}
}

export class VCPUWeight {
	value: number;
	weight: number;

	constructor(vw: IVCPUWeight) {
		this.value = vw.value;
		this.weight = vw.weight;
	}
}

export class RAMWeight {
	value: number;
	weight: number;

	constructor(mw: IRAMWeight) {
		this.value = mw.value;
		this.weight = mw.weight;
	}
}
