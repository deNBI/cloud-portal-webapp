import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Client} from './client.model';
import {ClientService} from '../../api-connector/client.service';
import {ApiSettings} from '../../api-connector/api-settings.service';
import {GroupService} from '../../api-connector/group.service';
import {UserService} from '../../api-connector/user.service';
import {ComputecenterComponent} from '../../projectmanagement/computecenter.component';
import {FacilityService} from '../../api-connector/facility.service';
import {IResponseTemplate} from '../../api-connector/response-template';
import {is_vo} from '../../shared/globalvar';
import {ClientLimitsComponent} from './modals/client-limits..component';

/**
 * Client component.
 */
@Component({
		selector: 'app-client-overview',
		templateUrl: 'clientOverview.html',
		providers: [FacilityService, UserService, GroupService, ClientService, ApiSettings],
})

export class ClientOverviewComponent implements OnInit, OnDestroy {

		title: string = 'Client Overview';
		/**
		 * All clients.
		 */
		clients: Client[];
		bsModalRef: BsModalRef;

		/**
		 * Selected Client;
		 */
		selectedClient: Client;
		/**
		 * If user is vo.
		 *
		 * @type {boolean}
		 */
		is_vo_admin: boolean = false;
		/**
		 * Default status not added client.
		 *
		 * @type {string}
		 */
		checkStatus: string = 'Not checked';
		/**
		 * All computecenters.
		 *
		 * @type {Array}
		 */
		computeCenters: ComputecenterComponent[] = [];
		/**
		 * Selected computecenter.
		 */
		selectedComputeCenter: ComputecenterComponent;
		/**
		 * If site is initialized with data.
		 *
		 * @type {boolean}
		 */
		isLoaded: boolean = false;

		subscription: Subscription = new Subscription();

		constructor(
				private facilityService: FacilityService,
				private userService: UserService,
				private clientservice: ClientService,
				private modalService: BsModalService,
		) {
				this.facilityService = facilityService;
				this.userService = userService;
				this.facilityService = facilityService;
		}

		/**
		 * Get all clients status checked.
		 */
		getClientsChecked(): void {
				this.subscription.add(
						this.clientservice.getClientsChecked().subscribe((clients: Client[]): void => {
								this.clients = clients;
								this.isLoaded = true;
						}),
				);
		}

		showClientsLimitsModal(cl: Client): void {
				const initialState = {client: cl};

				this.bsModalRef = this.modalService.show(ClientLimitsComponent, {initialState});
				// this.bsModalRef.setClass('modal-lg');
				// this.subscribeToBsModalRef();
		}

		/**
		 * Get all computecenters.
		 */
		getComputeCenters(): void {
				this.subscription.add(
						this.facilityService.getComputeCenters().subscribe((result: any): void => {
								for (const cc of result) {
										const compute_center: ComputecenterComponent = new ComputecenterComponent(
												cc['compute_center_facility_id'],
												cc['compute_center_name'],
												cc['compute_center_login'],
												cc['compute_center_support_mail'],
										);
										this.computeCenters.push(compute_center);
								}
						}),
				);
		}

		/**
		 * Check status of client.
		 *
		 * @param host of client
		 * @param port of client
		 */
		checkClient(host: string, port: string): void {
				if (host && port) {
						this.subscription.add(
								this.clientservice.checkClient(host, port).subscribe((data: IResponseTemplate): void => {
										if (!data.value) {
												this.checkStatus = 'No Connection';
										} else if (data.value) {
												this.checkStatus = 'Connected';
										} else {
												this.checkStatus = 'check failed';
										}
								}),
						);
				}
		}

		/**
		 * Add a new client.
		 *
		 * @param host
		 * @param port
		 * @param location
		 */
		postClient(host: string, port: string, location: string): void {

				if (host && port && location) {
						this.subscription.add(
								this.clientservice.postClient(host, port, location).subscribe((newClient: Client): void => {
										this.clients.push(newClient);
								}),
						);
				}
		}

		updateClient(host: string, port: string, location: string, id: string): void {
				let client = new Client(null, host, port, location, id)

				this.subscription.add(
						this.clientservice.updateClient(client).subscribe((res: Client): void => {
								this.clients[this.clients.indexOf(this.selectedClient)] = res;
								this.selectedClient = null;
								this.getClientsChecked();
						}),
				);
		}

		switchActiveClient(id: string): void {
				this.subscription.add(
						this.clientservice.switchActive(id).subscribe(
								(client: Client) => {
										this.clients[this.clients.indexOf(this.selectedClient)] = client;
										this.selectedClient = null;
								},
						),
				);
		}



		switchUseSSL(id: string): void {
				this.subscription.add(
						this.clientservice.switchUseSSL(id).subscribe(
								(client: Client) => {
										this.clients[this.clients.indexOf(this.selectedClient)] = client;
										this.selectedClient = null;
								},
						),
				);
		}

		ngOnInit(): void {
				this.is_vo_admin = is_vo;
				this.getClientsChecked();
				this.getComputeCenters();
		}

		ngOnDestroy() {
				this.subscription.unsubscribe();
		}

}
