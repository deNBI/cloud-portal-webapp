import { Component, Input, OnInit } from '@angular/core';
import { Application } from '../../application.model/application.model';
import { Application_States } from '../../../shared/shared_modules/baseClass/abstract-base-class';
import { ApplicationBaseClassComponent } from '../../../shared/shared_modules/baseClass/application-base-class.component';
import { User } from '../../application.model/user.model';

/**
 * Application modification details.
 */
@Component({
	selector: 'app-modification-detail',
	templateUrl: './modification-detail.component.html',
})
export class ModificationDetailComponent extends ApplicationBaseClassComponent implements OnInit {
		@Input() application: Application;
		@Input() is_vo_admin: boolean;
		Application_States: typeof Application_States = Application_States;

		ngOnInit() {
			this.getRequestingUser();
		}

		getRequestingUser() {
			if (this.application.project_modification_request && !this.application.project_modification_request.user) {
				this.applicationsService.getModificationUser(this.application.project_application_id).subscribe((user: User) => {

					this.application.project_modification_request.user = user;

				});
			}
		}

}
