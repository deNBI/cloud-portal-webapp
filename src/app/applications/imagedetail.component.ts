import { Component,Input } from '@angular/core';
import { Image } from '../virtualmachinemodels/image'
@Component({
  selector: 'image-detail',
  templateUrl: 'imagedetail.component.html'

})
export class ImageDetailComponent {
  @Input() image: Image;
  @Input() collapse1: boolean;
}
