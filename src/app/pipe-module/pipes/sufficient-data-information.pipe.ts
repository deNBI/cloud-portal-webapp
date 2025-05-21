import { Pipe, PipeTransform } from '@angular/core'
import { Application } from 'app/applications/application.model/application.model'
/**
 * Pipe to check if the form is clicked correctly regarding human data
 */
@Pipe({ name: 'sufficientHumanDataInformation', pure: false })
export class SufficientHumanDataInformationGivenPipe implements PipeTransform {
	transform(app: Application): boolean {
		if (app.project_application_person_related_data) {
			return (
				app.project_application_no_personal_data ||
				app.project_application_nonsensitive_data ||
				app.project_application_sensitive_data
			)
		} else {
			return app.project_application_no_data_at_all
		}
	}
}
