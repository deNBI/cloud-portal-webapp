import ***REMOVED***Component, EventEmitter, HostListener, Input, OnInit, Output***REMOVED*** from '@angular/core';
import ***REMOVED***Flavor***REMOVED*** from './virtualmachinemodels/flavor'
import ***REMOVED***OwlOptions, ResponsiveSettings***REMOVED*** from 'ngx-owl-carousel-o';

@Component(***REMOVED***
             selector: 'app-flavor-detail',
             templateUrl: 'flavordetail.component.html'

           ***REMOVED***)
export class FlavorDetailComponent implements OnInit ***REMOVED***
  @Input() selectedFlavor: Flavor;
  @Input() flavors: Flavor[];
  @Output() readonly selectedFlavorChange: EventEmitter<Flavor> = new EventEmitter();

  flavors_per_row: number = 4;
  carousel_activated: boolean = true;
  window_size: number;
  carousel_window_min_xl_9: number = 1500;
  carousel_window_min_xl_8: number = 1380;
  carousel_window_min_xl6: number = 1200;

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
      550: ***REMOVED***
        items: 2

      ***REMOVED***,
      800: ***REMOVED***
        items: 3
      ***REMOVED***,
      1200: ***REMOVED***
        items: 4
      ***REMOVED***
    ***REMOVED***,
    nav: true
  ***REMOVED***;

  ngOnInit(): void ***REMOVED***
    this.window_size = window.innerWidth;

  ***REMOVED***

  @HostListener('window:resize', ['$event'])
  onResize(event): void ***REMOVED***
    this.window_size = window.innerWidth;
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
