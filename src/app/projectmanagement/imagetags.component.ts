import {ImageService} from "../api-connector/image.service";
import {Component, Input, ViewChild} from '@angular/core';

@Component({
    templateUrl: 'imageTag.component.html',
    providers: [ImageService]
})
export class ImageTagComponent {

    imageTags: [string, string][]


    constructor(private imageService: ImageService,) {
        this.imageService.getImageTags().subscribe(result => {
            this.imageTags=result;
            console.log(this.imageTags)
        })
}


}
