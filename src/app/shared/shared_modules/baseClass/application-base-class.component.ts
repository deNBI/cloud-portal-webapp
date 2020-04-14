import {AbstractBaseClasse} from './abstract-base-class';
import {ApplicationStatus} from '../../../applications/application_status.model';
import {Application} from '../../../applications/application.model/application.model';
import {Flavor} from '../../../virtualmachines/virtualmachinemodels/flavor';
import {ApplicationExtension} from '../../../applications/application_extension.model';
import {ApplicationsService} from '../../../api-connector/applications.service';
import {ComputecenterComponent} from '../../../projectmanagement/computecenter.component';
import {FlavorType} from '../../../virtualmachines/virtualmachinemodels/flavorType';
import {FlavorService} from '../../../api-connector/flavor.service';
import {FacilityService} from '../../../api-connector/facility.service';
import {Component} from '@angular/core';
import {ApplicationStatusService} from '../../../api-connector/application-status.service';
import {UserService} from '../../../api-connector/user.service';
import {ApplicationDissemination} from '../../../applications/application-dissemination';

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

  /**application_user
   * User which requested the Application {id: Elixir id of user : {name and email}}.
   * @type {{}}
   */
  application_user: { [id: string]: { [id: string]: string } } = {};

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
    this.facilityService.getComputeCenters().subscribe((result: [{ [key: string]: string }]) => {
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

  setShortNewApplication(aj: any): Application {
    const newApp: Application = new Application();
    newApp.project_application_id = aj['project_application_id'];

    newApp.project_application_name = aj['project_application_name'];
    newApp.project_application_shortname = aj['project_application_shortname'];
    newApp.project_application_institute = aj['project_application_institute'];
    newApp.project_application_username = aj['project_application_user']['username'];
    newApp.project_application_date_submitted = aj['project_application_date_submitted'];
    newApp.project_application_status = aj['project_application_status'];
    newApp.project_application_perun_id = aj['project_application_perun_id'];
    newApp.project_application_openstack_project = aj['project_application_openstack_project'];

    newApp.project_application_date_approved = aj['project_application_date_approved'];

    return newApp
  }

  setNewApplication(aj: Application): Application {

    aj.dissemination = this.createDisseminatenObject(aj['dissemination']);

    if (aj.project_application_status === this.application_states.APPROVED) {
      aj.DaysRunning = Math.ceil((Math.abs(Date.now() - new Date(aj.project_application_date_approved).getTime())) / (1000 * 3600 * 24));

    }
    if (aj['projectapplicationrenewal']) {
      const extension: ApplicationExtension = new ApplicationExtension();
      let requestExtensionTotalCores: number = 0;
      let requestExtensionTotalRam: number = 0;

      for (const flavor of aj['projectapplicationrenewal']['flavors']) {
        extension.addFlavorToRequested(
          flavor.flavor_name, flavor.counter, flavor.tag, flavor.ram,
          flavor.rootdisk, flavor.vcpus, flavor.gpu, flavor.epheremal_disk);
        requestExtensionTotalCores += flavor.vcpus * flavor.counter;
        requestExtensionTotalRam += flavor.ram * flavor.counter

      }

      extension.project_application_renewal_total_ram = requestExtensionTotalRam;
      extension.project_application_renewal_total_cores = requestExtensionTotalCores;

      extension.Id = aj['projectapplicationrenewal']['project_application'];
      extension.project_application_renewal_lifetime = aj['projectapplicationrenewal']['project_application_renewal_lifetime'];
      extension.project_application_renewal_volume_limit = aj['projectapplicationrenewal']['project_application_renewal_volume_limit'];
      extension.project_application_renewal_volume_counter = aj['projectapplicationrenewal']['project_application_renewal_volume_counter'];
      extension.project_application_renewal_vms_requested = aj['projectapplicationrenewal']['project_application_renewal_vms_requested'];
      extension.project_application_renewal_comment = aj['projectapplicationrenewal']['project_application_renewal_comment'];
      extension.project_application_renewal_object_storage = aj['projectapplicationrenewal']['project_application_renewal_object_storage'];
      extension.project_application_renewal_comment = aj['projectapplicationrenewal']['project_application_renewal_comment'];
      extension.project_application_renewal_credits = aj['projectapplicationrenewal']['project_application_renewal_credits'];
      extension.is_only_extra_credits_application = aj['projectapplicationrenewal']['is_only_extra_credits_application'];
      extension.project_application_cloud_service_user_number = aj['projectapplicationrenewal']['project_application_renewal_cloud_service_user_number'];
      aj.projectapplicationrenewal = extension;
    }

    return aj
  }

  createDisseminatenObject(obj: any): ApplicationDissemination {
    if (obj) {
      // @ts-ignore
      return new ApplicationDissemination(
        obj['platform_denbi'], obj['platform_twitter'],
        obj['information_title'], obj['information_resources'], obj['information_pi_name'],
        obj['information_institution'], obj['information_workgroup'],
        obj['information_project_type'],
        obj['information_lifetime'], obj['information_project_affiliation'],
        obj['information_description'])
    } else {
      return null
    }
  }

  setShortDetailNewApplications(res: any): Application[] {
    const newApplications: Application[] = [];

    for (const key in res) {
      if (res.hasOwnProperty(key)) {

        const aj: object = res[key];

        newApplications.push(this.setShortNewApplication(aj))
      }
    }

    return newApplications
  }

  setNewApplications(res: any): Application[] {
    const newApplications: Application[] = [];

    for (const key in res) {
      if (res.hasOwnProperty(key)) {

        const aj: object = res[key];

        newApplications.push(this.setNewApplication(aj))
      }
    }

    return newApplications
  }

  setApplicationUser(elixir_id: string): void {
    if (!(elixir_id in this.application_user)) {
      this.userservice.getMemberDetailsByElixirId(elixir_id).subscribe((result: { [key: string]: string }) => {

        const name: string = `${result['firstName']} ${result['lastName']}`;
        const appuser: { [id: string]: string } = {};
        appuser['name'] = name;
        appuser['email'] = result['email'];
        this.application_user[elixir_id] = appuser;
      })
    }
  }

  /**
   * Get details of member like name and email by elixir.
   * @param {string} elixir_id
   * @param {string} collapse_id
   */
  public getMemberDetailsByElixirIdIfCollapsed(elixir_id: string, collapse_id: string): void {
    if (!this.getCollapseStatus(collapse_id)) {
      this.setApplicationUser(elixir_id);
    }
  }

  /**
   * Get details of member like name and email by elixir.
   * @param {string} elixir_id
   */
  public getMemberDetailsByElixirId(elixir_id: string): void {
    this.setApplicationUser(elixir_id);
  }

  /**
   * Get all possible application stati.
   */
  getApplicationStatus(): void {
    this.applicationstatusservice.getAllApplicationStatus().subscribe((stati: ApplicationStatus[]) => {
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
