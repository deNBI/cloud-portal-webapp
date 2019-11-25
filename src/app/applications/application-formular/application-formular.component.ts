import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Flavor} from '../../virtualmachines/virtualmachinemodels/flavor';
import {FlavorService} from '../../api-connector/flavor.service';
import {FlavorType} from '../../virtualmachines/virtualmachinemodels/flavorType';
import {environment} from '../../../environments/environment';
import {EdamOntologyTerm} from '../edam-ontology-term';
import {AutocompleteComponent} from 'angular-ng-autocomplete';
import {ApplicationsService} from '../../api-connector/applications.service';
import {ApplicationDissemination} from '../application-dissemination';
import {ApplicationBaseClassComponent} from '../../shared/shared_modules/baseClass/application-base-class.component';
import {FullLayoutComponent} from '../../layouts/full-layout.component';
import {IResponseTemplate} from '../../api-connector/response-template';
import {VoService} from '../../api-connector/vo.service';
import {CreditsService} from '../../api-connector/credits.service';

/**
 * Application formular component.
 */
@Component({
             selector: 'app-application-formular',
             templateUrl: './application-formular.component.html',
             styleUrls: ['./application-formular.component.scss'],
             providers: [FlavorService, ApplicationsService, VoService, CreditsService]
           })
export class ApplicationFormularComponent extends ApplicationBaseClassComponent implements OnInit, OnChanges {

  @Input() openstack_project: boolean = false;
  @Input() simple_vm_project: boolean = false;
  @Input() title: string;

  credits: number = 0;
  dissemination_platform_count: number = 0;
  project_application_sensitive_data: false;
  flavorList: Flavor[] = [];
  production: boolean = environment.production;
  dissemination_information_open: boolean = true;
  dissemination_platforms_open: boolean = false;
  invalid_shortname: boolean = false;
  simple_vm_min_vm: boolean = false;
  error: string[];
  project_application_vms_requested: number = 3;
  project_application_report_allowed: boolean = false;

  acknowledgeModalTitle: string = 'Acknowledge';
  acknowledgeModalType: string = 'info';

  application_dissemination: ApplicationDissemination = new ApplicationDissemination();
  edam_ontology_terms: EdamOntologyTerm[];
  new_application_id: string | number;
  selected_ontology_terms: EdamOntologyTerm[] = [];
  ontology_search_keyword: string = 'term';
  @ViewChild('edam_ontology') edam_ontology: AutocompleteComponent;
  @ViewChild(NgForm) application_form: NgForm;

  /**
   * List of flavor types.
   */
  public typeList: FlavorType[] = [];
  /**
   * List of all collapse booleans.
   */
  public collapseList: boolean[];

  constructor(private creditsService: CreditsService, private voService: VoService,
              private flavorService: FlavorService, private fullLayout: FullLayoutComponent,
              applicationsservice: ApplicationsService) {
    super(null, null, applicationsservice, null);

  }

  ngOnInit(): void {
    this.getListOfFlavors();
    this.getListOfTypes();
    this.checkVOstatus();
    this.applicationsservice.getEdamOntologyTerms().subscribe((terms: EdamOntologyTerm[]) => {
      this.edam_ontology_terms = terms;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.openstack_project) {
      this.simple_vm_min_vm = true;
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

  selectEvent(item: any): void {
    if (this.selected_ontology_terms.indexOf(item) === -1) {
      this.selected_ontology_terms.push(item);
    }
    this.edam_ontology.clear();
  }

  removeEDAMterm(term: EdamOntologyTerm): void {
    const indexOf: number = this.selected_ontology_terms.indexOf(term);
    this.selected_ontology_terms.splice(indexOf, 1);

  }

  onChangeFlavor(value: number): void {
    if (this.simple_vm_project) {
      this.checkIfMinVmIsSelected();
    }
  }

  /**
   * Uses the data from the application form to fill the confirmation-modal with information.
   * @param form the application form with corresponding data
   */
  filterEnteredData(form: NgForm): void {
    this.generateConstants();
    this.valuesToConfirm = [];
    for (const key in form.controls) {
      if (form.controls[key].value) {
        if (key === 'project_application_name') {
          this.projectName = form.controls[key].value;
          if (this.projectName.length > 50) {
            this.projectName = `${this.projectName.substring(0, 50)}...`;
          }
        }
        if (key in this.constantStrings) {
          if (form.controls[key].disabled) {
            continue;
          }

          this.valuesToConfirm.push(this.matchString(key.toString(), form.controls[key].value.toString()));

        }
      }

    }
    if (!this.project_application_report_allowed) {
      this.valuesToConfirm.push('Dissemination allowed: No');
    }

  }

  checkVOstatus(): void {
    this.voService.isVo().subscribe((result: IResponseTemplate) => {
      this.is_vo_admin = <boolean><Boolean>result.value;
    })
  }

  count_platform(checked: boolean): void {
    if (checked) {
      this.dissemination_platform_count++;
    } else {
      this.dissemination_platform_count--;
    }
  }

  /**
   * Check if shortname is valid.
   * @param {string} shortname
   */
  public checkShortname(shortname: string): void {
    this.invalid_shortname = !/^[a-zA-Z0-9\s]*$/.test(shortname);
  }

  /**
   * gets a list of all available Flavors from the flavorservice and puts them into the array flavorList
   */
  getListOfFlavors(): void {
    this.flavorService.getListOfFlavorsAvailable().subscribe((flavors: Flavor[]) => this.flavorList = flavors);
  }

  /**
   * Gets a list of all available types of flavors from the flavorservice and uses them in the function setListOfTypes
   */
  getListOfTypes(): void {
    this.flavorService.getListOfTypesAvailable().subscribe((types: FlavorType[]) => {
      this.setListOfTypes(types)
    });
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

  checkIfMinVmIsSelected(): void {
    for (const fl of this.flavorList) {
      const control: string = `project_application_${fl.name}`;
      if (control in this.application_form.controls) {
        if (this.application_form.controls[control].value > 0) {
          this.simple_vm_min_vm = true;

          return;
        }
      }
    }

    this.simple_vm_min_vm = false;

    return;
  }

  /**
   * Submit simple vm application.
   * @param {NgForm} form
   */
  onSubmit(form: NgForm): void {
    this.error = null;
    if (this.invalid_shortname) {
      this.updateNotificationModal(
        'Failed',
        'The application was not submitted, please check the required fields and try again.',
        true,
        'danger');
      this.notificationModalStay = true;
    } else {
      const values: { [key: string]: string | number | boolean } = {};
      values['project_application_openstack_project'] = this.openstack_project;
      values['project_application_initial_credits'] = this.credits;
      for (const value in form.controls) {
        if (form.controls[value].disabled) {
          continue;
        }
        if (form.controls[value].value) {
          values[value] = form.controls[value].value;
        }
      }

      this.applicationsservice.addNewApplication(values).toPromise()
        .then((application: any) => {
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
   * Sends a request to the BE to get the initital credits for a new application.
   */
  calculateInitialCredits(form: NgForm): void {

    const lifetime: number = form.controls['project_application_lifetime'].value;
    this.creditsService.getCreditsForApplication(this.totalNumberOfCores, this.totalRAM, lifetime).toPromise()
      .then((credits: number) => {
        this.credits = credits;
      }).catch((err: any) => console.log(err));

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
    values['project_application_openstack_project'] = this.openstack_project;
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
