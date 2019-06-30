import ***REMOVED***Component, EventEmitter, Input, Output***REMOVED*** from '@angular/core';
import ***REMOVED***Image***REMOVED*** from './virtualmachinemodels/image'
import ***REMOVED***Flavor***REMOVED*** from './virtualmachinemodels/flavor';
import ***REMOVED***OwlOptions***REMOVED*** from 'ngx-owl-carousel-o';

@Component(***REMOVED***
             selector: 'app-image-detail',
             templateUrl: 'imagedetail.component.html'

           ***REMOVED***)
export class ImageDetailComponent ***REMOVED***
  @Input() selectedImage: Image;
  @Input() images: Image[];
  @Input() collapse1: boolean;
  @Output() readonly selectedImageChange: EventEmitter<Image> = new EventEmitter();
  carousel_activated: boolean = true;
  images_per_row: number = 4;
  customOptions: OwlOptions = ***REMOVED***
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['<i class=\'fa fa-chevron-left\'></i>',
      '<i class=\'fa fa-chevron-right\'></i>'],
    responsive: ***REMOVED***
      0: ***REMOVED***
        items: 1
      ***REMOVED***,
      400: ***REMOVED***
        items: 2
      ***REMOVED***,
      740: ***REMOVED***
        items: 3
      ***REMOVED***,
      940: ***REMOVED***
        items: 4
      ***REMOVED***
    ***REMOVED***,
    nav: true
  ***REMOVED***;

  /**
   * Changes the responsive of the Owl Carousel to 3 items max.
   */
  changeResponsiveOwl(): void ***REMOVED***
    this.customOptions.responsive = ***REMOVED***
      0: ***REMOVED***
        items: 1
      ***REMOVED***,
      400: ***REMOVED***
        items: 2
      ***REMOVED***,
      740: ***REMOVED***
        items: 3
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***

  /**
   * Sets the selected Image.
   * If a selectedImage exist it will be added to the flavor list and the new selectedImage will be removed.
   * @param image Image which will become the selected Flavor.
   */
  setSelectedImage(image: Image): void ***REMOVED***
    const indexNewSelectedImage: number = this.images.indexOf(image, 0);

    if (this.selectedImage) ***REMOVED***
      this.images[indexNewSelectedImage] = this.selectedImage;
    ***REMOVED*** else ***REMOVED***
      this.images.splice(indexNewSelectedImage, 1);
    ***REMOVED***

    this.selectedImage = image;
    this.selectedImageChange.emit(this.selectedImage);
  ***REMOVED***
***REMOVED***
