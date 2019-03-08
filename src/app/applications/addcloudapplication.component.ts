import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ApiSettings} from '../api-connector/api-settings.service'
import {ApplicationsService} from '../api-connector/applications.service'
import {FlavorService} from '../api-connector/flavor.service';
import {Flavor} from '../virtualmachines/virtualmachinemodels/flavor';
import {FlavorType} from '../virtualmachines/virtualmachinemodels/flavorType';
import {AbstractBaseClasse} from '../shared_modules/baseClass/abstract-base-class';
import {environment} from '../../environments/environment';

/**
 * This components provides the functions to create a new Cloud Application.
 */
@Component({
    templateUrl: 'addcloudapplication.component.html',
    providers: [ApiSettings, ApplicationsService, FlavorService],
    styleUrls: ['addcloudapplication.component.css']
})

export class AddcloudapplicationComponent extends AbstractBaseClasse {

    public production: boolean = environment.production;

    /**
     * List of all collapse booleans.
     */
    public collapseList: boolean[];

    public project_application_report_allowed: boolean = false;

    /**
     * If shortname is valid.
     * @type {boolean}
     */
    public wronginput: boolean = false;

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
    /**
     * Values to confirm.
     */
    public valuesToConfirm: string[];
    /**
     *
     */
    public constantStrings: Object;

    /**
     * Name of the project.
     */
    public projectName: string;
    public acknowledgeModalTitle: string = 'Acknowledge';
    public acknowledgeModalType: string = 'info';

    /**
     * If project is openstack project (everytime true)
     * @type {boolean}
     */
    project_application_openstack_project: boolean = true;

    /**
     * Constructor.
     * Initialize special hardware and gets list of flavor and flavortypes.
     * @param {ApplicationsService} applicationsservice
     * @param {FlavorService} flavorservice
     */
    constructor(private applicationsservice: ApplicationsService, private flavorservice: FlavorService) {
        super();
        this.getListOfFlavors();
        this.getListOfTypes();

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
                        return (`${this.constantStrings[key]}${val} Yes`);
                    } else {
                        return (`${this.constantStrings[key]} No`);
                    }
                }
                default: {
                    return (this.constantStrings[key] + val);
                }
            }
        }
    }

    /**
     * Fills the array constantStrings with values dependent of keys which are used to indicate inputs from the application-form
     */
    generateConstants(): void {
        this.constantStrings = [];
        this.constantStrings['project_application_lifetime'] = 'Lifetime of your project: ';
        this.constantStrings['project_application_volume_counter'] = 'Number of volumes for additional storage: ';
        this.constantStrings['project_application_object_storage'] = 'Additional object storage: ';
        this.constantStrings['project_application_volume_limit'] = 'Additional storage space for your VMs: ';
        this.constantStrings['project_application_institute'] = 'Your institute: ';
        this.constantStrings['project_application_workgroup'] = 'Your Workgroup: ';
        this.constantStrings['project_application_report_allowed'] = 'Dissemination allowed: ';

        for (const key in this.flavorList) {
            if (key in this.flavorList) {
                this.constantStrings[`project_application_ ${this.flavorList[key].name}`] =
                    `Number of VMs of type  ${this.flavorList[key].name}: `;
            }
        }
    }

    keyIsVM(key: string): Flavor {
        for (const fkey in this.flavorList) {
            if (fkey in this.flavorList) {
                if (this.flavorList[fkey].name === key.substring(20)) {
                    return this.flavorList[fkey];
                }
            }
        }

        return null;

    }

    /**
     * Uses the data from the application form to fill the confirmation-modal with information.
     * @param f the application form with corresponding data
     */
    filterEnteredData(f: NgForm): void {
        this.generateConstants();
        this.totalNumberOfCores = 0;
        this.totalRAM = 0;
        this.valuesToConfirm = [];
        for (const key in f.controls) {
            if (f.controls[key].value) {
                if (key === 'project_application_name') {
                    this.projectName = f.controls[key].value;
                    if (this.projectName.length > 50) {
                        this.projectName = `${this.projectName.substring(0, 50)}...`;
                    }
                }
                if (key in this.constantStrings) {
                    this.valuesToConfirm.push(this.matchString(key.toString(), f.controls[key].value.toString()));

                    const flavor: Flavor = this.keyIsVM(key.toString());
                    if (flavor != null) {
                        this.totalNumberOfCores = this.totalNumberOfCores + (flavor.vcpus * f.controls[key].value);
                        this.totalRAM = this.totalRAM + (flavor.ram * f.controls[key].value)
                    }
                }
            }
        }
        if (!this.project_application_report_allowed) {
            this.valuesToConfirm.push('Dissemination allowed: No')
        }

    }

    /**
     * gets a list of all available Flavors from the flavorservice and puts them into the array flavorList
     */
    getListOfFlavors(): void {
        this.flavorservice.getListOfFlavorsAvailable().subscribe((flavors: Flavor[]) => this.flavorList = flavors);
    }

    /**
     * gets a list of all available types of flavors from the flavorservice and uses them in the function setListOfTypes
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
        for (const t of types) {

            this.collapseList.push(false); // AS FIX
            if (t.long_name === 'Standart Flavor') {
                this.collapseList[this.typeList.indexOf(t)] = true;
            }
        }

    }

    /**
     * Submits a new cloud application.
     * Therefore checks if the different values are valid.
     * @param {NgForm} f
     */
    onSubmit(f: NgForm): void {
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
            for (const v in f.controls) {
                if (f.controls[v].value) {

                    values[v] = f.controls[v].value;
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

    sendTestApplication(): void {
        const values: { [key: string]: string | number | boolean } = {};

        values['project_application_comment'] = 'TestApplication';
        values['project_application_description'] = 'TestApplication';
        values['project_application_institute'] = 'TestApplication';
        values['project_application_lifetime'] = 3;
        values['project_application_name'] = 'TestApplication';
        values['project_application_openstack_project'] = true;
        for (const f of this.flavorList) {
            const fname: string = `project_application_ ${f.name}`;
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

    /**
     * Check if shortname is valid.
     * @param {string} shortname
     */
    public checkShortname(shortname: string): void {
        if (!/^[a-zA-Z0-9\s]*$/.test(shortname)) {
            this.wronginput = true;
        } else {
            this.wronginput = false;
        }
    }
}
