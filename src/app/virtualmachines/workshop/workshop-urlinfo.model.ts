// eslint-disable-next-line max-classes-per-file
export class UrlData {
	user_email: string;
	user_name: string;
	resenv_url: string;

	constructor(url_data?: Partial<UrlData>) {
		Object.assign(this, url_data);
	}
}

export class WorkshopUrlInfoModel {

	longname: string;
	shortname: string;
	url_data: UrlData[];

	constructor(workshop_info?: Partial<WorkshopUrlInfoModel>) {
		Object.assign(this, workshop_info);
		if (workshop_info) {
			if (workshop_info.url_data) {
				this.url_data = [];
				for (const url_data of workshop_info.url_data) {
					this.url_data.push(new UrlData(url_data));
				}
			}
		}
	}

}
