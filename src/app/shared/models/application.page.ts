import { Application } from 'app/applications/application.model/application.model'
import { AbstractPage } from './abstract.page'

export class ApplicationPage extends AbstractPage<Application> {
	results: Application[]

	constructor(application_page?: Partial<ApplicationPage>) {
		super()

		Object.assign(this, application_page)
		this.results = []
		if (application_page) {
			if (application_page.results) {
				application_page.results.forEach((application: Application) => {
					this.results.push(new Application(application))
				})
			}
		}
	}
}
