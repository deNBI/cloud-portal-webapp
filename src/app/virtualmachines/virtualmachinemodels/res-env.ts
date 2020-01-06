/**
 * Res-Env Class.
 */
export class ResearchEnvironment {
  private _template_name: string;
  private _template_version: string;
  private _template_description: string;
  private _template_logo_url: string;
  private _template_info_url: string;

  get template_info_url(): string {
    return this._template_info_url;
  }

  set template_info_url(value: string) {
    this._template_info_url = value;
  }

  get template_name(): string {
    return this._template_name;
  }

  set template_name(value: string) {
    this._template_name = value;
  }

  get template_version(): string {
    return this._template_version;
  }

  set template_version(value: string) {
    this._template_version = value;
  }

  get template_description(): string {
    return this._template_description;
  }

  set template_description(value: string) {
    this._template_description = value;
  }

  get template_logo_url(): string {
    return this._template_logo_url;
  }
  set template_logo_url(value: string) {
    this._template_logo_url = value;
  }
}
