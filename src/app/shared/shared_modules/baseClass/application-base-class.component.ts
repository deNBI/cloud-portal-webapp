import {AbstractBaseClasse} from './abstract-base-class';
import {ApplicationStatus} from '../../../applications/application_status.model';
import {Application} from '../../../applications/application.model/application.model';
import {Flavor} from '../../../virtualmachines/virtualmachinemodels/flavor';
import {ApplicationsService} from '../../../api-connector/applications.service';
import {ComputecenterComponent} from '../../../projectmanagement/computecenter.component';
import {FlavorType} from '../../../virtualmachines/virtualmachinemodels/flavorType';
import {FlavorService} from '../../../api-connector/flavor.service';
import {FacilityService} from '../../../api-connector/facility.service';
import {Component} from '@angular/core';
import {ApplicationStatusService} from '../../../api-connector/application-status.service';
import {UserService} from '../../../api-connector/user.service';

/**
 * Application base component..
 */
@Component({
             selector: 'app-base',
             template: '',
             providers: [FacilityService, ApplicationsService, FlavorService]
           })
export class ApplicationBaseClassComponent extends AbstractBaseClasse {

  /**
   * If all Applications are loaded, important for the loader.
   * @type {boolean}
   */
  isLoaded_AllApplication: boolean = false;

  /**
   * Selected Application.
   */
  selectedApplication: Application;

  /**
   * All available compute centers.
   * @type {Array}
   */
  computeCenters: ComputecenterComponent[] = [];

  /**
   * Stati of the differen Applications.
   * @type {Array}
   */
  application_status: ApplicationStatus[] = [];

  /**
   * List of flavor types.
   */
  typeList: FlavorType[];
  /**
   * List of all collapse booleans.
   */
  collapseList: boolean[];

  /**
   * Total number of cores.
   * @type {number}
   */
  totalNumberOfCores: number = 0;
  /**
   * Total number of ram.
   * @type {number}
   */
  totalRAM: number = 0;
  /**
   * Values to confirm.
   */
  valuesToConfirm: string[];

  newFlavors: {
    [id: string]: {
      counter: number, flavor: Flavor
    }
  } = {};

  extension_request: boolean = false;

  /**
   * If shortname is valid.
   * @type {boolean}
   */
  public wronginput: boolean = false;
  /**
   *
   */
  constantStrings: Object;

  /**
   * List of flavors.
   */
  flavorList: Flavor[] = [];

  /**
   * If all userApplications are loaded, important for the loader.
   * @type {boolean}
   */
  isLoaded_userApplication: boolean = false;

  public project_application_pi_approved: boolean = false;

  /**
   * Name of the project.
   */
  public projectName: string;

  public project_application_report_allowed: boolean = false;

  /**
   * Applications of the user viewing the Application overview.
   * @type {Array}
   */
  user_applications: Application[] = [];

  constructor(protected userservice: UserService, protected applicationstatusservice: ApplicationStatusService,
              protected applicationsservice: ApplicationsService,
              protected facilityService: FacilityService) {
    super();

  }

  /**
   * Get id by status name.
   * @param {string} name
   * @returns {number}
   */
  getIdByStatus(name: string): number {
    const dummy: number = -1;

    for (const status of this.application_status) {
      if (status.application_status_name === name) {
        return status.application_status_id;
      }
    }

    return dummy;
  }

  /**
   * Gets all available compute centers and saves them in the computeCenters attribute.
   */
  getComputeCenters(): void {
    this.facilityService.getComputeCenters().subscribe((result: [{ [key: string]: string }]): void => {
      for (const cc of result) {
        const compute_center: ComputecenterComponent = new ComputecenterComponent(
          cc['compute_center_facility_id'],
          cc['compute_center_name'],
          cc['compute_center_login'],
          cc['compute_center_support_mail']);
        this.computeCenters.push(compute_center)
      }

    })
  }

  valuesChanged(flavor: Flavor, counter: number, lifetime?: string): void {
    this.newFlavors[flavor.name] = {counter: counter, flavor: flavor};
    this.calculateRamCores();
    if (lifetime === undefined) {
      lifetime = '0';
    }
  }

  calculateRamCores(): void {
    this.totalNumberOfCores = 0;
    this.totalRAM = 0;
    // tslint:disable-next-line:forin
    for (const extensionFlavorsKey in this.newFlavors) {
      const fl: any = this.newFlavors[extensionFlavorsKey];
      this.totalRAM = this.totalRAM + fl.flavor.ram * fl.counter;
      this.totalNumberOfCores = this.totalNumberOfCores + fl.flavor.vcpus * fl.counter;
    }
  }

  /**
   * Get details of member like name and email by elixir.
   * @param {string} elixir_id
   * @param {string} collapse_id
   */
  public getMemberDetailsByElixirIdIfCollapsed(application: Application, collapse_id: string): void {
    if (!this.getCollapseStatus(collapse_id)) {
      this.getMemberDetailsByElixirId(application);
    }
  }

  public getMemberDetailsByElixirId(application: Application): void {
    this.userservice.getMemberDetailsByElixirId(application.project_application_user.elixir_id).subscribe(
      (result: { [key: string]: string }): void => {

        application.project_application_user.username = `${result['firstName']} ${result['lastName']}`;

        application.project_application_user.email = result['email'];
      });
  }

  /**
   * Get all possible application stati.
   */
  getApplicationStatus(): void {
    this.applicationstatusservice.getAllApplicationStatus().subscribe((stati: ApplicationStatus[]): void => {
      this.application_status = stati;
    })
  }

  /**
   * Get status name  by status id.
   * @param {number} id
   * @returns {string}
   */
  public getStatusById(id: number): string {
    const dummy: string = 'Unknown';
    for (const status of this.application_status) {

      if (status.application_status_id === id) {
        return status.application_status_name;
      }
    }

    return dummy;
  }


  /**
   * Get status names  by status id.
   * TODO: replace old status function, which only gives one status
   * @param {number} id
   * @returns {string}
   */
  public getStatusesById(ids: [number]): [string] {
    return [""];
  }

  /**
   * Sets the selected application.
   * @param application
   */
  setSelectedApplication(application: Application): void {
    this.selectedApplication = application;

  }

  /**
   * Uses the param types to safe the available FlavorTypes to the array typeList.
   * Also it fills the array collapseList with booleans of value 'false' so all flavor-categories are shown in the application form.
   * @param types array of all available FlavorTypes
   */
  setListOfTypes(types: FlavorType[]): void {
    this.typeList = types;
    this.collapseList = new Array(types.length) as boolean[];
    for (const type of types) {

      this.collapseList.push(false); // AS FIX
      if (type.long_name === 'Standart Flavor') {
        this.collapseList[this.typeList.indexOf(type)] = true;
      }
    }

  }

  /**
   * Check if short name is valid.
   * @param {string} shortname
   */
  public checkShortname(shortname: string): void {
    this.wronginput = !/^[a-zA-Z0-9\s]*$/.test(shortname);
  }

  /**
   * Fills the array constantStrings with values dependent of keys which are used to indicate inputs from the application-form
   */
  generateConstants(): void {
    this.constantStrings = [];
    this.constantStrings['project_application_shortname'] = 'Shortname: ';
    this.constantStrings['project_application_description'] = 'Description: ';
    this.constantStrings['project_application_comment'] = 'Comment: ';
    this.constantStrings['project_application_pi_email'] = 'Principal Investigator Email: ';
    this.constantStrings['project_application_bmbf_project'] = 'BMBF Project: ';

    this.constantStrings['project_application_lifetime'] = 'Lifetime of your project: ';
    this.constantStrings['project_application_volume_counter'] = 'Number of volumes for additional storage: ';
    this.constantStrings['project_application_object_storage'] = 'Object storage: ';
    this.constantStrings['project_application_volume_limit'] = 'Volume Storage space for your VMs: ';
    this.constantStrings['project_application_comment'] = 'Comment: ';
    this.constantStrings['project_application_renewal_comment'] = 'Comment: ';

    this.constantStrings['project_application_renewal_lifetime'] = 'Lifetime of your project: ';
    this.constantStrings['project_application_renewal_volume_counter'] = 'Number of volumes for additional storage: ';
    this.constantStrings['project_application_renewal_object_storage'] = 'Object storage: ';
    this.constantStrings['project_application_renewal_volume_limit'] = 'Volume Storage space for your VMs: ';
    this.constantStrings['project_application_institute'] = 'Your institute: ';
    this.constantStrings['project_application_workgroup'] = 'Your Workgroup: ';
    this.constantStrings['project_application_horizon2020'] = 'Horizon2020: ';
    this.constantStrings['project_application_elixir_project'] = 'Elixir Project: ';

    this.constantStrings['project_application_report_allowed'] = 'Dissemination allowed: ';

    for (const key in this.flavorList) {
      if (key in this.flavorList) {
        this.constantStrings[`project_application_${this.flavorList[key].name}`] =
          `Number of VMs of type  ${this.flavorList[key].name}: `;
      }
    }
  }

  /**
   * This function concatenates a given key combined with a given value to a string
   * which is used on the confirmation-modal.
   * @param key the key to access a string in the array constantStrings
   * @param val the value that is concatenated with the string from the array and an optional addition (depending on the key)
   * @returns the concatenated string for the confirmation-modal
   */
  matchString(key: string, val: string): string {
    if (key in this.constantStrings) {
      switch (key) {
        case 'project_application_lifetime': {
          return (`${this.constantStrings[key]}${val} months`);
        }
        case ('project_application_volume_limit'): {
          return (`${this.constantStrings[key]}${val} GB`);
        }
        case 'project_application_object_storage': {
          return (`${this.constantStrings[key]}${val}  GB`);
        }
        case 'project_application_report_allowed': {
          if (val) {
            return (`${this.constantStrings[key]} Yes`);
          } else {
            return (`${this.constantStrings[key]} No`);
          }
        }
        default: {
          return (`${this.constantStrings[key]}${val}`);
        }
      }
    }
  }

}
