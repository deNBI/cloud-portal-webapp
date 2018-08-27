import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***PerunSettings***REMOVED*** from "../perun-connector/connector-settings.service";
import ***REMOVED***ApiSettings***REMOVED*** from "../api-connector/api-settings.service";
import ***REMOVED***ClientService***REMOVED*** from "../api-connector/vmClients.service";
import ***REMOVED***FacilityService***REMOVED*** from "../api-connector/facility.service";
import ***REMOVED***UserService***REMOVED*** from "../api-connector/user.service";
import ***REMOVED***GroupService***REMOVED*** from "../api-connector/group.service";
import ***REMOVED***PopoverModule ***REMOVED*** from 'ngx-popover';
import ***REMOVED***VoService***REMOVED*** from "../api-connector/vo.service";

@Component(***REMOVED***
    selector: 'app-dashboard',
    templateUrl: './full-layout.component.html',
    providers: [VoService,GroupService,UserService,FacilityService, ClientService,  PerunSettings, ApiSettings]
***REMOVED***)
export class FullLayoutComponent implements OnInit ***REMOVED***

    public year = new Date().getFullYear();
    public disabled = false;
    public status: ***REMOVED*** isopen: boolean ***REMOVED*** = ***REMOVED***isopen: false***REMOVED***;
    private is_vo_admin = false;
    public is_facility_manager = false;
    public vm_project_member = false;
    public login_name = '';
    navbar_state = 'closed';
    overview_state='closed';
    client_avaiable;

    constructor(private voService:VoService,private groupService:GroupService,private userservice:UserService,private facilityservice: FacilityService, private clientservice: ClientService, private perunsettings: PerunSettings) ***REMOVED***
        this.is_client_avaiable();
        this.is_vm_project_member();
        this.get_is_facility_manager();
        this.getLoginName();
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
        this.groupService.getMemberGroupsStatus().subscribe(result => ***REMOVED***
            if (result.length > 0) ***REMOVED***
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

    toggle_overview()***REMOVED***
         if (this.overview_state == 'closed') ***REMOVED***
            this.overview_state = 'open'
        ***REMOVED***
        else ***REMOVED***
            this.overview_state = 'closed'
        ***REMOVED***
    ***REMOVED***



    checkVOstatus() ***REMOVED***
       this.voService.isVo().subscribe(result =>***REMOVED***
           this.is_vo_admin=result['Is_Vo_Manager'];
       ***REMOVED***)
    ***REMOVED***

    ngOnInit(): void ***REMOVED***

        this.checkVOstatus();
    ***REMOVED***

    getLoginName() ***REMOVED***
            this.userservice.getLogins().toPromise().then(result => ***REMOVED***
                let logins = result;
                for (let login of logins) ***REMOVED***
                  if (login['friendlyName'] === 'login-namespace:elixir') ***REMOVED***
                        this.login_name = login['value'];
                    ***REMOVED***

                ***REMOVED***

            ***REMOVED***);

        ***REMOVED***
***REMOVED***
