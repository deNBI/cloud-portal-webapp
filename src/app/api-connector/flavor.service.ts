import ***REMOVED*** Injectable ***REMOVED*** from '@angular/core';
import  ***REMOVED*** Flavor***REMOVED*** from '../virtualmachinemodels/flavor';

export const FLAVORS: Flavor[] = [

  ***REMOVED*** id: '11', name: 'Flav1',disk:20,vcpus:2,ram: 2048 ***REMOVED***,
  ***REMOVED*** id: '12', name: 'Flav2',disk:10,vcpus:4,ram: 4096 ***REMOVED***,
  ***REMOVED*** id: '13', name: 'Flav3',disk:220,vcpus:2,ram: 2048 ***REMOVED***,
];


@Injectable()
export class FlavorService ***REMOVED***
  getFlavors(): Promise<Flavor[]>***REMOVED***
    return Promise.resolve(FLAVORS);
  ***REMOVED***
***REMOVED***
