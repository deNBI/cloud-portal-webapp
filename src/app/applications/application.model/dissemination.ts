/**
 * Dissemination class.
 */
export class Dissemination {

	platform_denbi: boolean = false;
	platform_twitter: boolean;
	information_title: string;
	information_resources: boolean;
	information_pi_name: boolean;
	information_institution: boolean;
	information_workgroup: boolean;
	information_project_type: boolean;
	information_lifetime: boolean;
	information_description: string;
	information_project_affiliation: boolean;
	allowed_platforms: string[] = [];
	allowed_informations: string[] = [];

	constructor(
		platform_denbi: boolean,
		platform_twitter: boolean,
		information_title: string,
		information_resources: boolean,
		information_pi_name: boolean,
		information_institution: boolean,
		information_workgroup: boolean,
		information_project_type: boolean,
		information_lifetime: boolean,
		information_project_affiliation: boolean,
		information_description: string,
	) {

		this.platform_denbi = platform_denbi;
		this.platform_twitter = platform_twitter;
		this.information_title = information_title;
		this.information_resources = information_resources;
		this.information_pi_name = information_pi_name;
		this.information_institution = information_institution;
		this.information_description = information_description;
		this.information_workgroup = information_workgroup;
		this.information_project_type = information_project_type;
		this.information_lifetime = information_lifetime;
		this.information_project_affiliation = information_project_affiliation;
		this.setAllowedPlatforms();
		this.setAllowedInformations();
	}

	private setAllowedPlatforms(): void {
		this.allowed_platforms = [];

		if (this.platform_denbi) {
			this.allowed_platforms.push('de.NBI Platforms ');
		}
		if (this.platform_twitter) {
			this.allowed_platforms.push('Twitter');
		}
	}

	private setAllowedInformations(): void {
		this.allowed_informations = [];
		if (this.information_project_affiliation) {
			this.allowed_informations.push('Project affiliation');
		}
		if (this.information_institution) {
			this.allowed_informations.push('Institution');
		}
		if (this.information_workgroup) {
			this.allowed_informations.push('Workgroup');
		}
		if (this.information_project_type) {
			this.allowed_informations.push('Project Type');
		}
		if (this.information_title) {
			this.allowed_informations.push('Title');
		}
		if (this.information_resources) {
			this.allowed_informations.push('Resources');
		}
		if (this.information_lifetime) {
			this.allowed_informations.push('Lifetime');
		}
		if (this.information_pi_name) {
			this.allowed_informations.push('PI Name');
		}
		if (this.information_description) {
			this.allowed_informations.push('Description');
		}
	}
}
