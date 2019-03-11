import {Component, OnInit} from '@angular/core';
import {Client} from './virtualmachinemodels/vmclient';
import {ClientService} from '../api-connector/vmClients.service';
import {ApiSettings} from '../api-connector/api-settings.service';
import {GroupService} from '../api-connector/group.service';
import {UserService} from '../api-connector/user.service';
import {ComputecenterComponent} from '../projectmanagement/computecenter.component';
import {FacilityService} from '../api-connector/facility.service';
import {environment} from '../../environments/environment';

/**
 * Client component.
 */
@Component({
    selector: 'app-client-overview',
    templateUrl: 'vmClients.component.html',
    providers: [FacilityService, UserService, GroupService, ClientService, ApiSettings]
})

export class ClientOverviewComponent implements OnInit {
    /**
     * All clients.
     */
    clients: Client[];
    /**
     * If user is vo.
     * @type {boolean}
     */
    is_vo_admin: boolean = false;
    /**
     * Default status not added client.
     * @type {string}
     */
    checkStatus: string = 'Not checked';
    /**
     * All computecenters.
     * @type {Array}
     */
    computeCenters: ComputecenterComponent[] = [];
    /**
     * Selected computecenter.
     */
    selectedComputeCenter: ComputecenterComponent;
    /**
     * If site is initialized with data.
     * @type {boolean}
     */
    isLoaded: boolean = false;

    constructor(private facilityService: FacilityService, private userservice: UserService,
                private clientservice: ClientService) {

    }

    /**
     * Check if user is vo.
     * @param {UserService} userservice
     */
    checkVOstatus(userservice: UserService): void {
        let user_id: number;
        let admin_vos: {};
        this.userservice
            .getLoggedUser().toPromise()
            .then(function (userdata) {
                // TODO catch errors
                user_id = userdata['id'];

                return userservice.getVosWhereUserIsAdmin().toPromise();
            }).then(function (adminvos) {
            admin_vos = adminvos;
        }).then(() => {
            // check if user is a Vo admin so we can serv according buttons
            for (const vkey in admin_vos) {
                if (admin_vos[vkey]['id'] === environment.vo.toString()) {
                    this.is_vo_admin = true;
                }
            }
        });
    }

    /**
     * Get all clients status checked.
     */
    getClientsChecked(): void {
        this.clientservice.getClientsChecked().subscribe(clients => {
            this.clients = clients;
            this.isLoaded = true;
        });

    }

    /**
     * Get all computecenters.
     */
    getComputeCenters(): void {
        this.facilityService.getComputeCenters().subscribe(result => {
            for (const cc of result) {
                const compute_center: ComputecenterComponent = new ComputecenterComponent(
                    cc['compute_center_facility_id'], cc['compute_center_name'],
                    cc['compute_center_login'], cc['compute_center_support_mail'])
                this.computeCenters.push(compute_center)
            }

        })
    }

    /**
     * Check status of client.
     * @param {string} host of client
     * @param {string} port of client
     */
    checkClient(host: string, port: string): void {
        if (host && port) {
            this.clientservice.checkClient(host, port).subscribe(data => {

                if (!data['status']) {
                    this.checkStatus = 'No Connection';
                } else if (data['status']) {
                    this.checkStatus = 'Connected';
                } else {
                    this.checkStatus = 'check failed';

                }

            });
        }
    }

    /**
     * Add a new client.
     * @param {string} host
     * @param {string} port
     * @param {string} location
     */
    postClient(host: string, port: string, location: string): void {

        if (host && port && location) {
            this.clientservice.postClient(host, port, location).subscribe(() => {

                this.getClientsChecked();
            });
        }
    }

    /**
     * Delete a client.
     * @param {number} client_id
     */
    deleteClient(client_id: number): void {
        this.clientservice.deleteClient(client_id).subscribe(() => {

            this.getClientsChecked();
        });
    }

    ngOnInit(): void {
        this.checkVOstatus(this.userservice);
        this.getClientsChecked();
        this.getComputeCenters();

    }

}
