import ***REMOVED***Component, EventEmitter, HostListener, Input, OnInit, Output***REMOVED*** from '@angular/core';
import ***REMOVED***Image***REMOVED*** from './virtualmachinemodels/image'
import ***REMOVED***OwlOptions, ResponsiveSettings***REMOVED*** from 'ngx-owl-carousel-o';

@Component(***REMOVED***
             selector: 'app-image-detail',
             templateUrl: 'imagedetail.component.html'

           ***REMOVED***)
export class ImageDetailComponent implements OnInit ***REMOVED***
  @Input() selectedImage: Image;
  @Input() images: Image[];
  @Output() readonly selectedImageChange: EventEmitter<Image> = new EventEmitter();
  carousel_activated: boolean = true;
  images_per_row: number = 4;
  window_size: number;
  carousel_window_min_xl_9: number = 1500;
  carousel_window_min_xl_8: number = 1380;
  carousel_window_min_xl6: number = 1200;

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
      550: ***REMOVED***
        items: 2

      ***REMOVED***,
      800: ***REMOVED***
        items: 3
      ***REMOVED***,
      1200: ***REMOVED***
        items: 4
      ***REMOVED***
    ***REMOVED***,
    nav: true
  ***REMOVED***;

  ngOnInit(): void ***REMOVED***
    this.window_size = window.innerWidth;

  ***REMOVED***

  @HostListener('window:resize', ['$event'])
  onResize(event): void ***REMOVED***
    this.window_size = window.innerWidth;
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
