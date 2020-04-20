import {AbstractBaseClasse} from './abstract-base-class';

/**
 * Base class for filtering.
 */
export abstract class FilterBaseClass extends AbstractBaseClasse {

  filterstatus_list: { [status: string]: boolean } = {
    ACTIVE: true,
    SUSPENDED: true,
    DELETED: false,
    EXPIRED: false,
    'EXPIRES SOON': true,
    WAIT_FOR_CONFIRMATION: false,
    TERMINATION_REQUESTED: true,
    EXPIRES_SOON: true
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

  isFilterProjectStatus(status_number: number, lifetime_reached: number): boolean {
    let status: string;
    let lifetime_status: string;
    switch (status_number) {
      case this.project_states.ACTIVE:
        status = this.project_states[this.project_states.ACTIVE];
        break;
      case this.project_states.SUSPENDED:
        status = this.project_states[this.project_states.SUSPENDED];
        break;
      case this.application_states.WAIT_FOR_CONFIRMATION:
        status = this.application_states[this.application_states.WAIT_FOR_CONFIRMATION];
        break;
      case this.application_states.TERMINATION_REQUESTED:
        status = this.application_states[this.application_states.TERMINATION_REQUESTED];
        break;
      default:
        break;
    }
    switch (lifetime_reached) {
      case this.lifetime_states.EXPIRED:
        lifetime_status = this.lifetime_states[this.lifetime_states.EXPIRED];
        break;
      case this.lifetime_states.EXPIRES_SOON:
        lifetime_status = this.lifetime_states[this.lifetime_states.EXPIRES_SOON];
        break;
      default:
        break;
    }

    return this.filterstatus_list[status] || this.filterstatus_list[lifetime_status];
  }

  changeFilterStatus(status: string): void {
    this.filterstatus_list[status] = !this.filterstatus_list[status];
  }


}
