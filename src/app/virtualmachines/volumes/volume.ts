import ***REMOVED***VirtualMachine***REMOVED*** from '../virtualmachinemodels/virtualmachine';
import ***REMOVED***Client***REMOVED*** from '../clients/client.model';

/**
 * Volume class.
 */
export class Volume ***REMOVED***
    volume_name: string;
    volume_project: string;
    volume_projectid: string;
    volume_openstackid: string;
    volume_size: number;
    volume_virtualmachine: VirtualMachine;
    volume_client: Client;
***REMOVED***
