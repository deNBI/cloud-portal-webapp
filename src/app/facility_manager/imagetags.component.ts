import ***REMOVED***ImageService***REMOVED*** from '../api-connector/image.service';
import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***ImageTag***REMOVED*** from './image-tag';

/**
 * ImageTag component.
 */
@Component(***REMOVED***
             templateUrl: 'imageTag.component.html',
             providers: [ImageService]
           ***REMOVED***)
export class ImageTagComponent implements OnInit ***REMOVED***
  isLoaded: boolean = false;
  alertRed: boolean = false;
  imageTags: ImageTag[];

  constructor(private imageService: ImageService) ***REMOVED***

  ***REMOVED***

  ngOnInit(): void ***REMOVED***
    this.imageService.getImageTags().subscribe((tags: ImageTag[]) => ***REMOVED***
      this.imageTags = tags;
      this.isLoaded = true;
    ***REMOVED***)
  ***REMOVED***

  addTag(tag: string, description: string, input: HTMLInputElement): void ***REMOVED***
    if (input.validity.valid) ***REMOVED***
    this.imageService.addImageTags(tag.trim(), description).subscribe((newTag: ImageTag) => ***REMOVED***
      this.imageTags.push(newTag)

    ***REMOVED***)
    this.alertRed = false;
    ***REMOVED*** else ***REMOVED***
      this.alertRed = true;
    ***REMOVED***
  ***REMOVED***

  deleteTag(tag: string): void ***REMOVED***
    this.imageService.deleteImageTag(tag).subscribe(() => ***REMOVED***
      this.imageService.getImageTags().subscribe((tags: ImageTag[]) => ***REMOVED***
        this.imageTags = tags;
      ***REMOVED***)
    ***REMOVED***)
  ***REMOVED***

***REMOVED***
