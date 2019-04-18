import {Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ApiSettings} from '../api-connector/api-settings.service'
import {ApplicationsService} from '../api-connector/applications.service'
import {Flavor} from '../virtualmachines/virtualmachinemodels/flavor';
import {FlavorService} from '../api-connector/flavor.service';
import {environment} from '../../environments/environment';
import {FlavorType} from '../virtualmachines/virtualmachinemodels/flavorType';
import {ApplicationBaseClass} from "../shared/shared_modules/baseClass/application-base-class";

/**
 * Component to create single vm applications.
 */
@Component({
    selector: 'app-addsimplevm',
    templateUrl: 'addsimplevm.component.html',
    providers: [FlavorService, ApiSettings, ApplicationsService]
})
export class AddsimplevmComponent extends ApplicationBaseClass {

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

    constructor(applicationsservice: ApplicationsService, private flavorService: FlavorService) {
        super(null, null, applicationsservice, null);
        this.applicationsservice.getApplicationValidationByHash('7b6be61cdfdc48ca99048c4525c05612').subscribe(res =>{
          console.log(res)
        })
        this.applicationsservice.validateApplicationAsPIByHash('7b6be61cdfdc48ca99048c4525c05612').subscribe()
        this.getListOfFlavors()
        this.getListOfTypes();

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

    sendTestApplication(): void {
        const values: { [key: string]: string | number | boolean } = {};

        values['project_application_comment'] = 'TestApplication';
        values['project_application_description'] = 'TestApplication';
        values['project_application_institute'] = 'TestApplication';
        values['project_application_lifetime'] = 3;
        values['project_application_name'] = 'TestApplication';
        values['project_application_openstack_project'] = false;
        for (const flavor of this.flavorList) {
            const fname: string = `project_application_${flavor.name}`;
            values[fname] = 1;
        }
        values['project_application_report_allowed'] = true;
        values['project_application_shortname'] = 'TestApplication';
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
