import { DisseminationPlatform } from "./application.model/dissemination-platform"
/**
 * Application Dissemination class.
 */
export class ApplicationDissemination {

	platform_twitter: boolean = false;
	platform_denbi: boolean = false;
	platforms: DisseminationPlatform[] = [];
	information_title: string = '';
	information_description: string = '';
	information_description_allowed: boolean = false;
	information_resources: boolean = false;
	information_project_affiliation: boolean = false;
	information_lifetime: boolean = false;
	information_pi_name: boolean = false;
	information_institution: boolean = false;
	information_workgroup: boolean = false;
	information_project_type: boolean = false;
	information_edam_terms: boolean = true;
	allowed_informations: string[] = [];

	constructor(diss?: Partial<ApplicationDissemination>) {
		if (diss) {
			Object.assign(this, diss);
			// test if information_description is set. !! converts to boolean.
			this.information_description_allowed = !!this.information_description;
		}
	}

	someAllowed(): boolean {
		return this.platforms.length > 0;
	}

	setAllInformationFalse(): void {
		this.information_description = '';
		this.information_description_allowed = false;
		this.information_resources = false;
		this.information_project_affiliation = false;
		this.information_lifetime = false;
		this.information_pi_name = false;
		this.information_institution = false;
		this.information_workgroup = false;
		this.information_project_type = false;
	}

	setAllInformationTrue(): void {
		this.information_description_allowed = true;
		this.information_resources = true;
		this.information_project_affiliation = true;
		this.information_lifetime = true;
		this.information_pi_name = true;
		this.information_institution = true;
		this.information_workgroup = true;
		this.information_project_type = true;

	}

	changeAllInformation(): void {
		this.information_description_allowed = !this.information_description_allowed;
		this.information_resources = !this.information_resources;
		this.information_project_affiliation = !this.information_project_affiliation;
		this.information_lifetime = !this.information_lifetime;
		this.information_pi_name = !this.information_pi_name;
		this.information_institution = !this.information_institution;
		this.information_workgroup = !this.information_workgroup;
		this.information_project_type = !this.information_project_type;

	}

	isPlatformSelected(): boolean {
		return this.platforms.length > 0;
	}
}
