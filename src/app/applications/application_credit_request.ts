import {Flavor} from '../virtualmachines/virtualmachinemodels/flavor';
import {User} from './application.model/application.model';

/**
 * Application Extension class.
 */
export class ApplicationCreditRequest {

  private _Id: number;
  private _project_application_id: number | string;
  private _project_application_modification_comment: string;
  private _project_application_modification_date_submitted: string;
  private _project_application_modification_credits: number;
  private _project_application_modification_user: User;

  constructor(extension: ApplicationCreditRequest|null) {
    if (extension) {
      this._project_application_id = extension.project_application_id;
      this._project_application_modification_comment = extension.project_application_modification_comment;
      this._project_application_modification_date_submitted = extension.project_application_modification_date_submitted;

      this._project_application_modification_credits = extension.project_application_modification_credits;
      this._project_application_modification_user = extension.project_application_modification_user;
    }
  }

  get project_application_modification_user(): User {
    return this._project_application_modification_user;
  }

  set project_application_modification_user(value: User) {
    this._project_application_modification_user = value;
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

  set project_application_modification_comment(value: string) {
    this._project_application_modification_comment = value;
  }

  get project_application_modification_comment(): string {
    return this._project_application_modification_comment;
  }

  get project_application_modification_date_submitted(): string {
    return this._project_application_modification_date_submitted;
  }

  set project_application_modification_date_submitted(value: string) {
    this._project_application_modification_date_submitted = value;
  }

  get project_application_modification_credits(): number {
    return Number(this._project_application_modification_credits);
  }

  set project_application_modification_credits(value: number) {
    this._project_application_modification_credits = value;
  }

}
