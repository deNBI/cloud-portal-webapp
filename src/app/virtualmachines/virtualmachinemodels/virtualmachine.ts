import ***REMOVED***Image***REMOVED*** from './image';
import ***REMOVED***Flavor***REMOVED*** from './flavor';
import ***REMOVED***Client***REMOVED*** from '../clients/client.model';

/**
 * Virtualmachine class.
 */
export class VirtualMachine ***REMOVED***
    flavor: Flavor;
    image: Image;
    project: string;
    status: string;
    keyname: string;
    name: string;
    client: Client;
    openstackid: string;
    created_at: string;
    stopped_at: string;
    elixir_id: string;
    username: string;
    floating_ip: string;
    ssh_command: string;

***REMOVED***
