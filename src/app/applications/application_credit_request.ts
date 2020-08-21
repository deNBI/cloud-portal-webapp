import {User} from './application.model/application.model';

/**
 * Application Extension class.
 */
export class ApplicationCreditRequest {

  Id: number;
  project_application_id: number | string;
  comment: string = '';
  date_submitted: string;
  extra_credits: number;
  project_credit_request_user: User;

  constructor(extension: ApplicationCreditRequest | null) {
    if (extension) {
      this.project_application_id = extension.project_application_id;
      this.comment = extension.comment;
      this.date_submitted = extension.date_submitted;
      this.extra_credits = extension.extra_credits;
      this.project_credit_request_user = extension.project_credit_request_user;
    }
  }
}
