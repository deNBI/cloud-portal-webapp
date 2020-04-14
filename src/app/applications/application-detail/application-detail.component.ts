import {Component, Input, OnInit} from '@angular/core';
import {Application} from '../application.model/application.model';
import {ApplicationBaseClassComponent} from '../../shared/shared_modules/baseClass/application-base-class.component';
import {ApplicationsService} from '../../api-connector/applications.service';
import {ApplicationStatusService} from '../../api-connector/application-status.service';
import {UserService} from '../../api-connector/user.service';
import {FacilityService} from '../../api-connector/facility.service';
import {is_vo} from '../../shared/globalvar';
import {CreditsService} from '../../api-connector/credits.service';

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

  /**
   * If user is vo.
   * @type {boolean}
   */
  creditsService: CreditsService;
  is_vo_admin: boolean = false;
  current_credits: number = 0;
  credits_left_with_extra: number = 0;

  constructor(applicationsservice: ApplicationsService,
              applicationstatusservice: ApplicationStatusService,
              userservice: UserService,
              facilityService: FacilityService,
              creditsService: CreditsService) {

    super(userservice, applicationstatusservice, applicationsservice, facilityService);
    this.creditsService = creditsService;
  }

  ngOnInit(): void {
    this.getMemberDetailsByElixirId(this.application.project_application_user.username);
    this.getCurrentCredits();
    this.is_vo_admin = is_vo;
  }

  getCurrentCredits(): void {
    this.creditsService.getCurrentCreditsOfProject(Number(this.application.project_application_perun_id.toString())).toPromise()
      .then((credits: number) => {
        this.current_credits = credits;
        this.credits_left_with_extra = this.application.TotalExtensionCredits - credits;
      }).catch((err: Error) => console.log(err.message));
  }
}
