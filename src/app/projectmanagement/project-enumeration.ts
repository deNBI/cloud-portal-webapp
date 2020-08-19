/**
 * Project enumeration class.
 */
export class ProjectEnumeration {

  private _project_name: string;
  private _application_id: string;
  private _has_perun_group: boolean;
  private _is_open_stack: boolean;
  private _project_lifetime: number;
  private _project_start_date: string;
  private _project_status: number[];

  get project_status(): number[] {
    return this._project_status;
  }

  set project_status(value: number[]) {
    this._project_status = value;
  }

  get project_lifetime(): number {
    return this._project_lifetime;
  }

  set project_lifetime(value: number) {
    this._project_lifetime = value;
  }

  get project_start_date(): string {
    return this._project_start_date;
  }

  set project_start_date(value: string) {
    this._project_start_date = value;
  }

  get project_name(): string {
    return this._project_name;
  }

  set project_name(value: string) {
    this._project_name = value;
  }

  get application_id(): string {
    return this._application_id;
  }

  set application_id(value: string) {
    this._application_id = value;
  }

  get has_perun_group(): boolean {
    return this._has_perun_group;
  }

  set has_perun_group(value: boolean) {
    this._has_perun_group = value;
  }

  get is_open_stack(): boolean {
    return this._is_open_stack;
  }

  set is_open_stack(value: boolean) {
    this._is_open_stack = value;
  }
}
