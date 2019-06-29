import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Flavor} from './virtualmachinemodels/flavor'
import {OwlOptions} from 'ngx-owl-carousel-o';

@Component({
             selector: 'app-flavor-detail',
             templateUrl: 'flavordetail.component.html',

           })
export class FlavorDetailComponent {
  @Input() selectedFlavor: Flavor;
  @Input() flavors: Flavor[];
  @Output() readonly selectedFlavorChange: EventEmitter<Flavor> = new EventEmitter();
  flavors_per_row: number = 4;
  carousel_activated: boolean = true;
  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['<i class=\'fa fa-chevron-left\'></i>',
      '<i class=\'fa fa-chevron-right\'></i>'],
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

  changeResponsiveowl(): void {
    this.customOptions.responsive = {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    }
  }

  setSelectedFlavor(flavor: Flavor): void {
    const indexNewSelectedFlavor: number = this.flavors.indexOf(flavor, 0);

    if (this.selectedFlavor) {
      this.flavors[indexNewSelectedFlavor] = this.selectedFlavor;
    } else {
      this.flavors.splice(indexNewSelectedFlavor, 1);
    }

    this.selectedFlavor = flavor;

    this.selectedFlavorChange.emit(this.selectedFlavor);
  }

  ramMBtoGB(ram: number): number {
    return Math.floor(ram / 1024)
  }
}
