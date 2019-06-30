import ***REMOVED***Component, EventEmitter, Input, Output***REMOVED*** from '@angular/core';
import ***REMOVED***Flavor***REMOVED*** from './virtualmachinemodels/flavor'
import ***REMOVED***OwlOptions***REMOVED*** from 'ngx-owl-carousel-o';

@Component(***REMOVED***
             selector: 'app-flavor-detail',
             templateUrl: 'flavordetail.component.html',

           ***REMOVED***)
export class FlavorDetailComponent ***REMOVED***
  @Input() selectedFlavor: Flavor;
  @Input() flavors: Flavor[];
  @Output() readonly selectedFlavorChange: EventEmitter<Flavor> = new EventEmitter();
  flavors_per_row: number = 4;
  carousel_activated: boolean = true;
  customOptions: OwlOptions = ***REMOVED***
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['<i class=\'fa fa-chevron-left\'></i>',
      '<i class=\'fa fa-chevron-right\'></i>'],
    responsive: ***REMOVED***
      0: ***REMOVED***
        items: 1
      ***REMOVED***,
      400: ***REMOVED***
        items: 2
      ***REMOVED***,
      740: ***REMOVED***
        items: 3
      ***REMOVED***,
      940: ***REMOVED***
        items: 4
      ***REMOVED***
    ***REMOVED***,
    nav: true
  ***REMOVED***;

  /**
   * Changes the responsive of the Owl Carousel to 3 items max.
   */
  changeResponsiveOwl(): void ***REMOVED***
    this.customOptions.responsive = ***REMOVED***
      0: ***REMOVED***
        items: 1
      ***REMOVED***,
      400: ***REMOVED***
        items: 2
      ***REMOVED***,
      740: ***REMOVED***
        items: 3
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***

  /**
   * Sets the selected Flavor.
   * If a selectedFlavor exist it will be added to the flavor list and the new selectedFlavor will be removed.
   * @param flavor Flavor which will become the selected Flavor.
   */
  setSelectedFlavor(flavor: Flavor): void ***REMOVED***
    const indexNewSelectedFlavor: number = this.flavors.indexOf(flavor, 0);

    if (this.selectedFlavor) ***REMOVED***
      this.flavors[indexNewSelectedFlavor] = this.selectedFlavor;
    ***REMOVED*** else ***REMOVED***
      this.flavors.splice(indexNewSelectedFlavor, 1);
    ***REMOVED***

    this.selectedFlavor = flavor;

    this.selectedFlavorChange.emit(this.selectedFlavor);
  ***REMOVED***

  /**
   * Converts MB to GB
   * @param input MB number
   */
  convertMbToGb(input: number): number ***REMOVED***
    return Math.floor(input / 1024)
  ***REMOVED***
***REMOVED***
