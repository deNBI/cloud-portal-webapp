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
    'EXPIRES SOON': false,
    WAIT_FOR_CONFIRMATION: false
  };
  filterProjectName: string;
  filterProjectId: number;
  filterProjectLongName: string;
  filterVmUsername: string;
  filterVmIp: string;
  filterVmCreated_at: string;
  filterVmElixir_id: string;
  filterVmStopped_at: string;
  filterVmName: string;
  filterFacilityName: string;

  abstract applyFilter(): void

  abstract checkFilter(obj: any): void

  isFilterProjectId(id: number | string): boolean {
    if (!this.filterProjectId) {
      return true;
    } else if (id.toString().indexOf(this.filterProjectId.toString()) === 0) {
      return true
    } else {
      return false
    }
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

  isFilterLongProjectName(name: string): boolean {
    if (!this.filterProjectLongName) {
      return true;
    } else if (name.indexOf(this.filterProjectLongName) === 0) {
      return true;
    } else {
      return false;
    }
  }

  isFilterProjectName(projectName: string): boolean {

    if (!this.filterProjectName) {
      return true;
    } else if (projectName.indexOf(this.filterProjectName) === 0) {

      return true;

    } else {

      return false;
    }
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

    if (this.filterstatus_list[status] || this.filterstatus_list[lifetime_status]
    ) {

      return true
    } else {
      return false
    }
  }

  isFilterStopped_at(vmstopped_at: string): boolean {
    if (!this.filterVmStopped_at) {
      return true;
    } else if (vmstopped_at.indexOf(this.filterVmStopped_at) === 0) {
      return true;
    } else {
      return false;
    }
  }

  isFilterElixir_id(vmelixir_id: string): boolean {
    if (!this.filterVmElixir_id) {
      return true;
    } else if (vmelixir_id.indexOf(this.filterVmElixir_id) === 0) {
      return true;
    } else {
      return false;
    }
  }

  isFilterCreated_at(vmcreated_at: string): boolean {
    if (!this.filterVmCreated_at) {
      return true;
    } else if (vmcreated_at.indexOf(this.filterVmCreated_at) === 0) {
      return true;
    } else {
      return false;
    }
  }

  isFilterName(vmname: string): boolean {
    if (!this.filterVmName) {
      return true;
    } else if (vmname.indexOf(this.filterVmName) === 0) {
      return true;
    } else {
      return false;
    }
  }

  isFilterIP(vmip: string): boolean {
    if (!this.filterVmIp) {
      return true;
    } else if (vmip == null) {
      return false;
    } else if (vmip.indexOf(this.filterVmIp) === 0) {

      return true;
    } else {
      return false;
    }
  }

  isFilterstatus(vmstatus: string): boolean {
    if (vmstatus !== 'ACTIVE' && vmstatus !== 'DELETED' && vmstatus !== 'SHUTOFF') {
      return true
    }
    if (this.filterstatus_list[vmstatus]
    ) {

      return true
    } else {
      return false
    }
  }

  isFilterUsername(vmusername: string): boolean {
    if (!this.filterVmUsername) {
      return true;
    } else if (vmusername.indexOf(this.filterVmUsername) === 0) {

      return true;
    } else {
      return false;
    }
  }

  changeFilterStatus(status: string): void {
    this.filterstatus_list[status] = !this.filterstatus_list[status];

  }

  changeFilterProjectStatusAndLifetimeStatus(project_status?: number, lifetime_reached?: number): void {
    let status: string;
    if (project_status) {
      switch (project_status) {
        case this.project_states.ACTIVE:
          status = this.project_states[this.project_states.ACTIVE];
          break;
        case this.project_states.SUSPENDED:
          status = this.project_states[this.project_states.SUSPENDED];
          break;
        default:
          break;
      }
      this.filterstatus_list[status] = !this.filterstatus_list[status];
    }
    if (lifetime_reached) {
      switch (lifetime_reached) {
        case this.lifetime_states.EXPIRED:
          status = this.lifetime_states[this.lifetime_states.EXPIRED];
          break;
        case this.lifetime_states.EXPIRES_SOON:
          status = this.lifetime_states[this.lifetime_states.EXPIRES_SOON];
          break;
        default:
          break;
      }
      this.filterstatus_list[status] = !this.filterstatus_list[status];
    }

  }
}
