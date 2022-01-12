/**
 * Model for Research Environment Templates
 */
export class ResenvTemplate {

	template_name: string;
	title: string;
	description: string;
	info_url: string;
	logo_url: string;

	constructor(template_name: string, title: string, description: string, info_url: string, logo_url: string) {
		this.template_name = template_name;
		this.title = title;
		this.description = description;
		this.info_url = info_url;
		this.logo_url = logo_url;
	}
}
