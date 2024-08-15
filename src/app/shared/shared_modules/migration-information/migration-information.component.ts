import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { Subscription } from 'rxjs'
import { CLOUD_PORTAL_SUPPORT_MAIL, NEW_SVM_PORTAL_LINK } from '../../../../links/links'

@Component({
	selector: 'app-migration-information',
	templateUrl: './migration-information.component.html',
	styleUrls: ['./migration-information.component.scss']
})
export class MigrationInformationComponent implements OnInit, OnDestroy {
	subscription: Subscription = new Subscription()

	CLOUD_PORTAL_SUPPORT_MAIL: string = CLOUD_PORTAL_SUPPORT_MAIL
	NEW_SVM_PORTAL_LINK: string = NEW_SVM_PORTAL_LINK

	@Input() isCreationPage: boolean = false
	@Input() affectedProjects: string[] = []

	@Input() type: string = ''

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor() {
		 
	}

	ngOnInit(): void {
		this.subscription = new Subscription()
		const uniqueProjects = []
		this.affectedProjects.forEach(project => {
			if (!uniqueProjects.includes(project)) {
				uniqueProjects.push(project)
			}
		})
		this.affectedProjects = uniqueProjects
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe()
	}
}
