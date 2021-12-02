import { Clusterinfo } from './clusterinfo';

export class ClusterPage {
	cluster_list: Clusterinfo[];
	total_pages: number = 0;
	total_items: number = 0;
	items_per_page: number = 7;
	num_pages: number = 0;
	cluster_status_error: boolean = false;

	constructor(cluster_page?: Partial<ClusterPage>) {
		Object.assign(this, cluster_page);
		this.cluster_list = [];
		if (cluster_page) {
			for (const cluster of cluster_page.cluster_list) {
				this.cluster_list.push(new Clusterinfo(cluster));
			}
			if (cluster_page.num_pages) {
				this.total_pages = cluster_page.num_pages;
			}
			if (cluster_page.total_pages) {
				this.num_pages = cluster_page.total_pages;
			}
			this.cluster_status_error = cluster_page.cluster_status_error;
		}
	}
}
