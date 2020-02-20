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
    EXPIRES_SOON: true
  };
  filterProjectName: string;
  filterProjectId: string;
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
    return this.filterstatus_list[vmstatus];
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
    console.log(this.filterstatus_list)

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
