import {Component, Input, OnInit} from '@angular/core';
import {Application} from '../application.model/application.model';
import {ApplicationBaseClassComponent} from '../../shared/shared_modules/baseClass/application-base-class.component';
import {ApplicationsService} from '../../api-connector/applications.service';
import {ApplicationStatusService} from '../../api-connector/application-status.service';
import {UserService} from '../../api-connector/user.service';
import {FacilityService} from '../../api-connector/facility.service';
import {CreditsService} from '../../api-connector/credits.service';
import {ApplicationStatus} from '../application_status.model';
import {ApiSettings} from '../../api-connector/api-settings.service';
import {Subscription} from 'rxjs';

/**
 * Class which displays the details of an application.
 */
@Component({
             selector: 'app-application-detail',
             templateUrl: './application-detail.component.html',
             styleUrls: ['./application-detail.component.scss'],
             providers: [FacilityService, UserService, ApplicationStatusService,
               ApplicationsService, CreditsService]
           })
export class ApplicationDetailComponent extends ApplicationBaseClassComponent implements OnInit {
  @Input() application: Application;
  @Input() isModification: boolean = false;
  creditsService: CreditsService;
  credits: number = 0;

  constructor(applicationsservice: ApplicationsService,
              applicationstatusservice: ApplicationStatusService,
              userservice: UserService,
              facilityService: FacilityService,
              creditsService: CreditsService
  ) {

    super(userservice, applicationstatusservice, applicationsservice, facilityService);
    this.creditsService = creditsService;
  }

  ngOnInit(): void {
    this.getMemberDetailsByElixirId(this.application.User);
  }

  getExpectedCredits(): void {
    this.creditsService.getCreditsForApplication(this.application.TotalCores,
                                                 this.application.TotalRam, this.application.Lifetime).subscribe((result: number ) => {
      this.credits = result
    })
  }

}
