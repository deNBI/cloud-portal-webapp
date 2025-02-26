import { Application_States } from '../shared_modules/baseClass/abstract-base-class'
import { SortColumn, SortDirection } from '../shared_modules/directives/nbd-sortable-header.directive'

export class ApplicationFilter {
	filterStatusList: number[] = []
	showSimpleVM: boolean = true
	showOpenStack: boolean = true
	showKubernetes: boolean = true
	sortColumn: SortColumn = 'project_application_perun_id'
	sortDirection: SortDirection

	constructor() {
		this._initiateFilterStatusList()
	}

	_initiateFilterStatusList(): void {
		this.filterStatusList = [
			Application_States.APPROVED,
			Application_States.SUSPENDED,
			Application_States.EXPIRED,
			Application_States.WAIT_FOR_CONFIRMATION,
			Application_States.TERMINATION_REQUESTED,
			Application_States.EXPIRES_SOON,
			Application_States.DISABLED
		]
	}

	addOrRemoveFromFilterStatusList(status: Application_States) {
		const idx = this.filterStatusList.indexOf(status)
		if (idx === -1) {
			this.filterStatusList.push(status)
		} else {
			this.filterStatusList.splice(idx, 1)
		}
	}
}
