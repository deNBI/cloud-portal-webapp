import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ApiSettings} from '../api-connector/api-settings.service'
import {ApplicationsService} from '../api-connector/applications.service'
import {FlavorService} from '../api-connector/flavor.service';
import {Flavor} from '../virtualmachines/virtualmachinemodels/flavor';
import {FlavorType} from '../virtualmachines/virtualmachinemodels/flavorType';
import {environment} from '../../environments/environment';
import {ApplicationBaseClass} from 'app/shared/shared_modules/baseClass/application-base-class';

/**
 * This components provides the functions to create a new Cloud Application.
 */
@Component({
             selector: 'app-addcloudapplication',
             templateUrl: 'addcloudapplication.component.html',
             providers: [ApiSettings, ApplicationsService, FlavorService],
             styleUrls: ['addcloudapplication.component.css']
           })

export class AddcloudapplicationComponent extends ApplicationBaseClass implements OnInit {

  /**
   * Fields for getting dissemination options for platforms.
   */
  public platform_newsletter: boolean;
  public platform_twitter: boolean;
  public platform_landing_page: boolean;
  public platform_portal_news: boolean;

  /**
   * Fileds for getting dissemination options for information.
   */
  public information_title: string;
  public information_description: string;
  public information_resources: boolean;
  public information_higher_projects: boolean;
  public information_runtime: boolean;
  public information_pi_name: boolean;
  public information_institution: boolean;
  public information_workgroup: boolean;
  public information_project_type: boolean;

  public public_description_enabled: boolean;


  /**
   * If it is in production or dev mode.
   * @type {boolean}
   */
  public production: boolean = environment.production;

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
  public collapseList: boolean[];

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
   * Constructor.
   * Initialize special hardware and gets list of flavor and flavortypes.
   * @param {ApplicationsService} applicationsservice
   * @param {FlavorService} flavorservice
   */
  constructor(applicationsservice: ApplicationsService, private flavorservice: FlavorService) {
    super(null, null, applicationsservice, null);

  }

  ngOnInit(): void {
    this.getListOfFlavors();
    this.getListOfTypes();
  }

  /**
   * Gets a list of all available types of flavors from the flavorservice and uses them in the function setListOfTypes
   */
  getListOfTypes(): void {
    this.flavorservice.getListOfTypesAvailable().subscribe((types: FlavorType[]) => this.setListOfTypes(types));
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
      for (const value in form.controls) {
        if (form.controls[value].disabled) {
          continue;
        }
        if (form.controls[value].value) {

          values[value] = form.controls[value].value;
        }
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

}
