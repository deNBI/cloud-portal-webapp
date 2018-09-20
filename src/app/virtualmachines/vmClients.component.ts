import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Vmclient} from "./virtualmachinemodels/vmclient";
import {ClientService} from "../api-connector/vmClients.service";
import {PerunSettings} from "../perun-connector/connector-settings.service";
import {ApiSettings} from "../api-connector/api-settings.service";
import {GroupService} from "../api-connector/group.service";
import {UserService} from "../api-connector/user.service";
import {ComputecenterComponent} from "../projectmanagement/computecenter.component";
import {FacilityService} from "../api-connector/facility.service";


@Component({
    selector: 'client-overview',
    templateUrl: 'vmClients.component.html',
    providers: [FacilityService,UserService, GroupService, ClientService, PerunSettings, ApiSettings]
})

export class ClientOverviewComponent implements OnInit {
    clients: Vmclient[];
    is_vo_admin = false;
    checkStatus: string = 'Not checked';
    computeCenters: ComputecenterComponent[]=[];
    selectedComputeCenter: ComputecenterComponent;
    isLoaded = false;

    constructor(private facilityService:FacilityService,private userservice: UserService, private groupservice: GroupService, private clientservice: ClientService, private perunsettings: PerunSettings) {

    }

    checkVOstatus(userservice: UserService) {
        let user_id: number;
        let admin_vos: {};
        this.userservice
            .getLoggedUser().toPromise()
            .then(function (userdata) {
                //TODO catch errors
                user_id = userdata["id"];
                return userservice.getVosWhereUserIsAdmin().toPromise();
            }).then(function (adminvos) {
            admin_vos = adminvos;
        }).then(result => {
            //check if user is a Vo admin so we can serv according buttons
            for (let vkey in admin_vos) {
                if (admin_vos[vkey]["id"] == this.perunsettings.getPerunVO().toString()) {
                    this.is_vo_admin = true;
                }
            }
        });
    }




    getClientsChecked(): void {
        this.clientservice.getClientsChecked().subscribe(clients => {
            this.clients = clients;
            this.isLoaded=true;
        });


    }

    getComputeCenters() {
        this.facilityService.getComputeCenters().subscribe(result => {
            for (let cc of result) {
                let compute_center = new ComputecenterComponent(cc['compute_center_facility_id'], cc['compute_center_name'], cc['compute_center_login'], cc['compute_center_support_mail'])
                this.computeCenters.push(compute_center)
            }

        })
    }

    checkClient(host: string, port: string): void {
        if (host && port) {
            this.clientservice.checkClient(host, port).subscribe(data => {

                if (data['status'] == false) {
                    this.checkStatus = 'No Connection';
                }
                else if (data['status'] == true) {
                    this.checkStatus = "Connected";
                }
                else {
                    this.checkStatus = "check failed";

                }

            });
        }
    }

    postClient(host: string, port: string, location: string): void {


        if (host && port && location) {
            this.clientservice.postClient(host, port, location).subscribe(data => {

                this.getClientsChecked();
            });
        }
    }

    deleteClient(client_id:number): void {
        this.clientservice.deleteClient(client_id).subscribe(data => {

            this.getClientsChecked();
        });
    }


    ngOnInit(): void {
        this.checkVOstatus(this.userservice);
        this.getClientsChecked();
        this.getComputeCenters();

    }

}
