import { Component, Input, OnInit } from '@angular/core'
import { Application } from '../../application.model/application.model'
import { ApplicationBaseClassComponent } from '../../../shared/shared_modules/baseClass/application-base-class.component'
import { User } from '../../application.model/user.model'

/**
 * Lifetime extension details.
 */
@Component({
	selector: 'app-lifetime-extension-detail',
	templateUrl: './lifetime-extension-detail.component.html'
})
export class LifetimeExtensionDetailComponent extends ApplicationBaseClassComponent implements OnInit {
	@Input() application: Application

	ngOnInit() {
		this.getRequestingUser()
	}

	getRequestingUser() {
		if (this.application.project_lifetime_request && !this.application.project_lifetime_request.user) {
			this.applicationsService
				.getLifetimeExtensionUser(this.application.project_application_id)
				.subscribe((user: User) => {
					this.application.project_lifetime_request.user = user
				})
		}
	}
}
