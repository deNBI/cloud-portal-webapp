import {Component, OnInit} from '@angular/core';
import {ApiSettings} from '../api-connector/api-settings.service';
import {ClientService} from '../api-connector/vmClients.service';
import {FacilityService} from '../api-connector/facility.service';
import {UserService} from '../api-connector/user.service';
import {GroupService} from '../api-connector/group.service';
import {VoService} from '../api-connector/vo.service';
import {IResponseTemplate} from "../api-connector/response-template";

/**
 * FullLayout component.
 */
@Component({
    selector: 'app-dashboard',
    templateUrl: './full-layout.component.html',
    providers: [VoService, GroupService, UserService, FacilityService, ClientService, ApiSettings]
})
export class FullLayoutComponent implements OnInit {

    public year: number = new Date().getFullYear();
    public disabled: boolean = false;
    public status: { isopen: boolean } = {isopen: false};
    private is_vo_admin: boolean = false;
    public is_facility_manager: boolean = false;
    public vm_project_member: boolean = false;
    public login_name: string = '';
    navbar_state: string = 'closed';
    overview_state: string = 'closed';

    constructor(private voService: VoService, private groupService: GroupService, private userservice: UserService,
                private facilityservice: FacilityService) {
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

    public get_is_facility_manager(): void {
        this.facilityservice.getManagerFacilities().subscribe(result => {
            if (result.length > 0) {
                this.is_facility_manager = true
            }
        })
    }

    is_vm_project_member(): void {
        this.groupService.getSimpleVmByUser().subscribe(result => {
            if (result.length > 0) {
                this.vm_project_member = true
            }
        })
    }

    toggle_new_application(): void {
        if (this.navbar_state === 'closed') {
            this.navbar_state = 'open'
        } else {
            this.navbar_state = 'closed'
        }
    }

    toggle_overview(): void {
        if (this.overview_state === 'closed') {
            this.overview_state = 'open'
        } else {
            this.overview_state = 'closed'
        }
    }

    checkVOstatus(): void {
        this.voService.isVo().subscribe((result: IResponseTemplate) => {
            this.is_vo_admin = <boolean><Boolean>result.value;
        })
    }

    ngOnInit(): void {

        this.checkVOstatus();
    }

    getLoginName(): void {
        this.userservice.getLogins().toPromise().then(result => {
            const logins = result;
            for (const login of logins) {
                if (login['friendlyName'] === 'login-namespace:elixir') {
                    this.login_name = login['value'];
                }

            }

        });

    }
}
