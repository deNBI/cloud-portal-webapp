import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Image} from './virtualmachinemodels/image'
import {Flavor} from './virtualmachinemodels/flavor';
import {OwlOptions, ResponsiveSettings} from 'ngx-owl-carousel-o';

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
  images_per_row: number = 4;
  responsive_selected: ResponsiveSettings = {
    0: {
      items: 1
    },
    400: {
      items: 2
    },
    740: {
      items: 3
    }
  };

  responsive_unselected: ResponsiveSettings = {
    0: {
      items: 1
    },
    400: {
      items: 2
    },
    740: {
      items: 3
    },
    900: {
      items: 4
    }
  };
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['<i class=\'fa fa-chevron-left\'></i>',
      '<i class=\'fa fa-chevron-right\'></i>'],
    responsive: this.responsive_unselected,
    nav: true
  };

  /**
   * Sets the selected Image.
   * If a selectedImage exist it will be added to the flavor list and the new selectedImage will be removed.
   * @param image Image which will become the selected Flavor.
   */
  setSelectedImage(image: Image): void {

    const indexNewSelectedImage: number = this.images.indexOf(image, 0);

    if (this.selectedImage) {
      this.images[indexNewSelectedImage] = this.selectedImage;
    } else {
      this.images.splice(indexNewSelectedImage, 1);
    }

    this.selectedImage = image;
    this.changeResponsiveOwl();

    this.selectedImageChange.emit(this.selectedImage);
  }

  /**
   * Changes the responsive of the Owl Carousel to 3 items max.
   */
  changeResponsiveOwl(): void {
    if (this.selectedImage) {
      this.customOptions.responsive = this.responsive_selected;

    }
  }
}
