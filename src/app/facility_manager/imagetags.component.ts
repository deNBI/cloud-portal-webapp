import {ImageService} from '../api-connector/image.service';
import {Component, OnInit} from '@angular/core';
import {ImageLogo, ImageTag} from './image-tag';
import {forkJoin} from 'rxjs';

/**
 * ImageTag component.
 */
@Component({
             selector: 'app-image-tags',
             templateUrl: 'imageTag.component.html',
             providers: [ImageService]
           })
export class ImageTagComponent implements OnInit {

  title: string = 'Image Tags';

  isLoaded: boolean = false;
  alertRed: boolean = false;
  imageTags: ImageTag[];
  imageLogos: ImageLogo[];
  imageTag: string;
  imageUrl: string;

  constructor(private imageService: ImageService) {

  }

  ngOnInit(): void {
    forkJoin(this.imageService.getImageTags(), this.imageService.getImageLogos()).subscribe((res: any) => {
      this.imageTags = res[0];
      this.imageLogos = res[1];
      this.isLoaded = true;
    })
  }

  imageLogoTagAvailable(): boolean {
    for (const il of this.imageLogos) {
      if (il.tag === this.imageTag) {
        return true;
      }
    }

    return false;
  }

  addLogoTag(): void {
    this.imageService.addImageLogos(this.imageTag, this.imageUrl).subscribe((newTag: ImageLogo) => {
      this.imageLogos.push(newTag)
    })
  }

  removeLogoTag(logoTag: ImageLogo): void {
    this.imageService.deleteImageLogoTag(logoTag.id).subscribe(() => {
      const idx: number = this.imageLogos.indexOf(logoTag);
      this.imageLogos.splice(idx, 1);
    })
  }

  addTag(tag: string, description: string, input: HTMLInputElement): void {
    if (input.validity.valid) {
      this.imageService.addImageTags(tag.trim(), description).subscribe((newTag: ImageTag) => {
        this.imageTags.push(newTag)

      });
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
