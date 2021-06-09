import { User } from './application.model/user.model';

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

	constructor(extension?: Partial<ApplicationCreditRequest>) {
		Object.assign(this, extension);
		if (extension) {
			this.extra_credits = (Math.round(extension.extra_credits * 10) / 10);
		}
	}
}
