import {
	Component, EventEmitter, Input, OnInit, Output,
} from '@angular/core';
import { Application_States } from '../../shared/shared_modules/baseClass/abstract-base-class';

import { Application } from '../application.model/application.model';
import { ApplicationTabStates } from '../../shared/enums/application-tab-states';
import { ComputecenterComponent } from '../../projectmanagement/computecenter.component';
import { is_vo } from '../../shared/globalvar';

@Component({
	selector: 'app-application-list',

	templateUrl: './application-list.component.html',
	styleUrl: './application-list.component.scss',
})
export class ApplicationListComponent implements OnInit {
		@Output() reloadNumbersTrigger: EventEmitter<void> = new EventEmitter();

		@Input() applications: Application[] = [];
		@Input() tabState: ApplicationTabStates = ApplicationTabStates.SUBMITTED;
		@Input() computeCenters: ComputecenterComponent[] = [];
		@Input() facilityView:boolean = false;
		@Input() voView:boolean = false;

		is_vo_admin: boolean = false;

		ngOnInit() {
			this.is_vo_admin = is_vo;

		}

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
