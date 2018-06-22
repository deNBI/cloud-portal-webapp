import {Component, OnInit} from '@angular/core';
import {UsersManager} from "../perun-connector/users-manager.service";
import {PerunSettings} from "../perun-connector/connector-settings.service";
import {ApiSettings} from "../api-connector/api-settings.service";
import {ClientService} from "../api-connector/vmClients.service";
import {GroupsManager} from "../perun-connector/groups-manager.service";
import {FacilityService} from "../api-connector/facility.service";
import {UserService} from "../api-connector/user.service";


@Component({
    selector: 'app-dashboard',
    templateUrl: './full-layout.component.html',
    providers: [UserService,FacilityService, GroupsManager, ClientService, UsersManager, PerunSettings, ApiSettings]
})
export class FullLayoutComponent implements OnInit {

    public year = new Date().getFullYear();
    public disabled = false;
    public status: { isopen: boolean } = {isopen: false};
    private is_vo_admin = false;
    public is_facility_manager = false
    public vm_project_member = false;
    navbar_state = 'closed'
    client_avaiable;

    constructor(private userservice:UserService,private facilityservice: FacilityService, private groupsManager: GroupsManager, private clientservice: ClientService, private perunsettings: PerunSettings, private usersmanager: UsersManager) {
        this.is_client_avaiable();
        this.is_vm_project_member();
        this.get_is_facility_manager();

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
        this.groupsManager.getMemberGroupsStatus().subscribe(result => {
            if (result.json().length > 0) {
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

    checkVOstatus(userservice:UserService) {
        let user_id: number;
        let admin_vos: {};

        this.userservice
            .getLoggedUser().toPromise()
            .then(function (userdata) {
                //TODO catch errors
                user_id = userdata.json()["id"];


                return userservice.getVosWhereUserIsAdmin(user_id).toPromise();
            }).then(function (adminvos) {
            admin_vos = adminvos.json();
        }).then(result => {
            //check if user is a Vo admin so we can serv according buttons
            for (let vkey in admin_vos) {
                if (admin_vos[vkey]["id"] == this.perunsettings.getPerunVO().toString()) {
                    this.is_vo_admin = true;
                }

            }
        });
    }

    ngOnInit(): void {

        this.checkVOstatus(this.userservice);
    }
}
