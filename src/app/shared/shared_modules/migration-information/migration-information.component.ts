import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NEW_SVM_PORTAL_LINK, WIKI_SVM_MIGRATION_LINK } from '../../../../links/links';
import {Input} from "@angular/core";


@Component({
	selector: 'app-migration-information',
	templateUrl: './migration-information.component.html',
	styleUrls: ['./migration-information.component.scss'],
})
export class MigrationInformationComponent implements OnInit, OnDestroy {
	subscription: Subscription = new Subscription();

	WIKI_SVM_MIGRATION_LINK: string = WIKI_SVM_MIGRATION_LINK;

	NEW_SVM_PORTAL_LINK: string = NEW_SVM_PORTAL_LINK;

	@Input() isCreationPage: boolean = false;
	@Input() affectedProjects: any = {};

	@Input() type: string = '';
	constructor() {
		// eslint-disable-next-line no-empty-function
	}

	ngOnInit(): void {
		this.subscription = new Subscription();
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

}