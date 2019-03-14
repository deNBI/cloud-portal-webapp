import {ImageService} from '../api-connector/image.service';
import {Component} from '@angular/core';

/**
 * ImageTag component.
 */
@Component({
    templateUrl: 'imageTag.component.html',
    providers: [ImageService]
})
export class ImageTagComponent {
    isLoaded: boolean = false;

    imageTags: [string, string][];

    constructor(private imageService: ImageService) {
        this.imageService.getImageTags().subscribe(result => {
            this.imageTags = result;
            this.isLoaded = true;
        })
    }


    addTag(tag: string, description: string): void {
        this.imageService.addImageTags(tag, description).subscribe(() => {
            this.imageService.getImageTags().subscribe(result => {
                this.imageTags = result
            })
        })
    }

    deleteTag(tag: string): void {
        this.imageService.deleteImageTag(tag).subscribe(() => {
            this.imageService.getImageTags().subscribe(result => {
                this.imageTags = result
            })
        })
    }

}
