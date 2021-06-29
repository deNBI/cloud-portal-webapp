/**
 * Application Dissemination class.
 */
export class ApplicationDissemination {

	private _platform_twitter: boolean = false;
	private _platform_denbi: boolean = false;
	private _information_title: string = '';
	private _information_description: string = '';
	private _information_description_allowed: boolean = false;
	private _information_resources: boolean = false;
	private _information_project_affiliation: boolean = false;
	private _information_lifetime: boolean = false;
	private _information_pi_name: boolean = false;
	private _information_institution: boolean = false;
	private _information_workgroup: boolean = false;
	private _information_project_type: boolean = false;
	private _information_edam_terms: boolean = true;

	private _allowed_platforms: string[] = [];
	private _allowed_informations: string[] = [];

	constructor(diss?: Partial<ApplicationDissemination>) {
		if (diss) {
			Object.assign(this, diss);
			// test if information_description is set. !! converts to boolean.
			this._information_description_allowed = !!this._information_description;
		}
		this.setAllowedPlatforms();
		this.setAllowedInformations();
	}

	someAllowed(): boolean {
		return this._allowed_informations.length > 0 && this._allowed_platforms.length > 0;
	}

	setAllInformationFalse(): void {
		this._information_description = '';
		this._information_description_allowed = false;
		this._information_resources = false;
		this._information_project_affiliation = false;
		this._information_lifetime = false;
		this._information_pi_name = false;
		this._information_institution = false;
		this._information_workgroup = false;
		this._information_project_type = false;
		this.setAllowedInformations();
	}

	setAllInformationTrue(): void {
		this._information_description_allowed = true;
		this._information_resources = true;
		this._information_project_affiliation = true;
		this._information_lifetime = true;
		this._information_pi_name = true;
		this._information_institution = true;
		this._information_workgroup = true;
		this._information_project_type = true;
		this.setAllowedInformations();

	}

	changeAllInformation(): void {
		this._information_description_allowed = !this._information_description_allowed;
		this._information_resources = !this._information_resources;
		this._information_project_affiliation = !this._information_project_affiliation;
		this._information_lifetime = !this._information_lifetime;
		this._information_pi_name = !this._information_pi_name;
		this._information_institution = !this._information_institution;
		this._information_workgroup = !this._information_workgroup;
		this._information_project_type = !this._information_project_type;
		this.setAllowedInformations();

	}

	isPlatformSelected(): boolean {
		this.setAllowedPlatforms();

		return this._allowed_platforms.length > 0;
	}

	private setAllowedPlatforms(): void {
		this._allowed_platforms = [];

		if (this._platform_denbi) {
			this._allowed_platforms.push('de.NBI Platforms');
		}
		if (this._platform_twitter) {
			this._allowed_platforms.push('Twitter');
		}
	}

	get allowed_platforms(): string[] {
		return this._allowed_platforms;
	}

	set allowed_platforms(value: string[]) {
		this._allowed_platforms = value;
		this.setAllowedInformations();
	}

	get allowed_informations(): string[] {
		return this._allowed_informations;
	}

	set allowed_informations(value: string[]) {
		this._allowed_informations = value;
	}

	private setAllowedInformations(): void {
		this._allowed_informations = [];
		this._allowed_informations.push('Title'); // it's mandatory in the form
		if (this._information_edam_terms) {
			this._allowed_informations.push('Research Topics');
		}
		if (this._information_description_allowed) {
			this._allowed_informations.push('Description');
		}
		if (this._information_resources) {
			this._allowed_informations.push('Resources');
		}
		if (this._information_lifetime) {
			this._allowed_informations.push('Lifetime');
		}
		if (this._information_project_type) {
			this._allowed_informations.push('Project Type');
		}
		if (this._information_pi_name) {
			this._allowed_informations.push('Name of PI');
		}
		if (this._information_institution) {
			this._allowed_informations.push('Institution');
		}
		if (this._information_workgroup) {
			this._allowed_informations.push('Workgroup');
		}
		if (this._information_project_affiliation) {
			this._allowed_informations.push('Project affiliation');
		}
	}

	get platform_denbi(): boolean {
		return this._platform_denbi;
	}

	set platform_denbi(value: boolean) {
		this._platform_denbi = value;
	}

	get information_edam_terms(): boolean {
		return this._information_edam_terms;
	}

	set information_edam_terms(value: boolean) {
		this._information_edam_terms = value;
	}

	get information_description_allowed(): boolean {
		return this._information_description_allowed;
	}

	set information_description_allowed(value: boolean) {
		this._information_description_allowed = value;
		if (!this._information_description_allowed) {
			this.information_description = '';
		}
		this.setAllowedInformations();
	}

	get platform_twitter(): boolean {
		return this._platform_twitter;
	}

	set platform_twitter(value: boolean) {
		this._platform_twitter = value;
		this.setAllowedInformations();
	}

	get information_title(): string {
		return this._information_title;
	}

	set information_title(value: string) {
		this._information_title = value;
		this.setAllowedInformations();
	}

	get information_description(): string {
		return this._information_description;
	}

	set information_description(value: string) {
		this._information_description = value;
		this.setAllowedInformations();
	}

	get information_resources(): boolean {
		return this._information_resources;
	}

	set information_resources(value: boolean) {
		this._information_resources = value;
		this.setAllowedInformations();
	}

	get information_project_affiliation(): boolean {
		return this._information_project_affiliation;
	}

	set information_project_affiliation(value: boolean) {
		this._information_project_affiliation = value;
		this.setAllowedInformations();
	}

	get information_lifetime(): boolean {
		return this._information_lifetime;
	}

	set information_lifetime(value: boolean) {
		this._information_lifetime = value;
		this.setAllowedInformations();
	}

	get information_pi_name(): boolean {
		return this._information_pi_name;
	}

	set information_pi_name(value: boolean) {
		this._information_pi_name = value;
		this.setAllowedInformations();
	}

	get information_institution(): boolean {
		return this._information_institution;
	}

	set information_institution(value: boolean) {
		this._information_institution = value;
		this.setAllowedInformations();
	}

	get information_workgroup(): boolean {
		return this._information_workgroup;
	}

	set information_workgroup(value: boolean) {
		this._information_workgroup = value;
		this.setAllowedInformations();
	}

	get information_project_type(): boolean {
		return this._information_project_type;
	}

	set information_project_type(value: boolean) {
		this._information_project_type = value;
		this.setAllowedInformations();
	}
}
