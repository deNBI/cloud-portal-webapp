import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {Image} from './virtualmachinemodels/image'

/**
 * Image carousel slide.
 */
@Component({
             selector: 'app-image-slide',
             templateUrl: 'imageCarouselSlide.component.html',
  styleUrls: ['./imagedetail.component.scss']
           })
export class ImageCarouselSlideComponent implements OnInit {
  @Input() image: Image;
  @Input() selectedImage: Image;
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
