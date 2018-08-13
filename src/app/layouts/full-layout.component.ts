import {Component, OnInit} from '@angular/core';
import {PerunSettings} from "../perun-connector/connector-settings.service";
import {ApiSettings} from "../api-connector/api-settings.service";
import {ClientService} from "../api-connector/vmClients.service";
import {FacilityService} from "../api-connector/facility.service";
import {UserService} from "../api-connector/user.service";
import {GroupService} from "../api-connector/group.service";
import {PopoverModule } from 'ngx-popover';
import {VoService} from "../api-connector/vo.service";

@Component({
    selector: 'app-dashboard',
    templateUrl: './full-layout.component.html',
    providers: [VoService,GroupService,UserService,FacilityService, ClientService,  PerunSettings, ApiSettings]
})
export class FullLayoutComponent implements OnInit {

    public year = new Date().getFullYear();
    public disabled = false;
    public status: { isopen: boolean } = {isopen: false};
    private is_vo_admin = false;
    public is_facility_manager = false;
    public vm_project_member = false;
    public login_name = '';
    navbar_state = 'closed';
    overview_state='closed';
    client_avaiable;

    constructor(private voService:VoService,private groupService:GroupService,private userservice:UserService,private facilityservice: FacilityService, private clientservice: ClientService, private perunsettings: PerunSettings) {
        this.is_client_avaiable();
        this.is_vm_project_member();
        this.get_is_facility_manager();
        this.getLoginName();
    }

    public get_is_vo_admin(): boolean {
        return this.is_vo_admin;
    }

    public toggled(open: boolean): void {
        console.log('Dropdown is now: ', open);
    }

    public toggleDropdown($event: MouseEvent): void {
        $event.preventDefault();
        $event.stopPropagation();
        this.status.isopen = !this.status.isopen;
    }

    public get_is_facility_manager() {
        this.facilityservice.getManagerFacilities().subscribe(result => {
            if (result.length > 0) {
                this.is_facility_manager = true
            }
        })
    }

    is_vm_project_member() {
        this.groupService.getMemberGroupsStatus().subscribe(result => {
            if (result.length > 0) {
                this.vm_project_member = true
            }
        })
    }

    is_client_avaiable() {
        this.clientservice.isClientAvaiable().subscribe(result => {
            try {
                if (result.toString() === 'true') {
                    this.client_avaiable = true;
                    return
                }
                this.client_avaiable = false;
                return;
            }
            catch (e) {
                this.client_avaiable = false;
                return;
            }

        })

    }

    toggle_new_application() {
        if (this.navbar_state == 'closed') {
            this.navbar_state = 'open'
        }
        else {
            this.navbar_state = 'closed'
        }
    }

    toggle_overview(){
         if (this.overview_state == 'closed') {
            this.overview_state = 'open'
        }
        else {
            this.overview_state = 'closed'
        }
    }



    checkVOstatus() {
       this.voService.isVo().subscribe(result =>{
           this.is_vo_admin=result['Is_Vo_Manager'];
       })
    }

    ngOnInit(): void {

        this.checkVOstatus();
    }

    getLoginName() {
            this.userservice.getLogins().toPromise().then(result => {
                let logins = result;
                for (let login of logins) {
                  if (login['friendlyName'] === 'login-namespace:elixir') {
                        this.login_name = login['value'];
                    }

                }

            });

        }
}
