import {User} from './application.model/application.model';

/**
 * Application Extension class.
 */
export class ApplicationLifetimeExtension {

  Id: number;
  project_application_id: number | string;
  extra_lifetime: number;
  comment: string;
  date_submitted: string;
  extra_credits: number = 0;
  user: User;

  constructor(extension: ApplicationLifetimeExtension | null) {
    if (extension) {
      console.log(extension.user)
      this.project_application_id = extension.project_application_id;
      this.extra_lifetime = extension.extra_lifetime;
      this.extra_credits = (Math.round(extension.extra_credits * 10) / 10);
      this.comment = extension.comment;
      this.date_submitted = extension.date_submitted;
      this.user = extension.user;
      console.log(this.user)
    }
  }

}
