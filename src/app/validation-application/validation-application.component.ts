import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***ApplicationsService***REMOVED*** from "../api-connector/applications.service";
import ***REMOVED***Application***REMOVED*** from "../applications/application.model";
import ***REMOVED***ActivatedRoute***REMOVED*** from "@angular/router";
import ***REMOVED***ApplicationBaseClass***REMOVED*** from "../shared/shared_modules/baseClass/application-base-class";

@Component(***REMOVED***
  selector: 'app-validation-application',
  templateUrl: './validation-application.component.html',
  styleUrls: ['./validation-application.component.scss'],
  providers: [ApplicationsService]
***REMOVED***)
export class ValidationApplicationComponent extends ApplicationBaseClass implements OnInit ***REMOVED***

  application: Application;

  isLoaded: boolean = false;
  hash: string;
  validated: boolean = false;

  constructor(private applicationsService: ApplicationsService, private activatedRoute: ActivatedRoute) ***REMOVED***
    super(null, null, applicationsService, null)

  ***REMOVED***

  approveApplication(): any ***REMOVED***
    this.applicationsService.validateApplicationAsPIByHash(this.hash).subscribe(res => ***REMOVED***
      if (res['project_application_pi_approved']) ***REMOVED***
        this.validated = true;
        this.updateNotificationModal(
          'Success',
          'The application was successfully validated.',
          true,
          'success');
        this.notificationModalStay = false;
      ***REMOVED*** else ***REMOVED***
        this.updateNotificationModal(
          'Failed',
          'The application was not successfully validated.',
          true,
          'danger');
        this.notificationModalStay = true;
      ***REMOVED***
    ***REMOVED***)
  ***REMOVED***

  ngOnInit() ***REMOVED***
    this.activatedRoute.params.subscribe(paramsId => ***REMOVED***
      this.hash = paramsId.hash;

      this.applicationsService.getApplicationValidationByHash(this.hash).subscribe(
        app => ***REMOVED***
          this.application = this.setNewApplication(app);

          this.isLoaded = true;

        ***REMOVED***,
        error => ***REMOVED***
          this.isLoaded = true;

        ***REMOVED***)
    ***REMOVED***)
  ***REMOVED***

***REMOVED***
