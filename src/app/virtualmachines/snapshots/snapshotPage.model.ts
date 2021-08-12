import { SnapshotModel } from './snapshot.model';

export class SnapshotPage {
	snapshot_list: SnapshotModel[];
	total_pages: number = 0;
	num_pages: number = 0;
	total_items: number = 0;
	items_per_page: number = 7;

	constructor(snapshot_page?: Partial<SnapshotPage>) {
		Object.assign(this, snapshot_page);
		this.snapshot_list = [];
		if (snapshot_page) {
			for (const snapshot of snapshot_page.snapshot_list) {
				this.snapshot_list.push(new SnapshotModel(snapshot));
			}
			if (snapshot_page.num_pages) {
				this.total_pages = snapshot_page.num_pages;
			}
			if (snapshot_page.total_pages) {
				this.num_pages = snapshot_page.total_pages;
			}
		}
	}
}
