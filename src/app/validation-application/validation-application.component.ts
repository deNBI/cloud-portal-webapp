import {Component, OnInit} from '@angular/core';
import {ApplicationsService} from '../api-connector/applications.service';
import {Application} from '../applications/application.model/application.model';
import {ActivatedRoute} from '@angular/router';
import {ApplicationBaseClassComponent} from '../shared/shared_modules/baseClass/application-base-class.component';
import {FlavorService} from '../api-connector/flavor.service';
import {FullLayoutComponent} from '../layouts/full-layout.component';

/**
 * Application validation modal.
 */
@Component({
             selector: 'app-validation-application',
             templateUrl: './validation-application.component.html',
             styleUrls: ['./validation-application.component.scss'],
             providers: [ApplicationsService, FlavorService]
           })
export class ValidationApplicationComponent extends ApplicationBaseClassComponent implements OnInit {

  application: Application;
  isLoaded: boolean = false;
  hash: string;
  validated: boolean = false;
  title: string;
  /**
   * Total number of cores.
   * @type {number}
   */
  public totalNumberOfCores: number = 0;
  /**
   * Total number of ram.
   * @type {number}
   */
  public totalRAM: number = 0;

  constructor(private applicationsService: ApplicationsService,
              private activatedRoute: ActivatedRoute,
              private flavorService: FlavorService, private fullLayout: FullLayoutComponent) {
    super(null, null, applicationsService, null);

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((paramsId: any) => {
      this.hash = paramsId.hash;

      this.applicationsService.getApplicationValidationByHash(this.hash).subscribe(
        (app: any) => {
          this.application = this.setNewApplication(app);
          if (this.application.OpenStackProject) {
            this.title = 'Cloud Project Application Validation';
          } else {
            this.title = 'Simple VM Project Application Validation';
          }
          this.isLoaded = true;

        },
        () => {
          this.isLoaded = true;

        })
    })
  }

}
