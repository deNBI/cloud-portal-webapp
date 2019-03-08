import {ImageService} from '../api-connector/image.service';
import {Component} from '@angular/core';

@Component({
    templateUrl: 'imageTag.component.html',
    providers: [ImageService]
})
export class ImageTagComponent {
    isLoaded = false;

    imageTags: [string, string][]

    constructor(private imageService: ImageService ) {
        this.imageService.getImageTags().subscribe(result => {
            this.imageTags = result;
            this.isLoaded = true;
        })
    }

    addTag(tag: string, description: string) {
        this.imageService.addImageTags(tag, description).subscribe(res => {
            this.imageService.getImageTags().subscribe(result => {
                this.imageTags = result
            })
        })
    }

    deleteTag(tag: string) {
        this.imageService.deleteImageTag(tag).subscribe(res => {
            this.imageService.getImageTags().subscribe(result => {
                this.imageTags = result
            })
        })
    }

}
