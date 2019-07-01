import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {Image} from './virtualmachinemodels/image'
import {OwlOptions, ResponsiveSettings} from 'ngx-owl-carousel-o';

@Component({
             selector: 'app-image-detail',
             templateUrl: 'imagedetail.component.html'

           })
export class ImageDetailComponent implements OnInit {
  @Input() selectedImage: Image;
  @Input() images: Image[];
  @Output() readonly selectedImageChange: EventEmitter<Image> = new EventEmitter();
  carousel_activated: boolean = true;
  images_per_row: number = 4;
  window_size: number;
  carousel_window_min_xl_9: number = 1500;
  carousel_window_min_xl_8: number = 1380;
  carousel_window_min_xl6: number = 1200;

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
      550: {
        items: 2

      },
      800: {
        items: 3
      },
      1200: {
        items: 4
      }
    },
    nav: true
  };

  ngOnInit(): void {
    this.window_size = window.innerWidth;

  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.window_size = window.innerWidth;
  }

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

    this.selectedImageChange.emit(this.selectedImage);
  }

}
