import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ApiSettings} from '../api-connector/api-settings.service'
import {ApplicationsService} from '../api-connector/applications.service'
import {FlavorService} from '../api-connector/flavor.service';
import {Flavor} from '../virtualmachines/virtualmachinemodels/flavor';
import {FlavorType} from '../virtualmachines/virtualmachinemodels/flavorType';
import {environment} from '../../environments/environment';
import {ApplicationBaseClassComponent} from 'app/shared/shared_modules/baseClass/application-base-class.component';
import {EdamOntologyTerm} from './edam-ontology-term';
import {AutocompleteComponent} from 'angular-ng-autocomplete';
import {ApplicationDissemination} from './application-dissemination';
import {FullLayoutComponent} from '../layouts/full-layout.component';
import {CreditsService} from '../api-connector/credits.service';
import {IResponseTemplate} from '../api-connector/response-template';
import {VoService} from '../api-connector/vo.service';

/**
 * This components provides the functions to create a new Cloud Application.
 */
@Component({
             selector: 'app-addcloudapplication',
             templateUrl: 'addcloudapplication.component.html',
             providers: [ApiSettings, ApplicationsService, FlavorService, CreditsService, VoService],
             styleUrls: ['addcloudapplication.component.css']
           })

export class AddcloudapplicationComponent extends ApplicationBaseClassComponent implements OnInit {

  title: string = 'New OpenStack Application';
  /**
   * Fields for getting dissemination options for platforms.
   */

  public application_dissemination: ApplicationDissemination = new ApplicationDissemination();

  /**
   * If it is in production or dev mode.
   * @type {boolean}
   */
  public production: boolean = environment.production;

  public edam_ontology_terms: EdamOntologyTerm[];

  new_application_id: string | number;

  @ViewChild('edam_ontology') edam_ontology: AutocompleteComponent;

  /**
   * Boolean indicating whether information selection accordion is open or not.
   * @type {boolean}
   */
  public dissemination_information_open: boolean = true;

  /**
   * List of all collapse booleans.
   */
  public collapseList: boolean[];

  dissemination_platform_count: number = 0;

  ontology_search_keyword: string = 'term';

  selected_ontology_terms: EdamOntologyTerm[] = [];

  /**
   * Contains errors recieved when submitting an application.
   */
  public error: string[];
  /**
   * Default vms requested in form.
   * @type {number}
   */
  public project_application_vms_requested: number = 5;
  /**
   * List of flavors.
   */
  public flavorList: Flavor[];
  /**
   * List of flavor types.
   */
  public typeList: FlavorType[];

  public acknowledgeModalTitle: string = 'Acknowledge';
  public acknowledgeModalType: string = 'info';

  /**
   * If project is openstack project (everytime true)
   * @type {boolean} if it is a openstack project
   */
  project_application_openstack_project: boolean = true;

  /**
   * The credit value, computed after the user finished selecting the arguments
   * @type {number}
   */
  credits: number = 0;

  /**
   * If user is vo.
   * @type {boolean}
   */
  is_vo_admin: boolean = false;

  /**
   * Constructor.
   * Initialize special hardware and gets list of flavor and flavortypes.
   * @param {ApplicationsService} applicationsservice
   * @param {CreditsService} creditsService
   * @param {FlavorService} flavorservice
   * @param {FullLayoutComponent} fullLayout
   * @param {VoService} voservice
   */
  constructor(applicationsservice: ApplicationsService, private creditsService: CreditsService,
              private flavorservice: FlavorService, private fullLayout: FullLayoutComponent, private voservice: VoService) {
    super(null, null, applicationsservice, null);
  }

  ngOnInit(): void {
    this.getListOfFlavors();
    this.getListOfTypes();
    this.applicationsservice.getEdamOntologyTerms().subscribe((terms: EdamOntologyTerm[]) => {
      this.edam_ontology_terms = terms;
    });
    this.checkVOstatus()
  }

  /**
   * Gets a list of all available types of flavors from the flavorservice and uses them in the function setListOfTypes
   */
  getListOfTypes(): void {
    this.flavorservice.getListOfTypesAvailable().subscribe((types: FlavorType[]) => {
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

  /**
   * gets a list of all available Flavors from the flavorservice and puts them into the array flavorList
   */
  getListOfFlavors(): void {
    this.flavorservice.getListOfFlavorsAvailable().subscribe((flavors: Flavor[]) => this.flavorList = flavors);
  }

  removeEDAMterm(term: EdamOntologyTerm): void {
    const indexOf: number = this.selected_ontology_terms.indexOf(term);
    this.selected_ontology_terms.splice(indexOf, 1);

  }

  selectEvent(item: any): void {
    if (this.selected_ontology_terms.indexOf(item) === -1) {
      this.selected_ontology_terms.push(item);
    }
    this.edam_ontology.clear();
  }

  /**
   * Sends a request to the BE to get the initital credits for a new application.
   */
  calculateInitialCredits(form: NgForm): void {
    const lifetime = form.controls['project_application_lifetime'].value;
    this.creditsService.getCreditsForApplication(this.totalNumberOfCores, this.totalRAM, lifetime).toPromise()
      .then((credits: number) => {
        this.credits = credits;
      }).catch(err => console.log(err));
  }

  /**
   * Submits a new cloud application.
   * Therefore checks if the different values are valid.
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
      values['project_application_openstack_project'] = this.project_application_openstack_project;
      values['project_application_pi_approved'] = this.project_application_pi_approved;
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
          if (this.project_application_report_allowed) {
            this.applicationsservice.setApplicationDissemination(application['project_application_id'],
                                                                 this.application_dissemination).subscribe()

          }
          this.new_application_id = application['project_application_id'];
          this.applicationsservice.addEdamOntologyTerms(this.new_application_id, this.selected_ontology_terms).subscribe();
          this.updateNotificationModal('Success', 'The application was submitted', true, 'success');
          this.fullLayout.getGroupsEnumeration();
          this.notificationModalStay = false;
        }).catch((error: string) => {
        const error_json: string = error;
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
   * Creates a test application
   * @param name of the new test application
   */
  sendTestApplication(name: string): void {
    const values: { [key: string]: string | number | boolean } = {};

    values['project_application_bmbf_project'] = 'BMBF';
    values['project_application_horizon2020'] = 'horizon';
    values['project_application_pi_approved'] = true;
    values['project_application_responsibility'] = true;
    values['project_application_comment'] = 'TestApplication';
    values['project_application_description'] = 'TestApplication';
    values['project_application_institute'] = 'TestApplication';
    values['project_application_lifetime'] = 3;
    values['project_application_name'] = name;
    values['project_application_object_storage'] = 3;
    values['project_application_openstack_project'] = true;
    values['project_application_report_allowed'] = true;
    values['project_application_shortname'] = name.substr(0, 15);
    values['project_application_volume_counter'] = 5;
    values['project_application_volume_limit'] = 20;
    values['project_application_workgroup'] = 'TestApplication';
    values['project_application_initial_credits'] = 5952;

    for (const flavor of this.flavorList) {
      const fname: string = `project_application_${flavor.name}`;
      values[fname] = 1;
    }

    this.applicationsservice.addNewApplication(values).toPromise()
      .then(() => {
        this.updateNotificationModal('Success', 'The application was submitted', true, 'success');
        this.notificationModalStay = false;
      }).catch((error: string) => {
      const error_json: string = error;
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

  count_platform(checked: boolean): void {
    if (checked) {
      this.dissemination_platform_count++;
    } else {
      this.dissemination_platform_count--;
    }
  }

  /**
   * Check vm status.
   * @param {UserService} userservice
   */
  checkVOstatus(): void {
    this.voservice.isVo().subscribe((result: IResponseTemplate) => {
      this.is_vo_admin = <boolean><Boolean>result.value;
    })
  }
}
