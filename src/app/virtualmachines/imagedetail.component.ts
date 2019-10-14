import {Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Image} from './virtualmachinemodels/image'
import {OwlOptions} from 'ngx-owl-carousel-o';
import {ImageLogoTags} from '../shared/shared_modules/baseClass/abstract-base-class';

@Component({
             selector: 'app-image-detail',
             templateUrl: 'imagedetail.component.html',
  styleUrls: ['./imagedetail.component.scss']

           })
export class ImageDetailComponent implements OnInit, OnChanges {
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

  ngOnChanges(changes: SimpleChanges): void {
    console.log('########');
    console.log(this.images);
    console.log('########');

  }

  ngOnInit(): void {
    this.window_size = window.innerWidth;
    this.images.forEach(img => {
      this.getImageLogoUrl(img)
    })

  }

  setSelectedImage(image: Image): void {
    console.log('set selected diamge')

    const indexNewSelectedImage: number = this.images.indexOf(image, 0);

    if (this.selectedImage) {
      console.log('seleceted set')
      this.images[indexNewSelectedImage] = this.selectedImage;
    } else {
      console.log('selected not set')
      this.images.splice(indexNewSelectedImage, 1);
    }

    //this.selectedImage = image;
    this.selectedImageChange.emit(image);

  }

  /**
   * Get Url of Image logo (first match)
   * @param image
   */
  getImageLogoUrl(image: Image): void {
    for (const tag of image.tags) {
      if (tag in ImageLogoTags) {
        image.logo_url = ImageLogoTags[tag];
        break;
      }
    }

  }

  public setImageVisible(): void {
    this.image_visible = !this.image_visible;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.window_size = window.innerWidth;
  }

}
