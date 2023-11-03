/**
 * GPU Specification class.
 */

export class GPUSpecification {
	id: string;
	type: string = 'UNUSED';
	is_changeable: boolean = false;
	ram: number = 0;
	cores: number = 0;

	constructor(gpuSpecification: GPUSpecification | null) {
		if (gpuSpecification) {
			this.id = gpuSpecification.id;
			this.type = gpuSpecification.type;
			this.ram = gpuSpecification.ram;
			this.cores = gpuSpecification.cores;
			this.is_changeable = gpuSpecification.is_changeable;
		}
	}
}
