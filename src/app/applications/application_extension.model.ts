import {User} from './application.model/application.model';

/**
 * Application Extension class.
 */
export class ApplicationExtension {

  private _Id: number;
  private _project_application_id: number | string;
  private _project_application_extension_lifetime: number;
  private _project_application_extension_comment: string;
  private _project_application_extension_date_submitted: string;
  private _project_application_extension_credits: number;
  private _project_application_extension_user: User;
  private _is_only_extra_credits_application: boolean;
  private _project_application_extension_cloud_service_user_number: number;
  private _project_application_extension_cloud_service_develop: boolean;

  constructor(extension: ApplicationExtension|null) {
    if (extension) {
      this._project_application_id = extension.project_application_id;
      this._project_application_extension_lifetime = extension.project_application_extension_lifetime;
      this._project_application_extension_comment = extension.project_application_extension_comment;
      this._project_application_extension_date_submitted = extension.project_application_extension_date_submitted;
      this._project_application_extension_credits = extension.project_application_extension_credits;
      this._is_only_extra_credits_application = extension.is_only_extra_credits_application;
      this._project_application_extension_cloud_service_user_number = extension.project_application_extension_cloud_service_user_number;
      this._project_application_extension_cloud_service_develop = extension.project_application_extension_cloud_service_develop;
      this._project_application_extension_user = extension.project_application_extension_user;
    }
  }

  get project_application_extension_user(): User {
    return this._project_application_extension_user;
  }

  set project_application_extension_user(value: User) {
    this._project_application_extension_user = value;
  }

  get project_application_id(): number | string {
    return this._project_application_id;
  }

  set project_application_id(value: number | string) {
    this._project_application_id = value;
  }

  get project_application_extension_lifetime(): number {
    return this._project_application_extension_lifetime;
  }

  set project_application_extension_lifetime(value: number) {
    this._project_application_extension_lifetime = value;
  }

  get Id(): number {
    return this._Id;
  }

  set Id(value: number) {
    this._Id = value;
  }

  set project_application_extension_comment(value: string) {
    this._project_application_extension_comment = value;
  }

  get project_application_extension_comment(): string {
    return this._project_application_extension_comment;
  }

  get project_application_extension_date_submitted(): string {
    return this._project_application_extension_date_submitted;
  }

  set project_application_extension_date_submitted(value: string) {
    this._project_application_extension_date_submitted = value;
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
