import {Component, OnInit} from '@angular/core';
import {Client} from './client.model';
import {ClientService} from '../../api-connector/client.service';
import {ApiSettings} from '../../api-connector/api-settings.service';
import {GroupService} from '../../api-connector/group.service';
import {UserService} from '../../api-connector/user.service';
import {ComputecenterComponent} from '../../projectmanagement/computecenter.component';
import {FacilityService} from '../../api-connector/facility.service';
import {VoService} from '../../api-connector/vo.service';
import {IResponseTemplate} from '../../api-connector/response-template';

/**
 * Client component.
 */
@Component({
             selector: 'app-client-overview',
             templateUrl: 'clientOverview.html',
             providers: [FacilityService, VoService, UserService, GroupService, ClientService, ApiSettings]
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
              private clientservice: ClientService, private voservice: VoService) {

  }

  /**
   * Check vm status.
   * @param {UserService} userservice
   */
  checkVOstatus(): void {
    this.voservice.isVo().subscribe((result: IResponseTemplate) => {
      this.is_vo_admin = <boolean><Boolean>result.value;
    })

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
    this.checkVOstatus();
    this.getClientsChecked();
    this.getComputeCenters();
  }

}
