import { Volume } from './volume';

export class VolumePage {
	volume_list: Volume[];
	total_pages: number = 0;
	total_items: number = 0;
	items_per_page: number = 7;
	num_pages: number = 0;

	constructor(volume_page?: Partial<VolumePage>) {
		Object.assign(this, volume_page);
		this.volume_list = [];
		if (volume_page) {
			for (const volume of volume_page.volume_list) {
				this.volume_list.push(new Volume(volume));
			}
			if (volume_page.num_pages) {
				this.total_pages = volume_page.num_pages;
			}
			if (volume_page.total_pages) {
				this.num_pages = volume_page.total_pages;
			}
		}
	}
}
