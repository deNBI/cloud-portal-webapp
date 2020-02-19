/**
 * Model for Research Environment Templates
 */
export class ResenvTemplate {

  private _template_name: string;
  private _title: string;
  private _description: string;
  private _info_url: string;
  private _logo_url: string;

  get template_name(): string {
    return this._template_name;
  }

  set template_name(value: string) {
    this._template_name = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get info_url(): string {
    return this._info_url;
  }

  set info_url(value: string) {
    this._info_url = value;
  }

  get logo_url(): string {
    return this._logo_url;
  }

  set logo_url(value: string) {
    this._logo_url = value;
  }

  constructor(template_name: string, title: string, description: string, info_url: string, logo_url: string) {
    this._template_name = template_name;
    this._title = title;
    this._description = description;
    this._info_url = info_url;
    this._logo_url = logo_url;
  }
}
