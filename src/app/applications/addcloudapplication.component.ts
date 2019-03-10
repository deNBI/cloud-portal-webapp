import ***REMOVED***Component***REMOVED*** from '@angular/core';
import ***REMOVED***NgForm***REMOVED*** from '@angular/forms';
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service'
import ***REMOVED***ApplicationsService***REMOVED*** from '../api-connector/applications.service'
import ***REMOVED***FlavorService***REMOVED*** from '../api-connector/flavor.service';
import ***REMOVED***Flavor***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavor';
import ***REMOVED***FlavorType***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavorType';
import ***REMOVED***AbstractBaseClasse***REMOVED*** from '../shared_modules/baseClass/abstract-base-class';
import ***REMOVED***environment***REMOVED*** from '../../environments/environment';

/**
 * This components provides the functions to create a new Cloud Application.
 */
@Component(***REMOVED***
    templateUrl: 'addcloudapplication.component.html',
    providers: [ApiSettings, ApplicationsService, FlavorService],
    styleUrls: ['addcloudapplication.component.css']
***REMOVED***)

export class AddcloudapplicationComponent extends AbstractBaseClasse ***REMOVED***

    /**
     * If it is in production or dev mode.
     * @type ***REMOVED***boolean***REMOVED***
     */
    public production: boolean = environment.production;

    /**
     * List of all collapse booleans.
     */
    public collapseList: boolean[];

    public project_application_report_allowed: boolean = false;

    /**
     * If shortname is valid.
     * @type ***REMOVED***boolean***REMOVED***
     */
    public wronginput: boolean = false;

    /**
     * Contains errors recieved when submitting an application.
     */
    public error: string[];
    /**
     * Default vms requested in form.
     * @type ***REMOVED***number***REMOVED***
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
     * @type ***REMOVED***number***REMOVED***
     */
    public totalNumberOfCores: number = 0;
    /**
     * Total number of ram.
     * @type ***REMOVED***number***REMOVED***
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
     * @type ***REMOVED***boolean***REMOVED*** if it is a openstack project
     */
    project_application_openstack_project: boolean = true;

    /**
     * Constructor.
     * Initialize special hardware and gets list of flavor and flavortypes.
     * @param ***REMOVED***ApplicationsService***REMOVED*** applicationsservice
     * @param ***REMOVED***FlavorService***REMOVED*** flavorservice
     */
    constructor(private applicationsservice: ApplicationsService, private flavorservice: FlavorService) ***REMOVED***
        super();
        this.getListOfFlavors();
        this.getListOfTypes();

    ***REMOVED***

    /**
     * Uses the data from the application form to fill the confirmation-modal with information.
     * @param form the application form with corresponding data
     */
    filterEnteredData(form: NgForm): void ***REMOVED***
        this.generateConstants();
        this.totalNumberOfCores = 0;
        this.totalRAM = 0;
        this.valuesToConfirm = [];
        for (const key in form.controls) ***REMOVED***
            if (form.controls[key].value) ***REMOVED***
                if (key === 'project_application_name') ***REMOVED***
                    this.projectName = form.controls[key].value;
                    if (this.projectName.length > 50) ***REMOVED***
                        this.projectName = `$***REMOVED***this.projectName.substring(0, 50)***REMOVED***...`;
                    ***REMOVED***
                ***REMOVED***
                if (key in this.constantStrings) ***REMOVED***
                    this.valuesToConfirm.push(this.matchString(key.toString(), form.controls[key].value.toString()));

                    const flavor: Flavor = this.keyIsVM(key.toString());
                    if (flavor != null) ***REMOVED***
                        this.totalNumberOfCores = this.totalNumberOfCores + (flavor.vcpus * form.controls[key].value);
                        const ram: number = flavor.ram * form.controls[key].value;
                        this.totalRAM = this.totalRAM + ram
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
        if (!this.project_application_report_allowed) ***REMOVED***
            this.valuesToConfirm.push('Dissemination allowed: No')
        ***REMOVED***

    ***REMOVED***

    /**
     * Fills the array constantStrings with values dependent of keys which are used to indicate inputs from the application-form
     */
    generateConstants(): void ***REMOVED***
        this.constantStrings = [];
        this.constantStrings['project_application_lifetime'] = 'Lifetime of your project: ';
        this.constantStrings['project_application_volume_counter'] = 'Number of volumes for additional storage: ';
        this.constantStrings['project_application_object_storage'] = 'Additional object storage: ';
        this.constantStrings['project_application_volume_limit'] = 'Additional storage space for your VMs: ';
        this.constantStrings['project_application_institute'] = 'Your institute: ';
        this.constantStrings['project_application_workgroup'] = 'Your Workgroup: ';
        this.constantStrings['project_application_report_allowed'] = 'Dissemination allowed: ';

        for (const key in this.flavorList) ***REMOVED***
            if (key in this.flavorList) ***REMOVED***
                this.constantStrings[`project_application_ $***REMOVED***this.flavorList[key].name***REMOVED***`] =
                    `Number of VMs of type  $***REMOVED***this.flavorList[key].name***REMOVED***: `;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***

    keyIsVM(key: string): Flavor ***REMOVED***
        for (const fkey in this.flavorList) ***REMOVED***
            if (fkey in this.flavorList) ***REMOVED***
                if (this.flavorList[fkey].name === key.substring(20)) ***REMOVED***
                    return this.flavorList[fkey];
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***

        return null;

    ***REMOVED***

    /**
     * This function concatenates a given key combined with a given value to a string
     * which is used on the confirmation-modal.
     * @param key the key to access a string in the array constantStrings
     * @param val the value that is concatenated with the string from the array and an optional addition (depending on the key)
     * @returns the concatenated string for the confirmation-modal
     */
    matchString(key: string, val: string): string ***REMOVED***
        if (key in this.constantStrings) ***REMOVED***
            switch (key) ***REMOVED***
                case 'project_application_lifetime': ***REMOVED***
                    return (`$***REMOVED***this.constantStrings[key]***REMOVED***$***REMOVED***val***REMOVED*** months`);
                ***REMOVED***
                case ('project_application_volume_limit'): ***REMOVED***
                    return (`$***REMOVED***this.constantStrings[key]***REMOVED***$***REMOVED***val***REMOVED*** GB`);
                ***REMOVED***
                case 'project_application_object_storage': ***REMOVED***
                    return (`$***REMOVED***this.constantStrings[key]***REMOVED***$***REMOVED***val***REMOVED***  GB`);
                ***REMOVED***
                case 'project_application_report_allowed': ***REMOVED***
                    if (val) ***REMOVED***
                        return (`$***REMOVED***this.constantStrings[key]***REMOVED***$***REMOVED***val***REMOVED*** Yes`);
                    ***REMOVED*** else ***REMOVED***
                        return (`$***REMOVED***this.constantStrings[key]***REMOVED*** No`);
                    ***REMOVED***
                ***REMOVED***
                default: ***REMOVED***
                    return (this.constantStrings[key] + val);
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***

    /**
     * Gets a list of all available types of flavors from the flavorservice and uses them in the function setListOfTypes
     */
    getListOfTypes(): void ***REMOVED***
        this.flavorservice.getListOfTypesAvailable().subscribe((types: FlavorType[]) => this.setListOfTypes(types));
    ***REMOVED***

    /**
     * Uses the param types to safe the available FlavorTypes to the array typeList.
     * Also it fills the array collapseList with booleans of value 'false' so all flavor-categories are shown in the application form.
     * @param types array of all available FlavorTypes
     */
    setListOfTypes(types: FlavorType[]): void ***REMOVED***
        this.typeList = types;
        this.collapseList = new Array(types.length) as boolean[];
        for (const type of types) ***REMOVED***

            this.collapseList.push(false); // AS FIX
            if (type.long_name === 'Standart Flavor') ***REMOVED***
                this.collapseList[this.typeList.indexOf(type)] = true;
            ***REMOVED***
        ***REMOVED***

    ***REMOVED***

    /**
     * gets a list of all available Flavors from the flavorservice and puts them into the array flavorList
     */
    getListOfFlavors(): void ***REMOVED***
        this.flavorservice.getListOfFlavorsAvailable().subscribe((flavors: Flavor[]) => this.flavorList = flavors);
    ***REMOVED***

    /**
     * Submits a new cloud application.
     * Therefore checks if the different values are valid.
     * @param ***REMOVED***NgForm***REMOVED*** form
     */
    onSubmit(form: NgForm): void ***REMOVED***
        this.error = null;
        if (this.wronginput) ***REMOVED***

            this.updateNotificationModal(
                'Failed',
                'The application was not submitted, please check the required fields and try again.',
                true,
                'danger');
            this.notificationModalStay = true;
        ***REMOVED*** else ***REMOVED***
            const values: ***REMOVED*** [key: string]: string | number | boolean ***REMOVED*** = ***REMOVED******REMOVED***;
            values['project_application_openstack_project'] = this.project_application_openstack_project;
            for (const value in form.controls) ***REMOVED***
                if (form.controls[value].value) ***REMOVED***

                    values[value] = form.controls[value].value;
                ***REMOVED***
            ***REMOVED***
            this.applicationsservice.addNewApplication(values).toPromise()
                .then(() => ***REMOVED***
                    this.updateNotificationModal('Success', 'The application was submitted', true, 'success');
                    this.notificationModalStay = false;
                ***REMOVED***).catch((error: string) => ***REMOVED***
                const error_json: string = error;
                this.error = [];
                for (const key of Object.keys(error_json)) ***REMOVED***
                    this.error.push(key.split('_')[2])

                ***REMOVED***

                this.updateNotificationModal(
                    'Failed',
                    'The application was not submitted, please check the required fields and try again.',
                    true,
                    'danger');
                this.notificationModalStay = true;
            ***REMOVED***)
        ***REMOVED***
    ***REMOVED***

    sendTestApplication(): void ***REMOVED***
        const values: ***REMOVED*** [key: string]: string | number | boolean ***REMOVED*** = ***REMOVED******REMOVED***;

        values['project_application_comment'] = 'TestApplication';
        values['project_application_description'] = 'TestApplication';
        values['project_application_institute'] = 'TestApplication';
        values['project_application_lifetime'] = 3;
        values['project_application_name'] = 'TestApplication';
        values['project_application_openstack_project'] = true;
        for (const flavor of this.flavorList) ***REMOVED***
            const fname: string = `project_application_ $***REMOVED***flavor.name***REMOVED***`;
            values[fname] = 1;
        ***REMOVED***
        values['project_application_report_allowed'] = true;
        values['project_application_shortname'] = 'TestApplication';
        values['project_application_volume_counter'] = 5;
        values['project_application_volume_limit'] = 20;
        values['project_application_workgroup'] = 'TestApplication';

        this.applicationsservice.addNewApplication(values).toPromise()
            .then(() => ***REMOVED***
                this.updateNotificationModal('Success', 'The application was submitted', true, 'success');
                this.notificationModalStay = false;
            ***REMOVED***).catch((error: string) => ***REMOVED***
            const error_json: string = error;
            this.error = [];
            for (const key of Object.keys(error_json)) ***REMOVED***
                this.error.push(key.split('_')[2])

            ***REMOVED***

            this.updateNotificationModal(
                'Failed',
                'The application was not submitted, please check the required fields and try again.',
                true,
                'danger');
            this.notificationModalStay = true;
        ***REMOVED***)

    ***REMOVED***

    /**
     * Check if shortname is valid.
     * @param ***REMOVED***string***REMOVED*** shortname
     */
    public checkShortname(shortname: string): void ***REMOVED***
        this.wronginput = !/^[a-zA-Z0-9\s]*$/.test(shortname);
    ***REMOVED***
***REMOVED***
