import {Component, OnInit} from '@angular/core';
import {ApplicationsService} from '../api-connector/applications.service'
import {ApiSettings} from '../api-connector/api-settings.service'
import {Application} from './application.model/application.model';
import {GroupService} from '../api-connector/group.service';
import {UserService} from '../api-connector/user.service';
import {VoService} from '../api-connector/vo.service';
import {FacilityService} from '../api-connector/facility.service';
import {Flavor} from '../virtualmachines/virtualmachinemodels/flavor';
import {FlavorService} from '../api-connector/flavor.service';
import {Client} from '../vo_manager/clients/client.model';
import {ApplicationBaseClassComponent} from '../shared/shared_modules/baseClass/application-base-class.component';
import {ComputecenterComponent} from '../projectmanagement/computecenter.component';
import {is_vo} from '../shared/globalvar';
import {Application_States} from '../shared/shared_modules/baseClass/abstract-base-class';

// eslint-disable-next-line no-shadow
enum TabStates {
  'SUBMITTED' = 0,
  'CREDITS_EXTENSION' = 3,
  'LIFETIME_EXTENSION' = 5,
  'MODIFICATION_EXTENSION' = 4
}

/**
 * Application Overview component.
 */
@Component({
             selector: 'app-applications-list',
             templateUrl: 'applications.component.html',
             providers: [FacilityService, VoService, UserService, GroupService,
               ApplicationsService, ApiSettings, FlavorService]
           })
export class ApplicationsComponent extends ApplicationBaseClassComponent implements OnInit {

  title: string = 'Application Overview';
  tab_state: number = TabStates.SUBMITTED;
  TabStates: typeof TabStates = TabStates;
  selectedCenter: {[key: string]: string} = {};

  loading_applications: boolean = false;

  /**
   * All Applications, just visibile for a vo admin.
   *
   * @type {Array}
   */
  all_applications: Application[] = [];

  applications_history: Application[] = [];

  /**
   * Limits information for Client tested/used for Simple Vm Project creation.
   */
  notificationClientInfo: Client[] = [];

  /**
   * id of the extension status.
   *
   * @type {number}
   */
  extension_status: number = 0;
  /**
   * id of Application set for deletion.
   */

  private WAIT_FOR_EXTENSION_STATUS: number = 6;

  numberOfExtensionRequests: number = 0;
  numberOfModificationRequests: number = 0;
  numberOfCreditRequests: number = 0;
  numberOfProjectApplications: number = 0;
  Application_States: typeof Application_States = Application_States;

  /**
   * Constructor.
   * Loads all Applications if user is vo admin and all user_applications.
   *
   * @param applicationsservice
   * @param userservice
   * @param groupservice
   * @param voService
   * @param facilityService
   * @param flavorService
   */
  constructor(applicationsservice: ApplicationsService,
              userservice: UserService,
              private groupservice: GroupService,
              private voService: VoService,
              facilityService: FacilityService,
              private flavorService: FlavorService) {

    super(userservice, applicationsservice, facilityService);

  }

  ngOnInit(): void {
    this.is_vo_admin = is_vo;
    if (this.is_vo_admin) {
      this.getSubmittedApplications();
      this.getApplicationHistory();
      this.getComputeCenters();
      this.applicationsservice.getExtensionRequestsCounter().subscribe((result: any): void => {
        this.numberOfCreditRequests = result['credits_extension_requests_all'];
        this.numberOfExtensionRequests = result['lifetime_extension_requests_all'];
        this.numberOfModificationRequests = result['modification_requests_all'];
        this.numberOfProjectApplications = result['applications_submitted_vo'];
      });
    } else {
      this.isLoaded = true;
    }

  }

  /**
   * Checks if the key given represents a flavor and if so returns the respective Flavor
   *
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

  changeTabState(state: number): void {
    if (!this.loading_applications) {
      this.tab_state = state;
      this.getApplicationsByTabState();
    }
  }

  /**
   * Get the facility of an application.
   *
   * @param app
   */
  getFacilityProject(app: Application): void {
    if (!app.ComputeCenter && !app.hasSubmittedStatus() && !app.hasTerminatedStatus()) {
      this.groupservice.getFacilityByGroup(app.project_application_perun_id.toString()).subscribe((res: object): void => {
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

  approveLifetimeExtension(application: Application): void {

    this.applicationsservice.approveAdditionalLifetime(application.project_application_id)
      .subscribe((res: any): void => {
                   if (application.project_application_openstack_project) {
                     application.project_application_status = []
                     this.getApplication(application)

                     this.updateNotificationModal('Success', 'The request has been sent to the facility manager.', true, 'success');
                   } else {
                     this.updateNotificationModal('Success', 'The project has been extended!', true, 'success');
                   }
                   if (!application.project_application_openstack_project) {
                     this.numberOfExtensionRequests--;
                     this.all_applications.splice(this.all_applications.indexOf(application), 1);

                   }
                 },
                 (err: any): void => {
                   console.log('error', err.status);
                   this.updateNotificationModal('Failed', 'Project lifetime could not be extendend!', true, 'danger');
                 });
  }

  declineLifetimeExtension(application: Application): void {

    this.applicationsservice.deleteAdditionalLifetimeRequests(application.project_application_id)
      .subscribe(
        (res: any): void => {
          this.updateNotificationModal('Declined', 'The project extension was declined!', true, 'success');

          this.all_applications.splice(this.all_applications.indexOf(application), 1);
          this.numberOfExtensionRequests--;
        },
        (err: any): void => {
          console.log('error', err.status);
          this.updateNotificationModal('Failed', 'Decline of project extension failed!', true, 'danger');
        })
  }

  approveModificationRequest(application: Application): void {

    this.applicationsservice.approveModificationRequest(application.project_application_id)
      .subscribe((res: any): void => {

                   this.updateNotificationModal('Success', 'The resource modification request was approved!', true, 'success');
                   if (!application.project_application_openstack_project) {

                     this.numberOfModificationRequests--;
                     this.all_applications.splice(this.all_applications.indexOf(application), 1);

                   } else {
                     application.project_application_status = []

                     this.getApplication(application)
                   }
                 },
                 (err: any): void => {
                   console.log('error', err.status);
                   this.updateNotificationModal('Failed', 'Approval of resource modification failed!', true, 'danger');
                 });
  }

  declineModificationRequest(application: Application): void {

    this.applicationsservice.deleteModificationRequest(application.project_application_id)
      .subscribe((res: any): void => {
                   this.updateNotificationModal('Declined', 'The resource modification request was declined!', true, 'success');
                   this.all_applications.splice(this.all_applications.indexOf(application), 1);
                   this.numberOfModificationRequests--;
                 },
                 (err: any): void => {
                   console.log('error', err.status);
                   this.updateNotificationModal('Failed', 'Decline of resource modification failed!', true, 'danger');
                 });
  }

  approveCreditExtension(application: Application): void {
    this.applicationsservice.approveAdditionalCreditsRequest(application.project_application_id)
      .subscribe((res: any): void => {

                   this.updateNotificationModal('Success', 'The credit extension request was approved!', true, 'success');
                   if (!application.project_application_openstack_project) {

                     this.numberOfCreditRequests--;
                     this.all_applications.splice(this.all_applications.indexOf(application), 1);

                   } else {
                     application.project_application_status = []

                     this.getApplication(application)
                   }
                 },
                 (err: any): void => {
                   console.log('error', err.status);
                   this.updateNotificationModal('Failed', 'Approval of credit extension failed!', true, 'danger');
                 });
  }

  declineCreditExtension(application: Application): void {
    this.applicationsservice.deleteAdditionalCreditsRequests(application.project_application_id)
      .subscribe((res: any): void => {
                   this.updateNotificationModal('Declined', 'The credit extension request was declined!', true, 'success');
                   this.all_applications.splice(this.all_applications.indexOf(application), 1)
                   this.numberOfCreditRequests = this.numberOfCreditRequests - 1;
                 },
                 (err: any): void => {
                   console.log('error', err.status);
                   this.updateNotificationModal('Failed', 'Decline of credit extension failed!', true, 'danger');
                 });
  }

  /**
   * Get all Applications if user is admin.
   */
  getSubmittedApplications(): void {
    if (this.is_vo_admin) {

      this.applicationsservice.getSubmittedApplications().subscribe((applications: Application[]): void => {
        if (applications.length === 0) {
          this.isLoaded_userApplication = true;
        }
        for (const application of applications) {
          this.all_applications.push(new Application(application));

        }
        this.isLoaded = true;
        for (const app of this.all_applications) {

          this.getFacilityProject(app);
        }

      })
    }
  }

  getApplicationHistory(): void {
    this.applicationsservice.getAllApplications()
      .subscribe((applications: Application[]): void => {
        if (applications.length > 0) {
          for (const application of applications) {
            this.applications_history.push(application);
          }
        }
    });
  }

  /**
   * Emptying all application lists, so applications don't get pushed to the lists multiple times.
   */
  clearApplicationLists(): void {
    this.all_applications = [];
  }

  /**
   * Loading Applications dependent from the current tab selected (submitted, credits, lifetime, modification)
   */
   getApplicationsByTabState(): void {
     this.loading_applications = true;
     if (this.is_vo_admin) {
      this.clearApplicationLists();
      if (this.tab_state === TabStates.SUBMITTED) {
        this.applicationsservice.getSubmittedApplications().subscribe((applications: Application[]): void => {
          if (applications.length === 0) {
            this.isLoaded_userApplication = true;
          }
          for (const application of applications) {
            this.all_applications.push(new Application(application));
          }
          for (const app of this.all_applications) {
            this.getFacilityProject(app);
          }
          this.isLoaded = true;
          this.loading_applications = false;
        });
      } else if (this.tab_state === TabStates.CREDITS_EXTENSION) {
        this.applicationsservice.getCreditsExtensionRequest().subscribe(
          (credit_applications: Application[]): void => {
            if (credit_applications.length === 0) {
              // bool here?
            }
            for (const credit_application of credit_applications) {
              this.all_applications.push(new Application(credit_application));
            }
            for (const app of this.all_applications) {
              this.getFacilityProject(app);
            }
            this.isLoaded = true;
            this.loading_applications = false;
          });
      } else if (this.tab_state === TabStates.LIFETIME_EXTENSION) {
        this.applicationsservice.getLifetimeRequestedApplications().subscribe(
          (lifetime_applications: Application[]): void => {
            if (lifetime_applications.length === 0) {
              // bool here?
            }
            for (const lifetime_application of lifetime_applications) {
              this.all_applications.push(new Application(lifetime_application));
            }
            for (const app of this.all_applications) {
              this.getFacilityProject(app);
            }
            this.isLoaded = true;
            this.loading_applications = false;

          });
      } else if (this.tab_state === TabStates.MODIFICATION_EXTENSION) {
        this.applicationsservice.getModificationRequestedApplications().subscribe(
          (modification_applications: Application[]): void => {
            if (modification_applications.length === 0) {
              // bool here?
            }
            for (const modification_application of modification_applications) {
              this.all_applications.push(new Application(modification_application));
            }
            for (const app of this.all_applications) {
              this.getFacilityProject(app);
            }
            this.isLoaded = true;
            this.loading_applications = false;
          });
      }
    }
  }

  /**
   * Get all Applications if user is admin.
   */
  getAllApplications(): void {
    if (this.is_vo_admin) {

      this.applicationsservice.getAllApplications().subscribe((applications: Application[]): void => {
        if (applications.length === 0) {
          this.isLoaded_userApplication = true;
        }
        for (const application of applications) {
          this.all_applications.push(new Application(application));

        }
        this.isLoaded = true;
        for (const app of this.all_applications) {

          this.getFacilityProject(app);
        }

      })
    }
  }

  /**
   * Updates an application with the actual values.
   *
   * @param application
   */
  public getApplication(application: Application): void {
    const index: number = this.all_applications.indexOf(application);

    this.applicationsservice
      .getApplication(application.project_application_id.toString())
      .subscribe((aj: Application): void => {
                   const newApp: Application = new Application(aj);
                   this.all_applications[index] = newApp;
                   this.getFacilityProject(newApp);
                 },
                 (error: any): void => {
                   console.log(error);
                 });
  }

  /**
   * Remove Application from facility , where it is for confirmation
   *
   * @param application the application
   */
  removeApplicationFromFacilityConfirmation(application: Application): void {
    this.groupservice.removeGroupFromResource(application.project_application_perun_id.toString()).subscribe(
      (res: any): void => {
        this.getApplication(application);
        this.updateNotificationModal('Success', 'The application was removed from the compute center', true, 'success');
      },
      (error: any): void => {
        this.updateNotificationModal('Failed', 'The application was removed from the compute center', true, 'danger');
      })

  }

  /**
   * Create a new Group in perun with the specific attributes.
   *
   * @param name
   * @param description
   * @param manager_elixir_id
   * @param application_id
   * @param compute_center
   */
  public createOpenStackProjectGroup(application: Application,
                                     compute_center: string): void {
    this.groupservice.createGroupOpenStack(
      application.project_application_id, compute_center)
      .subscribe((result: { [key: string]: string }): void => {

                   if (result['Error']) {
                     this.updateNotificationModal('Failed', result['Error'], true, 'danger');

                   } else {
                     application.project_application_status = []

                     this.updateNotificationModal('Success', 'The new project was created', true, 'success');
                     this.getApplication(application);

                   }
                 },
                 (): void => {
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
      application_id).subscribe((client: object): void => {
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
      if (app.project_application_id.toString() === application_id.toString()) {
        this.getApplication(app);
        break;

      }
    }
  }

  /**
   * Create a new Group in perun with the specific attributes.
   *
   * @param app
   */
  public createSimpleVmProjectGroup(app: Application, compute_center_id?: string): void {

    const application_id: string = <string>app.project_application_id;
    if (compute_center_id && compute_center_id !== 'undefined') {
      this.groupservice.createGroupByApplication(application_id, compute_center_id).subscribe(
        (res: any): void => {
          if (!res['client_available'] && !res['created']) {
            this.setNoResourcesClientNotification(res);
            this.updateNotificationModal('Failed', `The client ${res['client_name']} has not the necessary resources left!`,
                                         true, 'danger');
          } else {
            this.setNotificationClient(application_id);
            this.all_applications.splice(this.all_applications.indexOf(app), 1);
            this.numberOfProjectApplications--;
            // this.reloadApplicationList(application_id)
          }

        },
        (error: object): void => {
          console.log(error);
          this.updateNotificationModal('Failed', 'Project could not be created!', true, 'danger');
        });
    } else {
      this.applicationsservice.getApplicationClientAvaiable(application_id).subscribe(
        (res: Client): void => {
          if (!res['client_available']) {
            // tslint:disable-next-line:forin
            if (res['clients']) {
              for (const client of res['clients']) {
                this.setNoResourcesClientNotification(client);

              }
            }
            this.updateNotificationModal('Failed', 'No client with the necessary resources online!', true, 'danger');

          } else {

            this.groupservice.createGroupByApplication(application_id).subscribe((): void => {
              this.setNotificationClient(application_id);
              // this.reloadApplicationList(application_id)

            });

          }

        },
        (error: object): void => {
          console.log(error);
          this.updateNotificationModal('Failed', 'Project could not be created!', true, 'danger');
        })
    }

  }

  assignGroupToFacility(group_id: string, application_id: string, compute_center: string): void {
    if (compute_center !== 'undefined') {
      this.groupservice.assignGroupToResource(group_id, compute_center)
            .subscribe((): void => {
                         for (const app of this.all_applications) {
                           if (app.project_application_id.toString() === application_id.toString()) {
                             this.getApplication(app);
                             break;

                           }
                         }
                         this.updateNotificationModal('Success', 'The  project was assigned to the facility.', true, 'success');

                       },
                       (error: object): void => {
                         console.log(error);
                         this.updateNotificationModal('Failed', 'Project could not be created!', true, 'danger');
                       })

    } else {
      this.updateNotificationModal('Failed', 'You need to select an compute center!', true, 'danger');
    }

  }

  /**
   * Decline an application.
   *
   * @param application_id
   */

  public declineApplication(app: Application): void {
    const idx: number = this.all_applications.indexOf(app);
    this.applicationsservice.declineApplication(app.project_application_id).subscribe(
      (res: any): void => {
        this.updateNotificationModal('Success', 'The Application was declined', true, 'success');
        this.all_applications.splice(idx, 1)
        this.numberOfProjectApplications = this.numberOfProjectApplications - 1;
      },
      (error: any): void => {
        this.updateNotificationModal('Failed', 'Application could not be declined!', true, 'danger');
        this.changeTabState(this.tab_state);

      })

  }

}
