import {Component, Input} from '@angular/core';
import {Image} from './virtualmachinemodels/image'

@Component({
    selector: 'app-image-detail',
    templateUrl: 'imagedetail.component.html'

})
export class ImageDetailComponent {
    @Input() image: Image;
    @Input() collapse1: boolean;
}
