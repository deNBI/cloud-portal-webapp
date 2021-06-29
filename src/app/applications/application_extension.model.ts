import { User } from './application.model/user.model';
import { Application } from './application.model/application.model';

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

	constructor(extension?: Partial<ApplicationLifetimeExtension>) {
		Object.assign(this, extension);
		if (extension) {
			this.extra_credits = (Math.round(extension.extra_credits * 10) / 10);
		}
	}

	setByApp(app: Application): void {
		this.project_application_id = app.project_application_id;
		this.comment = app.project_application_comment;
		this.extra_lifetime = 0;
	}

}
