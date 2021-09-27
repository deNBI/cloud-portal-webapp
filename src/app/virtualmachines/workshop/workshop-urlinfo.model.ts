// eslint-disable-next-line max-classes-per-file
class UrlData {
	user_email: string;
	user_name: string;
	resenv_url: string;
}

export class WorkshopUrlInfoModel {

	longname: string = '';
	shortname: string = '';
	url_data: UrlData[];

	constructor(workshop_info?: Partial<WorkshopUrlInfoModel>) {
		Object.assign(this, WorkshopUrlInfoModel);
		if (workshop_info) {
			this.longname = workshop_info.longname;
			this.shortname = workshop_info.shortname;
			this.url_data = workshop_info.url_data;

		}
	}

}
