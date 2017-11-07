import { Image } from './image';
import { Flavor } from './flavor';



export class VirtualMachine {
  flavor: Flavor;
  image: Image;
  status: string;
  keyname: string;

}

