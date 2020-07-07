import {User} from './application.model/application.model';

/**
 * Application Extension class.
 */
export class ApplicationCreditRequest {

  private _Id: number;
  private _project_application_id: number | string;
  private _comment: string = '';
  private _date_submitted: string;
  private _extra_credits: number;
  private _project_credit_request_user: User;

  constructor(extension: ApplicationCreditRequest | null) {
    if (extension) {
      this._project_application_id = extension.project_application_id;
      this._comment = extension.comment;
      this._date_submitted = extension.date_submitted;
      this._extra_credits = extension.extra_credits;
      this._project_credit_request_user = extension.project_credit_request_user;
    }
  }

  get project_credit_request_user(): User {
    return this._project_credit_request_user;
  }

  set project_credit_request_user(value: User) {
    this._project_credit_request_user = value;
  }

  get project_application_id(): number | string {
    return this._project_application_id;
  }

  set project_application_id(value: number | string) {
    this._project_application_id = value;
  }

  get Id(): number {
    return this._Id;
  }

  set Id(value: number) {
    this._Id = value;
  }

  get comment(): string {
    return this._comment;
  }

  set comment(value: string) {
    this._comment = value;
  }

  get date_submitted(): string {
    return this._date_submitted;
  }

  set date_submitted(value: string) {
    this._date_submitted = value;
  }

  get extra_credits(): number {
    return this._extra_credits;
  }

  set extra_credits(value: number) {
    this._extra_credits = value;
  }
}
