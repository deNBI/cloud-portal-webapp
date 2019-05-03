import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***ApplicationsService***REMOVED*** from "../api-connector/applications.service";
import ***REMOVED***Application***REMOVED*** from "../applications/application.model";
import ***REMOVED***ActivatedRoute***REMOVED*** from "@angular/router";
import ***REMOVED***ApplicationBaseClass***REMOVED*** from "../shared/shared_modules/baseClass/application-base-class";
import ***REMOVED***FlavorService***REMOVED*** from '../api-connector/flavor.service';
import ***REMOVED***Flavor***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavor';
import ***REMOVED***FlavorType***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavorType';


@Component(***REMOVED***
  selector: 'app-validation-application',
  templateUrl: './validation-application.component.html',
  styleUrls: ['./validation-application.component.scss'],
  providers: [ApplicationsService, FlavorService]
***REMOVED***)
export class ValidationApplicationComponent extends ApplicationBaseClass implements OnInit ***REMOVED***

  application: Application;

  isLoaded: boolean = false;
  hash: string;
  validated: boolean = false;
  /**
   * Total number of cores.
   * @type ***REMOVED***number***REMOVED***
   */
  public totalNumberOfCores: number = 0;
  /**
   * Total number of ram.
   * @type ***REMOVED***number***REMOVED***
   */
  public totalRAM: number = 0;

  constructor(private applicationsService: ApplicationsService,
              private activatedRoute: ActivatedRoute,
              private flavorService: FlavorService) ***REMOVED***
    super(null, null, applicationsService, null);
    this.getListOfFlavors();
    this.getListOfTypes();

  ***REMOVED***

  approveApplication(): any ***REMOVED***
    this.applicationsService.validateApplicationAsPIByHash(this.hash).subscribe(res => ***REMOVED***
      if (res['project_application_pi_approved']) ***REMOVED***
        this.validated = true;
        this.updateNotificationModal(
          'Success',
          'The application was successfully approved.',
          true,
          'success');
        this.notificationModalStay = false;
      ***REMOVED*** else ***REMOVED***
        this.updateNotificationModal(
          'Failed',
          'The application was not successfully approved.',
          true,
          'danger');
        this.notificationModalStay = true;
      ***REMOVED***
    ***REMOVED***)
  ***REMOVED***

  ngOnInit() ***REMOVED***
    this.activatedRoute.params.subscribe(paramsId => ***REMOVED***
      this.hash = paramsId.hash;

      this.applicationsService.getApplicationValidationByHash(this.hash).subscribe(
        app => ***REMOVED***
          this.application = this.setNewApplication(app);
          this.calculateRamCores();
          this.isLoaded = true;

        ***REMOVED***,
        error => ***REMOVED***
          this.isLoaded = true;

        ***REMOVED***)
    ***REMOVED***)
  ***REMOVED***

  /**
   * gets a list of all available Flavors from the flavorservice and puts them into the array flavorList
   */
  getListOfFlavors(): void ***REMOVED***
    this.flavorService.getListOfFlavorsAvailable().subscribe((flavors: Flavor[]) => this.flavorList = flavors);
  ***REMOVED***

  /**
   * gets a list of all available types of flavors from the flavorservice and uses them in the function setListOfTypes
   */
  getListOfTypes(): void ***REMOVED***
    this.flavorService.getListOfTypesAvailable().subscribe((types: FlavorType[]) => this.setListOfTypes(types));
  ***REMOVED***

  checkIfTypeGotSimpleVmFlavor(type: FlavorType): boolean ***REMOVED***
    for (const flav of this.flavorList) ***REMOVED***
      if (flav.type.shortcut === type.shortcut && flav.simple_vm) ***REMOVED***
        return true
      ***REMOVED***

    ***REMOVED***
    return false

  ***REMOVED***

  calculateRamCores() ***REMOVED***
    this.totalNumberOfCores = 0;
    this.totalRAM = 0;
    for (const key in this.application.CurrentFlavors) ***REMOVED***
      const flavor = this.application.CurrentFlavors[key];
      if (flavor != null) ***REMOVED***
        this.totalNumberOfCores = this.totalNumberOfCores + (flavor.vcpus * flavor.counter);
        this.totalRAM = this.totalRAM + (flavor.ram * flavor.counter);

      ***REMOVED***

    ***REMOVED***
  ***REMOVED***
***REMOVED***
