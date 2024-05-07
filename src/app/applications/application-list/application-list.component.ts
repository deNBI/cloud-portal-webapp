import {
	Component, EventEmitter, Input, OnInit, Output,
} from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { AbstractBaseClass, Application_States } from '../../shared/shared_modules/baseClass/abstract-base-class';
import { ConfirmationActions } from '../../shared/modal/confirmation_actions';

import { Application } from '../application.model/application.model';
import { ApplicationTabStates } from '../../shared/enums/application-tab-states';
import { ComputecenterComponent } from '../../projectmanagement/computecenter.component';

@Component({
	selector: 'app-application-list',

	templateUrl: './application-list.component.html',
	styleUrl: './application-list.component.scss',
})
export class ApplicationListComponent {
		@Output() reloadNumbersTrigger: EventEmitter<void> = new EventEmitter();

		@Input() applications: Application[] = [];
		@Input() tabState: ApplicationTabStates = ApplicationTabStates.SUBMITTED;
		@Input() computeCenters: ComputecenterComponent[] = [];

		triggerReloadNumbers() {
			console.log('trigger reload 2');
			this.reloadNumbersTrigger.emit();
		}

		removeApplicationFromList(application_id: string | number) {
			const idx: number = this.applications.findIndex((application: Application) => application.project_application_id === application_id);

			if (idx !== -1) {
				console.log('remove index');
				this.applications.splice(idx, 1);
			}
		}

		protected readonly Application_States = Application_States;
}
