import { Component, Input, OnDestroy, OnInit, ChangeDetectionStrategy, inject } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { is_vo } from 'app/shared/globalvar'

import { Application } from 'app/applications/application.model/application.model'
import { ApplicationsService } from 'app/api-connector/applications.service'
import { ApplicationBadgesComponent } from 'app/shared/shared_modules/components/applications/application-badges/application-badges.component'
import { Router } from '@angular/router'

@Component({
	selector: 'app-application-list',
	templateUrl: './application-list.modal.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [ApplicationBadgesComponent]
})
export class ApplicationListModalComponent implements OnDestroy, OnInit {
	bsModalRef = inject(BsModalRef)
	router = inject(Router)
	applicationsService = inject(ApplicationsService)

	@Input() applications: Application[]
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
