import {Component, OnInit} from '@angular/core';
import {ApplicationsService} from "../api-connector/applications.service";
import {Application} from "../applications/application.model";
import {ActivatedRoute} from "@angular/router";
import {ApplicationBaseClass} from "../shared/shared_modules/baseClass/application-base-class";

@Component({
  selector: 'app-validation-application',
  templateUrl: './validation-application.component.html',
  styleUrls: ['./validation-application.component.scss'],
  providers: [ApplicationsService]
})
export class ValidationApplicationComponent extends ApplicationBaseClass implements OnInit {

  application: Application;

  isLoaded: boolean = false;
  hash: string;
  validated: boolean = false;

  constructor(private applicationsService: ApplicationsService, private activatedRoute: ActivatedRoute) {
    super(null, null, applicationsService, null)

  }

  approveApplication(): any {
    this.applicationsService.validateApplicationAsPIByHash(this.hash).subscribe(res => {
      if (res['project_application_pi_approved']) {
        this.validated = true;
        this.updateNotificationModal(
          'Success',
          'The application was successfully validated.',
          true,
          'success');
        this.notificationModalStay = false;
      } else {
        this.updateNotificationModal(
          'Failed',
          'The application was not successfully validated.',
          true,
          'danger');
        this.notificationModalStay = true;
      }
    })
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(paramsId => {
      this.hash = paramsId.hash;

      this.applicationsService.getApplicationValidationByHash(this.hash).subscribe(
        app => {
          this.application = this.setNewApplication(app);

          this.isLoaded = true;

        },
        error => {
          this.isLoaded = true;

        })
    })
  }

}
