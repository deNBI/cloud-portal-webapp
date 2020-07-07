import {User} from './application.model/application.model';

/**
 * Application Extension class.
 */
export class ApplicationLifetimeExtension {

  private _Id: number;
  private _project_application_id: number | string;
  private _extra_lifetime: number;
  private _comment: string;
  private _date_submitted: string;
  private _user: User;

  constructor(extension: ApplicationLifetimeExtension|null) {
    if (extension) {
      this._project_application_id = extension.project_application_id;
      this._extra_lifetime = extension.extra_lifetime;
      this._comment = extension.comment;
      this._date_submitted = extension.date_submitted;
      this._user = extension.user;
    }
  }

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  get project_application_id(): number | string {
    return this._project_application_id;
  }

  set project_application_id(value: number | string) {
    this._project_application_id = value;
  }

  get extra_lifetime(): number {
    return this._extra_lifetime;
  }

  set extra_lifetime(value: number) {
    this._extra_lifetime = value;
  }

  get Id(): number {
    return this._Id;
  }

  set Id(value: number) {
    this._Id = value;
  }

  set comment(value: string) {
    this._comment = value;
  }

  get comment(): string {
    return this._comment;
  }

  get date_submitted(): string {
    return this._date_submitted;
  }

  set date_submitted(value: string) {
    this._date_submitted = value;
  }

  get project_application_extension_credits(): number {
    return Number(this._project_application_extension_credits);
  }

  set project_application_extension_credits(value: number) {
    this._project_application_extension_credits = value;
  }

  get is_only_extra_credits_application(): boolean {
    return this._is_only_extra_credits_application;
  }

  set is_only_extra_credits_application(value: boolean) {
    this._is_only_extra_credits_application = value;
  }

  get project_application_extension_cloud_service_user_number(): number {
    return this._project_application_extension_cloud_service_user_number;
  }

  set project_application_extension_cloud_service_user_number(value: number) {
    this._project_application_extension_cloud_service_user_number = value;
  }

  get project_application_extension_cloud_service_develop(): boolean {
    return this._project_application_extension_cloud_service_develop;
  }

  set project_application_extension_cloud_service_develop(value: boolean) {
    this._project_application_extension_cloud_service_develop = value;
  }
}
