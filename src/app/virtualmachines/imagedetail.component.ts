import {
	Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output,
} from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { forkJoin, Subscription } from 'rxjs';
import { Image } from './virtualmachinemodels/image';
import { ImageService } from '../api-connector/image.service';
import { ImageTypes } from './virtualmachinemodels/imageTypes';
import { Flavor } from './virtualmachinemodels/flavor';
import { BiocondaService } from '../api-connector/bioconda.service';
import { Client } from '../vo_manager/clients/client.model';

/**
 * Imagedetail component.
 */
@Component({
	selector: 'app-image-detail[client][project_id]',
	templateUrl: 'imagedetail.component.html',
	styleUrls: ['./imagedetail.component.scss'],
	providers: [ImageService, BiocondaService],
})
export class ImageDetailComponent implements OnInit, OnDestroy {
	@Input() selectedImage: Image;
	@Input() selectedFlavor: Flavor;
	@Output() readonly selectedImageChange: EventEmitter<Image> = new EventEmitter();
	@Input() isCluster: boolean = false;
	@Input() client: Client;
	@Input() project_id: number;
	images_loaded: boolean = false;
	resenv_names: string[];
	images: Image[] = [];

	subscription: Subscription = new Subscription();
	regexp_data_test_id: RegExp = /[ ().]/g;
	carousel_activated: boolean = true;
	images_per_row: number = 4;
	window_size: number;
	carousel_window_min_xl_9: number = 1700;
	carousel_window_min_xl_8: number = 1380;
	carousel_window_min_xl6: number = 1200;
	img_height: string = '120px!important';
	img_width: string = '210px!important';
	image_visible: boolean = true;
	selected_image_type: string = ImageTypes.IMAGE;
	image_types: { [name: string]: Image[] } = {};
	imageTypes = ImageTypes;
	image_selection: Image[];
	STATIC_IMG_FOLDER: String = 'static/webapp/assets/img/';
	RAM_ICON_PATH: string = `${this.STATIC_IMG_FOLDER}/new_instance/ram_icon.svg`;
	STORAGE_ICON_PATH: string = `${this.STATIC_IMG_FOLDER}/new_instance/storage_icon.svg`;

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

	constructor(private imageService: ImageService, private condaService: BiocondaService) {
		// eslint-disable-next-line no-empty-function
	}

	ngOnInit(): void {
		if (this.isCluster) {
			this.selected_image_type = ImageTypes.CLUSTER_IMAGE;
		} else {
			this.selected_image_type = ImageTypes.IMAGE;
		}
		this.window_size = window.innerWidth;
		this.prepareImages();
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	prepareImages(): void {
		this.images_loaded = false;
		forkJoin([
			this.condaService.getForcTemplates(this.client.id),
			this.imageService.getImages(this.project_id),
		]).subscribe((res: any) => {
			res[0].forEach(resenv => this.resenv_names.push(resenv.template_name));
			this.images = res[1];
			this.image_types = this.imageService.sortImages(this.images, this.resenv_names);
			this.image_selection = this.image_types[this.selected_image_type];
			this.images_loaded = true;
		});
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
