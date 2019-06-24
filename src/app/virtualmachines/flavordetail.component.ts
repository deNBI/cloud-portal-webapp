import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Flavor} from './virtualmachinemodels/flavor'
import {OwlOptions} from 'ngx-owl-carousel-o';

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
  carousel_activated: boolean = true;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['Prev', 'Next'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  };

  setSelectedFlavor(flavor: Flavor): void {
    this.selectedFlavor = flavor;
    this.selectedFlavorChange.emit(this.selectedFlavor);
  }
}
