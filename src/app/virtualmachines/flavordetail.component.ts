import ***REMOVED***Component, EventEmitter, Input, Output***REMOVED*** from '@angular/core';
import ***REMOVED***Flavor***REMOVED*** from './virtualmachinemodels/flavor'

@Component(***REMOVED***
             selector: 'app-flavor-detail',
             templateUrl: 'flavordetail.component.html'

           ***REMOVED***)
export class FlavorDetailComponent ***REMOVED***
  @Input() selectedFlavor: Flavor;
  @Input() flavors: Flavor[];
  @Output() readonly selectedFlavorChange: EventEmitter<Flavor> = new EventEmitter();
  flavors_per_row: number = 4;
  flavors_visible: number = this.flavors_per_row;

  setSelectedFlavor(flavor: Flavor): void ***REMOVED***
    this.selectedFlavor = flavor;
    this.selectedFlavorChange.emit(this.selectedFlavor);
  ***REMOVED***
***REMOVED***
