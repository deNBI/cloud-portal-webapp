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

  private _allowed_platforms: string[] = [];
  private _allowed_informations: string[] = [];

  constructor(
    platform_denbi: boolean, platform_twitter: boolean,
    information_title: string, information_resources: boolean, information_pi_name: boolean,
    information_institution: boolean, information_workgroup: boolean,
    information_project_type: boolean, information_lifetime: boolean,
    information_project_affiliation: boolean, information_description: string) {

    this._platform_denbi = platform_denbi;
    this._platform_twitter = platform_twitter;
    this._information_title = information_title;
    this._information_resources = information_resources;
    this._information_pi_name = information_pi_name;
    this._information_institution = information_institution;
    this._information_description = information_description;
    if (this._information_description) {
      this._information_description_allowed = true;
    }
    this._information_workgroup = information_workgroup;
    this._information_project_type = information_project_type;
    this._information_lifetime = information_lifetime;
    this._information_project_affiliation = information_project_affiliation;
    this.setAllowedPlatforms();
    this.setAllowedInformations();
  }

  setAllFalse(): void {
    this._information_description = '';
    this._information_description_allowed = false;
    this._information_resources = false;
    this._information_project_affiliation = false;
    this._information_lifetime = false;
    this._information_pi_name = false;
    this._information_institution = false;
    this._information_workgroup = false;
    this._information_project_type = false;
  }

  setAllTrue(): void {
    this._information_description_allowed = true;
    this._information_resources = true;
    this._information_project_affiliation = true;
    this._information_lifetime = true;
    this._information_pi_name = true;
    this._information_institution = true;
    this._information_workgroup = true;
    this._information_project_type = true;

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

  }

  isPlatformSelected(): boolean {
    this.setAllowedPlatforms();

    return this._allowed_platforms.length > 0
  }

  private setAllowedPlatforms(): void {
    this._allowed_platforms = [];

    if (this._platform_denbi) {
      this._allowed_platforms.push('de.NBI Platforms ')
    }
    if (this._platform_twitter) {
      this._allowed_platforms.push('Twitter')
    }
  }

  get allowed_platforms(): string[] {
    return this._allowed_platforms;
  }

  set allowed_platforms(value: string[]) {
    this._allowed_platforms = value;
  }

  get allowed_informations(): string[] {
    return this._allowed_informations;
  }

  set allowed_informations(value: string[]) {
    this._allowed_informations = value;
  }

  private setAllowedInformations(): void {
    this._allowed_informations = [];
    if (this._information_project_affiliation) {
      this._allowed_informations.push('Project affiliation')
    }
    if (this._information_institution) {
      this._allowed_informations.push('Institution')
    }
    if (this._information_workgroup) {
      this._allowed_informations.push('Workgroup')
    }
    if (this._information_project_type) {
      this._allowed_informations.push('Project Type')
    }
    if (this._information_title) {
      this._allowed_informations.push('Title')
    }
    if (this._information_resources) {
      this._allowed_informations.push('Resources')
    }
    if (this._information_lifetime) {
      this._allowed_informations.push('Lifetime')
    }
    if (this._information_pi_name) {
      this._allowed_informations.push('PI Name')
    }
    if (this._information_description) {
      this._allowed_informations.push('Description')
    }
  }

  get platform_denbi(): boolean {
    return this._platform_denbi;
  }

  set platform_denbi(value: boolean) {
    this._platform_denbi = value;
  }

  get information_description_allowed(): boolean {
    return this._information_description_allowed;
  }

  set information_description_allowed(value: boolean) {
    this._information_description_allowed = value;
    if (!this._information_description_allowed) {
      this.information_description = '';
    }

  }

  get platform_twitter(): boolean {
    return this._platform_twitter;
  }

  set platform_twitter(value: boolean) {
    this._platform_twitter = value;
  }

  get information_title(): string {
    return this._information_title;
  }

  set information_title(value: string) {
    this._information_title = value;
  }

  get information_description(): string {
    return this._information_description;
  }

  set information_description(value: string) {

    this._information_description = value;
  }

  get information_resources(): boolean {
    return this._information_resources;
  }

  set information_resources(value: boolean) {
    this._information_resources = value;
  }

  get information_project_affiliation(): boolean {
    return this._information_project_affiliation;
  }

  set information_project_affiliation(value: boolean) {
    this._information_project_affiliation = value;
  }

  get information_lifetime(): boolean {
    return this._information_lifetime;
  }

  set information_lifetime(value: boolean) {
    this._information_lifetime = value;
  }

  get information_pi_name(): boolean {
    return this._information_pi_name;
  }

  set information_pi_name(value: boolean) {
    this._information_pi_name = value;
  }

  get information_institution(): boolean {
    return this._information_institution;
  }

  set information_institution(value: boolean) {
    this._information_institution = value;
  }

  get information_workgroup(): boolean {
    return this._information_workgroup;
  }

  set information_workgroup(value: boolean) {
    this._information_workgroup = value;
  }

  get information_project_type(): boolean {
    return this._information_project_type;
  }

  set information_project_type(value: boolean) {
    this._information_project_type = value;
  }
}
