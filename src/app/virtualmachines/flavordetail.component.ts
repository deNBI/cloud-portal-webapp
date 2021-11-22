import {
	Component, EventEmitter, HostListener, Input, OnInit, Output,
} from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Router } from '@angular/router';
import { KeyValue } from '@angular/common';
import { Flavor } from './virtualmachinemodels/flavor';
import { GroupService } from '../api-connector/group.service';
import { ImageService } from '../api-connector/image.service';
import { KeyService } from '../api-connector/key.service';
import { FlavorService } from '../api-connector/flavor.service';
import { VirtualmachineService } from '../api-connector/virtualmachine.service';
import { ApiSettings } from '../api-connector/api-settings.service';
import { UserService } from '../api-connector/user.service';
import { ApplicationsService } from '../api-connector/applications.service';

/**
 * Flavor detail component.
 */
@Component({
	selector: 'app-flavor-detail',
	templateUrl: 'flavordetail.component.html',
	providers: [FlavorService],

})
export class FlavorDetailComponent implements OnInit {
	@Input() selectedFlavor: Flavor;
	@Input() creditsAllowed: boolean;
	@Input() flavors: Flavor[];
	@Output() readonly selectedFlavorChange: EventEmitter<Flavor> = new EventEmitter();
	selected_flavor_types: Flavor[] = [];
	selected_flavor_type: string = 'Standard Flavours';
	flavor_types: { [name: string]: Flavor[] } = {};
	flavors_per_row: number = 4;
	possible_flavors: Flavor[] = [];
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

	constructor(
		private flavorService: FlavorService,
	) {
		// eslint-disable-next-line no-empty-function
	}

	ngOnInit(): void {
		this.window_size = window.innerWidth;
		this.flavor_types = this.flavorService.sortFlavors(this.flavors);
		this.possible_flavors = this.flavor_types[this.selected_flavor_type];

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

	setSelectedFlavorType(key: string): void {
		this.selected_flavor_type = key;
		this.possible_flavors = this.flavor_types[key];
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	unsorted(a: KeyValue<number, string>, b: KeyValue<number, string>): number {
		return 0;
	}

}
