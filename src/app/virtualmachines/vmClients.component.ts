import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormsModule} from '@angular/forms';
import 'rxjs/Rx'
import {Vmclient} from "./virtualmachinemodels/vmclient";
import {ClientService} from "../api-connector/vmClients.service";
import {PerunSettings} from "../perun-connector/connector-settings.service";
import {ApiSettings} from "../api-connector/api-settings.service";
import {GroupService} from "../api-connector/group.service";
import {UserService} from "../api-connector/user.service";


@Component({
    selector: 'client-overview',
    templateUrl: 'vmClients.component.html',
    providers: [UserService, GroupService, ClientService, PerunSettings, ApiSettings]
})

export class ClientOverviewComponent implements OnInit {
    clients: Vmclient[];
    is_vo_admin = false;
    checkStatus: string = 'Not checked';
    computeCenters: [string, number][];
    selectedComputeCenter: string;
    isLoaded = false;

    constructor(private userservice: UserService, private groupservice: GroupService, private clientservice: ClientService, private perunsettings: PerunSettings) {

    }

    checkVOstatus(userservice: UserService) {
        let user_id: number;
        let admin_vos: {};
        this.userservice
            .getLoggedUser().toPromise()
            .then(function (userdata) {
                //TODO catch errors
                user_id = userdata.json()["id"];
                return userservice.getVosWhereUserIsAdmin().toPromise();
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


    getClientsUnchecked(): void {
        this.clientservice.getClientsUnchecked().subscribe(clients => this.clients = clients);

    }

    getClientsChecked(): void {
        this.clientservice.getClientsChecked().subscribe(clients => {
            this.clients = clients;
            this.isLoaded=true;
        });


    }

    getComputeCenters() {
        this.groupservice.getComputeCenters().subscribe(result => {
            this.computeCenters = result;

        })
    }

    checkClient(host: string, port: string): void {
        if (host && port) {
            this.clientservice.checkClient(host, port).subscribe(data => {

                if (data.text() == "false") {
                    this.checkStatus = 'No Connection';
                }
                else if (data.text() == 'true') {
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

    deleteClient(host: string, port: string, location: string): void {
        this.clientservice.deleteClient(host, port, location).subscribe(data => {

            this.getClientsChecked();
        });
    }


    ngOnInit(): void {
        this.checkVOstatus(this.userservice);
        this.getClientsChecked();
        this.getComputeCenters();

    }

}
