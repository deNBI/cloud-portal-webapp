
import {VirtualMachine} from './virtualmachine';
import {Vmclient} from './vmclient';


export class Volume {
  volume_name: string;
  volume_project: string;
  volume_projectid: string;
  volume_openstackid: string;
  volume_size: number;
  volume_virtualmachine: VirtualMachine;
  volume_client = Vmclient;
}

