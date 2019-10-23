import {Component, Input, OnInit} from '@angular/core';
import {Application} from '../application.model/application.model';
import {ApplicationBaseClassComponent} from '../../shared/shared_modules/baseClass/application-base-class.component';
import {ApplicationsService} from '../../api-connector/applications.service';
import {ApplicationStatusService} from '../../api-connector/application-status.service';
import {UserService} from '../../api-connector/user.service';
import {FacilityService} from '../../api-connector/facility.service';

/**
 * Class which displays the details of an application.
 */
@Component({
             selector: 'app-application-detail',
             templateUrl: './application-detail.component.html',
             styleUrls: ['./application-detail.component.scss'],
             providers: [FacilityService, UserService, ApplicationStatusService,
               ApplicationsService]
           })
export class ApplicationDetailComponent extends ApplicationBaseClassComponent implements OnInit {
  @Input() application: Application;
  @Input() isModification: boolean = false;

  constructor(applicationsservice: ApplicationsService,
              applicationstatusservice: ApplicationStatusService,
              userservice: UserService,
              facilityService: FacilityService
  ) {

    super(userservice, applicationstatusservice, applicationsservice, facilityService);

  }

  ngOnInit(): void {
    this.getMemberDetailsByElixirId(this.application.User);
  }

}
