import { Application_States } from '../shared_modules/baseClass/abstract-base-class'
import { SortColumn, SortDirection } from '../shared_modules/directives/nbd-sortable-header.directive'

export class ApplicationFilter {
	showSimpleVM: boolean = true
	showOpenStack: boolean = true
	showKubernetes: boolean = true
	sortColumn: SortColumn = 'project_application_perun_id'
	sortDirection: SortDirection
	textFilter: string = ''
	isApproved: boolean = true
	isSuspended: boolean = true
	isExpired: boolean = true
	isWaitForConfirmation: boolean = true
	isTerminationRequested: boolean = true
	isExpiresSoon: boolean = true
	isDisabled: boolean = true
	isTerminated: boolean = false
	isWaitForTerminationFM: boolean = true

	getFilterStatusList(): number[] {
		const statusList: number[] = []
		if (this.isApproved) statusList.push(Application_States.APPROVED)
		if (this.isSuspended) statusList.push(Application_States.SUSPENDED)
		if (this.isExpired) statusList.push(Application_States.EXPIRED)
		if (this.isWaitForConfirmation) statusList.push(Application_States.WAIT_FOR_CONFIRMATION)
		if (this.isTerminationRequested) statusList.push(Application_States.TERMINATION_REQUESTED)
		if (this.isExpiresSoon) statusList.push(Application_States.EXPIRES_SOON)
		if (this.isDisabled) statusList.push(Application_States.DISABLED)
		if (this.isTerminated) statusList.push(Application_States.TERMINATED)
		if (this.isWaitForTerminationFM) statusList.push(Application_States.WAIT_FOR_TERMINATION_FM)

		return statusList
	}
}
