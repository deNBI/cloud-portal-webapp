import {Image} from './image';
import {Flavor} from './flavor';
import {Vmclient} from './vmclient';


export class VirtualMachine {
    flavor: Flavor;
    image: Image;
    project: string;
    status: string;
    keyname: string;
    name: string;
    client: Vmclient;
    openstackid: string;
    created_at: string;
    stopped_at: string;
    elixir_id: string;
    username: string;
    floating_ip: string;
    ssh_command: string;


}

