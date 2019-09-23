import ***REMOVED***Component, Input, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***Application***REMOVED*** from '../application.model/application.model';
import ***REMOVED***ApplicationBaseClass***REMOVED*** from '../../shared/shared_modules/baseClass/application-base-class';
import ***REMOVED***ApplicationsService***REMOVED*** from '../../api-connector/applications.service';
import ***REMOVED***ApplicationStatusService***REMOVED*** from '../../api-connector/application-status.service';
import ***REMOVED***UserService***REMOVED*** from '../../api-connector/user.service';
import ***REMOVED***FacilityService***REMOVED*** from '../../api-connector/facility.service';

@Component(***REMOVED***
             selector: 'app-application-detail',
             templateUrl: './application-detail.component.html',
             styleUrls: ['./application-detail.component.scss'],
             providers: [FacilityService, UserService, ApplicationStatusService,
               ApplicationsService]
           ***REMOVED***)
export class ApplicationDetailComponent extends ApplicationBaseClass implements OnInit ***REMOVED***
  @Input() application: Application;
  @Input() isModification: boolean = false;

  constructor(applicationsservice: ApplicationsService,
              applicationstatusservice: ApplicationStatusService,
              userservice: UserService,
              facilityService: FacilityService
  ) ***REMOVED***

    super(userservice, applicationstatusservice, applicationsservice, facilityService);

  ***REMOVED***

  ngOnInit(): void ***REMOVED***
    console.log(this.application.User)
    this.getMemberDetailsByElixirId(this.application.User);

  ***REMOVED***

***REMOVED***
