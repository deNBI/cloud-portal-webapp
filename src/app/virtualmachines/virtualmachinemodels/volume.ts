
import ***REMOVED***VirtualMachine***REMOVED*** from './virtualmachine';
import ***REMOVED***Vmclient***REMOVED*** from './vmclient';


export class Volume ***REMOVED***
  volume_name: string;
  volume_project: string;
  volume_projectid: string;
  volume_openstackid: string;
  volume_size: number;
  volume_virtualmachine: VirtualMachine;
  volume_client = Vmclient;
***REMOVED***

