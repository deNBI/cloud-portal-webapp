import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {Flavor} from './virtualmachinemodels/flavor'
import {OwlOptions, ResponsiveSettings} from 'ngx-owl-carousel-o';

@Component({
             selector: 'app-flavor-detail',
             templateUrl: 'flavordetail.component.html'

           })
export class FlavorDetailComponent implements OnInit {
  @Input() selectedFlavor: Flavor;
  @Input() flavors: Flavor[];
  @Output() readonly selectedFlavorChange: EventEmitter<Flavor> = new EventEmitter();

  flavors_per_row: number = 4;
  carousel_activated: boolean = true;
  window_size: number;
  carousel_window_min_xl_9: number = 1500;
  carousel_window_min_xl_8: number = 1380;
  carousel_window_min_xl6: number = 1200;

  //icons for graphics within flavor cards:

  static_img_folder: String = 'static/webapp/assets/img/';

  cpuIconPath: string;
  ramIconPath: string;
  storageIconPath: string;
  gpuIconPath: string;

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
      550: {
        items: 2

      },
      800: {
        items: 3
      },
      1200: {
        items: 4
      }
    },
    nav: true
  };

  ngOnInit(): void {
    this.window_size = window.innerWidth;

    this.cpuIconPath = this.static_img_folder + '/new_instance/cpu_icon.svg';
    this.ramIconPath = this.static_img_folder + '/new_instance/ram_icon.svg';
    this.storageIconPath = this.static_img_folder + '/new_instance/storage_icon.svg';
    this.gpuIconPath = this.static_img_folder + '/new_instance/gpu_icon.svg';

  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.window_size = window.innerWidth;
  }

  /**
   * Sets the selected Flavor.
   * If a selectedFlavor exist it will be added to the flavor list and the new selectedFlavor will be removed.
   * @param flavor Flavor which will become the selected Flavor.
   */
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

  /**
   * Converts MB to GB
   * @param input MB number
   */
  convertMbToGb(input: number): number {
    return Math.floor(input / 1024)
  }
}
