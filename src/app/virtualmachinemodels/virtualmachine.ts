import {Image} from './image';
import {Flavor} from './flavor';


export class VirtualMachine {
  flavor: Flavor;
  image: Image;
  status: string;
  keyname: string;
  name: string;
  openstackid: string;
  created_at: string;
  stopped_at: string;
  elixir_id: string;
  username: string;
}

