import {Component, Input, OnInit} from '@angular/core';
import {Application} from '../application.model/application.model';
import {ApplicationBaseClassComponent} from '../../shared/shared_modules/baseClass/application-base-class.component';
import {ApplicationsService} from '../../api-connector/applications.service';
import {ApplicationStatusService} from '../../api-connector/application-status.service';
import {UserService} from '../../api-connector/user.service';
import {FacilityService} from '../../api-connector/facility.service';
import {IResponseTemplate} from '../../api-connector/response-template';
import {VoService} from '../../api-connector/vo.service';

/**
 * Class which displays the details of an application.
 */
@Component({
             selector: 'app-application-detail',
             templateUrl: './application-detail.component.html',
             styleUrls: ['./application-detail.component.scss'],
             providers: [FacilityService, UserService, ApplicationStatusService,
               ApplicationsService, VoService]
           })
export class ApplicationDetailComponent extends ApplicationBaseClassComponent implements OnInit {
  @Input() application: Application;
  @Input() isModification: boolean = false;

  /**
   * If user is vo.
   * @type {boolean}
   */
  is_vo_admin: boolean = false;

  constructor(applicationsservice: ApplicationsService,
              applicationstatusservice: ApplicationStatusService,
              userservice: UserService,
              facilityService: FacilityService,
              private voservice: VoService) {

    super(userservice, applicationstatusservice, applicationsservice, facilityService);
  }

  ngOnInit(): void {
    this.getMemberDetailsByElixirId(this.application.User);
    this.checkVOstatus()
  }

  /**
   * Check vm status.
   * @param {UserService} userservice
   */
  checkVOstatus(): void {
    this.voservice.isVo().subscribe((result: IResponseTemplate) => {
      this.is_vo_admin = <boolean><Boolean>result.value;
    })
  }

}
