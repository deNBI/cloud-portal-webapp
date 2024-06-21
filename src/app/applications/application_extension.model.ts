import { User } from './application.model/user.model';
import { Application } from './application.model/application.model';

/**
 * Application Extension class.
 */
export class ApplicationLifetimeExtension {
	id: number;
	project_application_id: number | string;
	extra_lifetime: number;

	old_end_date: any;

	new_end_date: any;
	comment: string;
	date_submitted: string;
	extra_credits: number = 0;
	user: User;
	manager_comment: string;

	constructor(extension?: Partial<ApplicationLifetimeExtension>) {
		Object.assign(this, extension);
		if (extension) {
			this.extra_credits = Math.round(extension.extra_credits * 10) / 10;
		}
		if (new Date(this.new_end_date) < new Date()) {
			this.new_end_date = `${this.extra_lifetime} month${
				this.extra_lifetime > 1 ? 's' : ''
			} after the approval of the extension`;
		}
	}

	setByApp(app: Application): void {
		this.project_application_id = app.project_application_id;
		this.comment = app.project_application_comment;
		this.extra_lifetime = 0;
	}
}
