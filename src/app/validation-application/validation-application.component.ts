import {Component, OnInit} from '@angular/core';
import {ApplicationsService} from "../api-connector/applications.service";
import {Application} from "../applications/application.model";
import {ActivatedRoute} from "@angular/router";
import {ApplicationBaseClass} from "../shared/shared_modules/baseClass/application-base-class";
import {FlavorService} from '../api-connector/flavor.service';
import {Flavor} from '../virtualmachines/virtualmachinemodels/flavor';
import {FlavorType} from '../virtualmachines/virtualmachinemodels/flavorType';


@Component({
  selector: 'app-validation-application',
  templateUrl: './validation-application.component.html',
  styleUrls: ['./validation-application.component.scss'],
  providers: [ApplicationsService, FlavorService]
})
export class ValidationApplicationComponent extends ApplicationBaseClass implements OnInit {

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
              private flavorService: FlavorService) {
    super(null, null, applicationsService, null);
    this.getListOfFlavors();
    this.getListOfTypes();

  }

  approveApplication(): any {
    this.applicationsService.validateApplicationAsPIByHash(this.hash).subscribe(res => {
      if (res['project_application_pi_approved']) {
        this.validated = true;
        this.updateNotificationModal(
          'Success',
          'The application was successfully validated.',
          true,
          'success');
        this.notificationModalStay = false;
      } else {
        this.updateNotificationModal(
          'Failed',
          'The application was not successfully validated.',
          true,
          'danger');
        this.notificationModalStay = true;
      }
    })
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(paramsId => {
      this.hash = paramsId.hash;

      this.applicationsService.getApplicationValidationByHash(this.hash).subscribe(
        app => {
          this.application = this.setNewApplication(app);
          this.calculateRamCores();
          this.isLoaded = true;

        },
        error => {
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

  calculateRamCores() {
    this.totalNumberOfCores = 0;
    this.totalRAM = 0;
    for (const key in this.application.CurrentFlavors) {
      const flavor = this.application.CurrentFlavors[key];
      if (flavor != null) {
        this.totalNumberOfCores = this.totalNumberOfCores + (flavor.vcpus * flavor.counter);
        this.totalRAM = this.totalRAM + (flavor.ram * flavor.counter);

      }

    }
  }
}
