import { Flavor } from '../../virtualmachines/virtualmachinemodels/flavor';
import { WorkerBatch } from '../../virtualmachines/clusters/clusterinfo';

/**
 * Ressourceusage.
 */
export class ApplicationRessourceUsage {
	number_vms: number;
	used_vms: number;
	max_volume_storage: number;
	used_volume_storage: number;
	volume_counter: number;
	used_volumes: number;
	cores_total: number;
	cores_used: number;
	ram_total: number;
	ram_used: number;
	gpus_max: number;
	gpus_used: number;

	constructor(usage: ApplicationRessourceUsage) {
		this.number_vms = usage.number_vms;
		this.used_vms = usage.used_vms;
		this.max_volume_storage = usage.max_volume_storage;
		this.used_volume_storage = usage.used_volume_storage;
		this.volume_counter = usage.volume_counter;
		this.used_volumes = usage.used_volumes;
		this.cores_total = usage.cores_total;
		this.cores_used = usage.cores_used;
		this.ram_total = usage.ram_total;
		this.ram_used = usage.ram_used;
		this.gpus_max = usage.gpus_max;
		this.gpus_used = usage.gpus_used;
	}

	filterFlavorsTest(flavor: Flavor, possible_flavors: Flavor[], worker_batches: WorkerBatch[], master_flavor?: Flavor): boolean {
		let batches_ram: number = 0;
		let batches_cpu: number = 0;
		let batches_gpus: number = 0;

		if (master_flavor) {
			batches_ram += master_flavor.ram;
			batches_cpu += master_flavor.vcpus;
			batches_gpus += master_flavor.gpu;
		}

		worker_batches.forEach((batch: WorkerBatch): void => {
			if (batch.flavor) {
				batches_ram += (batch.flavor.ram * batch.worker_count);
				batches_cpu += batch.flavor.vcpus * batch.worker_count;
				batches_gpus += batch.flavor.gpu * batch.worker_count;
			}
		});
		const tmp_flavors: Flavor[] = [];
		const available_cores: number = this.cores_total - (flavor.vcpus + this.cores_used + batches_cpu);
		const available_ram: number = this.ram_total - (flavor.ram + this.ram_used + batches_ram);
		const available_gpu: number = this.gpus_max - (flavor.gpu + this.gpus_used + batches_gpus);
		for (const fl of possible_flavors) {
			if (fl.vcpus <= available_cores && fl.ram <= available_ram && fl.gpu <= available_gpu) {
				tmp_flavors.push(fl);
			}
		}

		return tmp_flavors.length > 0;
	}

	filterFlavors(new_cores: number, new_ram: number, new_gpus: number, possible_flavors: Flavor[], worker_batches: WorkerBatch[]): Flavor[] {
		let batches_ram: number = 0;
		let batches_cpu: number = 0;
		let batches_gpus: number = 0;

		worker_batches.forEach((batch: WorkerBatch): void => {
			if (batch.flavor) {
				batches_ram += (batch.flavor.ram * batch.worker_count);
				batches_cpu += batch.flavor.vcpus * batch.worker_count;
				batches_gpus += batch.flavor.gpu * batch.worker_count;
			}
		});
		const tmp_flavors: Flavor[] = [];
		const available_cores: number = this.cores_total - (new_cores + this.cores_used + batches_cpu);
		const available_ram: number = this.ram_total - (new_ram + this.ram_used + batches_ram);
		const available_gpu: number = this.gpus_max - (new_gpus + this.gpus_used + batches_gpus);
		for (const fl of possible_flavors) {
			if (fl.vcpus <= available_cores && fl.ram <= available_ram && fl.gpu <= available_gpu) {
				tmp_flavors.push(fl);
			}
		}

		return tmp_flavors;
	}

	calcMaxWorkerInstancesByFlavor(master_flavor: Flavor, selectedBatch: WorkerBatch, worker_batches: WorkerBatch[]): number {
		let batches_ram: number = 0;
		let batches_cpu: number = 0;
		let batches_vms: number = 0;

		worker_batches.forEach((batch: WorkerBatch): void => {
			if (batch.flavor && batch !== selectedBatch) {
				batches_ram += Math.ceil(batch.flavor.ram * batch.worker_count);
				batches_cpu += batch.flavor.vcpus * batch.worker_count;
				batches_vms += batch.worker_count;
			}
		});
		const ram_max_vms: number = (this.ram_total - this.ram_used - master_flavor.ram - batches_ram)
			/ selectedBatch.flavor.ram;
		const cpu_max_vms: number = (this.cores_total - this.cores_used - master_flavor.vcpus - batches_cpu)
			/ selectedBatch.flavor.vcpus;

		return Math.floor(Math.min(ram_max_vms, cpu_max_vms, this.number_vms - this.used_vms - 1 - batches_vms));
	}

	calcMaxScaleUpWorkerInstancesByFlavor(worker_flavor: Flavor): number {
		const ram_max_vms: number = (this.ram_total - this.ram_used)
			/ worker_flavor.ram;
		const cpu_max_vms: number = (this.cores_total - this.cores_used)
			/ worker_flavor.vcpus;

		return Math.floor(Math.min(ram_max_vms, cpu_max_vms, this.number_vms - this.used_vms));
	}

}
