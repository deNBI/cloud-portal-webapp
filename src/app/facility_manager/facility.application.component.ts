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

  title: string = 'Application Overview';
  /**
   * All Applications waiting for confirmation for the selected facility.
   * @type {Array}
   */

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

  public approveExtension(app: Application): void {
    this.applicationsservice.approveAdditionalLifetime(app.project_application_id)
      .subscribe((result: any) => {
        this.updateNotificationModal('Success', 'Successfully approved extension!', true, 'success');
        this.allApplicationsToCheck.splice(this.allApplicationsToCheck.indexOf(app), 1);
        this.numberOfExtensionRequests--;
        this.getAllApplicationsHistory(this.selectedFacility['FacilityId']);
      },         (error: any) => {
        this.updateNotificationModal('Failed',
                                     'The approval of the extension request has failed.',
                                     true,
                                     'danger');
        });
  }

  /**
   * Decline an extension request.
   * @param {number} application_id
   */
  public declineExtension(app: Application): void {

    this.applicationsservice.declineAdditionalLifetime(app.project_application_id)
      .subscribe((result: any) => {
        this.updateNotificationModal('Success', 'Successfully declined extension!', true, 'success');
        this.allApplicationsToCheck.splice(this.allApplicationsToCheck.indexOf(app), 1);
        this.numberOfExtensionRequests--;
        this.getAllApplicationsHistory(this.selectedFacility['FacilityId']);
      },         (error: any) => {
        this.updateNotificationModal('Failed',
                                     'The decline of the extension request has failed.',
                                     true,
                                     'danger');
      });
  }

  public approveModification(app: Application): void {
    this.applicationsservice.approveModificationRequest(app.project_application_id)
      .subscribe((result: any) => {
        this.updateNotificationModal('Success', 'Successfully approved modification!', true, 'success');
        this.allApplicationsToCheck.splice(this.allApplicationsToCheck.indexOf(app), 1);
        this.numberOfModificationRequests--;
        this.getAllApplicationsHistory(this.selectedFacility['FacilityId']);
      },         (error: any) => {
        this.updateNotificationModal('Failed',
                                     'The approval of the modification request has failed.',
                                     true,
                                     'danger');
      });
  }

  public declineModification(app: Application): void {
    this.applicationsservice.declineModificationRequest(app.project_application_id)
      .subscribe((result: any) => {
        this.updateNotificationModal('Success', 'Successfully declined modification!', true, 'success');
        this.allApplicationsToCheck.splice(this.allApplicationsToCheck.indexOf(app), 1);
        this.numberOfModificationRequests--;
        this.getAllApplicationsHistory(this.selectedFacility['FacilityId']);
      },         (error: any) => {
        this.updateNotificationModal('Failed',
                                     'The decline of the modification request has failed.',
                                     true,
                                     'danger');
      });
  }

  public approveCreditRequest(app: Application): void {
    this.applicationsservice.approveAdditionalCreditsRequest(app.project_application_id)
      .subscribe((result: any) => {
        this.updateNotificationModal('Success', 'Successfully approved credit extension!', true, 'success');
        this.allApplicationsToCheck.splice(this.allApplicationsToCheck.indexOf(app), 1);
        this.numberOfCreditRequests--;
        this.getAllApplicationsHistory(this.selectedFacility['FacilityId']);
      },         (error: any) => {
        this.updateNotificationModal('Failed',
                                     'The approval of the credit request has failed.',
                                     true,
                                     'danger');
      });
  }

  public declineCreditRequest(app: Application): void {
    this.applicationsservice.declineAdditionalCredits(app.project_application_id)
      .subscribe((result: any) => {
        this.updateNotificationModal('Success', 'Successfully declined credit extension!', true, 'success');
        this.allApplicationsToCheck.splice(this.allApplicationsToCheck.indexOf(app), 1);
        this.numberOfCreditRequests--;
        this.getAllApplicationsHistory(this.selectedFacility['FacilityId']);
      },         (error: any) => {
        this.updateNotificationModal('Failed',
                                     'The decline of the credit request has failed.',
                                     true,
                                     'danger');
      });
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
        this.allApplicationsToCheck.splice(this.allApplicationsToCheck.indexOf(app), 1);
        this.numberOfProjectApplications = this.numberOfProjectApplications - 1;
        this.getAllApplicationsHistory(this.selectedFacility['FacilityId']);
      },
      (): void => {
        this.updateNotificationModal('Failed', 'Failed to approve the application.', true, 'danger');

      })
  }

  /**
   * Declines an Application.
   * @param {number} application_id
   */
  declineApplication(app: Application): void {
    this.updateNotificationModal('Decline Application', 'Waiting..', true, 'info');

    this.facilityService.declineFacilityApplication(this.selectedFacility['FacilityId'], parseInt(app.project_application_id.toString()))
      .subscribe(
      (): void => {
        this.updateNotificationModal('Success', 'Successfully declined the application.', true, 'success');
        this.allApplicationsToCheck.splice(this.allApplicationsToCheck.indexOf(app), 1);
        this.numberOfProjectApplications = this.numberOfProjectApplications - 1;
        this.getAllApplicationsHistory(this.selectedFacility['FacilityId']);
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
    this.allApplicationsToCheck = [];
    this.all_application_modifications = [];
    this.applications_history = [];
    // this.getFullApplications(this.selectedFacility ['FacilityId']);
    this.getAllApplicationsHistory(this.selectedFacility ['FacilityId']);

  }

  /**
   * may need changes due to multiple facilities for one single fm?
   */
  changeTabState(state: number): void {
    if (!this.loadingApplications) {
      this.tab_state = state;
      this.getApplicationsByTabState();
    }
  }

  getApplicationsByTabState() {
    this.allApplicationsToCheck = [];
    this.loadingApplications = true;
    if (this.tab_state === TabStates.SUBMITTED) {
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
    } else if (this.tab_state === TabStates.CREDITS_EXTENSION) {
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
    } else if (this.tab_state === TabStates.LIFETIME_EXTENSION) {
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
          this.numberOfCreditRequests = result['credits_extension_requests'];
          this.numberOfExtensionRequests = result['lifetime_extension_requests'];
          this.numberOfModificationRequests = result['modification_requests'];
          this.numberOfProjectApplications = result['applications_submitted'];
        });
      this.changeTabState(TabStates.SUBMITTED);
      this.isLoaded = true;

      this.facilityService.getFacilityResources(this.selectedFacility['FacilityId']).subscribe();
      this.getApplicationStatus();
     // this.getFullApplications(this.selectedFacility ['FacilityId']);
      this.getAllApplicationsHistory(this.selectedFacility ['FacilityId']);
    })
  }

}
