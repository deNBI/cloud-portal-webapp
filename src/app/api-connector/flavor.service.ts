import { Injectable } from '@angular/core';
import  { Flavor} from '../virtualmachinemodels/flavor';

export const FLAVORS: Flavor[] = [

  { id: '11', name: 'Flav1',disk:20,vcpus:2,ram: 2048 },
  { id: '12', name: 'Flav2',disk:10,vcpus:4,ram: 4096 },
  { id: '13', name: 'Flav3',disk:220,vcpus:2,ram: 2048 },
];


@Injectable()
export class FlavorService {
  getFlavors(): Promise<Flavor[]>{
    return Promise.resolve(FLAVORS);
  }
}
