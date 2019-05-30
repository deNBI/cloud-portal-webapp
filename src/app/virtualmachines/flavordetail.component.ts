import ***REMOVED***Component, Input***REMOVED*** from '@angular/core';
import ***REMOVED***Flavor***REMOVED*** from './virtualmachinemodels/flavor'

@Component(***REMOVED***
    selector: 'app-flavor-detail',
    templateUrl: 'flavordetail.component.html'

***REMOVED***)
export class FlavorDetailComponent ***REMOVED***
    @Input() flavor: Flavor;
    @Input() collapse2: boolean;
***REMOVED***
