import {ImageService} from '../api-connector/image.service';
import {Component, OnInit} from '@angular/core';
import {ImageTag} from './image-tag';

/**
 * ImageTag component.
 */
@Component({
             templateUrl: 'imageTag.component.html',
             providers: [ImageService]
           })
export class ImageTagComponent implements OnInit {
  isLoaded: boolean = false;

  imageTags: ImageTag[];

  constructor(private imageService: ImageService) {

  }

  ngOnInit(): void {
    this.imageService.getImageTags().subscribe((tags: ImageTag[]) => {
      this.imageTags = tags;
      this.isLoaded = true;
    })
  }

  addTag(tag: string, description: string): void {
    this.imageService.addImageTags(tag, description).subscribe((newTag: ImageTag) => {
      this.imageTags.push(newTag)

    })
  }

  deleteTag(tag: string): void {
    this.imageService.deleteImageTag(tag).subscribe(() => {
      this.imageService.getImageTags().subscribe((tags: ImageTag[]) => {
        this.imageTags = tags;
      })
    })
  }

}
