import {Component} from '@angular/core';
import {ApplicationsService} from '../api-connector/applications.service'
import {ApplicationStatusService} from '../api-connector/application-status.service'
import {ApiSettings} from '../api-connector/api-settings.service'
import {Application} from './application.model';
import {ApplicationStatus} from './application_status.model';
import {GroupService} from '../api-connector/group.service';
import {UserService} from '../api-connector/user.service';
import {ApplicationExtension} from './application_extension.model';
import {NgForm} from '@angular/forms';
import {VoService} from '../api-connector/vo.service';
import {ComputecenterComponent} from '../projectmanagement/computecenter.component';
import {FacilityService} from '../api-connector/facility.service';
import {AbstractBaseClasse} from '../shared_modules/baseClass/abstract-base-class';
import {FlavorType} from '../virtualmachines/virtualmachinemodels/flavorType';
import {Flavor} from '../virtualmachines/virtualmachinemodels/flavor';
import {FlavorService} from '../api-connector/flavor.service';
import {Client} from '../virtualmachines/virtualmachinemodels/vmclient';

/**
 * Application Overview component.
 */
@Component({
    templateUrl: 'applications.component.html',
    providers: [FacilityService, VoService, UserService, GroupService, ApplicationStatusService,
        ApplicationsService, ApiSettings, FlavorService]
})
export class ApplicationsComponent extends AbstractBaseClasse {

    /**
     * Limits information for Client tested/used for Simple Vm Project creation.
     */
    notificationClientInfo: Client[] = [];

    /**
     * Applications of the user viewing the Application overview.
     * @type {Array}
     */
    user_applications: Application[] = [];

    /**
     * If the user is a vo admin.
     * @type {boolean}
     */
    is_vo_admin: boolean = false;

    /**
     * All Applications, just visibile for a vo admin.
     * @type {Array}
     */
    all_applications: Application[] = [];

    /**
     * Stati of the differen Applications.
     * @type {Array}
     */

    application_status: ApplicationStatus[] = [];

    /**
     * All available compute centers.
     * @type {Array}
     */
    computeCenters: ComputecenterComponent[] = [];

    /**
     * Selected Application.
     */
    selectedApplication: Application;

    /**
     * Id of the extension status.
     * @type {number}
     */
    extension_status: number = 0;
    /**
     * Id of Application set for deletion.
     */
    public deleteId: number;

    /**
     * If all userApplications are loaded, important for the loader.
     * @type {boolean}
     */
    isLoaded_userApplication: boolean = false;

    /**
     * If all Applications are loaded, important for the loader.
     * @type {boolean}
     */
    isLoaded_AllApplication: boolean = false;

    /**
     * User which requested the Application {id: Elixir Id of user : {name and email}}.
     * @type {{}}
     */
    application_user: { [id: string]: { [id: string]: string } } = {};

    private APPROVED_STATUS: number = 2;
    private WAIT_FOR_EXTENSION_STATUS: number = 6;

    /**
     * List of flavors.
     */public flavorList: Flavor[];

    /**
     * List of flavor types.
     */
    public typeList: FlavorType[];
    /**
     * List of all collapse booleans.
     */
    public collapseList: boolean[];
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
     * Constructor.
     * Loads all Applications if user is vo admin and all user_applications.
     * @param {ApplicationsService} applicationsservice
     * @param {ApplicationStatusService} applicationstatusservice
     * @param {UserService} userservice
     * @param {GroupService} groupservice
     * @param {VoService} voService
     * @param {FacilityService} facilityService
     * @param {FlavorService} flavorService
     */
    constructor(private applicationsservice: ApplicationsService,
                private applicationstatusservice: ApplicationStatusService,
                private userservice: UserService,
                private groupservice: GroupService,
                private voService: VoService,
                private facilityService: FacilityService,
                private flavorService: FlavorService) {

        super();
        this.voService.isVo().subscribe((result: { [key: string]: boolean }) => {
            this.is_vo_admin = result['Is_Vo_Manager'];
            this.getUserApplications();
            this.getApplicationStatus();
            if (this.is_vo_admin) {
                this.getAllApplications();
                this.getComputeCenters();

            } else {
                this.isLoaded_AllApplication = true;

            }

        });
        this.getListOfFlavors();
        this.getListOfTypes();
    }

    /**
     * Checks if the key given represents a flavor and if so returns the respective Flavor
     * @param key the key which is checked
     */
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
     * Resets the values of totalRAM und totalNumberOfCores to 0 and changes the text at the end of the extension form.
     * @param elemIDcores the ID of the label containing the number of cores
     * @param elemIDram the ID of the label containing the amount of RAM
     */
    protected unsetValues(elemIDcores: string, elemIDram: string): void {
        this.totalRAM = 0;
        this.totalNumberOfCores = 0;
        document.getElementById(elemIDcores).innerHTML = `Number of total cores:  ${this.totalNumberOfCores.toString()}`;
        document.getElementById(elemIDram).innerHTML = `Total amout of RAM:  ${this.totalRAM.toString()} GB`;

    }

    /**
     * Called whenvalues of the flavor-input-fields are changed and if so changes the values shown at the end of the form.
     * @param form the form which contains the input-fields
     */
    protected valuesChanged(form: NgForm): void {

        this.totalRAM = 0;
        this.totalNumberOfCores = 0;
        for (const key in form.controls) {
            if (form.controls[key].value) {
                const flavor: Flavor = this.keyIsVM(key.toString());
                if (flavor != null) {
                    this.totalNumberOfCores = this.totalNumberOfCores + (flavor.vcpus * form.controls[key].value);
                    this.totalRAM = this.totalRAM + (flavor.ram * form.controls[key].value);
                }
            }
        }

        document.getElementById('corenumbers').innerHTML = `Number of total cores:  ${this.totalNumberOfCores.toString()}`;
        document.getElementById('ramnumbers').innerHTML = `Total amout of RAM:  ${this.totalRAM.toString()} GB`;

    }

    /**
     * gets a list of all available Flavors from the flavorservice and puts them into the array flavorList
     */
    getListOfFlavors(): void {
        this.flavorService.getListOfFlavorsAvailable().subscribe((flavors: Flavor[]) => this.flavorList = flavors);
    }

    /**
     * gets a list of all available types of flavors from the flavorservice and uses them in the function setListOfTypes
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
        for (const t of types) {

            this.collapseList.push(false); // AS FIX
            if (t.long_name === 'Standart Flavor') {
                this.collapseList[this.typeList.indexOf(t)] = true;
            }
        }

    }

    /**
     * Gets all available compute centers and saves them in the computeCenters attribute.
     */
    getComputeCenters(): void {
        this.facilityService.getComputeCenters().subscribe((result: [{ [key: string]: string }]) => {
            for (const cc of result) {
                const compute_center: ComputecenterComponent = new ComputecenterComponent(
                    cc['compute_center_facility_id'],
                    cc['compute_center_name'],
                    cc['compute_center_login'],
                    cc['compute_center_support_mail']);
                this.computeCenters.push(compute_center)
            }

        })
    }

    /**
     * Gets all affialiations from a user.
     * @param {number} user
     */
    getUserAffilaitions(user: number): void {
        this.userservice.getuserAffiliations(user).subscribe()
    }

    /**
     * Sets the selected application.
     * @param application
     */
    setSelectedApplication(application: Application): void {
        this.selectedApplication = application;

    }

    /**
     * Submits an renewal request for an application.
     * @param {NgForm} form
     */
    onSubmit(form: NgForm): void {
        const values: { [key: string]: string | number | boolean } = {};
        for (const value in form.controls) {
            if (form.controls[value].value) {
                values[value] = form.controls[value].value;
            }
        }
        values['project_application_id'] = this.selectedApplication.Id;
        values['total_cores_new'] = this.totalNumberOfCores;
        values['total_ram_new'] = this.totalRAM;
        this.requestExtension(values);

    }

    /**
     * Sets the default values in the request renewal form.
     * @param {NgForm} form
     */
    ngFormSetDefault(form: NgForm): void {
        form.reset({
            project_application_renewal_vms_requested: this.selectedApplication.VMsRequested,
            project_application_renewal_cores_per_vm: this.selectedApplication.CoresPerVM,
            project_application_renewal_ram_per_vm: this.selectedApplication.RamPerVM,
            project_application_renewal_volume_limit: this.selectedApplication.VolumeLimit,
            project_application_renewal_volume_counter: this.selectedApplication.VolumeCounter,
            project_application_renewal_object_storage: this.selectedApplication.ObjectStorage,
            project_application_renewal_comment: this.selectedApplication.Comment

        })

    }

    /**
     * Gets all Application of the user viewing the application overview.
     * Saves them in the userApplication array.
     */
    getUserApplications(): void {
        this.applicationsservice
            .getUserApplications().subscribe((result: [{ [key: string]: string }]) => {
            const res: [{ [key: string]: string }] = result;
            if (Object.keys(res).length === 0) {
                this.isLoaded_userApplication = true;
            }
            for (const key in res) {
                if (res.hasOwnProperty(key)) {
                    const aj: object = res[key];
                    const newApp: Application = new Application();
                    newApp.Id = aj['project_application_id'];
                    newApp.Name = aj['project_application_name'];
                    newApp.Shortname = aj['project_application_shortname'];
                    newApp.Lifetime = aj['project_application_lifetime'];
                    newApp.DateSubmitted = aj['project_application_date_submitted'];
                    newApp.Status = aj['project_application_status']['application_status_name'];
                    newApp.Description = aj['project_application_description'];
                    newApp.VMsRequested = aj['project_application_vms_requested'];
                    newApp.RamPerVM = aj['project_application_ram_per_vm'];
                    newApp.TotalRam = aj['project_application_total_ram'];
                    newApp.TotalCores = aj['project_application_total_cores'];
                    newApp.CoresPerVM = aj['project_application_cores_per_vm'];
                    newApp.VolumeLimit = aj['project_application_volume_limit'];
                    newApp.VolumeCounter = aj['project_application_volume_counter'];
                    newApp.ObjectStorage = aj['project_application_object_storage'];
                    newApp.OpenStackProject = aj['project_application_openstack_project'];
                    newApp.Comment = aj['project_application_comment'];
                    newApp.PerunId = aj['project_application_perun_id'];
                    newApp.DateApproved = aj['project_application_date_approved'];
                    newApp.Dissemination = aj['project_application_report_allowed'];
                    newApp.Horizon2020 = aj['project_application_horizon2020'];

                    for (const flavor of aj['flavors']) {
                        newApp.addFlavorToCurrent(
                            flavor.flavor_name, flavor.counter, flavor.tag, flavor.ram,
                            flavor.rootdisk, flavor.vcpus, flavor.gpu, flavor.epheremal_disk)

                    }

                    if (aj['projectapplicationrenewal']) {
                        const newExtension: ApplicationExtension = new ApplicationExtension();
                        let requestExtensionTotalCores: number = 0;
                        let requestExtensionTotalRam: number = 0;

                        for (const flavor of aj['projectapplicationrenewal']['flavors']) {
                            newExtension.addFlavorToRequested(
                                flavor.flavor_name, flavor.counter, flavor.tag, flavor.ram, flavor.rootdisk,
                                flavor.vcpus, flavor.gpu, flavor.epheremal_disk);
                            requestExtensionTotalCores += flavor.vcpus * flavor.counter;
                            requestExtensionTotalRam += flavor.ram * flavor.counter

                        }

                        newExtension.TotalRAM = requestExtensionTotalRam;
                        newExtension.TotalCores = requestExtensionTotalCores;

                        newExtension.Id = aj['projectapplicationrenewal']['project_application'];
                        newExtension.Lifetime = aj['projectapplicationrenewal']['project_application_renewal_lifetime'];
                        newExtension.VolumeLimit = aj['projectapplicationrenewal']['project_application_renewal_volume_limit'];
                        newExtension.VolumeCounter = aj['projectapplicationrenewal']['project_application_renewal_volume_counter'];
                        newExtension.VMsRequested = aj['projectapplicationrenewal']['project_application_renewal_vms_requested'];
                        newExtension.Comment = aj['projectapplicationrenewal']['project_application_renewal_comment'];
                        newExtension.CoresPerVM = aj['projectapplicationrenewal']['project_application_renewal_cores_per_vm'];
                        newExtension.ObjectStorage = aj['projectapplicationrenewal']['project_application_renewal_object_storage'];
                        newExtension.RamPerVM = aj['projectapplicationrenewal']['project_application_renewal_ram_per_vm'];
                        newExtension.Comment = aj['projectapplicationrenewal']['project_application_renewal_comment'];

                        newApp.ApplicationExtension = newExtension;
                    }
                    this.user_applications.push(newApp)
                }
            }
            this.isLoaded_userApplication = true;

        });
    }

    /**
     * Returns a string with the end-date of a application which depends on the day it was approved and the lifetime in months
     * @param approval date in string when the application was approved
     * @param months number of months the application is permitted
     */
    getEndDate(approval: string, months: number): string {
        let date1: Date = new Date(Number(approval.substring(0, 4)), Number(approval.substring(5, 7)) - 1, Number(approval.substring(8)));
        const m: number = date1.getMonth();
        if ((m + months) > 11) {
            date1 = new Date(date1.getFullYear(), (m + months - 12), date1.getDate());
        } else {
            date1.setMonth(date1.getMonth() + months);
        }

        return `${date1.getFullYear()}-${this.fillUp((date1.getMonth() + 1).toString())}-${this.fillUp(date1.getDate().toString())}`;
    }

    fillUp(date: string): string {
        if (date.length === 1) {
            return `0${date}`;
        }

        return date;
    }

    showLifetime(sa?: Application): string {
        if (!sa) {
            return
        }

        return `${sa.DateApproved} - ${this.getEndDate(sa.DateApproved, sa.Lifetime)}`;
    }

    /**
     * Get all possible application stati.
     */
    getApplicationStatus(): void {
        this.applicationstatusservice.getAllApplicationStatus().toPromise()
            .then((result: object) => {
                const res: object = result;
                for (const key in res) {
                    if (res[key]) {
                        const asj: object = res[key];
                        const aj: ApplicationStatus = new ApplicationStatus(asj['application_status_id'], asj['application_status_name']);
                        this.application_status.push(aj)
                    }
                }
            });
    }

    /**
     * Get all Applications if user is admin.
     */
    getAllApplications(): void {
        // todo check if user is VO Admin

        if (this.is_vo_admin) {
            this.applicationsservice.getAllApplications().subscribe((res: object) => {
                if (Object.keys(res).length === 0) {
                    this.isLoaded_AllApplication = true;
                }

                for (const key in res) {
                    if (res.hasOwnProperty(key)) {

                        const aj: object = res[key];
                        const newApp: Application = new Application();
                        newApp.Id = aj['project_application_id'];

                        newApp.Name = aj['project_application_name'];
                        newApp.Shortname = aj['project_application_shortname'];
                        newApp.Description = aj['project_application_description'];
                        newApp.Lifetime = aj['project_application_lifetime'];

                        newApp.ObjectStorage = aj['project_application_object_storage'];
                        newApp.OpenStackProject = aj['project_application_openstack_project'];

                        newApp.ObjectStorage = aj['project_application_object_storage'];
                        newApp.SpecialHardware = aj['project_application_special_hardware'];

                        newApp.Institute = aj['project_application_institute'];
                        newApp.Workgroup = aj['project_application_workgroup'];
                        newApp.DateApproved = aj['project_application_date_approved'];

                        newApp.DateSubmitted = aj['project_application_date_submitted'];
                        newApp.DateStatusChanged = aj['project_application_date_status_changed'];
                        newApp.User = aj['project_application_user']['username'];
                        newApp.UserAffiliations = aj['project_application_user']['profile']['affiliations'];
                        newApp.UserEmail = aj['project_application_user']['email'];
                        newApp.Status = aj['project_application_status'];
                        newApp.Dissemination = aj['project_application_report_allowed'];
                        newApp.Horizon2020 = aj['project_application_horizon2020'];

                        for (const flavor of aj['flavors']) {
                            newApp.addFlavorToCurrent(
                                flavor.flavor_name, flavor.counter, flavor.tag, flavor.ram,
                                flavor.rootdisk, flavor.vcpus, flavor.gpu, flavor.epheremal_disk)

                        }
                        if (newApp.Status === this.APPROVED_STATUS) {

                            newApp.DaysRunning = Math.ceil((Math.abs(Date.now() - new Date(newApp.DateStatusChanged).getTime()))
                                / (1000 * 3600 * 24));

                            newApp.Comment = aj['project_application_comment'];
                            newApp.PerunId = aj['project_application_perun_id'];
                            if (aj['projectapplicationrenewal']) {
                                const r: ApplicationExtension = new ApplicationExtension();
                                let requestExtensionTotalCores: number = 0;
                                let requestExtensionTotalRam: number = 0;

                                newApp.Comment = aj['project_application_comment'];
                                newApp.PerunId = aj['project_application_perun_id'];
                                newApp.OpenStackProject = aj['project_application_openstack_project'];

                                for (const flavor of aj['projectapplicationrenewal']['flavors']) {
                                    r.addFlavorToRequested(
                                        flavor.flavor_name,
                                        flavor.counter,
                                        flavor.tag,
                                        flavor.ram,
                                        flavor.rootdisk,
                                        flavor.vcpus,
                                        flavor.gpu,
                                        flavor.epheremal_disk);
                                    requestExtensionTotalCores += flavor.vcpus * flavor.counter;
                                    requestExtensionTotalRam += flavor.ram * flavor.counter;

                                    r.TotalRAM = requestExtensionTotalRam;
                                    r.TotalCores = requestExtensionTotalCores;

                                    r.Id = aj['projectapplicationrenewal']['project_application'];
                                    r.Lifetime = aj['projectapplicationrenewal']['project_application_renewal_lifetime'];
                                    r.VolumeLimit = aj['projectapplicationrenewal']['project_application_renewal_volume_limit'];
                                    r.VolumeCounter = aj['projectapplicationrenewal']['project_application_renewal_volume_counter'];
                                    r.VMsRequested = aj['projectapplicationrenewal']['project_application_renewal_vms_requested'];
                                    r.Comment = aj['projectapplicationrenewal']['project_application_renewal_comment'];
                                    r.CoresPerVM = aj['projectapplicationrenewal']['project_application_renewal_cores_per_vm'];
                                    r.ObjectStorage = aj['projectapplicationrenewal']['project_application_renewal_object_storage'];
                                    r.RamPerVM = aj['projectapplicationrenewal']['project_application_renewal_ram_per_vm'];
                                    r.Comment = aj['projectapplicationrenewal']['project_application_renewal_comment'];

                                    newApp.ApplicationExtension = r;

                                }

                            }
                        }
                        this.all_applications.push(newApp);

                        this.isLoaded_AllApplication = true;
                        for (const app of this.all_applications) {
                            if (app.Status === this.application_statuses.WAIT_FOR_CONFIRMATION ||
                                app.Status === this.application_statuses.MODIFICATION_REQUESTED) {
                                this.getFacilityProject(app);
                            }
                        }

                    }
                }
            });
        } else {
            this.isLoaded_AllApplication = true;

        }

    }

    /**
     * Get the facility of an application.
     * @param {Application} app
     */
    public getFacilityProject(app: Application): void {

        if (!app.ComputeCenter && app.Status.toString() !== 'submitted') {
            this.groupservice.getFacilityByGroup(app.PerunId.toString()).subscribe((res: object) => {
                const login: string = res['Login'];
                const suport: string = res['Support'];
                const facilityname: string = res['Facility'];
                const facilityId: number = res['FacilityId'];

                app.ComputeCenter = new ComputecenterComponent(facilityId.toString(), facilityname, login, suport);

            })
        }

    }

    /**
     * Updates an application with the actual values.
     * @param {Application} application
     */
    public getApplication(application: Application): void {
        const index: number = this.all_applications.indexOf(application);

        this.applicationsservice.getApplication(application.Id.toString()).subscribe((aj: object) => {
            const newApp: Application = new Application();
            newApp.Id = aj['project_application_id'];

            newApp.Name = aj['project_application_name'];
            newApp.Shortname = aj['project_application_shortname'];
            newApp.Description = aj['project_application_description'];
            newApp.Lifetime = aj['project_application_lifetime'];

            newApp.VMsRequested = aj['project_application_vms_requested'];
            newApp.RamPerVM = aj['project_application_ram_per_vm'];

            newApp.TotalRam = aj['project_application_total_ram'];
            newApp.TotalCores = aj['project_application_total_cores'];
            newApp.CoresPerVM = aj['project_application_cores_per_vm'];
            newApp.VolumeLimit = aj['project_application_volume_limit'];
            newApp.VolumeCounter = aj['project_application_volume_counter'];

            newApp.ObjectStorage = aj['project_application_object_storage'];
            newApp.OpenStackProject = aj['project_application_openstack_project'];

            newApp.Institute = aj['project_application_institute'];
            newApp.Workgroup = aj['project_application_workgroup'];
            newApp.DateApproved = aj['project_application_date_approved'];

            newApp.DateSubmitted = aj['project_application_date_submitted'];
            newApp.DateStatusChanged = aj['project_application_date_status_changed'];
            newApp.User = aj['project_application_user']['username'];
            newApp.UserAffiliations = aj['project_application_user']['profile']['affiliations'];
            newApp.UserEmail = aj['project_application_user']['email'];
            newApp.Status = aj['project_application_status'];
            newApp.Dissemination = aj['project_application_report_allowed'];
            newApp.Horizon2020 = aj['project_application_horizon2020'];

            if (newApp.Status === this.application_statuses.APPROVED) {
                newApp.DaysRunning = Math.ceil((Math.abs(Date.now() - new Date(newApp.DateStatusChanged).getTime())) / (1000 * 3600 * 24));

            }
            newApp.Comment = aj['project_application_comment'];
            newApp.PerunId = aj['project_application_perun_id'];
            for (const flavor of aj['flavors']) {
                newApp.addFlavorToCurrent(
                    flavor.flavor_name, flavor.counter, flavor.tag, flavor.ram,
                    flavor.rootdisk, flavor.vcpus, flavor.gpu, flavor.epheremal_disk)

            }
            if (aj['projectapplicationrenewal']) {
                const r: ApplicationExtension = new ApplicationExtension();
                let requestExtensionTotalCores: number = 0;
                let requestExtensionTotalRam: number = 0;

                for (const flavor of aj['projectapplicationrenewal']['flavors']) {
                    r.addFlavorToRequested(
                        flavor.flavor_name, flavor.counter, flavor.tag, flavor.ram,
                        flavor.rootdisk, flavor.vcpus, flavor.gpu, flavor.epheremal_disk);
                    requestExtensionTotalCores += flavor.vcpus * flavor.counter;
                    requestExtensionTotalRam += flavor.ram * flavor.counter

                }

                r.TotalRAM = requestExtensionTotalRam;
                r.TotalCores = requestExtensionTotalCores;

                r.Id = aj['projectapplicationrenewal']['project_application'];
                r.Lifetime = aj['projectapplicationrenewal']['project_application_renewal_lifetime'];
                r.VolumeLimit = aj['projectapplicationrenewal']['project_application_renewal_volume_limit'];
                r.VolumeCounter = aj['projectapplicationrenewal']['project_application_renewal_volume_counter'];
                r.VMsRequested = aj['projectapplicationrenewal']['project_application_renewal_vms_requested'];
                r.Comment = aj['projectapplicationrenewal']['project_application_renewal_comment'];
                r.CoresPerVM = aj['projectapplicationrenewal']['project_application_renewal_cores_per_vm'];
                r.ObjectStorage = aj['projectapplicationrenewal']['project_application_renewal_object_storage'];
                r.RamPerVM = aj['projectapplicationrenewal']['project_application_renewal_ram_per_vm'];
                r.Comment = aj['projectapplicationrenewal']['project_application_renewal_comment'];

                newApp.ApplicationExtension = r;
            }
            this.getFacilityProject(newApp);

            this.all_applications[index] = newApp;

        })
    }

    /**
     * Gets a user application with the actual values.
     * @param {Application} application
     */
    public getUserApplication(application: Application): void {
        const index: number = this.user_applications.indexOf(application);

        this.applicationsservice.getUserApplication(application.Id.toString()).subscribe((aj: object) => {
            const newApp: Application = new Application();
            newApp.Id = aj['project_application_id'];
            newApp.Name = aj['project_application_name'];
            newApp.Shortname = aj['project_application_shortname'];
            newApp.Lifetime = aj['project_application_lifetime'];
            newApp.DateSubmitted = aj['project_application_date_submitted'];
            newApp.Status = aj['project_application_status']['application_status_name'];
            newApp.Description = aj['project_application_description'];
            newApp.VMsRequested = aj['project_application_vms_requested'];
            newApp.RamPerVM = aj['project_application_ram_per_vm'];
            newApp.TotalRam = aj['project_application_total_ram'];
            newApp.TotalCores = aj['project_application_total_cores'];
            newApp.CoresPerVM = aj['project_application_cores_per_vm'];
            newApp.VolumeLimit = aj['project_application_volume_limit'];
            newApp.VolumeCounter = aj['project_application_volume_counter'];
            newApp.ObjectStorage = aj['project_application_object_storage'];
            newApp.SpecialHardware = aj['project_application_special_hardware'];
            newApp.OpenStackProject = aj['project_application_openstack_project'];
            newApp.DateApproved = aj['project_application_date_approved'];
            newApp.Dissemination = aj['project_application_report_allowed'];
            newApp.Horizon2020 = aj['project_application_horizon2020'];

            newApp.PerunId = aj['project_application_perun_id'];
            newApp.Horizon2020 = aj['project_application_horizon2020'];

            newApp.Comment = aj['project_application_comment'];
            for (const flavor of aj['flavors']) {
                newApp.addFlavorToCurrent(
                    flavor.flavor_name, flavor.counter, flavor.tag, flavor.ram,
                    flavor.rootdisk, flavor.vcpus, flavor.gpu, flavor.epheremal_disk)

            }
            if (aj['projectapplicationrenewal']) {
                const newExtension: ApplicationExtension = new ApplicationExtension();
                let requestExtensionTotalCores: number = 0;
                let requestExtensionTotalRam: number = 0;

                for (const flavor of aj['projectapplicationrenewal']['flavors']) {
                    newExtension.addFlavorToRequested(
                        flavor.flavor_name, flavor.counter, flavor.tag, flavor.ram,
                        flavor.rootdisk, flavor.vcpus, flavor.gpu, flavor.epheremal_disk);
                    requestExtensionTotalCores += flavor.vcpus * flavor.counter;
                    requestExtensionTotalRam += flavor.ram * flavor.counter

                }

                newExtension.TotalRAM = requestExtensionTotalRam;
                newExtension.TotalCores = requestExtensionTotalCores;
                newExtension.Id = aj['projectapplicationrenewal']['project_application'];
                newExtension.Lifetime = aj['projectapplicationrenewal']['project_application_renewal_lifetime'];
                newExtension.VolumeLimit = aj['projectapplicationrenewal']['project_application_renewal_volume_limit'];
                newExtension.VolumeCounter = aj['projectapplicationrenewal']['project_application_renewal_volume_counter'];
                newExtension.VMsRequested = aj['projectapplicationrenewal']['project_application_renewal_vms_requested'];
                newExtension.Comment = aj['projectapplicationrenewal']['project_application_renewal_comment'];
                newExtension.CoresPerVM = aj['projectapplicationrenewal']['project_application_renewal_cores_per_vm'];
                newExtension.ObjectStorage = aj['projectapplicationrenewal']['project_application_renewal_object_storage'];
                newExtension.RamPerVM = aj['projectapplicationrenewal']['project_application_renewal_ram_per_vm'];
                newExtension.Comment = aj['projectapplicationrenewal']['project_application_renewal_comment'];

                newApp.ApplicationExtension = newExtension;
            }
            this.user_applications[index] = newApp;

        })

    }

    /**
     * Request an extension from an application.
     * @param data
     */
    public requestExtension(data: { [key: string]: string | number | boolean }): void {
        this.applicationsservice.requestRenewal(data).subscribe((result: { [key: string]: string }) => {
            if (result['Error']) {
                this.extension_status = 2
            } else {
                this.extension_status = 1;
            }
            this.getUserApplication(this.selectedApplication);

            for (const app of this.all_applications) {
                if (this.selectedApplication.PerunId === app.PerunId) {
                    this.getApplication(app);
                    break;
                }

            }
        })

    }

    /**
     * Get details of member like name and email by elixir.
     * @param {string} elixir_id
     * @param {string} collapse_id
     */
    public getMemberDetailsByElixirIdIfCollapsed(elixir_id: string, collapse_id: string): void {
        if (!this.getCollapseStatus(collapse_id)) {
            if (!(elixir_id in this.application_user)) {
                this.userservice.getMemberDetailsByElixirId(elixir_id).subscribe((result: { [key: string]: string }) => {

                    const name: string = `${result['firstName']} ${result['lastName']}`;
                    const appuser: { [id: string]: string } = {};
                    appuser['name'] = name;
                    appuser['email'] = result['email'];
                    this.application_user[elixir_id] = appuser;
                })
            }
        }

    }

    /**
     * Approve an extension request.
     * @param {Application} app
     */
    public approveExtension(app: Application): void {

        if (app.OpenStackProject) {
            this.applicationstatusservice.setApplicationStatus(
                app.Id.toString(),
                this.WAIT_FOR_EXTENSION_STATUS.toString()).subscribe(() => {
                this.extension_status = 5;
                this.getApplication(app);
                this.getUserApplication(app);

                for (const appl of this.user_applications) {
                    if (this.selectedApplication.PerunId === appl.PerunId) {
                        this.getUserApplication(appl);
                        break;
                    }

                }
            })
        } else {
            this.applicationsservice.approveRenewal(app.Id).subscribe((result: { [key: string]: string }) => {
                if (result['Error']) {
                    this.extension_status = 2
                } else {
                    this.extension_status = 3;
                }
                this.getApplication(this.selectedApplication);

                for (const appl of this.user_applications) {
                    if (this.selectedApplication.PerunId === appl.PerunId) {
                        this.getUserApplication(appl);
                        break;
                    }

                }
            })
        }
    }

    /**
     * Decline an extension request.
     * @param {number} application_id
     */
    public declineExtension(application_id: number): void {
        this.applicationsservice.declineRenewal(application_id).subscribe((result: { [key: string]: string }) => {
            if (result != null) {
                this.extension_status = 2
            } else {
                this.extension_status = 4;
            }
            this.getApplication(this.selectedApplication);

            for (const app of this.user_applications) {
                if (this.selectedApplication.PerunId === app.PerunId) {
                    this.getUserApplication(app);
                    break;
                }

            }
        })
    }

    /**
     * Get status name  by status id.
     * @param {number} id
     * @returns {string}
     */
    public getStatusById(id: number): string {
        const s: string = 'Unknown';
        for (const status of this.application_status) {
            if (status.Id === id) {
                return status.Name;
            }
        }

        return s;
    }

    /**
     * Get id by status name.
     * @param {string} name
     * @returns {number}
     */
    public getIdByStatus(name: string): number {
        const s: number = -1;
        for (const status of this.application_status) {
            if (status.Name === name) {
                return status.Id;
            }
        }

        return s;
    }

    /**
     * Remove Application from facility , where it is for confirmation
     * @param {Application} application the application
     */
    removeApplicationFromFacilityConfirmation(application: Application): void {
        this.groupservice.removeGroupFromResource(application.PerunId.toString()).subscribe(() => {
            this.getApplication(application)
        })

    }

    /**
     * Create a new Group in perun with the specific attributes.
     * @param name
     * @param description
     * @param manager_elixir_id
     * @param application_id
     * @param compute_center
     */
    public createOpenStackProjectGroup(name: string,
                                       description: string,
                                       manager_elixir_id: string,
                                       application_id: string,
                                       compute_center: string): void {
        // get memeber id in order to add the user later as the new member and manager of the group
        let manager_member_id: string;
        let manager_member_user_id: string;
        let new_group_id: string;

        this.userservice.getMemberByExtSourceNameAndExtLogin(manager_elixir_id).subscribe(
            (member_raw: { [key: string]: string }) => {
                const member: { [key: string]: string } = member_raw;
                manager_member_id = member['id'];
                manager_member_user_id = member['userId'];
                this.groupservice.createGroup(name, description).subscribe((group: { [key: string]: string }) => {
                    new_group_id = group['id'];
                    this.groupservice.addMember(new_group_id, manager_member_id, compute_center).subscribe();
                    this.groupservice.addAdmin(new_group_id, manager_member_user_id, compute_center).subscribe(() => {
                        this.groupservice.setPerunGroupAttributes(application_id, new_group_id).subscribe(() => {
                            this.groupservice.assignGroupToResource(new_group_id.toString(), compute_center).subscribe(() => {
                                if (compute_center !== 'undefined') {
                                    this.applicationstatusservice.setApplicationStatus(
                                        application_id,
                                        this.application_statuses.WAIT_FOR_CONFIRMATION.toString())
                                        .subscribe((result: { [key: string]: string }) => {
                                                if (result['Error']) {
                                                    this.updateNotificationModal('Failed', result['Error'], true, 'danger');

                                                } else {
                                                    this.updateNotificationModal('Success', 'The new project was created', true, 'success');
                                                }
                                                for (const app of this.user_applications) {
                                                    if (app.Id.toString() === application_id) {
                                                        this.getUserApplication(app);
                                                        break;

                                                    }

                                                }
                                                for (const app of this.all_applications) {
                                                    if (app.Id.toString() === application_id) {
                                                        this.getApplication(app);
                                                        break;

                                                    }
                                                }
                                            }
                                        )
                                } else {
                                    this.groupservice.setPerunGroupStatus(
                                        new_group_id,
                                        this.application_statuses.APPROVED.toString()).subscribe(() => {
                                        this.applicationstatusservice.setApplicationStatus(
                                            application_id,
                                            this.application_statuses.APPROVED.toString())
                                            .subscribe((result: { [key: string]: string }) => {
                                                if (result['Error']) {
                                                    this.updateNotificationModal('Failed', result['Error'], true, 'danger');

                                                } else {
                                                    this.updateNotificationModal('Success', 'The new project was created', true, 'success');
                                                }
                                                for (const appl of this.user_applications) {
                                                    if (appl.Id.toString() === application_id) {
                                                        this.getUserApplication(appl);
                                                        break;

                                                    }
                                                    for (const app of this.user_applications) {
                                                        if (app.Id.toString() === application_id) {
                                                            this.getUserApplication(app);
                                                            break;

                                                        }

                                                    }
                                                    for (const app of this.all_applications) {
                                                        if (app.Id.toString() === application_id) {
                                                            this.getApplication(app);
                                                            break;

                                                        }
                                                    }
                                                }
                                            })

                                    })

                                }
                            });
                        })

                    })

                })
            },
            () => {
                this.updateNotificationModal('Failed', 'Project could not be created!', true, 'danger');
            })

    }

    public resetNotificationModal(): void {
        this.notificationModalTitle = 'Notification';
        this.notificationModalMessage = 'Please wait...';
        this.notificationModalIsClosable = false;
        this.notificationModalType = 'info';
        this.notificationClientInfo = [];
    }

    /**
     * Bugfix not scrollable site after closing modal
     */
    removeModalOpen(): void {
        document.body.classList.remove('modal-open');
    }

    /**
     * Create a new Group in perun with the specific attributes.
     * @param name
     * @param description
     * @param manager_elixir_id
     * @param application_id
     * @param compute_center
     */
    public createSimpleVmProjectGroup(name: string,
                                      description: string,
                                      manager_elixir_id: string,
                                      application_id: string,
                                      compute_center: string): void {

        // get memeber id in order to add the user later as the new member and manager of the group
        let manager_member_id: string;
        let manager_member_user_id: string;
        let new_group_id: string;
        this.applicationsservice.getApplicationClientAvaiable(application_id).subscribe(
            (res: Client) => {
                if (res['Info']) {
                    if (res['Clients']) {
                        for (const client of res['Clients']) {
                            const newClient: Client = new Client();
                            newClient.location = client.location;
                            newClient.maxVolumeLimit = client.max_ressources.maxTotalVolumeGigabytes;
                            newClient.maxVolumes = client.max_ressources.maxTotalVolumes;
                            newClient.maxVMs = client.max_ressources.maxTotalInstances;
                            newClient.assignedVMs = client.assigned_ressources.vms;
                            newClient.assignedVolumes = client.assigned_ressources.volumes;
                            newClient.assignedVolumesStorage = client.assigned_ressources.volumeLimit;
                            this.notificationClientInfo.push(newClient);
                        }
                    }
                    this.updateNotificationModal('Failed', res['Info'], true, 'danger');

                } else {
                    this.applicationstatusservice.setApplicationStatus(
                        application_id,
                        this.application_statuses.APPROVED.toString()).subscribe((result: { [key: string]: string }) => {
                        if (result['Error']) {

                            this.updateNotificationModal('Failed', result['Error'], true, 'danger');

                        } else {
                            this.userservice.getMemberByExtSourceNameAndExtLogin(
                                manager_elixir_id).subscribe((member_raw: { [key: string]: string }) => {
                                const member: { [key: string]: string } = member_raw;
                                manager_member_id = member['id'];
                                manager_member_user_id = member['userId'];
                                this.groupservice.createGroup(name, description).subscribe((group: { [key: string]: string }) => {
                                    new_group_id = group['id'];
                                    this.groupservice.addMember(
                                        new_group_id.toString(),
                                        manager_member_id.toString(),
                                        compute_center).subscribe();
                                    this.groupservice.addAdmin(
                                        new_group_id.toString(),
                                        manager_member_user_id,
                                        compute_center).subscribe(() => {
                                        this.groupservice.setPerunGroupAttributes(application_id, new_group_id).subscribe(() => {
                                                if (result['Info']) {
                                                    this.updateNotificationModal('Failed', result['Info'], true, 'danger');

                                                } else {
                                                    this.applicationsservice.getApplicationClient(
                                                        application_id).subscribe((client: object) => {
                                                        const newClient: Client = new Client();
                                                        newClient.location = client['location'];
                                                        newClient.maxVolumeLimit = client['max_ressources']['maxTotalVolumeGigabytes'];
                                                        newClient.maxVolumes = client['max_ressources']['maxTotalVolumes'];
                                                        newClient.maxVMs = client['max_ressources']['maxTotalInstances'];
                                                        newClient.assignedVMs = client['assigned_ressources']['vms'];
                                                        newClient.assignedVolumes = client['assigned_ressources']['volumes'];
                                                        newClient.assignedVolumesStorage = client['assigned_ressources']['volumeLimit'];
                                                        this.notificationClientInfo.push(newClient);
                                                        this.updateNotificationModal(
                                                            'Success', `The new project was created and assigned to ${newClient.location}.`,
                                                            true,
                                                            'success');

                                                    });
                                                }

                                                for (const app of this.user_applications) {
                                                    if (app.Id.toString() === application_id) {
                                                        this.getUserApplication(app);
                                                        break;

                                                    }

                                                }
                                                for (const app of this.all_applications) {
                                                    if (app.Id.toString() === application_id) {
                                                        this.getApplication(app);
                                                        break;

                                                    }
                                                }

                                            }
                                        )

                                    });

                                });

                            })
                        }

                    })
                }

            },
            (error: object) => {
                console.log(error);
                this.updateNotificationModal('Failed', 'Project could not be created!', true, 'danger');
            })

    }

    assignGroupToFacility(group_id: string, application_id: string, compute_center: string): void {
        if (compute_center !== 'undefined') {
            this.groupservice.assignGroupToResource(group_id.toString(), compute_center).subscribe(
                () => {
                    this.applicationstatusservice.setApplicationStatus(
                        application_id,
                        this.application_statuses.WAIT_FOR_CONFIRMATION.toString())
                        .subscribe(() => {
                            for (const app of this.all_applications) {
                                if (app.Id.toString() === application_id) {
                                    this.getApplication(app);

                                    break;

                                }
                            }
                            this.updateNotificationModal('Success', 'The  project was assigned to the facility.', true, 'success');

                        })

                },
                (error: object) => {
                    console.log(error);
                    this.updateNotificationModal('Failed', 'Project could not be created!', true, 'danger');
                });
        } else {
            this.updateNotificationModal('Failed', 'You need to select an compute center!', true, 'danger');
        }

    }

    /**
     * Decline an application.
     * @param application_id
     */
    public declineApplication(application_id: string): void {
        this.applicationstatusservice.setApplicationStatus(application_id, this.getIdByStatus('declined').toString()).toPromise()
            .then(() => {
                this.all_applications = [];
                this.user_applications = [];
                this.getUserApplications();
                this.getAllApplications();
                this.updateNotificationModal('Success', 'The Application was declined', true, 'success');
            })
            .catch(() => {
                this.updateNotificationModal('Failed', 'Application could be declined!', true, 'danger');
            });
    }

    /**
     * Delete an application.
     * @param application_id
     */
    public deleteApplication(application_id: string): void {
        this.applicationsservice.deleteApplication(application_id).toPromise()
            .then(() => {
                this.updateNotificationModal('Success', 'The application has been successfully removed', true, 'success');
            }).then(() => {
            this.user_applications = [];
            this.all_applications = [];
            this.getUserApplications();
            this.getAllApplications();
        })
            .catch(() => {
                this.updateNotificationModal('Failed', 'Application could not be removed!', true, 'danger');
            });
    }

    /**
     * Check if active applications are available.
     * @returns {boolean}
     */
    public activeApplicationsAvailable(): boolean {
        for (const application of this.all_applications) {
            if (application.Status === 1 || application.Status === 4 || application.Status === 7 || application.Status === 6) {
                return true;
            }
        }
    }

    public setApplicationStatus(status: number, app: Application): void {
        this.applicationstatusservice.setApplicationStatus(app.Id.toString(), status.toString()).subscribe()
    }

    /**
     * Set the id of the application which should be deleted.
     * @param applicationId
     */
    public setDeleteId(applicationId: number): void {
        this.deleteId = applicationId;
    }

    /**
     * Coming soon.
     */
    public comingSoon(): void {
        alert('This functinality will be implemented soon!')
    }

}
