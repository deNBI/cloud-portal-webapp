import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {Image} from './virtualmachinemodels/image'
import {OwlOptions} from 'ngx-owl-carousel-o';
import {ImageLogoTags} from '../shared/shared_modules/baseClass/abstract-base-class';

@Component({
             selector: 'app-image-slide',
             templateUrl: 'imageCarouselSlide.component.html'

           })
export class ImageCarouselSlideComponent implements OnInit {
  @Input() image: Image;
  @Output() readonly selectedImageChange: EventEmitter<Image> = new EventEmitter();
  window_size: number;
  img_height: string = '120px';
  img_width: string = '210px';
  image_visible: boolean = true;

  ngOnInit(): void {
    this.window_size = window.innerWidth;
  }

  public setImageVisible(): void {
    this.image_visible = !this.image_visible;
  }

}
