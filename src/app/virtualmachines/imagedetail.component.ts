import {
	Component, EventEmitter, HostListener, Input, OnInit, Output,
} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {Image, ImageTypes} from './virtualmachinemodels/image';
import {Flavor} from "./virtualmachinemodels/flavor";
import {GroupService} from "../api-connector/group.service";
import {ImageService} from "../api-connector/image.service";
import {KeyService} from "../api-connector/key.service";
import {FlavorService} from "../api-connector/flavor.service";
import {VirtualmachineService} from "../api-connector/virtualmachine.service";
import {ApiSettings} from "../api-connector/api-settings.service";
import {UserService} from "../api-connector/user.service";
import {ApplicationsService} from "../api-connector/applications.service";
import {Router} from "@angular/router";

/**
 * Imagedetail component.
 */
@Component({
	selector: 'app-image-detail',
	templateUrl: 'imagedetail.component.html',
	styleUrls: ['./imagedetail.component.scss'],
	providers: [ImageService]

})
export class ImageDetailComponent implements OnInit {
	@Input() selectedImage: Image;
	@Input() images: Image[];
	@Output() readonly selectedImageChange: EventEmitter<Image> = new EventEmitter();

	carousel_activated: boolean = true;
	images_per_row: number = 4;
	window_size: number;
	carousel_window_min_xl_9: number = 1700;
	carousel_window_min_xl_8: number = 1380;
	carousel_window_min_xl6: number = 1200;
	img_height: string = '120px';
	img_width: string = '210px';
	image_visible: boolean = true;
	selected_image_type: string = ImageTypes.IMAGE;
	image_types: { [name: string]: Image[] } = {};
	imageTypes = ImageTypes;
	image_selection: Image[];


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
		private imageService: ImageService,
	) {
		// eslint-disable-next-line no-empty-function
	}

	ngOnInit(): void {
		this.window_size = window.innerWidth;
		this.image_types = this.imageService.sortImages(this.images);
		this.image_selection = this.image_types[this.selected_image_type];

	}

	setSelectedImageType(key: string): void {
		this.selected_image_type = key;
		this.image_selection = this.image_types[key];
	}

	public setImageVisible(): void {
		this.image_visible = !this.image_visible;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	@HostListener('window:resize', ['$event']) onResize(event: any): void {
		this.window_size = window.innerWidth;
	}

}
