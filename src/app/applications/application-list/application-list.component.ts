import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core'
import { Application_States } from '../../shared/shared_modules/baseClass/abstract-base-class'

import { Application } from '../application.model/application.model'
import { ApplicationTabStates } from '../../shared/enums/application-tab-states'
import { ComputecenterComponent } from '../../projectmanagement/computecenter.component'
import { is_vo } from '../../shared/globalvar'

@Component({
	selector: 'app-application-list',
	templateUrl: './application-list.component.html',
	styleUrl: './application-list.component.scss',
	standalone: false
})
export class ApplicationListComponent implements OnInit, OnChanges {
	@Output() reloadNumbersTrigger: EventEmitter<void> = new EventEmitter()

	@Input() applications: Application[] = []
	@Input() tabState: ApplicationTabStates = ApplicationTabStates.SUBMITTED
	@Input() computeCenters: ComputecenterComponent[] = []
	@Input() facilityView: boolean = false
	@Input() voView: boolean = false

	dataTestId: string = ''

	is_vo_admin: boolean = false

	ngOnInit() {
		this.is_vo_admin = is_vo
		this.setDataTestId()
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	ngOnChanges(changes: SimpleChanges) {
		this.setDataTestId()
	}

	setDataTestId(): void {
		switch (this.tabState) {
			case ApplicationTabStates.SUBMITTED: {
				this.dataTestId = 'submitted_applications_container'
				break
			}
			case ApplicationTabStates.CREDITS_EXTENSION: {
				this.dataTestId = 'credits_requests_applications_container'
				break
			}
			case ApplicationTabStates.LIFETIME_EXTENSION: {
				this.dataTestId = 'lifetime_requests_applications_container'
				break
			}
			case ApplicationTabStates.MODIFICATION_EXTENSION: {
				this.dataTestId = 'modification_requests_applications_container'
				break
			}
			case ApplicationTabStates.TERMINATION_REQUEST: {
				this.dataTestId = 'termination_requests_applications_container'
				break
			}
			default: {
				break
			}
		}
		console.log(this.dataTestId)
	}

	triggerReloadNumbers() {
		console.log('trigger reload 2')
		this.reloadNumbersTrigger.emit()
	}

	removeApplicationFromList(application_id: string | number) {
		const idx: number = this.applications.findIndex(
			(application: Application) => application.project_application_id === application_id
		)

		if (idx !== -1) {
			console.log('remove index')
			this.applications.splice(idx, 1)
		}
	}

	protected readonly Application_States = Application_States
}
