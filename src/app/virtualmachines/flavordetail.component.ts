import {Component, Input} from '@angular/core';
import {Flavor} from './virtualmachinemodels/flavor'

@Component({
    selector: 'app-flavor-detail',
    templateUrl: 'flavordetail.component.html'

})
export class FlavorDetailComponent {
    @Input() flavor: Flavor;
    @Input() collapse2: boolean;
}
