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
  flavors_visible: number = this.flavors_per_row;
  carousel_activated: boolean = true;
  customOptions: OwlOptions = ***REMOVED***
    loop: true,
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

  setSelectedFlavor(flavor: Flavor): void ***REMOVED***
    this.selectedFlavor = flavor;
    this.selectedFlavorChange.emit(this.selectedFlavor);
  ***REMOVED***

  ramMBtoGB(ram: number): number ***REMOVED***
    return Math.floor(ram / 1024)
  ***REMOVED***
***REMOVED***
