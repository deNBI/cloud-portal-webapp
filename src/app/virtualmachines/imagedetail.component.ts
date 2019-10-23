import {Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Image} from './virtualmachinemodels/image'
import {OwlOptions} from 'ngx-owl-carousel-o';

/**
 * Imagedetail component.
 */
@Component({
             selector: 'app-image-detail',
             templateUrl: 'imagedetail.component.html',
             styleUrls: ['./imagedetail.component.scss']

           })
export class ImageDetailComponent implements OnInit {
  @Input() selectedImage: Image;
  @Input() images: Image[];
  @Output() readonly selectedImageChange: EventEmitter<Image> = new EventEmitter();

  carousel_activated: boolean = true;
  images_per_row: number = 4;
  window_size: number;
  carousel_window_min_xl_9: number = 1700;
  carousel_window_min_xl_8: number = 1380;
  carousel_window_min_xl6: number = 1200;
  img_height: string = '120px';
  img_width: string = '210px';
  image_visible: boolean = true;

  customOptions: OwlOptions = {
    loop: false,
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

  public setImageVisible(): void {
    this.image_visible = !this.image_visible;
  }

  @HostListener('window:resize', ['$event']) onResize(event: any): void {
    this.window_size = window.innerWidth;
  }

}
