import {
	Component, EventEmitter, Input, OnInit, Output,
} from '@angular/core';
import { Image } from './virtualmachinemodels/image';
import { Flavor } from './virtualmachinemodels/flavor';

/**
 * Image carousel slide.
 */
@Component({
	selector: 'app-image-slide',
	templateUrl: 'imageCarouselSlide.component.html',
	styleUrls: ['./imagedetail.component.scss'],
})
export class ImageCarouselSlideComponent implements OnInit {
	@Input() image: Image;
	@Input() selectedImage: Image;
	@Input() selectedFlavor: Flavor;
	@Output() readonly selectedImageChange: EventEmitter<Image> = new EventEmitter();
	window_size: number;
	img_height: string = '120px';
	img_width: string = '210px';
	image_visible: boolean = true;
	regexp_data_test_id: RegExp = /[ ().]/g;
	STATIC_IMG_FOLDER: String = 'static/webapp/assets/img/';

	RAM_ICON_PATH: string = `${this.STATIC_IMG_FOLDER}/new_instance/ram_icon.svg`;
	STORAGE_ICON_PATH: string = `${this.STATIC_IMG_FOLDER}/new_instance/storage_icon.svg`;

	ngOnInit(): void {
		this.window_size = window.innerWidth;
	}

	public setImageVisible(): void {
		this.image_visible = !this.image_visible;
	}

}
