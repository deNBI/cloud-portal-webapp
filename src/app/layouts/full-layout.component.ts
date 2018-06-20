import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***UsersManager***REMOVED*** from "../perun-connector/users-manager.service";
import ***REMOVED***AuthzResolver***REMOVED*** from "../perun-connector/authz-resolver.service";
import ***REMOVED***PerunSettings***REMOVED*** from "../perun-connector/connector-settings.service";
import ***REMOVED***ApiSettings***REMOVED*** from "../api-connector/api-settings.service";
import ***REMOVED***ClientService***REMOVED*** from "../api-connector/vmClients.service";
import ***REMOVED***GroupsManager***REMOVED*** from "../perun-connector/groups-manager.service";
import ***REMOVED***FacilityService***REMOVED*** from "../api-connector/facility.service";


@Component(***REMOVED***
    selector: 'app-dashboard',
    templateUrl: './full-layout.component.html',
    providers: [FacilityService, GroupsManager, ClientService, AuthzResolver, UsersManager, PerunSettings, ApiSettings]
***REMOVED***)
export class FullLayoutComponent implements OnInit ***REMOVED***

    public year = new Date().getFullYear();
    public disabled = false;
    public status: ***REMOVED*** isopen: boolean ***REMOVED*** = ***REMOVED***isopen: false***REMOVED***;
    private is_vo_admin = false;
    public is_facility_manager = false
    public vm_project_member = false;
    navbar_state = 'closed'
    client_avaiable;

    constructor(private facilityservice: FacilityService, private groupsManager: GroupsManager, private clientservice: ClientService, private perunsettings: PerunSettings, private usersmanager: UsersManager, private authzresolver: AuthzResolver) ***REMOVED***
        this.is_client_avaiable();
        this.is_vm_project_member();
        this.get_is_facility_manager();

    ***REMOVED***

    public get_is_vo_admin(): boolean ***REMOVED***
        return this.is_vo_admin;
    ***REMOVED***

    public toggled(open: boolean): void ***REMOVED***
        console.log('Dropdown is now: ', open);
    ***REMOVED***

    public toggleDropdown($event: MouseEvent): void ***REMOVED***
        $event.preventDefault();
        $event.stopPropagation();
        this.status.isopen = !this.status.isopen;
    ***REMOVED***

    public get_is_facility_manager() ***REMOVED***
        this.facilityservice.getManagerFacilities().subscribe(result => ***REMOVED***
            if (result.length > 0) ***REMOVED***
                this.is_facility_manager = true
            ***REMOVED***
        ***REMOVED***)
    ***REMOVED***

    is_vm_project_member() ***REMOVED***
        this.groupsManager.getMemberGroupsStatus().subscribe(result => ***REMOVED***
            if (result.json().length > 0) ***REMOVED***
                this.vm_project_member = true
            ***REMOVED***
        ***REMOVED***)
    ***REMOVED***

    is_client_avaiable() ***REMOVED***
        this.clientservice.isClientAvaiable().subscribe(result => ***REMOVED***
            try ***REMOVED***
                if (result.toString() === 'true') ***REMOVED***
                    this.client_avaiable = true;
                    return
                ***REMOVED***
                this.client_avaiable = false;
                return;
            ***REMOVED***
            catch (e) ***REMOVED***
                this.client_avaiable = false;
                return;
            ***REMOVED***

        ***REMOVED***)

    ***REMOVED***

    toggle_new_application() ***REMOVED***
        if (this.navbar_state == 'closed') ***REMOVED***
            this.navbar_state = 'open'
        ***REMOVED***
        else ***REMOVED***
            this.navbar_state = 'closed'
        ***REMOVED***
    ***REMOVED***

    checkVOstatus(usersmanager: UsersManager) ***REMOVED***
        let user_id: number;
        let admin_vos: ***REMOVED******REMOVED***;
        this.authzresolver
            .getLoggedUser().toPromise()
            .then(function (userdata) ***REMOVED***
                //TODO catch errors
                user_id = userdata.json()["id"];
                return usersmanager.getVosWhereUserIsAdmin(user_id).toPromise();
            ***REMOVED***).then(function (adminvos) ***REMOVED***
            admin_vos = adminvos.json();
        ***REMOVED***).then(result => ***REMOVED***
            //check if user is a Vo admin so we can serv according buttons
            for (let vkey in admin_vos) ***REMOVED***
                if (admin_vos[vkey]["id"] == this.perunsettings.getPerunVO().toString()) ***REMOVED***
                    this.is_vo_admin = true;
                ***REMOVED***

            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***

    ngOnInit(): void ***REMOVED***
        this.checkVOstatus(this.usersmanager);
    ***REMOVED***
***REMOVED***
