import {Component, OnInit} from '@angular/core';
import {FacilityService} from '../api-connector/facility.service';
import {UserService} from '../api-connector/user.service';
import {GroupService} from '../api-connector/group.service';
import {ApiSettings} from '../api-connector/api-settings.service';
import {Application} from '../applications/application.model/application.model';
import {ApplicationStatusService} from '../api-connector/application-status.service';
import {ApplicationsService} from '../api-connector/applications.service';
import {ApplicationBaseClassComponent} from '../shared/shared_modules/baseClass/application-base-class.component';
import {forkJoin} from 'rxjs';

enum TabStates {
  'SUBMITTED' = 0,
  'CREDITS_EXTENSION' = 1,
  'LIFETIME_EXTENSION' = 2,
  'MODIFICATION_EXTENSION' = 3
}

/**
 * Application component
 */
@Component({
             selector: 'app-facility.application',
             templateUrl: 'facility.application.component.html',
             styleUrls: ['facility.application.component.scss'],
             providers: [FacilityService, UserService, GroupService, ApplicationStatusService,
               ApplicationsService, ApiSettings]

           })
export class FacilityApplicationComponent extends ApplicationBaseClassComponent implements OnInit {


  numberOfExtensionRequests: number  = 0;
  numberOfModificationRequests: number = 0;
  numberOfCreditRequests: number = 0;
  numberOfProjectApplications: number = 0;

  loading_applications: boolean = false;

  title: string = 'Application Overview';
  /**
   * All Applications waiting for confirmation for the selected facility.
   * @type {Array}
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
   * @type {Array}
   */
  all_application_modifications: Application [] = [];
  isHistoryLoaded: boolean = false;

  applications_history: Application [] = [];

  allApplicationsToCheck: Application[] = [];

  tab_state: number = TabStates.SUBMITTED;
  TabStates: typeof TabStates = TabStates;
  loadingApplications: boolean = false;

  constructor(userservice: UserService,
              applicationstatusservice: ApplicationStatusService,
              facilityService: FacilityService, applicationsservice: ApplicationsService) {
    super(userservice, applicationstatusservice, applicationsservice, facilityService);

  }

  getFacilityApplicationById(application: Application): void {
    if (application.project_application_description !== undefined) {
      return;
    }
    const idx: number = this.applications_history.indexOf(application);
    this.facilityService.getFacilityApplicationById(this.selectedFacility['FacilityId'], application.project_application_id.toString())
      .subscribe((app: Application): void => {
        this.applications_history[idx] = new Application(app);
      })
  }

  /**
   * Get all application ( with all stati) for a facility.
   * @param {number} facility id of the facility
   */
  getAllApplicationsHistory(facility: number): void {
    this.isHistoryLoaded = false;

    this.applications_history = [];

    // todo check if user is VO Admin
    this.facilityService.getFacilityApplicationsHistory(facility).subscribe((applications: Application[]): void => {
      if (applications.length === 0) {
        this.isHistoryLoaded = true;
      }
      for (const application of applications) {
        this.applications_history.push(new Application(application))
      }
      this.isHistoryLoaded = true;
    });
  }

  getFullApplications(facility: number): void {
    forkJoin(this.facilityService.getFacilityApplicationsWaitingForConfirmation(facility),
             this.facilityService.getFacilityModificationApplicationsWaitingForConfirmation(facility)).subscribe((res: any): void => {
      const wfc_apps: Application[] = res[0];
      const modification_apps: Application[] = res[1];

      for (const wfcApp of wfc_apps) {
        this.all_applications_wfc.push(new Application(wfcApp))
      }
      for (const modificationApp of modification_apps) {
        this.all_application_modifications.push(new Application(modificationApp))
      }
      this.isLoaded = true;
    })


  }

  /**
   * Gets all applications for the facility.
   * @param {number} facility
   */
  getAllApplicationsWFC(facility: number): void {

    // todo check if user is VO Admin
    this.facilityService.getFacilityApplicationsWaitingForConfirmation(facility).subscribe((applications: Application[]): void => {
      if (applications.length === 0) {
        this.isLoaded = true;
      }
      this.all_applications_wfc.push.apply(this.all_applications_wfc, applications);

    });
    this.isLoaded = true;
  }

  /**
   * Approves an  application.
   * @param {number} application_id
   */
  approveApplication(app: Application): void {

    this.updateNotificationModal('Approving Application', 'Waiting..', true, 'info');
    this.facilityService.approveFacilityApplication(this.selectedFacility['FacilityId'], app.project_application_id).subscribe(
      (): void => {
        this.updateNotificationModal('Success', 'Successfully approved the application.', true, 'success');
        this.all_applications_wfc.splice(this.all_applications_wfc.indexOf(app), 1);

        this.getAllApplicationsHistory(this.selectedFacility ['FacilityId']);
      },
      (): void => {
        this.updateNotificationModal('Failed', 'Failed to approve the application.', true, 'danger');

      })
  }

  /**
   * Decline an extension request.
   * @param {number} application_id
   */
  public declineExtension(app: Application): void {
    const modificaton_requested: number = 4;
    this.applicationstatusservice.setApplicationStatus(app.project_application_id, modificaton_requested).subscribe((): void => {
      this.updateNotificationModal('Success', 'Successfully declined!', true, 'success');
      this.all_application_modifications.splice(this.all_application_modifications.indexOf(app), 1);
      this.getAllApplicationsHistory(this.selectedFacility ['FacilityId']);
    })

  }

  /**
   * Declines an Application.
   * @param {number} application_id
   */
  declineApplication(application_id: number): void {
    this.updateNotificationModal('Decline Application', 'Waiting..', true, 'info');

    this.facilityService.declineFacilityApplication(this.selectedFacility['FacilityId'], application_id).subscribe(
      (): void => {
        this.updateNotificationModal('Success', 'Successfully declined the application.', true, 'success');

        this.all_applications_wfc = [];
        this.getAllApplicationsWFC(this.selectedFacility['FacilityId'])
      },
      (): void => {
        this.updateNotificationModal('Failed', 'Failed to decline the application.', true, 'danger');

      })
  }

  /**
   * If the selected facility changes, reload the applicatins.
   * @param value
   */
  onChangeSelectedFacility(): void {
    this.isLoaded = false;
    this.all_applications_wfc = [];
    this.all_application_modifications = [];
    this.applications_history = [];
    this.getFullApplications(this.selectedFacility ['FacilityId']);
    this.getAllApplicationsHistory(this.selectedFacility ['FacilityId']);

  }

  /**
   * may need changes due to multiple facilities for one single fm?
   */
  changeTabState(state: number): void {
    if (!this.loadingApplications){
      this.tab_state = state;
      this.getApplicationsByTabState();
    }
  }

  getApplicationsByTabState(){
    this.allApplicationsToCheck = [];
    this.loadingApplications = true;
    if (this.tab_state === TabStates.SUBMITTED){
      this.facilityService.getWfcSubmittedApplications(this.selectedFacility['FacilityId'])
        .subscribe((applications: Application[]): void => {
        if (applications.length === 0) {
          this.isLoaded_userApplication = true;
        }
        for (const application of applications) {
          this.allApplicationsToCheck.push(new Application(application));
        }
        this.loadingApplications = false;
      });
    } else if (this.tab_state === TabStates.MODIFICATION_EXTENSION) {
      this.facilityService.getWfcModificationRequestedApplications(this.selectedFacility ['FacilityId'])
        .subscribe((applications: Application[]): void => {
        if (applications.length === 0) {
          this.isLoaded_userApplication = true;
        }
        for (const application of applications) {
          this.allApplicationsToCheck.push(new Application(application));
        }
        this.loadingApplications = false;
      });
    } else if (this.tab_state === TabStates.CREDITS_EXTENSION){
      this.facilityService.getWfcCreditsRequestedApplications(this.selectedFacility ['FacilityId'])
        .subscribe((applications: Application[]): void => {
        if (applications.length === 0) {
          this.isLoaded_userApplication = true;
        }
        for (const application of applications) {
          this.allApplicationsToCheck.push(new Application(application));
        }
        this.loadingApplications = false;
      });
    } else if (this.tab_state === TabStates.LIFETIME_EXTENSION){
      this.facilityService.getWfcLifetimeRequestedApplications(this.selectedFacility ['FacilityId'])
        .subscribe((applications: Application[]): void => {
        if (applications.length === 0) {
          this.isLoaded_userApplication = true;
        }
        for (const application of applications) {
          this.allApplicationsToCheck.push(new Application(application));
        }
        this.loadingApplications = false;
      });
    }
  }

  ngOnInit(): void {
    this.facilityService.getManagerFacilities().subscribe((result: any): void => {
      this.managerFacilities = result;
      this.selectedFacility = this.managerFacilities[0];
      this.facilityService.getExtensionRequestsCounterFacility(this.selectedFacility['FacilityId'])
        .subscribe((result: any) => {
          console.log(result);
        this.numberOfCreditRequests = result["credits_extension_requests"];
        this.numberOfExtensionRequests = result["lifetime_extension_requests"];
        this.numberOfModificationRequests = result["modification_requests"];
        this.numberOfProjectApplications = result["applications_submitted"];
      });

      this.facilityService.getFacilityResources(this.selectedFacility['FacilityId']).subscribe();
      this.getApplicationStatus();
      this.getFullApplications(this.selectedFacility ['FacilityId']);
      this.getAllApplicationsHistory(this.selectedFacility ['FacilityId']);
    })
  }

}
