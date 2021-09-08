// eslint-disable-next-line max-classes-per-file
import { VirtualMachine } from '../virtualmachinemodels/virtualmachine';
import { Client } from '../../vo_manager/clients/client.model';
import { Flavor } from '../virtualmachinemodels/flavor';
import { Image } from '../virtualmachinemodels/image';
import { ApplicationRessourceUsage } from '../../applications/application-ressource-usage/application-ressource-usage';
import { VirtualMachineStates } from '../virtualmachinemodels/virtualmachinestates';

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
		Object.assign(this, batch);
		if (batch) {
			if (batch.flavor) {
				this.flavor = new Flavor(batch.flavor);
			}
			if (batch.image) {
				this.image = new Image(batch.image);
			}
			if (batch.usable_flavors) {
				for (const flavor of batch.usable_flavors) {
					this.usable_flavors.push(new Flavor(flavor));
				}
			}
		}
	}

	public setMaxWorkerCount(ressource_usage: ApplicationRessourceUsage): void {
		if (this.flavor) {

			this.max_worker_count = ressource_usage.calcMaxScaleUpWorkerInstancesByFlavor(
				this.flavor,
			);
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
	password: string;
	master_instance_openstack_id: string;

	constructor(cl?: Partial<Clusterinfo>) {
		Object.assign(this, cl);
		if (cl) {
			if (cl.master_instance) {
				this.master_instance = new VirtualMachine(cl.master_instance);
				/**
				 * TODO: Remove once cluster status is updated by api
				 */
				if (this.master_instance.status === VirtualMachineStates.SHUTOFF) {
					this.status = VirtualMachineStates.SHUTOFF;
				}
			}
			this.worker_instances = [];
			if (cl.worker_instances) {
				for (const clWorkerInstance of cl.worker_instances) {
					this.worker_instances.push(new VirtualMachine(clWorkerInstance));
				}
			}
			if (cl.worker_batches) {
				this.worker_batches = [];
				this.set_worker_batches(cl.worker_batches);
			}
			this.sortWorkerByStatus();
		}
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

	private set_worker_batches(workerBatches: WorkerBatch[]): void {
		// for (const worker_batch of workerBatches) {
		// 	this.worker_batches.push(new WorkerBatch(worker_batch.index, worker_batch));
		// }
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
