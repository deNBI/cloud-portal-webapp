import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ApiSettings} from '../api-connector/api-settings.service'
import {ApplicationsService} from '../api-connector/applications.service'
import {Flavor} from '../virtualmachines/virtualmachinemodels/flavor';
import {FlavorService} from '../api-connector/flavor.service';
import {environment} from '../../environments/environment';
import {FlavorType} from '../virtualmachines/virtualmachinemodels/flavorType';
import {ApplicationBaseClass} from '../shared/shared_modules/baseClass/application-base-class';
import {ApplicationDissemination} from './application-dissemination';
import {EdamOntologyTerm} from './edam-ontology-term';
import {AutocompleteComponent} from 'angular-ng-autocomplete';
import {FullLayoutComponent} from '../layouts/full-layout.component';

/**
 * Component to create single vm applications.
 */
@Component({
             selector: 'app-addsimplevm',
             templateUrl: 'addsimplevm.component.html',
             providers: [FlavorService, ApiSettings, ApplicationsService]
           })
export class AddsimplevmComponent extends ApplicationBaseClass implements OnInit {



  title: string = "New SimpleVM Application";

  public application_dissemination: ApplicationDissemination = new ApplicationDissemination();

  new_application_id: string | number;

  public edam_ontology_terms: EdamOntologyTerm[];

  ontology_search_keyword: string = 'term';

  selected_ontology_terms: EdamOntologyTerm[] = [];

  @ViewChild('edam_ontology') edam_ontology: AutocompleteComponent;

  /**
   * Boolean indicating whether information selection accordion is open or not.
   * @type {boolean}
   */
  public dissemination_information_open: boolean = false;

  /**
   * Boolean indicating whether platform selection accordion is open or not
   * @type {boolean}
   */
  public dissemination_platforms_open: boolean = false;

  /**
   * List of all collapse booleans.
   */

  /**
   * List of flavor types.
   */
  public typeList: FlavorType[] = [];
  /**
   * List of all collapse booleans.
   */
  public collapseList: boolean[];

  /**
   * Check if the shortname provided is valid.
   * @type {boolean}
   */
  public wronginput: boolean = false;

  @ViewChild(NgForm) simpleVmForm: NgForm;

  /**
   * If at least 1 flavor is selected.
   * @type {boolean}
   */
  public min_vm: boolean = false;

  /**
   * List of flavors.
   */
  public flavorList: Flavor[] = [];

  public production: boolean = environment.production;
  public error: string[];
  public project_application_vms_requested: number = 3;
  public project_application_report_allowed: boolean = false;

  public acknowledgeModalTitle: string = 'Acknowledge';
  public acknowledgeModalType: string = 'info';

  constructor(applicationsservice: ApplicationsService, private flavorService: FlavorService, private fullLayout: FullLayoutComponent) {
    super(null, null, applicationsservice, null);
  }

  ngOnInit(): void {
    this.getListOfFlavors();
    this.getListOfTypes();
    this.applicationsservice.getEdamOntologyTerms().subscribe((terms: EdamOntologyTerm[]) => {
      this.edam_ontology_terms = terms;
    })

  }

  selectEvent(item) {
    if (this.selected_ontology_terms.indexOf(item) === -1) {
      this.selected_ontology_terms.push(item);
    }
    this.edam_ontology.clear();
  }

  removeEDAMterm(term: EdamOntologyTerm): void {
    const indexOf: number = this.selected_ontology_terms.indexOf(term);
    this.selected_ontology_terms.splice(indexOf, 1);

  }

  /**
   * Gets a list of all available types of flavors from the flavorservice and uses them in the function setListOfTypes
   */
  getListOfTypes(): void {
    this.flavorService.getListOfTypesAvailable().subscribe((types: FlavorType[]) => this.setListOfTypes(types));
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

  checkIfTypeGotSimpleVmFlavor(type: FlavorType): boolean {
    for (const flav of this.flavorList) {
      if (flav.type.shortcut === type.shortcut && flav.simple_vm) {
        return true
      }

    }

    return false

  }

  onChangeFlavor(value: number): void {

    this.checkIfMinVmIsSelected();
  }

  checkIfMinVmIsSelected(): void {
    for (const fl of this.flavorList) {
      const control: string = `project_application_${fl.name}`;
      if (control in this.simpleVmForm.controls) {
        if (this.simpleVmForm.controls[control].value > 0) {
          this.min_vm = true;

          return;
        }
      }
    }

    this.min_vm = false;

    return;
  }

  /**
   * Submit simple vm application.
   * @param {NgForm} form
   */
  onSubmit(form: NgForm): void {
    this.error = null;
    if (this.wronginput) {
      this.updateNotificationModal(
        'Failed',
        'The application was not submitted, please check the required fields and try again.',
        true,
        'danger');
      this.notificationModalStay = true;
    } else {
      const values: { [key: string]: string | number | boolean } = {};
      for (const value in form.controls) {
        if (form.controls[value].disabled) {
          continue;
        }
        if (form.controls[value].value) {
          values[value] = form.controls[value].value;
        }
      }

      this.applicationsservice.addNewApplication(values).toPromise()
        .then(application => {
          this.new_application_id = application['project_application_id'];

          if (this.project_application_report_allowed) {
            this.applicationsservice.setApplicationDissemination(this.new_application_id, this.application_dissemination).subscribe()

          }
          this.applicationsservice.addEdamOntologyTerms(this.new_application_id,
                                                        this.selected_ontology_terms
          ).subscribe();

          this.updateNotificationModal('Success', 'The application was submitted', true, 'success');
          this.fullLayout.getGroupsEnumeration();

          this.notificationModalStay = false;
        }).catch((error: object) => {
        const error_json: object = error;
        this.error = [];
        for (const key of Object.keys(error_json)) {
          this.error.push(key.split('_')[2])

        }

        this.updateNotificationModal(
          'Failed',
          'The application was not submitted, please check the required fields and try again.',
          true,
          'danger');
        this.notificationModalStay = true;
      })
    }
  }

  /**
   * gets a list of all available Flavors from the flavorservice and puts them into the array flavorList
   */
  getListOfFlavors(): void {
    this.flavorService.getListOfFlavorsAvailable().subscribe((flavors: Flavor[]) => this.flavorList = flavors);
  }

  /**
   * Check if shortname is valid.
   * @param {string} shortname
   */
  public checkShortname(shortname: string): void {
    this.wronginput = !/^[a-zA-Z0-9\s]*$/.test(shortname);
  }

  /**
   * Creates a test application
   * @param name of the new test application
   */
  sendTestApplication(name: string): void {
    const values: { [key: string]: string | number | boolean } = {};

    values['project_application_bmbf_project'] = 'BMBF';
    values['project_application_horizon2020'] = 'horizon';
    values['project_application_de.NBI.default'] = 1;
    values['project_application_pi_approved'] = true;
    values['project_application_responsibility'] = true;
    values['project_application_comment'] = 'TestApplication';
    values['project_application_description'] = 'TestApplication';
    values['project_application_institute'] = 'TestApplication';
    values['project_application_lifetime'] = 3;
    values['project_application_name'] = name;
    values['project_application_openstack_project'] = false;
    values['project_application_report_allowed'] = true;
    values['project_application_shortname'] = name.substr(0, 15);
    values['project_application_volume_counter'] = 5;
    values['project_application_volume_limit'] = 20;
    values['project_application_workgroup'] = 'TestApplication';

    this.applicationsservice.addNewApplication(values).toPromise()
      .then(() => {
        this.updateNotificationModal('Success', 'The application was submitted', true, 'success');
        this.notificationModalStay = false;
      }).catch((error: object) => {
      const error_json: object = error;
      this.error = [];
      for (const key of Object.keys(error_json)) {
        this.error.push(key.split('_')[2])

      }

      this.updateNotificationModal(
        'Failed',
        'The application was not submitted, please check the required fields and try again.',
        true,
        'danger');
      this.notificationModalStay = true;
    })

  }
}
