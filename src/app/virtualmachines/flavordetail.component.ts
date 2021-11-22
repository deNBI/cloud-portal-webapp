import {
	Component, EventEmitter, HostListener, Input, OnInit, Output,
} from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Flavor } from './virtualmachinemodels/flavor';

/**
 * Flavor detail component.
 */
@Component({
	selector: 'app-flavor-detail',
	templateUrl: 'flavordetail.component.html',

})
export class FlavorDetailComponent implements OnInit {
	@Input() selectedFlavor: Flavor;
	@Input() creditsAllowed: boolean;
	@Input() flavors: Flavor[];
	@Output() readonly selectedFlavorChange: EventEmitter<Flavor> = new EventEmitter();
	flavors_per_row: number = 4;
	carousel_activated: boolean = true;
	window_size: number;
	carousel_window_min_xl_9: number = 1700;
	carousel_window_min_xl_8: number = 1380;
	carousel_window_min_xl6: number = 1200;

	// icons for graphics within flavor cards:

	STATIC_IMG_FOLDER: String = 'static/webapp/assets/img/';

	CPU_ICON_PATH: string = `${this.STATIC_IMG_FOLDER}/new_instance/cpu_icon.svg`;
	RAM_ICON_PATH: string = `${this.STATIC_IMG_FOLDER}/new_instance/ram_icon.svg`;
	STORAGE_ICON_PATH: string = `${this.STATIC_IMG_FOLDER}/new_instance/storage_icon.svg`;
	GPU_ICON_PATH: string = `${this.STATIC_IMG_FOLDER}/new_instance/gpu_icon.svg`;
	CREDITS_ICON_PATH: string = `${this.STATIC_IMG_FOLDER}/new_instance/credits_icon.svg`;

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
				items: 1,
			},
			550: {
				items: 2,

			},
			800: {
				items: 3,
			},
			1200: {
				items: 4,
			},
		},
		nav: true,
	};

	ngOnInit(): void {
		this.window_size = window.innerWidth;

	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	@HostListener('window:resize', ['$event']) onResize(event: any): void {
		this.window_size = window.innerWidth;
	}

	/**
	 * Sets the selected Flavor.
	 * If a selectedFlavor exist it will be added to the flavor list and the new selectedFlavor will be removed.
	 *
	 * @param flavor Flavor which will become the selected Flavor.
	 */
	setSelectedFlavor(flavor: Flavor): void {

		this.selectedFlavor = flavor;
		this.selectedFlavorChange.emit(this.selectedFlavor);

	}

}
