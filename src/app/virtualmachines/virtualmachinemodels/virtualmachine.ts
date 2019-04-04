import {Image} from './image';
import {Flavor} from './flavor';
import {Client} from '../clients/client.model';

/**
 * Virtualmachine class.
 */
export class VirtualMachine {
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

}
