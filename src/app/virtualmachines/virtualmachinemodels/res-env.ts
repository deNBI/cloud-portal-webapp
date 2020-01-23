/**
 * Res-Env Class.
 */
export class ResearchEnvironment {
  private _template_name: string;
  private _template_version: string;
  private _description: string;
  private _logo_url: string;
  private _info_url: string;
  private _title: string;

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get info_url(): string {
    return this._info_url;
  }

  set info_url(value: string) {
    this._info_url = value;
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

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get logo_url(): string {
    return this._logo_url;
  }
  set logo_url(value: string) {
    this._logo_url = value;
  }
}
