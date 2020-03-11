import {Component, OnInit} from '@angular/core';
import {Client} from './client.model';
import {ClientService} from '../../api-connector/client.service';
import {ApiSettings} from '../../api-connector/api-settings.service';
import {GroupService} from '../../api-connector/group.service';
import {UserService} from '../../api-connector/user.service';
import {ComputecenterComponent} from '../../projectmanagement/computecenter.component';
import {FacilityService} from '../../api-connector/facility.service';
import {IResponseTemplate} from '../../api-connector/response-template';
import {is_vo} from '../../shared/globalvar';

/**
 * Client component.
 */
@Component({
             selector: 'app-client-overview',
             templateUrl: 'clientOverview.html',
             providers: [FacilityService, UserService, GroupService, ClientService, ApiSettings]
           })

export class ClientOverviewComponent implements OnInit {

  title: string = 'Client Overview';
  /**
   * All clients.
   */
  clients: Client[];

  /**
   * Selected Client;
   */
  selectedClient: Client;
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
   * Get all clients status checked.
   */
  getClientsChecked(): void {
    this.clientservice.getClientsChecked().subscribe((clients: Client[]) => {
      this.clients = clients;
      this.isLoaded = true;
    });

  }

  /**
   * Get all computecenters.
   */
  getComputeCenters(): void {
    this.facilityService.getComputeCenters().subscribe((result: any) => {
      for (const cc of result) {
        const compute_center: ComputecenterComponent = new ComputecenterComponent(
          cc['compute_center_facility_id'], cc['compute_center_name'],
          cc['compute_center_login'], cc['compute_center_support_mail']);
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
      this.clientservice.checkClient(host, port).subscribe((data: IResponseTemplate) => {

        if (!data.value) {
          this.checkStatus = 'No Connection';
        } else if (data.value) {
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
      this.clientservice.postClient(host, port, location).subscribe((newClient: Client) => {
        this.clients.push(newClient);
      });
    }
  }

  updateClient(host: string, port: string, location: string, id: string): void {
    this.clientservice.updateClient(new Client(host, port, location, id)).subscribe((res: Client) => {
      this.clients[this.clients.indexOf(this.selectedClient)] = res;
      this.selectedClient = null;
      this.getClientsChecked();
    })

  }

  ngOnInit(): void {
    this.is_vo_admin = is_vo;
    this.getClientsChecked();
    this.getComputeCenters();
  }

}
