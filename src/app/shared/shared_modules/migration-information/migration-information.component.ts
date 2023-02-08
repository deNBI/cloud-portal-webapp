import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';


@Component({
	selector: 'app-migration-information',
	templateUrl: './migration-information.component.html',
	styleUrls: ['./migration-information.component.scss'],
})
export class MigrationInformationComponent implements OnInit, OnDestroy {
	subscription: Subscription = new Subscription();

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
