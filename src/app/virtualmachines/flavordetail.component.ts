import {
	Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output,
} from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { KeyValue } from '@angular/common';
import { Flavor } from './virtualmachinemodels/flavor';
import { FlavorService } from '../api-connector/flavor.service';
import { Image } from './virtualmachinemodels/image';

/**
 * Flavor detail component.
 */
@Component({
	selector: 'app-flavor-detail',
	templateUrl: 'flavordetail.component.html',
	providers: [FlavorService],
})
export class FlavorDetailComponent implements OnInit, OnChanges {
	@Input() selectedFlavor: Flavor;
	@Input() selectedImage: Image;
	@Input() creditsAllowed: boolean;
	@Input() flavors: Flavor[];
	@Input() allowReload: boolean = false;
	@Output() readonly selectedFlavorChange: EventEmitter<Flavor> = new EventEmitter();
	@Output() readonly reloadFlavors: EventEmitter<any> = new EventEmitter<any>();

	regexp_data_test_id: RegExp = /[ ().]/g;
	selected_flavor_types: Flavor[] = [];
	selected_flavor_type: string = 'Standard Flavors';
	flavor_types: { [name: string]: Flavor[] } = {};
	flavors_per_row: number = 4;
	possible_flavors: Flavor[] = [];
	filter: string = '';
	filterTimeout = null;
	filterDebounceTime: number = 300;

	carousel_activated: boolean = true;
	window_size: number;
	carousel_window_min_xl_9: number = 1700;
	carousel_window_min_xl_8: number = 1380;
	carousel_window_min_xl6: number = 1200;

	filterFlavorsWithDebounce() {
		clearTimeout(this.filterTimeout);
		this.filterTimeout = setTimeout(() => {
			this.filterFlavors();
		}, this.filterDebounceTime);
	}

	filterFlavors(): void {
		if (this.filter) {
			this.possible_flavors = this.flavors.filter(image => image.name.toLowerCase().includes(this.filter.toLowerCase()));
		} else {
			this.possible_flavors = this.flavor_types[this.selected_flavor_type];
		}
	}

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
		navText: ['<i class=\'fa fa-chevron-left\'></i>', '<i class=\'fa fa-chevron-right\'></i>'],
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

	constructor(private flavorService: FlavorService) {
		// eslint-disable-next-line no-empty-function
	}

	ngOnInit(): void {
		this.window_size = window.innerWidth;
		this.flavor_types = this.flavorService.sortFlavors(this.flavors);
		this.possible_flavors = this.flavor_types[this.selected_flavor_type];
	}

	ngOnChanges() {
		this.flavor_types = this.flavorService.sortFlavors(this.flavors);
		this.possible_flavors = this.flavor_types[this.selected_flavor_type];
		this.filterFlavors();
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

	emitFlavorReload(): void {
		this.selectedFlavor = undefined;
		this.selected_flavor_type = 'Standard Flavors';
		this.reloadFlavors.emit();
	}

	setSelectedFlavorType(key: string): void {
		this.selected_flavor_type = key;
		this.possible_flavors = this.flavor_types[key];
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	unsorted(a: KeyValue<number, string>, b: KeyValue<number, string>): number {
		return 0;
	}
}
