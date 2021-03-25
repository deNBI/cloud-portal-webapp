import { AbstractBaseClass } from './abstract-base-class';

/**
 * Base class for filtering.
 */
export abstract class FilterBaseClass extends AbstractBaseClass {

	filterstatus_list: { [status: string]: boolean } = {
		ACTIVE: true,
		SUSPENDED: true,
		DELETED: false,
		EXPIRED: false,
		'EXPIRES SOON': true,
		WAIT_FOR_CONFIRMATION: false,
		TERMINATION_REQUESTED: true,
		EXPIRES_SOON: true,
	};
	filterProjectName: string;
	filterProjectId: string;
	filterProjectLongName: string;
	filterFacilityName: string;

	abstract applyFilter(): void

	abstract checkFilter(obj: any): void

	isFilterProjectId(id: string, filter?: string): boolean {

		if (filter) {
			this.filterProjectId = filter;
		}
		if (!this.filterProjectId) {
			return true;
		}

		return id.includes(this.filterProjectId);
	}

	isFilterFacilityName(name: string): boolean {
		if (!this.filterFacilityName) {
			return true;
		} else if (name.indexOf(this.filterFacilityName) === 0) {
			return true;
		} else {
			return false;
		}
	}

	isFilterLongProjectName(name: string, filter?: string): boolean {

		if (filter) {
			this.filterProjectLongName = filter;
		}
		if (!this.filterProjectLongName) {
			return true;
		}

		return name != null && name.includes(this.filterProjectLongName);
	}

	isFilterProjectName(projectName: string, filter?: string): boolean {
		if (filter) {
			this.filterProjectName = filter;
		}

		if (!this.filterProjectName) {
			return true;
		}

		return projectName != null && projectName.includes(this.filterProjectName);
	}

	isFilterProjectStatus(status_numbers: number[], lifetime_reached: number): boolean {
		let status: string;
		let lifetime_status: string;
		if (status_numbers && status_numbers.length > 0) {
			for (const status_number of status_numbers) {
				switch (status_number) {
					case this.project_states.ACTIVE:
						status = this.project_states[this.project_states.ACTIVE];
						if (this.filterstatus_list[status]) {
							return true;
						}

						break;
					case this.project_states.SUSPENDED:
						status = this.project_states[this.project_states.SUSPENDED];
						if (this.filterstatus_list[status]) {
							return true;
						}
						break;
					case this.application_states.WAIT_FOR_CONFIRMATION:
						status = this.application_states[this.application_states.WAIT_FOR_CONFIRMATION];
						if (this.filterstatus_list[status]) {
							return true;
						}
						break;
					case this.application_states.TERMINATION_REQUESTED:
						status = this.application_states[this.application_states.TERMINATION_REQUESTED];
						if (this.filterstatus_list[status]) {
							return true;
						}
						break;
					case this.application_states.WAIT_FOR_TERMINATION_FM:
						status = this.application_states[this.application_states.WAIT_FOR_TERMINATION_FM];
						if (this.filterstatus_list[status]) {
							return true;
						}
						break;
					default:
						break;
				}
			}
		}

		switch (lifetime_reached) {
			case this.lifetime_states.EXPIRED:
				lifetime_status = this.lifetime_states[this.lifetime_states.EXPIRED];
				if (this.filterstatus_list[lifetime_status]) {
					return true;
				}
				break;
			case this.lifetime_states.EXPIRES_SOON:
				lifetime_status = this.lifetime_states[this.lifetime_states.EXPIRES_SOON];
				if (this.filterstatus_list[lifetime_status]) {
					return true;
				}
				break;
			default:
				break;
		}

		return false;

	}

	changeFilterStatus(status: string): void {
		this.filterstatus_list[status] = !this.filterstatus_list[status];
	}

}
