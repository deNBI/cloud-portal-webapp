import {ImageService} from '../api-connector/image.service';
import {Component, OnInit} from '@angular/core';
import {ImageTag} from './image-tag';
import {AbstractBaseClasse} from '../shared/shared_modules/baseClass/abstract-base-class';
import {ImageLogoTags} from '../shared/shared_modules/baseClass/abstract-base-class';
import {Image} from '../virtualmachines/virtualmachinemodels/image';

/**
 * ImageTag component.
 */
@Component({
             templateUrl: 'imageTag.component.html',
             providers: [ImageService]
           })
export class ImageTagComponent implements OnInit {
  isLoaded: boolean = false;
  alertRed: boolean = false;
  imageTags: ImageTag[];
  imageLogoTags: { [id: string]: string; } = ImageLogoTags;

  constructor(private imageService: ImageService) {

  }


  ngOnInit(): void {
    this.imageService.getImageTags().subscribe((tags: ImageTag[]) => {
      this.imageTags = tags;
      this.isLoaded = true;
    });
  }

  addTag(tag: string, description: string, input: HTMLInputElement): void {
    if (input.validity.valid) {
      this.imageService.addImageTags(tag.trim(), description).subscribe((newTag: ImageTag) => {
        this.imageTags.push(newTag)

      })
      this.alertRed = false;
    } else {
      this.alertRed = true;
    }
  }

  deleteTag(tag: string): void {
    this.imageService.deleteImageTag(tag).subscribe(() => {
      this.imageService.getImageTags().subscribe((tags: ImageTag[]) => {
        this.imageTags = tags;
      })
    })
  }

}
