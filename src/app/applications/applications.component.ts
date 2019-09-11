import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***ApplicationsService***REMOVED*** from '../api-connector/applications.service'
import ***REMOVED***ApplicationStatusService***REMOVED*** from '../api-connector/application-status.service'
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service'
import ***REMOVED***Application***REMOVED*** from './application.model/application.model';
import ***REMOVED***GroupService***REMOVED*** from '../api-connector/group.service';
import ***REMOVED***UserService***REMOVED*** from '../api-connector/user.service';
import ***REMOVED***VoService***REMOVED*** from '../api-connector/vo.service';
import ***REMOVED***FacilityService***REMOVED*** from '../api-connector/facility.service';
import ***REMOVED***Flavor***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavor';
import ***REMOVED***FlavorService***REMOVED*** from '../api-connector/flavor.service';
import ***REMOVED***Client***REMOVED*** from '../virtualmachines/clients/client.model';
import ***REMOVED***ApplicationBaseClass***REMOVED*** from '../shared/shared_modules/baseClass/application-base-class';
import ***REMOVED***ComputecenterComponent***REMOVED*** from '../projectmanagement/computecenter.component';
import ***REMOVED***IResponseTemplate***REMOVED*** from '../api-connector/response-template';
import ***REMOVED***forkJoin***REMOVED*** from 'rxjs/index';

/**
 * Application Overview component.
 */
@Component(***REMOVED***
             templateUrl: 'applications.component.html',
             providers: [FacilityService, VoService, UserService, GroupService, ApplicationStatusService,
               ApplicationsService, ApiSettings, FlavorService]
           ***REMOVED***)
export class ApplicationsComponent extends ApplicationBaseClass implements OnInit ***REMOVED***

  /**
   * All Applications, just visibile for a vo admin.
   * @type ***REMOVED***Array***REMOVED***
   */
  all_applications: Application[] = [];

  /**
   * Limits information for Client tested/used for Simple Vm Project creation.
   */
  notificationClientInfo: Client[] = [];

  /**
   * id of the extension status.
   * @type ***REMOVED***number***REMOVED***
   */
  extension_status: number = 0;
  /**
   * id of Application set for deletion.
   */

  private WAIT_FOR_EXTENSION_STATUS: number = 6;

  /**
   * Constructor.
   * Loads all Applications if user is vo admin and all user_applications.
   * @param ***REMOVED***ApplicationsService***REMOVED*** applicationsservice
   * @param ***REMOVED***ApplicationStatusService***REMOVED*** applicationstatusservice
   * @param ***REMOVED***UserService***REMOVED*** userservice
   * @param ***REMOVED***GroupService***REMOVED*** groupservice
   * @param ***REMOVED***VoService***REMOVED*** voService
   * @param ***REMOVED***FacilityService***REMOVED*** facilityService
   * @param ***REMOVED***FlavorService***REMOVED*** flavorService
   */
  constructor(applicationsservice: ApplicationsService,
              applicationstatusservice: ApplicationStatusService,
              userservice: UserService,
              private groupservice: GroupService,
              private voService: VoService,
              facilityService: FacilityService,
              private flavorService: FlavorService) ***REMOVED***

    super(userservice, applicationstatusservice, applicationsservice, facilityService);

  ***REMOVED***

  ngOnInit(): void ***REMOVED***
    this.voService.isVo().subscribe((result: IResponseTemplate) => ***REMOVED***
      this.is_vo_admin = <boolean><Boolean>result.value;
      this.getApplicationStatus();
      if (this.is_vo_admin) ***REMOVED***
        this.getAllApplications();
        this.getComputeCenters();

      ***REMOVED*** else ***REMOVED***
        this.isLoaded_AllApplication = true;

      ***REMOVED***

    ***REMOVED***);

  ***REMOVED***

  /**
   * Checks if the key given represents a flavor and if so returns the respective Flavor
   * @param key the key which is checked
   */
  isKeyFlavor(key: string): Flavor ***REMOVED***
    for (const fkey in this.flavorList) ***REMOVED***
      if (fkey in this.flavorList) ***REMOVED***
        if (this.flavorList[fkey].name === key.substring(20)) ***REMOVED***
          return this.flavorList[fkey];
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***

    return null;

  ***REMOVED***

  /**
   * Get the facility of an application.
   * @param ***REMOVED***Application***REMOVED*** app
   */
  getFacilityProject(app: Application): void ***REMOVED***

    if (!app.ComputeCenter && app.Status !== this.application_states.SUBMITTED && app.Status !== this.application_states.TERMINATED) ***REMOVED***
      this.groupservice.getFacilityByGroup(app.PerunId.toString()).subscribe((res: object) => ***REMOVED***

        const login: string = res['Login'];
        const suport: string = res['Support'];
        const facilityname: string = res['Facility'];
        const facilityId: number = res['FacilityId'];
        if (facilityId) ***REMOVED***
          app.ComputeCenter = new ComputecenterComponent(facilityId.toString(), facilityname, login, suport);
        ***REMOVED***

      ***REMOVED***)
    ***REMOVED***

  ***REMOVED***

  /**
   * Get all Applications if user is admin.
   */
  getAllApplications(): void ***REMOVED***
    // todo check if user is VO Admin

    if (this.is_vo_admin) ***REMOVED***

      this.applicationsservice.getAllApplications().subscribe(res => ***REMOVED***
        if (Object.keys(res).length === 0) ***REMOVED***
          this.isLoaded_userApplication = true;
        ***REMOVED***
        const newApps: Application [] = this.setNewApplications(res);
        this.all_applications.push.apply(this.all_applications, newApps);

        this.isLoaded_AllApplication = true;
        for (const app of this.all_applications) ***REMOVED***
          if (app.Status === this.application_states.WAIT_FOR_CONFIRMATION ||
            app.Status === this.application_states.MODIFICATION_REQUESTED) ***REMOVED***
            this.getFacilityProject(app);
          ***REMOVED***
        ***REMOVED***

      ***REMOVED***)
    ***REMOVED***
  ***REMOVED***

  /**
   * Updates an application with the actual values.
   * @param ***REMOVED***Application***REMOVED*** application
   */
  public getApplication(application: Application): void ***REMOVED***
    const index: number = this.all_applications.indexOf(application);

    this.applicationsservice.getApplication(application.Id.toString()).subscribe((aj: object) => ***REMOVED***
      const newApp: Application = this.setNewApplication(aj);
      this.all_applications[index] = newApp;
      this.getFacilityProject(newApp);
    ***REMOVED***);

  ***REMOVED***

  public approveExtension(app: Application): void ***REMOVED***

    if (app.OpenStackProject) ***REMOVED***
      if (!app.ComputeCenter) ***REMOVED***
        this.applicationsservice.approveRenewal(app.Id.toString()).subscribe(result => ***REMOVED***
          if (result['Error']) ***REMOVED***
            this.extension_status = 2;
            this.updateNotificationModal('Failed', 'Failed to approve the application modification.', true, 'danger');
          ***REMOVED*** else ***REMOVED***
            this.extension_status = 3;

            this.updateNotificationModal('Success', 'Successfully approved the application modification.', true, 'success');
            this.all_applications = [];
            this.user_applications = [];
            this.getAllApplications();

          ***REMOVED***
        ***REMOVED***);
      ***REMOVED*** else ***REMOVED***
        this.applicationstatusservice.setApplicationStatus(
          app.Id.toString(),
          this.WAIT_FOR_EXTENSION_STATUS.toString()).subscribe(() => ***REMOVED***
          this.extension_status = 5;
          this.getApplication(app);

          for (const appl of this.user_applications) ***REMOVED***
            if (this.selectedApplication.Id.toString() === appl.Id.toString()) ***REMOVED***
              break;
            ***REMOVED***

          ***REMOVED***
        ***REMOVED***)
      ***REMOVED***
    ***REMOVED*** else ***REMOVED***
      this.applicationsservice.approveRenewal(app.Id).subscribe((result: ***REMOVED*** [key: string]: string ***REMOVED***) => ***REMOVED***
        if (result['Error']) ***REMOVED***
          this.extension_status = 2
        ***REMOVED*** else ***REMOVED***
          this.extension_status = 3;
        ***REMOVED***
        this.getApplication(this.selectedApplication);

      ***REMOVED***)
    ***REMOVED***
  ***REMOVED***

  /**
   * Decline an extension request.
   * @param ***REMOVED***number***REMOVED*** application_id
   */
  public declineExtension(application_id: number): void ***REMOVED***
    this.applicationsservice.declineRenewal(application_id).subscribe((result: ***REMOVED*** [key: string]: string ***REMOVED***) => ***REMOVED***
      if (result != null) ***REMOVED***
        this.extension_status = 2
      ***REMOVED*** else ***REMOVED***
        this.extension_status = 4;
      ***REMOVED***
      this.getApplication(this.selectedApplication);

    ***REMOVED***)
  ***REMOVED***

  /**
   * Remove Application from facility , where it is for confirmation
   * @param ***REMOVED***Application***REMOVED*** application the application
   */
  removeApplicationFromFacilityConfirmation(application: Application): void ***REMOVED***
    this.groupservice.removeGroupFromResource(application.PerunId.toString()).subscribe(() => ***REMOVED***
      this.getApplication(application)
    ***REMOVED***)

  ***REMOVED***

  /**
   * Create a new Group in perun with the specific attributes.
   * @param name
   * @param description
   * @param manager_elixir_id
   * @param application_id
   * @param compute_center
   */
  public createOpenStackProjectGroup(application: Application,
                                     compute_center: string): void ***REMOVED***
    this.groupservice.createGroupOpenStack(
      application.Id, compute_center)
      .subscribe((result: ***REMOVED*** [key: string]: string ***REMOVED***) => ***REMOVED***
                   if (result['Error']) ***REMOVED***
                     this.updateNotificationModal('Failed', result['Error'], true, 'danger');

                   ***REMOVED*** else ***REMOVED***
                     this.updateNotificationModal('Success', 'The new project was created', true, 'success');
                   ***REMOVED***
                   this.getApplication(application);
                 ***REMOVED***,
                 () => ***REMOVED***
                   this.updateNotificationModal('Failed', 'Project could not be created!', true, 'danger');
                 ***REMOVED***)

  ***REMOVED***

  public resetNotificationModal(): void ***REMOVED***
    this.notificationModalTitle = 'Notification';
    this.notificationModalMessage = 'Please wait...';
    this.notificationModalIsClosable = false;
    this.notificationModalType = 'info';
    this.notificationClientInfo = [];
  ***REMOVED***

  /**
   * Bugfix not scrollable site after closing modal
   */
  removeModalOpen(): void ***REMOVED***
    document.body.classList.remove('modal-open');
  ***REMOVED***

  /**
   * Create a new Group in perun with the specific attributes.
   * @param app
   */
  public createSimpleVmProjectGroup(app: Application): void ***REMOVED***

    const application_id: string = <string>app.Id;
    this.applicationsservice.getApplicationClientAvaiable(application_id).subscribe(
      (res: Client) => ***REMOVED***
        if (!res['client_available']) ***REMOVED***
          this.updateNotificationModal('Failed',"No client with the necessary resources online!", true, 'danger');

        ***REMOVED*** else ***REMOVED***

          this.groupservice.createGroupByApplication(application_id).subscribe(() => ***REMOVED***
            this.applicationsservice.getApplicationClient(
              application_id).subscribe((client: object) => ***REMOVED***
              const newClient: Client = new Client(client['host'], client['port'], client['location'], client['id']);
              newClient.maxVolumeLimit = client['max_ressources']['maxTotalVolumeGigabytes'];
              newClient.maxVolumes = client['max_ressources']['maxTotalVolumes'];
              newClient.maxVMs = client['max_ressources']['maxTotalInstances'];
              newClient.assignedVMs = client['assigned_ressources']['vms'];
              newClient.assignedVolumes = client['assigned_ressources']['volumes'];
              newClient.assignedVolumesStorage = client['assigned_ressources']['volumeLimit'];
              this.notificationClientInfo.push(newClient);
              this.updateNotificationModal(
                'Success', `The new project was created and assigned to $***REMOVED***newClient.location***REMOVED***.`,
                true,
                'success');

            ***REMOVED***);

            for (const app of this.all_applications) ***REMOVED***
              if (app.Id.toString() === application_id.toString()) ***REMOVED***
                this.getApplication(app);
                break;

              ***REMOVED***
            ***REMOVED***

          ***REMOVED***);

        ***REMOVED***

      ***REMOVED***,
      (error: object) => ***REMOVED***
        console.log(error);
        this.updateNotificationModal('Failed', 'Project could not be created!', true, 'danger');
      ***REMOVED***)

  ***REMOVED***

  assignGroupToFacility(group_id: string, application_id: string, compute_center: string): void ***REMOVED***
    if (compute_center !== 'undefined') ***REMOVED***
      this.groupservice.assignGroupToResource(group_id, compute_center).subscribe(
        () => ***REMOVED***
          this.applicationstatusservice.setApplicationStatus(
            application_id,
            this.application_states.WAIT_FOR_CONFIRMATION.toString())
            .subscribe(() => ***REMOVED***
              for (const app of this.all_applications) ***REMOVED***
                if (app.Id.toString() === application_id) ***REMOVED***
                  this.getApplication(app);

                  break;

                ***REMOVED***
              ***REMOVED***
              this.updateNotificationModal('Success', 'The  project was assigned to the facility.', true, 'success');

            ***REMOVED***)

        ***REMOVED***,
        (error: object) => ***REMOVED***
          console.log(error);
          this.updateNotificationModal('Failed', 'Project could not be created!', true, 'danger');
        ***REMOVED***);
    ***REMOVED*** else ***REMOVED***
      this.updateNotificationModal('Failed', 'You need to select an compute center!', true, 'danger');
    ***REMOVED***

  ***REMOVED***

  /**
   * Decline an application.
   * @param application_id
   */
  public declineApplication(application_id: string): void ***REMOVED***
    this.applicationstatusservice.setApplicationStatus(application_id, this.getIdByStatus('declined').toString()).toPromise()
      .then(() => ***REMOVED***
        this.all_applications = [];
        this.user_applications = [];
        this.getAllApplications();
        this.updateNotificationModal('Success', 'The Application was declined', true, 'success');
      ***REMOVED***)
      .catch(() => ***REMOVED***
        this.updateNotificationModal('Failed', 'Application could be declined!', true, 'danger');
      ***REMOVED***);
  ***REMOVED***

***REMOVED***
