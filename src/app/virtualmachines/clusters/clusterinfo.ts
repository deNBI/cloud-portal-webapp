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
  delete_count: number = 0;
  upscale_count: number = 0;
  max_scale_up_count: number = 0;
  max_worker_count: number;

  constructor(index: number) {
    this.index = index;
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
    this.worker_batches = cl.worker_batches;
    this.master_instance_openstack_id = cl.master_instance_openstack_id;
    this.sortWorkerByStatus()
  }

  private sortWorkerByStatus(): void {
    this.worker_instances.sort((w1: VirtualMachine, w2: VirtualMachine): any => (w1.status > w2.status) ? 1 : ((w2.status > w1.status) ? -1 : 0));
  }

}
