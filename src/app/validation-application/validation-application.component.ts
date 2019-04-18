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

  constructor(private applicationsService: ApplicationsService, private  activatedRoute: ActivatedRoute) {
    super(null, null, applicationsService, null)

  }

  application: Application;

  ngOnInit() {
    this.activatedRoute.params.subscribe(paramsId => {
      this.applicationsService.getApplicationValidationByHash(paramsId.hash).subscribe(app => {
        this.application = this.setNewApplication(app)

      })
    })
  }

}
