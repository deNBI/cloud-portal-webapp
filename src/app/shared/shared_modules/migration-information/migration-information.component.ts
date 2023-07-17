import {
	Component, OnInit, OnDestroy, Input,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CLOUD_PORTAL_SUPPORT_MAIL, NEW_SVM_KEYCLOAK_LOGIN } from '../../../../links/links';

@Component({
	selector: 'app-migration-information',
	templateUrl: './migration-information.component.html',
	styleUrls: ['./migration-information.component.scss'],
})
export class MigrationInformationComponent implements OnInit, OnDestroy {
	subscription: Subscription = new Subscription();

	NEW_SVM_KEYCLOAK_LOGIN: string = NEW_SVM_KEYCLOAK_LOGIN;
	CLOUD_PORTAL_SUPPORT_MAIL: string = CLOUD_PORTAL_SUPPORT_MAIL;

	@Input() isCreationPage: boolean = false;
	@Input() affectedProjects: string[] = [];

	@Input() type: string = '';

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor() {
		// eslint-disable-next-line no-empty-function
	}

	ngOnInit(): void {
		this.subscription = new Subscription();
		const uniqueProjects = [];
		this.affectedProjects.forEach(project => {
			if (!uniqueProjects.includes(project)) {
				uniqueProjects.push(project);
			}
		});
		this.affectedProjects = uniqueProjects;
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
}
