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

  constructor() {
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
