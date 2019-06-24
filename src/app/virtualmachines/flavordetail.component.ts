import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Flavor} from './virtualmachinemodels/flavor'

@Component({
             selector: 'app-flavor-detail',
             templateUrl: 'flavordetail.component.html'

           })
export class FlavorDetailComponent {
  @Input() selectedFlavor: Flavor;
  @Input() flavors: Flavor[];
  @Output() readonly selectedFlavorChange: EventEmitter<Flavor> = new EventEmitter();
  flavors_per_row: number = 4;
  flavors_visible: number = this.flavors_per_row;

  setSelectedFlavor(flavor: Flavor): void {
    this.selectedFlavor = flavor;
    this.selectedFlavorChange.emit(this.selectedFlavor);
  }
}
