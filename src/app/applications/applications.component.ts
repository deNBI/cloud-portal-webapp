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
import {is_vo} from '../shared/globalvar';

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
    this.is_vo_admin = is_vo;
    this.getApplicationStatus();
<<<<<<< HEAD
    this.getSpecialHardware();
    this.getComputeCenters(); 

    ** * REMOVED ** *

  getComputeCenters() ** * REMOVED ** *
    this.groupservice.getComputeCenters().subscribe(result => ** * REMOVED ** *
      this.computeCenters =                         result; 
    ** * REMOVED ** * )
    ** * REMOVED ** *

  getUserApplications() ** * REMOVED ** *
    this.applicataionsservice
      .getUserApplications().toPromise()
      .then(result => ** * REMOVED ** *
        let res = result.json();
    for (const key in res) { ** * REMOVED ** *
          let
    } aj = res[key];
    let a = new Application();
    a.Id = aj['project_application_id'];
    a.Name = aj['project_application_name'];
    a.Lifetime = aj['project_application_lifetime'];
    a.DateSubmitted = aj['project_application_date_submitted'];
    a.Status = aj['project_application_status']['application_status_name'];
    a.Description = aj['project_application_description'];
    a.VMsRequested = aj['project_application_vms_requested'];
    a.RamPerVM = aj['project_application_ram_per_vm'];
    a.CoresPerVM = aj['project_application_cores_per_vm'];
    a.DiskSpace = aj['project_application_disk_space'];
    a.ObjectStorage = aj['project_application_object_storage'];
    a.SpecialHardware = aj['project_application_special_hardware'];

    this.user_applications.push(a)
        ** * REMOVED ** *
      ** * REMOVED ** * ); 
    ** * REMOVED ** *

  getApplicationStatus() ** * REMOVED ** *
    this.applicationstatusservice.getAllApplicationStatus().toPromise()
      .then(result => ** * REMOVED ** *
        let res = result.json();
    for (const key in res) { ** * REMOVED ** *
          let
    } asj = res[key];
    let aj = new ApplicationStatus(asj['application_status_id'], asj['application_status_name']);
    this.application_status.push(aj)
        ** * REMOVED ** *
      ** * REMOVED ** * ); 
    ** * REMOVED ** *

  getSpecialHardware() ** * REMOVED ** *
    this.specialhardwareservice.getAllSpecialHardware().toPromise()
      .then(result => ** * REMOVED ** *
        let res = result.json();
    for (const key in res) { ** * REMOVED ** *
          let
    } shj = res[key];
    const sh = new SpecialHardware(shj['special_hardware_id'], shj['special_hardware_key'], shj['special_hardware_name']);
    this.special_hardware.push(sh)
        ** * REMOVED ** *
      ** * REMOVED ** * ); 
    ** * REMOVED ** *

  getAllApplications(usersmanager: UsersManager) ** * REMOVED ** *
    // todo check if user is VO Admin
    let user_id: number;
    let admin_vos:  ** * REMOVED ** ** ** REMOVED ** * ;

    this.authzresolver
      .getLoggedUser().toPromise()
      .then(function (userdata) ** * REMOVED ** *
        // TODO catch errors
        user_id = userdata.json()['id'];

    return usersmanager.getVosWhereUserIsAdmin(user_id).toPromise(); 
    ** * REMOVED ** * ).then(function (adminvos) ** * REMOVED ** *
      admin_vos =         adminvos.json(); 
    ** * REMOVED ** * ).then(result => ** * REMOVED ** *
      // check if user is a Vo admin so we can serv according buttons
    for (const vkey in admin_vos) { ** * REMOVED ** * }
    if (admin_vos[vkey]['id'] == this.perunsettings.getPerunVO().toString()) { ** * REMOVED ** *
          this.is_vo_admin
    } = true;
    this.applicataionsservice
            .getAllApplications().toPromise()
            .then(result => ** * REMOVED ** *
              let res = result.json();
    for (const key in res) { ** * REMOVED ** *
                let
    } aj = res[key];
    const a = new Application();
    a.Id = aj['project_application_id'];

    a.Name = aj['project_application_name'];
    a.Description = aj['project_application_description'];
    a.Lifetime = aj['project_application_lifetime'];

    a.VMsRequested = aj['project_application_vms_requested'];
    a.RamPerVM = aj['project_application_ram_per_vm'];
    a.CoresPerVM = aj['project_application_cores_per_vm'];
    a.DiskSpace = aj['project_application_disk_space'];
    a.ObjectStorage = aj['project_application_object_storage'];
    a.SpecialHardware = aj['project_application_special_hardware'];

    a.Institute = aj['project_application_institute'];
    a.Workgroup = aj['project_application_workgroup'];

    a.DateSubmitted = aj['project_application_date_submitted'];
    a.DateStatusChanged = aj['project_application_date_status_changed'];
    a.User = aj['project_application_user']['username'];
    a.UserEmail = aj['project_application_user']['email'];
    a.Status = aj['project_application_status'];
    if (a.Status !== 1) { ** * REMOVED ** *
                this.groupsmanager.getGroupByVoandName(a.Name).subscribe(group => ** * REMOVED ** *
    }
    if (group.status !== 200) { ** * REMOVED ** *
                      a.ComputeCenter
    } = 'None'
    this.all_applications.push(a)
                  ** * REMOVED ** *
                  this.resourceManager.getGroupAssignedResources(group.json()['id']).subscribe(resource => ** * REMOVED ** *
    try ** * REMOVED ** *
                       let resource_id = resource.json()[0]['id'];
    this.resourceManager.getFacilityByResource(resource_id).subscribe(facility => ** * REMOVED ** *
                        a.ComputeCenter =                                               facility.json()['name'];
    this.groupservice.getComputeCentersDetails(resource_id).subscribe(details => ** * REMOVED ** *
    if (details) { ** * REMOVED ** *
                            let
    } details_array = [];
    for (const detail in details) { ** * REMOVED ** *
                              let
    } detail_as_string = detail + ': ' + details[detail];
    details_array.push(detail_as_string); 
    ** * REMOVED ** *

                          a.ComputecenterDetails= details_array; 
    ** * REMOVED ** *
                           this.all_applications.push(a)
                        ** * REMOVED ** * )

    ** * REMOVED ** * )
    ** * REMOVED ** * catch (e) ** * REMOVED ** *

                      a.ComputeCenter = 'None'

    this.all_applications.push(a)

                    ** * REMOVED ** *
                  ** * REMOVED ** * )
    ** * REMOVED ** * ); ** * REMOVED ** *
                else ** * REMOVED ** *
                   a.ComputeCenter = 'None'

    this.all_applications.push(a)

                ** * REMOVED ** *
              ** * REMOVED ** *
            ** * REMOVED ** * );
    break; 
    ** * REMOVED ** *
      ** * REMOVED ** *
    ** * REMOVED ** * ); 
    ** * REMOVED ** *

  public getCollapseStatus(id: string) ** * REMOVED ** *
    if (id in this.collapse_status) { ** * REMOVED ** * }

    return this.collapse_status[id]; 
    ** * REMOVED ** * else ** * REMOVED ** *
      this.collapse_status[id] = true;

 return true; 
    ** * REMOVED ** *
  ** * REMOVED ** *

  public switchCollapseStatus(id: string) ** * REMOVED ** *
    this.collapse_status[id] = !this.getCollapseStatus(id); 
    ** * REMOVED ** *

  public getStatusById(id: number): string ** * REMOVED ** *
    let s = 'Unknown';
    for (const status of this.application_status) { ** * REMOVED ** * }
    if (status.Id == id) { ** * REMOVED ** * }

    return status.Name; 
    ** * REMOVED ** *
    ** * REMOVED ** *

    return s; 
    ** * REMOVED ** *

  public getIdByStatus(name: string): number ** * REMOVED ** *
    let s = -1;
    for (const status of this.application_status) { ** * REMOVED ** * }
    if (status.Name == name) { ** * REMOVED ** * }

    return status.Id; 
    ** * REMOVED ** *
    ** * REMOVED ** *

    return s; 
    ** * REMOVED ** *

  public updateNotificaitonModal(title: string, message: string, closable: true, type: string) ** * REMOVED ** *
    this.notificationModalTitle = title;
    this.notificationModalMessage = message;
    this.notificationModalIsClosable = closable;
    this.notificationModalType = type; 
    ** * REMOVED ** *

  public createGroup(name, description, manager_elixir_id, application_id, compute_center, numberOfVms) ** * REMOVED ** *
    // get memeber id in order to add the user later as the new member and manager of the group
    let manager_member_id: number;
    let manager_member_user_id: number;
    let new_group_id: number;

    this.membersmanager.getMemberByExtSourceNameAndExtLogin(manager_elixir_id).toPromise()
      .then(member_raw => ** * REMOVED ** *
          let member = member_raw.json();
    manager_member_id = member['id'];
    manager_member_user_id = member['userId'];

    // create new group
    return this.groupsmanager.createGroup(name, description).toPromise(); 
    ** * REMOVED ** *
      ).then(group_raw => ** * REMOVED ** *
      let    group = group_raw.json();
    new_group_id = group['id'];

      // add the application user to the group
    return this.groupsmanager.addMember(new_group_id, manager_member_id).toPromise(); 

    ** * REMOVED ** * ).then(null_result => ** * REMOVED ** *

return this.groupsmanager.addAdmin(new_group_id, manager_member_user_id).toPromise(); 
    ** * REMOVED ** * ).then(null_result => ** * REMOVED ** *

return this.applicationstatusservice.setApplicationStatus(application_id, this.getIdByStatus('approved')).toPromise(); 
    ** * REMOVED ** * ).then(null_result => ** * REMOVED ** *
      // setting approved status for Perun Group
      this.groupsmanager.setPerunGroupStatus(new_group_id, 2).toPromise();
    this.groupservice.assignGroupToResource(new_group_id.toString(), compute_center).subscribe();
    this.groupservice.setNumberOfVms(new_group_id.toString(), numberOfVms.toString()).subscribe();
      // update modal
    this.updateNotificaitonModal('Success', 'The new project was created', true, 'success');
      // update applications
    this.all_applications = [];
    this.user_applications = [];
    this.getUserApplications();
    this.getAllApplications(this.usersmanager); 
    ** * REMOVED ** * ). catch (error => ** * REMOVED ** *
      this.updateNotificaitonModal('Failed', 'Project could not be created!', true, 'danger'); 
    ** * REMOVED ** * ); 

    ** * REMOVED ** *

  public declineApplication(application_id) ** * REMOVED ** *
    this.applicationstatusservice.setApplicationStatus(application_id, this.getIdByStatus('declined')).toPromise()
      .then(result => ** * REMOVED ** *
=======
    if (this.is_vo_admin) {
      this.getAllApplications();
      this.getComputeCenters();

    } else {
      this.isLoaded_AllApplication = true;
    }

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
        console.log(res);
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

    this.applicationsservice
      .getApplication(application.Id.toString())
      .subscribe((aj: object) => {
                   const newApp: Application = this.setNewApplication(aj);
                   this.all_applications[index] = newApp;
                   this.getFacilityProject(newApp);
                 },
                 (error: any) => {
                   console.log(error);
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
>>>>>>> dev
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
