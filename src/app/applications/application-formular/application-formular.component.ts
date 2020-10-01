import {ChangeDetectionStrategy, Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Flavor} from '../../virtualmachines/virtualmachinemodels/flavor';
import {FlavorService} from '../../api-connector/flavor.service';
import {FlavorType} from '../../virtualmachines/virtualmachinemodels/flavorType';
import {environment} from '../../../environments/environment';
import {EdamOntologyTerm} from '../edam-ontology-term';
import {AutocompleteComponent} from 'angular-ng-autocomplete';
import {ApplicationsService} from '../../api-connector/applications.service';
import {ApplicationBaseClassComponent} from '../../shared/shared_modules/baseClass/application-base-class.component';
import {FullLayoutComponent} from '../../layouts/full-layout.component';
import {CreditsService} from '../../api-connector/credits.service';
import {Application} from '../application.model/application.model';
import {is_vo} from '../../shared/globalvar';

/**
 * Application formular component.
 */
@Component({
             selector: 'app-application-formular',
             templateUrl: './application-formular.component.html',
             styleUrls: ['./application-formular.component.scss'],
             providers: [FlavorService, ApplicationsService, CreditsService]
           })
export class ApplicationFormularComponent extends ApplicationBaseClassComponent implements OnInit {

  @Input() openstack_project: boolean = false;
  @Input() simple_vm_project: boolean = false;
  @Input() title: string;
  @Input() application: Application;
  @Input() is_validation: boolean = false;
  @Input() hash: string;

  edam_ontology_terms: EdamOntologyTerm[] = [];
  isLoaded: boolean = false;
  submitting: boolean = false;
  test_name: string = '';
  all_dissemination_checked: boolean = false;
  initiated_validation: boolean = false;
  dissemination_platform_count: number = 0;
  flavorList: Flavor[] = [];
  production: boolean = environment.production;
  dissemination_information_open: boolean = true;
  invalid_shortname: boolean = false;
  simple_vm_min_vm: boolean = false;
  error: string[];

  acknowledgeModalTitle: string = 'Acknowledge';
  acknowledgeModalType: string = 'info';

  application_id: string | number;
  ontology_search_keyword: string = 'term';
  @ViewChild('edam_ontology', { static: true }) edam_ontology: AutocompleteComponent;
  @ViewChild(NgForm, { static: true }) application_form: NgForm;

  /**
   * List of flavor types.
   */
  public typeList: FlavorType[] = [];
  /**
   * List of all collapse booleans.
   */
  public collapseList: boolean[];

  constructor(private creditsService: CreditsService,
              private flavorService: FlavorService, private fullLayout: FullLayoutComponent,
              applicationsservice: ApplicationsService) {
    super(null, null, applicationsservice, null);

  }

  ngOnInit(): void {
    this.getListOfFlavors();
    this.getListOfTypes();
    this.is_vo_admin = is_vo;

    if (this.openstack_project) {
      this.simple_vm_min_vm = true;
    }
    this.applicationsservice.getEdamOntologyTerms().subscribe((terms: EdamOntologyTerm[]): void => {
      this.edam_ontology_terms = terms;
      this.initiateFormWithApplication();
    })
  }

  onAllDissChange(event: any): void {
    if (this.all_dissemination_checked) {
      this.application.dissemination.setAllInformationTrue();
    } else {
      this.application.dissemination.setAllInformationFalse();
    }
  }

  clearApplication(): void {
    this.application = new Application(null);
    this.application.project_application_openstack_project = this.openstack_project;
    if (this.openstack_project) {
      this.application.project_application_object_storage = 0;
    }
    this.application.project_application_volume_counter = 3;
    this.application.project_application_volume_limit = 20;
  }

  initiateFormWithApplication(): void {
    if (this.application && !this.initiated_validation && this.is_validation) {
      this.openstack_project = this.application.project_application_openstack_project;
      this.simple_vm_project = !this.openstack_project;
      this.searchTermsInEdamTerms();

      if (this.application.dissemination.someAllowed()) {
        this.project_application_report_allowed = true;

      }
      if (this.simple_vm_project) {
        this.simple_vm_min_vm = this.application.flavors.length > 0
      }
      this.initiated_validation = true
    } else {
      this.application = new Application(null);
      this.application.project_application_openstack_project = this.openstack_project;
      if (this.openstack_project) {
        this.application.project_application_object_storage = 0;
      }
      this.application.project_application_volume_counter = 3;
      this.application.project_application_volume_limit = 20;
    }
    this.isLoaded = true;
  }

  checkIfTypeGotSimpleVmFlavor(type: FlavorType): boolean {
    for (const flav of this.flavorList) {
      if (flav.type.shortcut === type.shortcut && flav.simple_vm) {
        return true
      }

    }

    return false

  }

  selectEvent(item: EdamOntologyTerm): void {
    this.application.addEdamTerm(item);
  }

  onChangeFlavor(flavor: Flavor, value: number): void {
    this.application.setFlavorInFlavors(flavor, value);
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
    if (!this.application.project_application_report_allowed) {
      this.valuesToConfirm.push('Dissemination allowed: No');
    } else {
      const disseminationInformation: string[] = this.application.dissemination.allowed_informations
        .concat(this.application.dissemination.allowed_platforms)
      for (const value of disseminationInformation) {
        // tslint:disable-next-line:prefer-template
        this.valuesToConfirm.push('Dissemination allowed on: ' + value)
      }
    }
    if (!this.application.project_application_sensitive_data) {
      this.valuesToConfirm.push('Sensitive Data: No');
    } else {
      this.valuesToConfirm.push('Sensitive Data: Yes');
    }

    if (!this.application.project_application_workshop) {
      this.valuesToConfirm.push('Workshops: No');
    } else {
      this.valuesToConfirm.push('Workshops: Yes');
    }

    if (this.openstack_project) {
      if (!this.application.project_application_openstack_basic_introduction) {
        this.valuesToConfirm.push('Training: No');
      } else {
        this.valuesToConfirm.push('Training: Yes');
      }
      if (!this.application.project_application_cloud_service) {
        this.valuesToConfirm.push('CloudService: No');
      } else {
        this.valuesToConfirm.push('CloudService: Yes');
      }
    }
    let research: string = 'Research Topics: ';
    for (const term of this.application.project_application_edam_terms) {
      research = research.concat(` ${term.term},`);
    }
    this.valuesToConfirm.push(research);
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
    this.flavorService.getListOfFlavorsAvailable().subscribe((flavors: Flavor[]): Flavor[] => this.flavorList = flavors);
  }

  /**
   * Gets a list of all available types of flavors from the flavorservice and uses them in the function setListOfTypes
   */
  getListOfTypes(): void {
    this.flavorService.getListOfTypesAvailable().subscribe((types: FlavorType[]): void => {
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
    this.simple_vm_min_vm = this.application.flavors.length > 0

  }

  searchTermsInEdamTerms(): void {
    const tmp: EdamOntologyTerm[] = [];
    // tslint:disable-next-line:no-for-each-push typedef
    this.application.project_application_edam_terms.forEach(ele => {
      // tslint:disable-next-line:typedef
      // @ts-ignore
      // tslint:disable-next-line:typedef
      const td = this.edam_ontology_terms.find(term => term.term === ele);
      tmp.push(td)

    });
    this.application.project_application_edam_terms = tmp;
  }

  onSubmit(): void {
    this.error = null;
    this.submitting = true;

    this.applicationsservice.addNewApplication(this.application).subscribe(
      (application: Application): void => {
        this.clearApplication();
        this.submitting = false;
        this.application_id = application.project_application_id

        this.updateNotificationModal('Success', 'The application was submitted', true, 'success');
        this.fullLayout.getGroupsEnumeration();

        this.notificationModalStay = false;
      },
      (error: object): void => {
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

  /**
   * Sends a request to the BE to get the initital credits for a new application.
   */
  calculateInitialCredits(form: NgForm): void {
    this.creditsService.getCreditsForApplication(
      this.application.flavors,
      this.application.project_application_lifetime).toPromise()
      .then((credits: number): void => {
        this.application.project_application_initial_credits = credits
      }).catch((err: any): void => console.log(err));

  }

  approveApplication(form: NgForm): any {
    this.calculateInitialCredits(form);
    this.application_id = this.application.project_application_id;
    this.applicationsservice.validateApplicationAsPIByHash(
      this.hash, this.application).subscribe((): void => {
                                               this.fullLayout.getGroupsEnumeration();

                                               this.updateNotificationModal(
                                                 'Success',
                                                 'The application was successfully approved.',
                                                 true,
                                                 'success');
                                               this.notificationModalStay = false;

                                             },
                                             (): void => {
                                               this.updateNotificationModal(
                                                 'Failed',
                                                 'The application was not successfully approved.',
                                                 true,
                                                 'danger');
                                               this.notificationModalStay = true;

                                             })
  }

  /**
   * Creates a test application
   * @param name of the new test application
   */
  sendTestApplication(name: string): void {
    const default_flav: Flavor = this.flavorList.find((fl: Flavor): boolean => {
      return fl.name === 'de.NBI default'
    });

    this.application.project_application_bmbf_project = 'BMBF';
    this.application.project_application_horizon2020 = 'horizon';
    this.application.setFlavorInFlavors(default_flav, 3);
    this.application.project_application_pi_approved = true;
    this.application.project_application_comment = 'TestApplication';
    this.application.project_application_description = 'TestApplication';
    this.application.project_application_institute = 'TestApplication';
    this.application.project_application_lifetime = 3;
    this.application.project_application_name = name;
    this.application.project_application_openstack_project = this.openstack_project;
    this.application.project_application_report_allowed = false;
    this.application.project_application_shortname = name.substr(0, 15);
    this.application.project_application_volume_counter = 3;
    this.application.project_application_volume_limit = 20;
    this.application.project_application_workgroup = 'TestApplication';
    this.application.project_application_initial_credits = 5952;

    this.applicationsservice.addNewApplication(this.application).subscribe(
      (application: Application): void => {
        this.clearApplication();
        this.submitting = false;
        this.application_id = application.project_application_id
        this.updateNotificationModal('Success', 'The application was submitted', true, 'success');
        this.notificationModalStay = false;
        this.fullLayout.getGroupsEnumeration();
      },
      (error: object): void => {
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

  toggleProjectPart(checked: boolean, project_part: string): void {
    switch (project_part) {
      case 'horizon': {
        if (!checked) {
          this.application.project_application_horizon2020 = '';
        }
        break;
      }
      case 'elixir': {
        if (!checked) {
          this.application.project_application_elixir_project = '';
        }
        break
      }
      case 'bmbf': {
        if (!checked) {
          this.application.project_application_bmbf_project = '';
        }
        break
      }
      default: {
        break
      }

    }

  }

}
