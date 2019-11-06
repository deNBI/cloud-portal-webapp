import {Component, OnInit} from '@angular/core';
import {ApplicationsService} from '../api-connector/applications.service'
import {ApplicationStatusService} from '../api-connector/application-status.service'
import {ApiSettings} from '../api-connector/api-settings.service'
import {Application} from './application.model/application.model';
import {GroupService} from '../api-connector/group.service';
import {UserService} from '../api-connector/user.service';
import {VoService} from '../api-connector/vo.service';
import {FacilityService} from '../api-connector/facility.service';
import {Flavor} from '../virtualmachines/virtualmachinemodels/flavor';
import {FlavorService} from '../api-connector/flavor.service';
import {Client} from '../virtualmachines/clients/client.model';
import {ApplicationBaseClassComponent} from '../shared/shared_modules/baseClass/application-base-class.component';
import {ComputecenterComponent} from '../projectmanagement/computecenter.component';
import {IResponseTemplate} from '../api-connector/response-template';

/**
 * Application Overview component.
 */
@Component({
             selector: 'app-applications-list',
             templateUrl: 'applications.component.html',
             providers: [FacilityService, VoService, UserService, GroupService, ApplicationStatusService,
               ApplicationsService, ApiSettings, FlavorService]
           })
export class ApplicationsComponent extends ApplicationBaseClassComponent implements OnInit {

  title: string = 'Application Overview';

  /**
   * All Applications, just visibile for a vo admin.
   * @type {Array}
   */
  all_applications: Application[] = [];

  /**
   * Limits information for Client tested/used for Simple Vm Project creation.
   */
  notificationClientInfo: Client[] = [];

  /**
   * id of the extension status.
   * @type {number}
   */
  extension_status: number = 0;
  /**
   * id of Application set for deletion.
   */

  private WAIT_FOR_EXTENSION_STATUS: number = 6;

  /**
   * Constructor.
   * Loads all Applications if user is vo admin and all user_applications.
   * @param {ApplicationsService} applicationsservice
   * @param {ApplicationStatusService} applicationstatusservice
   * @param {UserService} userservice
   * @param {GroupService} groupservice
   * @param {VoService} voService
   * @param {FacilityService} facilityService
   * @param {FlavorService} flavorService
   */
  constructor(applicationsservice: ApplicationsService,
              applicationstatusservice: ApplicationStatusService,
              userservice: UserService,
              private groupservice: GroupService,
              private voService: VoService,
              facilityService: FacilityService,
              private flavorService: FlavorService) {

    super(userservice, applicationstatusservice, applicationsservice, facilityService);

  }

  ngOnInit(): void {
    this.voService.isVo().subscribe((result: IResponseTemplate) => {
      this.is_vo_admin = <boolean><Boolean>result.value;
      this.getApplicationStatus();
      if (this.is_vo_admin) {
        this.getAllApplications();
        this.getComputeCenters();

      } else {
        this.isLoaded_AllApplication = true;

      }

    });

  }

  /**
   * Checks if the key given represents a flavor and if so returns the respective Flavor
   * @param key the key which is checked
   */
  isKeyFlavor(key: string): Flavor {
    for (const fkey in this.flavorList) {
      if (fkey in this.flavorList) {
        if (this.flavorList[fkey].name === key.substring(20)) {
          return this.flavorList[fkey];
        }
      }
    }

    return null;

  }

  /**
   * Get the facility of an application.
   * @param {Application} app
   */
  getFacilityProject(app: Application): void {

    if (!app.ComputeCenter && app.Status !== this.application_states.SUBMITTED && app.Status !== this.application_states.TERMINATED) {
      this.groupservice.getFacilityByGroup(app.PerunId.toString()).subscribe((res: object) => {

        const login: string = res['Login'];
        const suport: string = res['Support'];
        const facilityname: string = res['Facility'];
        const facilityId: number = res['FacilityId'];
        if (facilityId) {
          app.ComputeCenter = new ComputecenterComponent(facilityId.toString(), facilityname, login, suport);
        }

      })
    }

  }

  /**
   * Get all Applications if user is admin.
   */
  getAllApplications(): void {
    // todo check if user is VO Admin

    if (this.is_vo_admin) {

      this.applicationsservice.getAllApplications().subscribe((res: any) => {
        if (Object.keys(res).length === 0) {
          this.isLoaded_userApplication = true;
        }
        const newApps: Application [] = this.setNewApplications(res);
        this.all_applications.push.apply(this.all_applications, newApps);

        this.isLoaded_AllApplication = true;
        for (const app of this.all_applications) {
          if (app.Status === this.application_states.WAIT_FOR_CONFIRMATION ||
            app.Status === this.application_states.MODIFICATION_REQUESTED) {
            this.getFacilityProject(app);
          }
        }

      })
    }
  }

  /**
   * Updates an application with the actual values.
   * @param {Application} application
   */
  public getApplication(application: Application): void {
    const index: number = this.all_applications.indexOf(application);

    this.applicationsservice.getApplication(application.Id.toString()).subscribe((aj: object) => {
      const newApp: Application = this.setNewApplication(aj);
      this.all_applications[index] = newApp;
      this.getFacilityProject(newApp);
    });

  }

  public approveExtension(app: Application): void {

    if (app.OpenStackProject) {
      if (!app.ComputeCenter) {
        this.applicationsservice.approveRenewal(app.Id.toString()).subscribe((result: any) => {
          if (result['Error']) {
            this.extension_status = 2;
            this.updateNotificationModal('Failed', 'Failed to approve the application modification.', true, 'danger');
          } else {
            this.extension_status = 3;

            this.updateNotificationModal('Success', 'Successfully approved the application modification.', true, 'success');
            this.all_applications = [];
            this.user_applications = [];
            this.getAllApplications();

          }
        });
      } else {
        this.applicationstatusservice.setApplicationStatus(
          app.Id.toString(),
          this.WAIT_FOR_EXTENSION_STATUS.toString()).subscribe(() => {
          this.extension_status = 5;
          this.getApplication(app);

          for (const appl of this.user_applications) {
            if (this.selectedApplication.Id.toString() === appl.Id.toString()) {
              break;
            }

          }
        })
      }
    } else {
      this.applicationsservice.approveRenewal(app.Id).subscribe((result: { [key: string]: string }) => {
        if (result['Error']) {
          this.extension_status = 2
        } else {
          this.extension_status = 3;
        }
        this.getApplication(this.selectedApplication);

      })
    }
  }

  /**
   * Decline an extension request.
   * @param {number} application_id
   */
  public declineExtension(application_id: number): void {
    this.applicationsservice.declineRenewal(application_id).subscribe((result: { [key: string]: string }) => {
      if (result != null) {
        this.extension_status = 2
      } else {
        this.extension_status = 4;
      }
      this.getApplication(this.selectedApplication);

    })
  }

  /**
   * Remove Application from facility , where it is for confirmation
   * @param {Application} application the application
   */
  removeApplicationFromFacilityConfirmation(application: Application): void {
    this.groupservice.removeGroupFromResource(application.PerunId.toString()).subscribe(() => {
      this.getApplication(application)
    })

  }

  /**
   * Create a new Group in perun with the specific attributes.
   * @param name
   * @param description
   * @param manager_elixir_id
   * @param application_id
   * @param compute_center
   */
  public createOpenStackProjectGroup(application: Application,
                                     compute_center: string): void {
    this.groupservice.createGroupOpenStack(
      application.Id, compute_center)
      .subscribe((result: { [key: string]: string }) => {
                   if (result['Error']) {
                     this.updateNotificationModal('Failed', result['Error'], true, 'danger');

                   } else {
                     this.updateNotificationModal('Success', 'The new project was created', true, 'success');
                   }
                   this.getApplication(application);
                 },
                 () => {
                   this.updateNotificationModal('Failed', 'Project could not be created!', true, 'danger');
                 })

  }

  public resetNotificationModal(): void {
    this.notificationModalTitle = 'Notification';
    this.notificationModalMessage = 'Please wait...';
    this.notificationModalIsClosable = false;
    this.notificationModalType = 'info';
    this.notificationClientInfo = [];
  }

  /**
   * Bugfix not scrollable site after closing modal
   */
  removeModalOpen(): void {
    document.body.classList.remove('modal-open');
  }

  private setNotificationClient(application_id: string): void {
    this.applicationsservice.getApplicationClient(
      application_id).subscribe((client: object) => {
      const newClient: Client = new Client(client['host'], client['port'], client['location'], client['id']);
      newClient.maxVolumeLimit = client['max_ressources']['maxTotalVolumeGigabytes'];
      newClient.maxVolumes = client['max_ressources']['maxTotalVolumes'];
      newClient.maxVMs = client['max_ressources']['maxTotalInstances'];
      newClient.assignedVMs = client['assigned_ressources']['vms'];
      newClient.assignedVolumes = client['assigned_ressources']['volumes'];
      newClient.assignedVolumesStorage = client['assigned_ressources']['volumeLimit'];
      this.notificationClientInfo.push(newClient);
      this.updateNotificationModal(
        'Success', `The new project was created and assigned to ${newClient.location}.`,
        true,
        'success');

    });
  }

  private setNoResourcesClientNotification(client: any): void {
    const newClient: Client = new Client(null, null, client['client_location'], null);
    newClient.maxVolumeLimit = client['max_volume_gb'];
    newClient.maxVolumes = client['max_volumes'];
    newClient.maxVMs = client['max_instances'];
    newClient.assignedVMs = client['assigned_instances'];
    newClient.assignedVolumes = client['assigned_volumes'];
    newClient.assignedVolumesStorage = client['assigned_volume_gb'];
    newClient.newVms = client['additional_instances'];
    newClient.newVolumeLimit = client['new_volume_gb'];
    newClient.newVolumes = client['new_volumes'];
    this.notificationClientInfo.push(newClient);

  }

  private reloadApplicationList(application_id: string): void {
    for (const app of this.all_applications) {
      if (app.Id.toString() === application_id.toString()) {
        this.getApplication(app);
        break;

      }
    }
  }

  /**
   * Create a new Group in perun with the specific attributes.
   * @param app
   */
  public createSimpleVmProjectGroup(app: Application, compute_center_id?: string): void {

    const application_id: string = <string>app.Id;
    if (compute_center_id && compute_center_id !== 'undefined') {
      this.groupservice.createGroupByApplication(application_id, compute_center_id).subscribe(
        (res: any) => {
          if (!res['client_available'] && !res['created']) {
            this.setNoResourcesClientNotification(res);
            this.updateNotificationModal('Failed', `The client ${res['client_name']} has not the necessary resources left!`,
                                         true, 'danger');

          } else {
            this.setNotificationClient(application_id);
            this.reloadApplicationList(application_id)
          }

        },
        (error: object) => {
          console.log(error);
          this.updateNotificationModal('Failed', 'Project could not be created!', true, 'danger');
        });
    } else {
      this.applicationsservice.getApplicationClientAvaiable(application_id).subscribe(
        (res: Client) => {
          if (!res['client_available']) {
            // tslint:disable-next-line:forin
            if (res['clients']) {
              for (const client of res['clients']) {
                this.setNoResourcesClientNotification(client);

              }
            }
            this.updateNotificationModal('Failed', 'No client with the necessary resources online!', true, 'danger');

          } else {

            this.groupservice.createGroupByApplication(application_id).subscribe(() => {
              this.setNotificationClient(application_id);
              this.reloadApplicationList(application_id)

            });

          }

        },
        (error: object) => {
          console.log(error);
          this.updateNotificationModal('Failed', 'Project could not be created!', true, 'danger');
        })
    }

  }

  assignGroupToFacility(group_id: string, application_id: string, compute_center: string): void {
    if (compute_center !== 'undefined') {
      this.groupservice.assignGroupToResource(group_id, compute_center).subscribe(
        () => {
          this.applicationstatusservice.setApplicationStatus(
            application_id,
            this.application_states.WAIT_FOR_CONFIRMATION.toString())
            .subscribe(() => {
              for (const app of this.all_applications) {
                if (app.Id.toString() === application_id) {
                  this.getApplication(app);

                  break;

                }
              }
              this.updateNotificationModal('Success', 'The  project was assigned to the facility.', true, 'success');

            })

        },
        (error: object) => {
          console.log(error);
          this.updateNotificationModal('Failed', 'Project could not be created!', true, 'danger');
        });
    } else {
      this.updateNotificationModal('Failed', 'You need to select an compute center!', true, 'danger');
    }

  }

  /**
   * Decline an application.
   * @param application_id
   */
  public declineApplication(application_id: string): void {
    this.applicationstatusservice.setApplicationStatus(application_id, this.getIdByStatus('declined').toString()).toPromise()
      .then(() => {
        this.all_applications = [];
        this.user_applications = [];
        this.getAllApplications();
        this.updateNotificationModal('Success', 'The Application was declined', true, 'success');
      })
      .catch(() => {
        this.updateNotificationModal('Failed', 'Application could be declined!', true, 'danger');
      });
  }

}
