import ***REMOVED***Component***REMOVED*** from '@angular/core';
import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';
import ***REMOVED***NgForm***REMOVED*** from '@angular/forms';
import ***REMOVED***SpecialHardwareService***REMOVED*** from '../api-connector/special-hardware.service'
import ***REMOVED***SpecialHardware***REMOVED*** from './special_hardware.model'
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service'
import ***REMOVED***ApplicationsService***REMOVED*** from '../api-connector/applications.service'
import ***REMOVED***Observable***REMOVED*** from 'rxjs';
import ***REMOVED***FlavorService***REMOVED*** from '../api-connector/flavor.service';
import ***REMOVED***Flavor***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavor';
import ***REMOVED***FlavorType***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavorType';
import ***REMOVED***forEach***REMOVED*** from '@angular/router/src/utils/collection';
import ***REMOVED***AbstractBaseClasse***REMOVED*** from "../shared_modules/baseClass/abstract-base-class";
import ***REMOVED***environment***REMOVED*** from "../../environments/environment";

@Component(***REMOVED***
    templateUrl: 'addcloudapplication.component.html',
    providers: [SpecialHardwareService, ApiSettings, ApplicationsService, FlavorService],
    styleUrls: ['addcloudapplication.component.css']
***REMOVED***)

export class AddcloudapplicationComponent extends AbstractBaseClasse ***REMOVED***

    public production = environment.production;

    /**
     * List of all collapse booleans.
     */
    public collapseList: boolean[];

    public project_application_report_allowed = false;


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
    public project_application_vms_requested = 5;
    /**
     * List of flavors.
     */
    public flavorList: Flavor[];
    /**
     * List of flavor types.
     */
    public typeList: FlavorType[];
    /**
     * List of all collapse booleans.
     */
    F
    /**
     * Total number of cores.
     * @type ***REMOVED***number***REMOVED***
     */
    public totalNumberOfCores = 0;
    /**
     * Total number of ram.
     * @type ***REMOVED***number***REMOVED***
     */
    public totalRAM = 0;
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


    public acknowledgeModalMessage: string = 'The development and support of the cloud is possible above all through the funding of the cloud infrastructure by the Federal Ministry of Education and Research (BMBF)!\n' +
        'We would highly appreciate the following citation in your next publication(s): ‘This work was supported by the BMBF-funded de.NBI Cloud within the German Network for Bioinformatics Infrastructure (de.NBI) (031A537B, 031A533A, 031A538A, 031A533B, 031A535A, 031A537C, 031A534A, 031A532B).';
    public acknowledgeModalTitle: string = 'Acknowledge';
    public acknowledgeModalType: string = 'info';

    /**
     * If project is openstack project (everytime true)
     * @type ***REMOVED***boolean***REMOVED***
     */
    project_application_openstack_project: boolean = true;
    /**
     * List of special hardwares.
     * @type ***REMOVED***any[]***REMOVED***
     */
    special_hardware: SpecialHardware[] = new Array();

    /**
     * Constructor.
     * Initialize special hardware and gets list of flavor and flavortypes.
     * @param ***REMOVED***SpecialHardwareService***REMOVED*** specialhardwareservice
     * @param ***REMOVED***ApplicationsService***REMOVED*** applicationsservice
     * @param ***REMOVED***FlavorService***REMOVED*** flavorservice
     */
    constructor(private specialhardwareservice: SpecialHardwareService,
                private  applicationsservice: ApplicationsService, private flavorservice: FlavorService) ***REMOVED***
        super();
        this.getSpecialHardware();
        this.getListOfFlavors();
        this.getListOfTypes();


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
                    return (this.constantStrings[key] + val + ' months');
                ***REMOVED***
                case ('project_application_volume_limit'): ***REMOVED***
                    return (this.constantStrings[key] + val + ' GB');
                ***REMOVED***
                case 'project_application_object_storage': ***REMOVED***
                    return (this.constantStrings[key] + val + ' GB');
                ***REMOVED***
                case 'project_application_report_allowed': ***REMOVED***
                    if (val) ***REMOVED***
                        return (this.constantStrings[key] + 'Yes');
                    ***REMOVED***
                    else ***REMOVED***
                        return (this.constantStrings[key] + 'No');
                    ***REMOVED***
                ***REMOVED***
                default: ***REMOVED***
                    return (this.constantStrings[key] + val);
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***

    /**
     * Fills the array constantStrings with values dependent of keys which are used to indicate inputs from the application-form
     */
    generateConstants() ***REMOVED***
        this.constantStrings = new Array();
        this.constantStrings['project_application_lifetime'] = 'Lifetime of your project: ';
        this.constantStrings['project_application_volume_counter'] = 'Number of volumes for additional storage: ';
        this.constantStrings['project_application_object_storage'] = 'Additional object storage: ';
        this.constantStrings['project_application_volume_limit'] = 'Additional storage space for your VMs: ';
        this.constantStrings['project_application_institute'] = 'Your institute: ';
        this.constantStrings['project_application_workgroup'] = 'Your Workgroup: ';
        this.constantStrings['project_application_report_allowed'] = 'Dissemination allowed: ';

        for (let key in this.flavorList) ***REMOVED***
            if (key in this.flavorList) ***REMOVED***
                this.constantStrings['project_application_' + this.flavorList[key].name] =
                    'Number of VMs of type ' + this.flavorList[key].name + ': ';
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***

    keyIsVM(key: string): Flavor ***REMOVED***
        for (let fkey in this.flavorList) ***REMOVED***
            if (fkey in this.flavorList) ***REMOVED***
                if (this.flavorList[fkey].name === key.substring(20)) ***REMOVED***
                    return this.flavorList[fkey];
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
        return null;

    ***REMOVED***

    /**
     * Uses the data from the application form to fill the confirmation-modal with information.
     * @param f the application form with corresponding data
     */
    filterEnteredData(f: NgForm) ***REMOVED***
        this.generateConstants();
        this.totalNumberOfCores = 0;
        this.totalRAM = 0;
        this.valuesToConfirm = new Array();
        for (let key in f.controls) ***REMOVED***
            if (f.controls[key].value) ***REMOVED***
                if (key === 'project_application_name') ***REMOVED***
                    this.projectName = f.controls[key].value;
                    if (this.projectName.length > 50) ***REMOVED***
                        this.projectName = this.projectName.substring(0, 50) + '...';
                    ***REMOVED***
                ***REMOVED***
                if (key in this.constantStrings) ***REMOVED***
                    console.log(key)
                    this.valuesToConfirm.push(this.matchString(key.toString(), f.controls[key].value.toString()));

                    var flavor: Flavor = this.keyIsVM(key.toString());
                    if (flavor != null) ***REMOVED***
                        this.totalNumberOfCores = this.totalNumberOfCores + (flavor.vcpus * f.controls[key].value);
                        this.totalRAM = this.totalRAM + (flavor.ram * f.controls[key].value)
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
        if (!this.project_application_report_allowed) ***REMOVED***
            this.valuesToConfirm.push("Dissemination allowed: No")
        ***REMOVED***

    ***REMOVED***

    /**
     * gets a list of all available Flavors from the flavorservice and puts them into the array flavorList
     */
    getListOfFlavors() ***REMOVED***
        this.flavorservice.getListOfFlavorsAvailable().subscribe(flavors => this.flavorList = flavors);
    ***REMOVED***

    /**
     * gets a list of all available types of flavors from the flavorservice and uses them in the function setListOfTypes
     */
    getListOfTypes() ***REMOVED***
        this.flavorservice.getListOfTypesAvailable().subscribe(types => this.setListOfTypes(types));
    ***REMOVED***


    /**
     * Uses the param types to safe the available FlavorTypes to the array typeList.
     * Also it fills the array collapseList with booleans of value 'false' so all flavor-categories are shown in the application form.
     * @param types array of all available FlavorTypes
     */
    setListOfTypes(types: FlavorType[]) ***REMOVED***
        this.typeList = types;
        this.collapseList = new Array(types.length) as Array<boolean>;
        for (let i = 0; i < types.length; i++) ***REMOVED***

            this.collapseList.push(false); //AS FIX
        ***REMOVED***
        for (let t of this.typeList) ***REMOVED***
            if (t.long_name === 'Standart Flavor') ***REMOVED***
                this.collapseList[this.typeList.indexOf(t)]=true;
            ***REMOVED***
            break;
        ***REMOVED***

    ***REMOVED***


    /**
     * Get all Special Hardware.
     */
    getSpecialHardware() ***REMOVED***
        this.specialhardwareservice.getAllSpecialHardware().toPromise()
            .then(result => ***REMOVED***
                let res = result;
                for (let key in res) ***REMOVED***
                    let shj = res[key];
                    let sh = new SpecialHardware(shj['special_hardware_id'], shj['special_hardware_key'], shj['special_hardware_name']);
                    this.special_hardware.push(sh)
                ***REMOVED***
            ***REMOVED***);
    ***REMOVED***


    /**
     * Submits a new cloud application.
     * Therefore checks if the different values are valid.
     * @param ***REMOVED***NgForm***REMOVED*** f
     */
    onSubmit(f: NgForm) ***REMOVED***
        this.error = null;
        if (this.wronginput == true) ***REMOVED***

            this.updateNotificationModal('Failed', 'The application was not submitted, please check the required fields and try again.', true, 'danger');
            this.notificationModalStay = true;
        ***REMOVED***
        else ***REMOVED***
            let values: ***REMOVED*** [key: string]: any ***REMOVED*** = ***REMOVED******REMOVED***;
            values['project_application_special_hardware'] = this.special_hardware.filter(hardware => hardware.Checked).map(hardware => hardware.Id)
            values['project_application_openstack_project'] = this.project_application_openstack_project;
            for (let v in f.controls) ***REMOVED***
                if (f.controls[v].value) ***REMOVED***

                    values[v] = f.controls[v].value;
                ***REMOVED***
            ***REMOVED***
            this.applicationsservice.addNewApplication(values).toPromise()
                .then(result => ***REMOVED***
                    this.updateNotificationModal('Success', 'The application was submitted', true, 'success');
                    this.notificationModalStay = false;
                ***REMOVED***).catch(error => ***REMOVED***
                var error_json = error
                this.error = []
                for (let key of Object.keys(error_json)) ***REMOVED***
                    this.error.push(key.split('_',)[2])

                ***REMOVED***


                this.updateNotificationModal('Failed', 'The application was not submitted, please check the required fields and try again.', true, 'danger');
                this.notificationModalStay = true;
            ***REMOVED***)
        ***REMOVED***
    ***REMOVED***


    sendTestApplication() ***REMOVED***
        let values: ***REMOVED*** [key: string]: any ***REMOVED*** = ***REMOVED******REMOVED***;

        values['project_application_comment'] = 'TestApplication';
        values['project_application_description'] = 'TestApplication';
        values['project_application_institute'] = 'TestApplication';
        values['project_application_lifetime'] = 3;
        values['project_application_name'] = 'TestApplication';
        values['project_application_openstack_project'] = true;
        for (let f of this.flavorList) ***REMOVED***
            let fname = 'project_application_' + f.name;
            values[fname] = 1;
        ***REMOVED***
        values['project_application_report_allowed'] = true;
        values['project_application_shortname'] = 'TestApplication';
        values['project_application_special_hardware'] = [1, 2];
        values['project_application_volume_counter'] = 5;
        values['project_application_volume_limit'] = 20;
        values['project_application_workgroup'] = 'TestApplication';

        this.applicationsservice.addNewApplication(values).toPromise()
            .then(result => ***REMOVED***
                this.updateNotificationModal('Success', 'The application was submitted', true, 'success');
                this.notificationModalStay = false;
            ***REMOVED***).catch(error => ***REMOVED***
            var error_json = error
            this.error = []
            for (let key of Object.keys(error_json)) ***REMOVED***
                this.error.push(key.split('_',)[2])

            ***REMOVED***


            this.updateNotificationModal('Failed', 'The application was not submitted, please check the required fields and try again.', true, 'danger');
            this.notificationModalStay = true;
        ***REMOVED***)


    ***REMOVED***


    /**
     * Check if shortname is valid.
     * @param ***REMOVED***string***REMOVED*** shortname
     */
    public checkShortname(shortname: string) ***REMOVED***
        if (/^[a-zA-Z0-9\s]*$/.test(shortname) == false) ***REMOVED***
            this.wronginput = true;
        ***REMOVED***
        else ***REMOVED***
            this.wronginput = false;
        ***REMOVED***
    ***REMOVED***
***REMOVED***


