import {AbstractBaseClass, Application_States} from './abstract-base-class';

/**
 * Base class for filtering.
 */
export abstract class FilterBaseClass extends AbstractBaseClass {

		filterstatus_list: number[] = [
				Application_States.ACTIVE,
				Application_States.SUSPENDED,
				//	Application_States.DELETED,
				Application_States.EXPIRED,
				Application_States.WAIT_FOR_CONFIRMATION,
				Application_States.TERMINATION_REQUESTED,
				Application_States.EXPIRES_SOON,
		];
		filterProjectName: string;
		filterProjectId: string;
		filterProjectLongName: string;
		filterFacilityName: string;

		addOrRemoveFromFilterStatusList(status: Application_States) {
				const idx = this.filterstatus_list.indexOf(status)
				if (idx == -1) {
						this.addToFilterStatusList(status)
				} else {
						this.removeStatusFromFilterStatusList(status)
				}

		}

		addToFilterStatusList(status: Application_States) {
				const idx = this.filterstatus_list.indexOf(status)
				if (idx == -1) {
						console.log('add')
						this.filterstatus_list.push(status)
				}
		}

		removeStatusFromFilterStatusList(status: Application_States) {
				const idx = this.filterstatus_list.indexOf(status)
				if (idx != -1) {
						console.log('remove')

						this.filterstatus_list.splice(idx, 1)
				}
		}

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
				} else return name.includes(this.filterFacilityName.toLowerCase());
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
