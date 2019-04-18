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

  constructor(private applicationsService: ApplicationsService, private  activatedRoute: ActivatedRoute) ***REMOVED***
    super(null, null, applicationsService, null)

  ***REMOVED***

  application: Application;

  ngOnInit() ***REMOVED***
    this.activatedRoute.params.subscribe(paramsId => ***REMOVED***
      this.applicationsService.getApplicationValidationByHash(paramsId.hash).subscribe(app => ***REMOVED***
        this.application = this.setNewApplication(app)

      ***REMOVED***)
    ***REMOVED***)
  ***REMOVED***

***REMOVED***
