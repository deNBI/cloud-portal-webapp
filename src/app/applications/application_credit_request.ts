import {Flavor} from '../virtualmachines/virtualmachinemodels/flavor';
import {User} from './application.model/application.model';

/**
 * Application Extension class.
 */
export class ApplicationCreditRequest {

  private _Id: number;
  private _project_id: number | string;
  private _project_credit_request_comment: string;
  private _project_credit_request_date_submitted: string;
  private _project_credit_request_credits: number;
  private _project_credit_request_user: User;

  constructor(extension: ApplicationCreditRequest|null) {
    if (extension) {
      this._project_id = extension.project_id;
      this._project_credit_request_comment = extension.project_credit_request_comment;
      this._project_credit_request_date_submitted = extension.project_credit_request_date_submitted;

      this._project_credit_request_credits = extension.project_credit_request_credits;
      this._project_credit_request_user = extension.project_credit_request_user;
    }
  }

  get project_credit_request_user(): User {
    return this._project_credit_request_user;
  }

  set project_credit_request_user(value: User) {
    this._project_credit_request_user = value;
  }

  get project_id(): number | string {
    return this._project_id;
  }

  set project_id(value: number | string) {
    this._project_id = value;
  }

  get Id(): number {
    return this._Id;
  }

  set Id(value: number) {
    this._Id = value;
  }

  set project_credit_request_comment(value: string) {
    this._project_credit_request_comment = value;
  }

  get project_credit_request_comment(): string {
    return this._project_credit_request_comment;
  }

  get project_credit_request_date_submitted(): string {
    return this._project_credit_request_date_submitted;
  }

  set project_credit_request_date_submitted(value: string) {
    this._project_credit_request_date_submitted = value;
  }

  get project_credit_request_credits(): number {
    return Number(this._project_credit_request_credits);
  }

  set project_credit_request_credits(value: number) {
    this._project_credit_request_credits = value;
  }

}
