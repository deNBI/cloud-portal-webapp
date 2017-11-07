import { Injectable } from '@angular/core';
import  { Image} from '../virtualmachinemodels/image';

export const IMAGES: Image[] = [

  { id: '11', name: 'Ubuntu1',status:'ACTIVE',min_disk:20,min_ram: 2048 },
  { id: '12', name: 'Ubuntu2',status:'ACTIVE',min_disk:40,min_ram: 2048 },
  { id: '13', name: 'Ubuntu3',status:'PAUSED',min_disk:20,min_ram: 2048 },
];


@Injectable()
export class ImageService {
  getImages(): Promise<Image[]>{
    return Promise.resolve(IMAGES);
  }
}
