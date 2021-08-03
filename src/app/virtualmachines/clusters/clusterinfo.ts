// eslint-disable-next-line max-classes-per-file
import { VirtualMachine } from '../virtualmachinemodels/virtualmachine';
import { Client } from '../../vo_manager/clients/client.model';
import { Flavor } from '../virtualmachinemodels/flavor';
import { Image } from '../virtualmachinemodels/image';

/**
 *  Cluster Worker Batch
 */
export class WorkerBatch {
	index: number;
	flavor: Flavor;
	image: Image;
	worker_count: number = 0;
	running_worker: number = 0;
	delete_count: number = 0;
	upscale_count: number = 0;
	max_scale_up_count: number = 0;
	max_worker_count: number;
	usable_flavors: Flavor[] = [];
	valid_batch: boolean = false;

	constructor(index: number, batch?: Partial<WorkerBatch>) {
		this.index = index;
		if (batch) {
			Object.assign(this, batch);
			this.flavor = new Flavor(batch.flavor);
			this.image = new Image(batch.image);
			for (const flavor of batch.usable_flavors) {
				this.usable_flavors.push(new Flavor(flavor));
			}
		}
	}

	public setNewScalingDownWorkerCount(): void {
		this.worker_count -= this.delete_count;
		this.running_worker -= this.delete_count;
		this.delete_count = 0;
	}

	public setNewScalingUpWorkerCount(): void {
		this.worker_count += this.upscale_count;
		this.upscale_count = 0;

	}

}

/**
 * Clusterinfo
 */
export class Clusterinfo {
	master_instance: VirtualMachine;
	worker_instances: VirtualMachine[];
	worker_batches: WorkerBatch[];
	client: Client;
	public_ip: string;
	cluster_id: string;
	group_id: string;
	project_id: string;
	user: string;
	instances_count: number;
	launch_date: string;
	key_name: string;
	status: string;
	application_id: string;
	project: string;
	userlogin: string;
	master_instance_openstack_id: string;

	constructor(cl?: Partial<Clusterinfo>) {
		if (cl) {
			this.master_instance = new VirtualMachine(cl.master_instance);
			this.worker_instances = [];
			for (const clWorkerInstance of cl.worker_instances) {
				this.worker_instances.push(new VirtualMachine(clWorkerInstance));
			}
		}
		this.set_worker_baches(cl.worker_batches);
		this.sortWorkerByStatus();
	}

	public setScaleDownBatchesCount(): void {
		this.worker_batches.forEach((batch: WorkerBatch): void => {
			batch.setNewScalingDownWorkerCount();
			if (batch.worker_count === 0) {
				this.worker_batches.splice(this.worker_batches.indexOf(batch));
				this.setScaleDownBatchesCount();
			}

		});

	}

	public create_new_batch(): void {
		const new_batch: WorkerBatch = new WorkerBatch(this.get_batches_count() + 1);
		const image: Image = new Image();
		image.name = this.master_instance.image;
		new_batch.image = image;
		this.worker_batches.push(new_batch);
	}

	public remove_batch(batch: WorkerBatch): void {
		const idx: number = this.worker_batches.indexOf(batch);
		if (this.worker_batches.indexOf(batch) !== -1) {
			this.worker_batches.splice(idx, 1);
		}

	}

	private set_worker_baches(workerBatches: WorkerBatch[]): void {
		this.worker_batches = workerBatches.map(
			(workerBatch: WorkerBatch): WorkerBatch => new WorkerBatch(workerBatch.index, workerBatch),
		);
	}

	private get_batches_count(): number {
		return this.worker_batches.length;
	}

	private sortWorkerByStatus(): void {
		this.worker_instances.sort(
			(w1: VirtualMachine, w2: VirtualMachine): any => ((w1.status > w2.status) ? 1 : ((w2.status > w1.status) ? -1 : 0)),
		);
	}

}
