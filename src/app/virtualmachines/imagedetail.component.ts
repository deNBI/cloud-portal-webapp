import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Image} from './virtualmachinemodels/image'
import {Flavor} from './virtualmachinemodels/flavor';
import {OwlOptions} from 'ngx-owl-carousel-o';

@Component({
             selector: 'app-image-detail',
             templateUrl: 'imagedetail.component.html'

           })
export class ImageDetailComponent {
  @Input() selectedImage: Image;
  @Input() images: Image[];
  @Input() collapse1: boolean;
  @Output() readonly selectedImageChange: EventEmitter<Image> = new EventEmitter();
  carousel_activated: boolean = true;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['<i class=\'fa fa-chevron-left\'></i>',
      '<i class=\'fa fa-chevron-right\'></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  };

  setSelectedImage(image: Image): void {
    this.selectedImage = image;
    this.selectedImageChange.emit(this.selectedImage);
  }
}
