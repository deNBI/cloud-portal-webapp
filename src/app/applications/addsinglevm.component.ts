import ***REMOVED***Component***REMOVED*** from '@angular/core';
import ***REMOVED***NgForm***REMOVED*** from '@angular/forms';
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service'
import ***REMOVED***ApplicationsService***REMOVED*** from '../api-connector/applications.service'
import ***REMOVED***AbstractBaseClasse***REMOVED*** from '../shared/shared_modules/baseClass/abstract-base-class';
import ***REMOVED***Flavor***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavor';
import ***REMOVED***FlavorService***REMOVED*** from '../api-connector/flavor.service';
import ***REMOVED***environment***REMOVED*** from '../../environments/environment';
import ***REMOVED***FlavorType***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavorType';
import ***REMOVED***ApplicationBaseClass***REMOVED*** from "../shared/shared_modules/baseClass/application-base-class";

/**
 * Component to create single vm applications.
 */
@Component(***REMOVED***
    selector: 'app-addsinglevm',
    templateUrl: 'addsinglevm.component.html',
    providers: [FlavorService, ApiSettings, ApplicationsService]
***REMOVED***)
export class AddsinglevmComponent extends ApplicationBaseClass ***REMOVED***

    /**
     * List of flavor types.
     */
    public typeList: FlavorType[];
    /**
     * List of all collapse booleans.
     */
    public collapseList: boolean[];

    /**
     * Check if the shortname provided is valid.
     * @type ***REMOVED***boolean***REMOVED***
     */
    public wronginput: boolean = false;

    /**
     * List of flavors.
     */
    public flavorList: Flavor[];

    public production: boolean = environment.production;
    public error: string[];
    public project_application_vms_requested: number = 3;
    public project_application_report_allowed: boolean = false;

    public acknowledgeModalTitle: string = 'Acknowledge';
    public acknowledgeModalType: string = 'info';

    constructor( applicationsservice: ApplicationsService, private flavorService: FlavorService) ***REMOVED***
        super(null, null, applicationsservice, null);
        this.getListOfFlavors();
        this.getListOfTypes();

    ***REMOVED***

    checkIfTypeGotSimpleVmFlavor(type: FlavorType): boolean ***REMOVED***
        for (const flav of this.flavorList) ***REMOVED***
            if (flav.type.shortcut === type.shortcut && flav.simple_vm) ***REMOVED***
                return true
            ***REMOVED***

        ***REMOVED***
        return false

    ***REMOVED***


    /**
     * Gets a list of all available types of flavors from the flavorservice and uses them in the function setListOfTypes
     */
    getListOfTypes(): void ***REMOVED***
        this.flavorService.getListOfTypesAvailable().subscribe((types: FlavorType[]) => this.setListOfTypes(types));
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
     * Submit simple vm application.
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
            for (const value in form.controls) ***REMOVED***
                if (form.controls[value].value) ***REMOVED***
                    values[value] = form.controls[value].value;
                ***REMOVED***
            ***REMOVED***

            this.applicationsservice.addNewApplication(values).toPromise()
                .then(() => ***REMOVED***
                    this.updateNotificationModal('Success', 'The application was submitted', true, 'success');
                    this.notificationModalStay = false;
                ***REMOVED***).catch((error: object) => ***REMOVED***
                const error_json: object = error;
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

    /**
     * gets a list of all available Flavors from the flavorservice and puts them into the array flavorList
     */
    getListOfFlavors(): void ***REMOVED***
        this.flavorService.getListOfFlavorsAvailable().subscribe((flavors: Flavor[]) => this.flavorList = flavors);
    ***REMOVED***


    /**
     * Check if shortname is valid.
     * @param ***REMOVED***string***REMOVED*** shortname
     */
    public checkShortname(shortname: string): void ***REMOVED***
        this.wronginput = !/^[a-zA-Z0-9\s]*$/.test(shortname);
    ***REMOVED***

    sendTestApplication(): void ***REMOVED***
        const values: ***REMOVED*** [key: string]: string | number | boolean ***REMOVED*** = ***REMOVED******REMOVED***;

        values['project_application_comment'] = 'TestApplication';
        values['project_application_description'] = 'TestApplication';
        values['project_application_institute'] = 'TestApplication';
        values['project_application_lifetime'] = 3;
        values['project_application_name'] = 'TestApplication';
        values['project_application_openstack_project'] = false;
        for (const flavor of this.flavorList) ***REMOVED***
            const fname: string = `project_application_$***REMOVED***flavor.name***REMOVED***`;
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
            ***REMOVED***).catch((error: object) => ***REMOVED***
            const error_json: object = error;
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
