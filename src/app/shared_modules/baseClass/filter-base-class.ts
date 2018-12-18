import ***REMOVED***AbstractBaseClasse***REMOVED*** from "./abstract-base-class";

export abstract class FilterBaseClass extends AbstractBaseClasse ***REMOVED***

    filterstatus_list: ***REMOVED*** [status: string]: boolean ***REMOVED*** = ***REMOVED***
        'ACTIVE': true,
        'SUSPENDED': true,
        'DELETED': false,
        'EXPIRED': false,
        'EXPIRES SOON': false
    ***REMOVED***;
    filterProjectName: string;
    filterProjectId: number;
    filterProjectLongName: string;
    filterVmUsername: string;
    filterVmIp: string;
    filterVmStatus: string;
    filterVmCreated_at: string;
    filterVmElixir_id: string;
    filterVmStopped_at: string;
    filterVmName: string;
    filterVmSsh: string;

    changeFilterLifetime(lifetime_reached: number) ***REMOVED***
        let status: string;
        switch (lifetime_reached) ***REMOVED***
            case this.lifetime_statuses.EXPIRED:
                status = this.lifetime_statuses[this.lifetime_statuses.EXPIRED];
                break;
            case this.lifetime_statuses.EXPIRES_SOON:
                status = this.lifetime_statuses[this.lifetime_statuses.EXPIRES_SOON];

        ***REMOVED***
        this.filterstatus_list[status] = !this.filterstatus_list[status];


    ***REMOVED***

    abstract applyFilter(): void

    abstract checkFilter(obj: any): void

    isFilterProjectId(id: number): boolean ***REMOVED***
        if (!this.filterProjectId) ***REMOVED***
            return true;
        ***REMOVED***
        else if (id.toString().indexOf(this.filterProjectId.toString()) === 0) ***REMOVED***
            return true
        ***REMOVED***
        else ***REMOVED***
            return false
        ***REMOVED***
    ***REMOVED***

    isFilterLongProjectName(name: string): boolean ***REMOVED***
        if (!this.filterProjectLongName) ***REMOVED***
            return true;
        ***REMOVED***
        else if (name.indexOf(this.filterProjectLongName) === 0) ***REMOVED***
            return true;
        ***REMOVED***
        else ***REMOVED***
            return false;
        ***REMOVED***
    ***REMOVED***


    isFilterProjectName(projectName: string): boolean ***REMOVED***

        if (!this.filterProjectName) ***REMOVED***
            return true;
        ***REMOVED***
        else if (projectName.indexOf(this.filterProjectName) === 0) ***REMOVED***

            return true;

        ***REMOVED***
        else ***REMOVED***

            return false;
        ***REMOVED***
    ***REMOVED***

    isFilterProjectStatus(status_number: number, lifetime_reached: number): boolean ***REMOVED***
        let status: string;
        let lifetime_status: string;
        switch (status_number) ***REMOVED***
            case this.project_statuses.ACTIVE:
                status = this.project_statuses[this.project_statuses.ACTIVE];
                break;
            case this.project_statuses.SUSPENDED:
                status = this.project_statuses[this.project_statuses.SUSPENDED];
                break;
        ***REMOVED***
        switch (lifetime_reached) ***REMOVED***
            case this.lifetime_statuses.EXPIRED:
                lifetime_status = this.lifetime_statuses[this.lifetime_statuses.EXPIRED];
                break;
            case this.lifetime_statuses.EXPIRES_SOON:
                lifetime_status = this.lifetime_statuses[this.lifetime_statuses.EXPIRES_SOON];break;
        ***REMOVED***


        if (this.filterstatus_list[status] || this.filterstatus_list[lifetime_status]
        ) ***REMOVED***

            return true
        ***REMOVED***
        else ***REMOVED***
            return false
        ***REMOVED***
    ***REMOVED***

    isFilterStopped_at(vmstopped_at: string): boolean ***REMOVED***
        if (!this.filterVmStopped_at) ***REMOVED***
            return true;
        ***REMOVED***
        else if (vmstopped_at.indexOf(this.filterVmStopped_at) === 0) ***REMOVED***
            return true;
        ***REMOVED***
        else ***REMOVED***
            return false;
        ***REMOVED***
    ***REMOVED***


    isFilterElixir_id(vmelixir_id: string): boolean ***REMOVED***
        if (!this.filterVmElixir_id) ***REMOVED***
            return true;
        ***REMOVED***
        else if (vmelixir_id.indexOf(this.filterVmElixir_id) === 0) ***REMOVED***
            return true;
        ***REMOVED***
        else ***REMOVED***
            return false;
        ***REMOVED***
    ***REMOVED***

    isFilterCreated_at(vmcreated_at: string): boolean ***REMOVED***
        if (!this.filterVmCreated_at) ***REMOVED***
            return true;
        ***REMOVED***
        else if (vmcreated_at.indexOf(this.filterVmCreated_at) === 0) ***REMOVED***
            return true;
        ***REMOVED***
        else ***REMOVED***
            return false;
        ***REMOVED***
    ***REMOVED***

    isFilterName(vmname: string): boolean ***REMOVED***
        if (!this.filterVmName) ***REMOVED***
            return true;
        ***REMOVED***
        else if (vmname.indexOf(this.filterVmName) === 0) ***REMOVED***
            return true;
        ***REMOVED***
        else ***REMOVED***
            return false;
        ***REMOVED***
    ***REMOVED***

    isFilterIP(vmip: string): boolean ***REMOVED***
        if (!this.filterVmIp) ***REMOVED***
            return true;
        ***REMOVED***
        else if (vmip == null) ***REMOVED***
            return false;
        ***REMOVED***
        else if (vmip.indexOf(this.filterVmIp) === 0) ***REMOVED***

            return true;
        ***REMOVED***
        else ***REMOVED***
            return false;
        ***REMOVED***
    ***REMOVED***

    isFilterstatus(vmstatus: string): boolean ***REMOVED***
        if (vmstatus == 'FREEMIUM') ***REMOVED***
            return true
        ***REMOVED***
        if (this.filterstatus_list[vmstatus]
        ) ***REMOVED***

            return true
        ***REMOVED***
        else ***REMOVED***
            return false
        ***REMOVED***
    ***REMOVED***

    isFilterUsername(vmusername: string): boolean ***REMOVED***
        if (!this.filterVmUsername) ***REMOVED***
            return true;
        ***REMOVED***
        else if (vmusername.indexOf(this.filterVmUsername) === 0) ***REMOVED***

            return true;
        ***REMOVED***
        else ***REMOVED***
            return false;
        ***REMOVED***
    ***REMOVED***

    changeFilterStatus(status: string) ***REMOVED***
        this.filterstatus_list[status] = !this.filterstatus_list[status];


    ***REMOVED***

    changeFilterProjectStatusAndLifetimeStatus(project_status?: number, lifetime_reached?: number): void ***REMOVED***
        let status: string;
        if (project_status) ***REMOVED***
            switch (project_status) ***REMOVED***
                case this.project_statuses.ACTIVE:
                    status = this.project_statuses[this.project_statuses.ACTIVE];
                    break;
                case this.project_statuses.SUSPENDED:
                    status = this.project_statuses[this.project_statuses.SUSPENDED];
                    break;
            ***REMOVED***
            this.filterstatus_list[status] = !this.filterstatus_list[status];
        ***REMOVED***
        if (lifetime_reached) ***REMOVED***
            switch (lifetime_reached) ***REMOVED***
                case this.lifetime_statuses.EXPIRED:
                    status = this.lifetime_statuses[this.lifetime_statuses.EXPIRED];
                    break;
                case this.lifetime_statuses.EXPIRES_SOON:
                    status = this.lifetime_statuses[this.lifetime_statuses.EXPIRES_SOON];
            ***REMOVED***
            this.filterstatus_list[status] = !this.filterstatus_list[status];
        ***REMOVED***


    ***REMOVED***
***REMOVED***
