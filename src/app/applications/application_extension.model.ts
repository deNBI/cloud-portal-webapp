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
  private _extra_credits: number;
  private _user: User;

  constructor(extension: ApplicationLifetimeExtension|null) {
    if (extension) {
      this._project_application_id = extension.project_application_id;
      this._extra_lifetime = extension.extra_lifetime;
      this._extra_credits = extension.extra_credits
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

  get extra_credits(): number {
    return this._extra_credits;
  }

  set extra_credits(value: number) {
    this._extra_credits = value;
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

}
