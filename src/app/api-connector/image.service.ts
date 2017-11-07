import ***REMOVED*** Injectable ***REMOVED*** from '@angular/core';
import  ***REMOVED*** Image***REMOVED*** from '../virtualmachinemodels/image';

export const IMAGES: Image[] = [

  ***REMOVED*** id: '11', name: 'Ubuntu1',status:'ACTIVE',min_disk:20,min_ram: 2048 ***REMOVED***,
  ***REMOVED*** id: '12', name: 'Ubuntu2',status:'ACTIVE',min_disk:40,min_ram: 2048 ***REMOVED***,
  ***REMOVED*** id: '13', name: 'Ubuntu3',status:'PAUSED',min_disk:20,min_ram: 2048 ***REMOVED***,
];


@Injectable()
export class ImageService ***REMOVED***
  getImages(): Promise<Image[]>***REMOVED***
    return Promise.resolve(IMAGES);
  ***REMOVED***
***REMOVED***
