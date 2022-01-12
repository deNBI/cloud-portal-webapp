import {
	AfterViewChecked, ChangeDetectorRef, Component, OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationsService } from '../api-connector/applications.service';
import { Application } from '../applications/application.model/application.model';
import { ApplicationBaseClassComponent } from '../shared/shared_modules/baseClass/application-base-class.component';
import { FlavorService } from '../api-connector/flavor.service';

/**
 * Application validation modal.
 */
@Component({
	selector: 'app-validation-application',
	templateUrl: './validation-application.component.html',
	styleUrls: ['./validation-application.component.scss'],
	providers: [ApplicationsService, FlavorService],
})
export class ValidationApplicationComponent extends ApplicationBaseClassComponent implements OnInit, AfterViewChecked {

	application: Application;
	isLoadedApplication: boolean = false;
	hash: string;
	validated: boolean = false;
	title: string;
	/**
	 * Total number of cores.
	 *
	 * @type {number}
	 */
	public totalNumberOfCores: number = 0;
	/**
	 * Total number of ram.
	 *
	 * @type {number}
	 */
	public totalRAM: number = 0;

	constructor(
		applicationsService: ApplicationsService,
		private activatedRoute: ActivatedRoute,
private changeDetector: ChangeDetectorRef,
	) {
		super(null, applicationsService, null);

	}

	ngAfterViewChecked(): void {
		this.changeDetector.detectChanges();
	}

	ngOnInit(): void {
		this.activatedRoute.params.subscribe((paramsId: any): void => {
			this.hash = paramsId.hash;

			this.applicationsService.getApplicationValidationByHash(this.hash).subscribe(
				(app: Application): void => {
					this.application = new Application(app);
					if (this.application.project_application_openstack_project) {
						this.title = 'Cloud Project Application Validation';
					} else {
						this.title = 'Simple VM Project Application Validation';
					}
					this.isLoadedApplication = true;

				},
				(): void => {
					this.isLoadedApplication = true;

				},
			);
		});
	}

}
