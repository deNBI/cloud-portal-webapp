import ***REMOVED*** Component, Input ***REMOVED*** from '@angular/core';
import ***REMOVED*** Image ***REMOVED*** from './virtualmachinemodels/image'
@Component(***REMOVED***
  selector: 'image-detail',
  templateUrl: 'imagedetail.component.html'

***REMOVED***)
export class ImageDetailComponent ***REMOVED***
  @Input() image: Image;
  @Input() collapse1: boolean;
***REMOVED***
