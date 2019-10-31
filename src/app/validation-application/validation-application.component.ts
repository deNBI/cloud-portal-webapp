import {Component, OnInit} from '@angular/core';
import {ApplicationsService} from '../api-connector/applications.service';
import {Application} from '../applications/application.model/application.model';
import {ActivatedRoute} from '@angular/router';
import {ApplicationBaseClassComponent} from '../shared/shared_modules/baseClass/application-base-class.component';
import {FlavorService} from '../api-connector/flavor.service';
import {Flavor} from '../virtualmachines/virtualmachinemodels/flavor';
import {FlavorType} from '../virtualmachines/virtualmachinemodels/flavorType';
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

  approveApplication(): any {
    this.applicationsService.validateApplicationAsPIByHash(this.hash).subscribe((res: any) => {
      if (res['project_application_pi_approved']) {
        this.validated = true;
        this.fullLayout.getGroupsEnumeration();
        this.updateNotificationModal(
          'Success',
          'The application was successfully approved.',
          true,
          'success');
        this.notificationModalStay = false;
      } else {
        this.updateNotificationModal(
          'Failed',
          'The application was not successfully approved.',
          true,
          'danger');
        this.notificationModalStay = true;
      }
    })
  }

  ngOnInit(): void {
    this.getListOfFlavors();
    this.getListOfTypes();
    this.activatedRoute.params.subscribe((paramsId: any) => {
      this.hash = paramsId.hash;

      this.applicationsService.getApplicationValidationByHash(this.hash).subscribe(
        (app: any) => {
          this.application = this.setNewApplication(app);
          this.calculateRamCores();
          this.isLoaded = true;

        },
        () => {
          this.isLoaded = true;

        })
    })
  }

  /**
   * gets a list of all available Flavors from the flavorservice and puts them into the array flavorList
   */
  getListOfFlavors(): void {
    this.flavorService.getListOfFlavorsAvailable().subscribe((flavors: Flavor[]) => this.flavorList = flavors);
  }

  /**
   * gets a list of all available types of flavors from the flavorservice and uses them in the function setListOfTypes
   */
  getListOfTypes(): void {
    this.flavorService.getListOfTypesAvailable().subscribe((types: FlavorType[]) => this.setListOfTypes(types));
  }

  checkIfTypeGotSimpleVmFlavor(type: FlavorType): boolean {
    for (const flav of this.flavorList) {
      if (flav.type.shortcut === type.shortcut && flav.simple_vm) {
        return true
      }

    }

    return false

  }

  calculateRamCores(): void {
    this.totalNumberOfCores = 0;
    this.totalRAM = 0;
    // tslint:disable-next-line:forin
    for (const key in this.application.CurrentFlavors) {
      const flavor: any = this.application.CurrentFlavors[key];
      if (flavor != null) {
        this.totalNumberOfCores = this.totalNumberOfCores + (flavor.vcpus * flavor.counter);
        this.totalRAM = this.totalRAM + (flavor.ram * flavor.counter);

      }

    }
  }
}
