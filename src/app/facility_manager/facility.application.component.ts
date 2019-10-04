import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***FacilityService***REMOVED*** from '../api-connector/facility.service';
import ***REMOVED***UserService***REMOVED*** from '../api-connector/user.service';
import ***REMOVED***GroupService***REMOVED*** from '../api-connector/group.service';
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service';
import ***REMOVED***Application***REMOVED*** from '../applications/application.model/application.model';
import ***REMOVED***ApplicationStatusService***REMOVED*** from '../api-connector/application-status.service';
import ***REMOVED***ApplicationsService***REMOVED*** from '../api-connector/applications.service';
import ***REMOVED***ApplicationBaseClass***REMOVED*** from '../shared/shared_modules/baseClass/application-base-class';

/**
 * Application component
 */
@Component(***REMOVED***
             selector: 'app-facility.application',
             templateUrl: 'facility.application.component.html',
             styleUrls: ['facility.application.component.scss'],
             providers: [FacilityService, UserService, GroupService, ApplicationStatusService,
               ApplicationsService, ApiSettings]

           ***REMOVED***)
export class FacilityApplicationComponent extends ApplicationBaseClass implements OnInit ***REMOVED***

  /**
   * All Applications waiting for confirmation for the selected facility.
   * @type ***REMOVED***Array***REMOVED***
   */
  all_applications_wfc: Application[] = [];

  /**
   * Facilitties where the user is manager ['name',id].
   */
  public managerFacilities: [string, number][];
  /**
   * Chosen facility.
   */
  public selectedFacility: [string, number];

  /**
   * List of all application modifications.
   * @type ***REMOVED***Array***REMOVED***
   */
  all_application_modifications: Application [] = [];

  applications_history: Application [] = [];

  constructor(userservice: UserService,
              applicationstatusservice: ApplicationStatusService,
              facilityService: FacilityService, applicationsservice: ApplicationsService) ***REMOVED***
    super(userservice, applicationstatusservice, applicationsservice, facilityService);

  ***REMOVED***

  /**
   * Approve an application extension.
   * @param ***REMOVED***Application***REMOVED*** app the application
   * @returns ***REMOVED***void***REMOVED***
   */
  public approveExtension(app: Application): void ***REMOVED***

    this.applicationsservice.approveRenewal(app.Id).subscribe(result => ***REMOVED***
      if (result['Error']) ***REMOVED***
        this.updateNotificationModal('Failed', 'Failed to approve the application modification.', true, 'danger');
      ***REMOVED*** else ***REMOVED***
        this.updateNotificationModal('Success', 'Successfully approved the application modification.', true, 'success');
        this.all_application_modifications.splice(this.all_application_modifications.indexOf(app), 1);
        this.getAllApplicationsHistory(this.selectedFacility ['FacilityId']);

      ***REMOVED***
    ***REMOVED***)
  ***REMOVED***

  /**
   * Get all application modification requests.
   * @param ***REMOVED***number***REMOVED*** facility id of the facility
   */
  getAllApplicationsModifications(facility: number): void ***REMOVED***
    this.isLoaded = false;
    this.facilityService.getFacilityModificationApplicationsWaitingForConfirmation(facility).subscribe(res => ***REMOVED***
      if (Object.keys(res).length === 0) ***REMOVED***
        this.isLoaded = true;
      ***REMOVED***

      const newApps: Application [] = this.setNewApplications(res);
      this.all_application_modifications.push.apply(this.all_application_modifications, newApps);
      this.isLoaded = true;

    ***REMOVED***)
  ***REMOVED***

  /**
   * Get all application ( with all stati) for a facility.
   * @param ***REMOVED***number***REMOVED*** facility id of the facility
   */
  getAllApplicationsHistory(facility: number): void ***REMOVED***
    this.isLoaded = false;
    this.applications_history = [];

    // todo check if user is VO Admin
    this.facilityService.getFacilityApplicationsHistory(facility).subscribe(res => ***REMOVED***
      if (Object.keys(res).length === 0) ***REMOVED***
        this.isLoaded = true;
      ***REMOVED***
      const newApps: Application [] = this.setNewApplications(res);
      this.applications_history.push.apply(this.applications_history, newApps);
      this.isLoaded = true;
    ***REMOVED***);
  ***REMOVED***

  /**
   * Gets all applications for the facility.
   * @param ***REMOVED***number***REMOVED*** facility
   */
  getAllApplicationsWFC(facility: number): void ***REMOVED***

    // todo check if user is VO Admin
    this.facilityService.getFacilityApplicationsWaitingForConfirmation(facility).subscribe(res => ***REMOVED***
      if (Object.keys(res).length === 0) ***REMOVED***
        this.isLoaded = true;
      ***REMOVED***
      const newApps: Application [] = this.setNewApplications(res);
      this.all_applications_wfc.push.apply(this.all_applications_wfc, newApps);

    ***REMOVED***);
    this.isLoaded = true;
  ***REMOVED***

  /**
   * Approves an  application.
   * @param ***REMOVED***number***REMOVED*** application_id
   */
  approveApplication(application_id: number): void ***REMOVED***

    this.updateNotificationModal('Approving Application', 'Waiting..', true, 'info');
    this.facilityService.approveFacilityApplication(this.selectedFacility['FacilityId'], application_id).subscribe(
      () => ***REMOVED***
        this.updateNotificationModal('Success', 'Successfully approved the application.', true, 'success');

        this.all_applications_wfc = [];
        this.getAllApplicationsHistory(this.selectedFacility ['FacilityId']);

        this.getAllApplicationsWFC(this.selectedFacility['FacilityId'])
      ***REMOVED***,
      () => ***REMOVED***
        this.updateNotificationModal('Failed', 'Failed to approve the application.', true, 'danger');

      ***REMOVED***)
  ***REMOVED***

  /**
   * Decline an extension request.
   * @param ***REMOVED***number***REMOVED*** application_id
   */
  public declineExtension(app: Application): void ***REMOVED***
    const modificaton_requested: number = 4;
    this.applicationstatusservice.setApplicationStatus(app.Id, modificaton_requested).subscribe(() => ***REMOVED***
      this.updateNotificationModal('Success', 'Successfully declined!', true, 'success');
      this.all_application_modifications.splice(this.all_application_modifications.indexOf(app), 1);
      this.getAllApplicationsHistory(this.selectedFacility ['FacilityId']);
    ***REMOVED***)

  ***REMOVED***

  /**
   * Declines an Application.
   * @param ***REMOVED***number***REMOVED*** application_id
   */
  declineApplication(application_id: number): void ***REMOVED***
    this.updateNotificationModal('Decline Application', 'Waiting..', true, 'info');

    this.facilityService.declineFacilityApplication(this.selectedFacility['FacilityId'], application_id).subscribe(
      () => ***REMOVED***
        this.updateNotificationModal('Success', 'Successfully declined the application.', true, 'success');

        this.all_applications_wfc = [];
        this.getAllApplicationsWFC(this.selectedFacility['FacilityId'])
      ***REMOVED***,
      () => ***REMOVED***
        this.updateNotificationModal('Failed', 'Failed to decline the application.', true, 'danger');

      ***REMOVED***)
  ***REMOVED***

  /**
   * If the selected facility changes, reload the applicatins.
   * @param value
   */
  onChangeSelectedFacility(): void ***REMOVED***
    this.all_applications_wfc = [];
    this.all_application_modifications = [];
    this.applications_history = [];
    this.getAllApplicationsWFC(this.selectedFacility['FacilityId']);
    this.getAllApplicationsHistory(this.selectedFacility['FacilityId']);
    this.getAllApplicationsModifications(this.selectedFacility['FacilityId']);
  ***REMOVED***

  ngOnInit(): void ***REMOVED***
    this.facilityService.getManagerFacilities().subscribe(result => ***REMOVED***
      this.managerFacilities = result;
      this.selectedFacility = this.managerFacilities[0];
      this.facilityService.getFacilityResources(this.selectedFacility['FacilityId']).subscribe();
      this.getApplicationStatus();
      this.getAllApplicationsWFC(this.selectedFacility ['FacilityId']);
      this.getAllApplicationsModifications(this.selectedFacility ['FacilityId']);
      this.getAllApplicationsHistory(this.selectedFacility ['FacilityId']);

    ***REMOVED***)
  ***REMOVED***

***REMOVED***
