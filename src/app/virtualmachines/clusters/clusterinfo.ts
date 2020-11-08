import {VirtualMachine} from '../virtualmachinemodels/virtualmachine';
import {Client} from '../../vo_manager/clients/client.model';
import {Flavor} from '../virtualmachinemodels/flavor';
import {Image} from '../virtualmachinemodels/image';

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

  constructor(index: number, batch?: WorkerBatch) {
    this.index = index;
    if (batch) {
      this.index = batch.index;
      this.flavor = batch.flavor;
      this.image = batch.image;
      this.worker_count = batch.worker_count;
      this.running_worker = batch.running_worker;
      this.delete_count = batch.delete_count;
      this.upscale_count = batch.upscale_count;
      this.max_worker_count = batch.max_worker_count;
      this.max_scale_up_count = batch.max_scale_up_count;
    }
  }

  public setNewScalingDownWorkerCount(): void {
    this.worker_count = this.worker_count - this.delete_count;
    this.running_worker = this.running_worker - this.delete_count
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

  constructor(cl: Clusterinfo) {
    this.master_instance = cl.master_instance;
    this.worker_instances = cl.worker_instances;
    this.client = cl.client;
    this.public_ip = cl.public_ip;
    this.cluster_id = cl.cluster_id;
    this.group_id = cl.group_id;
    this.user = cl.user;
    this.instances_count = cl.worker_instances.length + 1;
    this.launch_date = cl.launch_date;
    this.key_name = cl.key_name;
    this.status = cl.status;
    this.application_id = cl.application_id;
    this.project = cl.project;
    this.userlogin = cl.userlogin;
    this.project_id = cl.project_id;
    this.master_instance_openstack_id = cl.master_instance_openstack_id;
    this.set_worker_baches(cl.worker_batches)
    this.sortWorkerByStatus()
  }

  public setScaleDownBatchesCount(): void {
    this.worker_batches.forEach((batch: WorkerBatch): void => {
      batch.setNewScalingDownWorkerCount()
      if (batch.worker_count === 0) {
        this.worker_batches.splice(this.worker_batches.indexOf(batch))
        this.setScaleDownBatchesCount()
      }

    })

  }

  public create_new_batch(): void {
    const new_batch: WorkerBatch = new WorkerBatch(this.get_batches_count() + 1)
    const image: Image = new Image()
    image.name = this.master_instance.image;
    new_batch.image = image;
    this.worker_batches.push(new_batch)
  }

  public remove_batch(batch: WorkerBatch): void {
    const idx: number = this.worker_batches.indexOf(batch)
    if (this.worker_batches.indexOf(batch) !== -1) {
      this.worker_batches.splice(idx, 1)
    }

  }

  private set_worker_baches(workerBatches: WorkerBatch[]): void {
    this.worker_batches = workerBatches.map((workerBatch: WorkerBatch): WorkerBatch => {
      return new WorkerBatch(workerBatch.index, workerBatch)
    })

  }

  private get_batches_count(): number {
    return this.worker_batches.length
  }

  private sortWorkerByStatus(): void {
    this.worker_instances.sort(
      (w1: VirtualMachine, w2: VirtualMachine): any => (w1.status > w2.status) ? 1 : ((w2.status > w1.status) ? -1 : 0));
  }

}
