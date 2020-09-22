import {VirtualMachine} from '../virtualmachinemodels/virtualmachine';
import {Client} from '../../vo_manager/clients/client.model';
import {VirtualMachineStates} from '../virtualmachinemodels/virtualmachinestates';

/**
 * Clusterinfo
 */
export class Clusterinfo {
  master_instance: VirtualMachine;
  worker_instances: VirtualMachine[];
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

}
