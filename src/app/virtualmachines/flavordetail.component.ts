import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Flavor} from './virtualmachinemodels/flavor'
import {OwlOptions, ResponsiveSettings} from 'ngx-owl-carousel-o';

@Component({
             selector: 'app-flavor-detail',
             templateUrl: 'flavordetail.component.html'

           })
export class FlavorDetailComponent {
  @Input() selectedFlavor: Flavor;
  @Input() flavors: Flavor[];
  @Output() readonly selectedFlavorChange: EventEmitter<Flavor> = new EventEmitter();
  responsive_selected: ResponsiveSettings = {
    0: {
      items: 1
    },
    400: {
      items: 2
    },
    740: {
      items: 3
    }
  };

  responsive_unselected: ResponsiveSettings = {
    0: {
      items: 1
    },
    400: {
      items: 2
    },
    740: {
      items: 3
    },
    900: {
      items: 4
    }
  };
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
    responsive: this.responsive_unselected,
    nav: true
  };

  /**
   * Changes the responsive of the Owl Carousel to 3 items max.
   */
  changeResponsiveOwl(): void {
    if (this.selectedFlavor) {
      this.customOptions.responsive = this.responsive_selected;

    }
  }

  /**
   * Sets the selected Flavor.
   * If a selectedFlavor exist it will be added to the flavor list and the new selectedFlavor will be removed.
   * @param flavor Flavor which will become the selected Flavor.
   */
  setSelectedFlavor(flavor: Flavor): void {
    this.changeResponsiveOwl();

    const indexNewSelectedFlavor: number = this.flavors.indexOf(flavor, 0);

    if (this.selectedFlavor) {
      this.flavors[indexNewSelectedFlavor] = this.selectedFlavor;
    } else {
      this.flavors.splice(indexNewSelectedFlavor, 1);
    }

    this.selectedFlavor = flavor;

    this.selectedFlavorChange.emit(this.selectedFlavor);

  }

  /**
   * Converts MB to GB
   * @param input MB number
   */
  convertMbToGb(input: number): number {
    return Math.floor(input / 1024)
  }
}
