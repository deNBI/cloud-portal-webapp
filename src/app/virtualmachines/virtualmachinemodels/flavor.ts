import {FlavorType} from './flavorType';

/**
 * Flavor Class.
 */
export class Flavor {
  id: string;
  name: string;
  vcpus: number;
  ram: number;
  rootdisk: number;
  gpu: number;
  ephemeral_disk: number;
  type: FlavorType;
  simple_vm: boolean;
  comment: string;
  counter: number;
}
