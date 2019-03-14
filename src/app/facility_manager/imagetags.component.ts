import ***REMOVED***ImageService***REMOVED*** from '../api-connector/image.service';
import ***REMOVED***Component***REMOVED*** from '@angular/core';

/**
 * ImageTag component.
 */
@Component(***REMOVED***
    templateUrl: 'imageTag.component.html',
    providers: [ImageService]
***REMOVED***)
export class ImageTagComponent ***REMOVED***
    isLoaded: boolean = false;

    imageTags: [string, string][];

    constructor(private imageService: ImageService) ***REMOVED***
        this.imageService.getImageTags().subscribe(result => ***REMOVED***
            this.imageTags = result;
            this.isLoaded = true;
        ***REMOVED***)
    ***REMOVED***


    addTag(tag: string, description: string): void ***REMOVED***
        this.imageService.addImageTags(tag, description).subscribe(() => ***REMOVED***
            this.imageService.getImageTags().subscribe(result => ***REMOVED***
                this.imageTags = result
            ***REMOVED***)
        ***REMOVED***)
    ***REMOVED***

    deleteTag(tag: string): void ***REMOVED***
        this.imageService.deleteImageTag(tag).subscribe(() => ***REMOVED***
            this.imageService.getImageTags().subscribe(result => ***REMOVED***
                this.imageTags = result
            ***REMOVED***)
        ***REMOVED***)
    ***REMOVED***

***REMOVED***
