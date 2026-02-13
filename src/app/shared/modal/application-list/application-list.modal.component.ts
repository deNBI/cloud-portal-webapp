import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { is_vo } from 'app/shared/globalvar'

import { Application } from 'app/applications/application.model/application.model'
import { ApplicationsService } from 'app/api-connector/applications.service'
import { ApplicationBadgesComponent } from 'app/shared/shared_modules/components/applications/application-badges/application-badges.component'
import { Router } from '@angular/router'

@Component({
	selector: 'app-application-list',
	templateUrl: './application-list.modal.component.html',
	imports: [ApplicationBadgesComponent]
})
export class ApplicationListModalComponent implements OnDestroy, OnInit {
	@Input() applications: Application[]

	constructor(
		public bsModalRef: BsModalRef,
		public router: Router,
		public applicationsService: ApplicationsService
	) {}
	is_vo_admin: boolean = false

	ngOnInit() {
		this.is_vo_admin = is_vo
	}

	showProject(app: Application): void {
		if (this.is_vo_admin) {
			void this.router.navigate([`project-management/${app.project_application_id}`])
			this.bsModalRef.hide()
		}
	}

	ngOnDestroy(): void {
		this.bsModalRef.hide()
	}
}
