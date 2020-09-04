import {User} from './application.model/application.model';

/**
 * Application Extension class.
 */
export class ApplicationCreditRequest {

  Id: number;
  project_application_id: number | string;
  comment: string = '';
  date_submitted: string;
  extra_credits: number = 0;
  user: User;

  constructor(extension: ApplicationCreditRequest | null) {
    if (extension) {
      this.project_application_id = extension.project_application_id;
      this.comment = extension.comment;
      this.date_submitted = extension.date_submitted;
      this.extra_credits = (Math.round(extension.extra_credits * 10) / 10);
      this.user = extension.user;
    }
  }
}
