import ***REMOVED***Component***REMOVED*** from '@angular/core';
import ***REMOVED***ApplicationsService***REMOVED*** from '../api-connector/applications.service'
import ***REMOVED***ApplicationStatusService***REMOVED*** from '../api-connector/application-status.service'
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service'
import ***REMOVED***Application***REMOVED*** from './application.model';
import ***REMOVED***ApplicationStatus***REMOVED*** from './application_status.model';
import ***REMOVED***GroupService***REMOVED*** from '../api-connector/group.service';
import ***REMOVED***UserService***REMOVED*** from '../api-connector/user.service';
import ***REMOVED***ApplicationExtension***REMOVED*** from './application_extension.model';
import ***REMOVED***NgForm***REMOVED*** from '@angular/forms';
import ***REMOVED***VoService***REMOVED*** from '../api-connector/vo.service';
import ***REMOVED***ComputecenterComponent***REMOVED*** from '../projectmanagement/computecenter.component';
import ***REMOVED***FacilityService***REMOVED*** from '../api-connector/facility.service';
import ***REMOVED***AbstractBaseClasse***REMOVED*** from '../shared_modules/baseClass/abstract-base-class';
import ***REMOVED***FlavorType***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavorType';
import ***REMOVED***Flavor***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavor';
import ***REMOVED***FlavorService***REMOVED*** from '../api-connector/flavor.service';
import ***REMOVED***Client***REMOVED*** from '../virtualmachines/virtualmachinemodels/vmclient';

/**
 * Application Overview component.
 */
@Component(***REMOVED***
    templateUrl: 'applications.component.html',
    providers: [FacilityService, VoService, UserService, GroupService, ApplicationStatusService,
        ApplicationsService, ApiSettings, FlavorService]
***REMOVED***)
export class ApplicationsComponent extends AbstractBaseClasse ***REMOVED***

    /**
     * Limits information for Client tested/used for Simple Vm Project creation.
     */
    notificationClientInfo: Client[] = [];

    /**
     * Applications of the user viewing the Application overview.
     * @type ***REMOVED***Array***REMOVED***
     */
    user_applications: Application[] = [];

    /**
     * If the user is a vo admin.
     * @type ***REMOVED***boolean***REMOVED***
     */
    is_vo_admin: boolean = false;

    /**
     * All Applications, just visibile for a vo admin.
     * @type ***REMOVED***Array***REMOVED***
     */
    all_applications: Application[] = [];

    /**
     * Stati of the differen Applications.
     * @type ***REMOVED***Array***REMOVED***
     */

    application_status: ApplicationStatus[] = [];

    /**
     * All available compute centers.
     * @type ***REMOVED***Array***REMOVED***
     */
    computeCenters: ComputecenterComponent[] = [];

    /**
     * Selected Application.
     */
    selectedApplication: Application;

    /**
     * Id of the extension status.
     * @type ***REMOVED***number***REMOVED***
     */
    extension_status: number = 0;
    /**
     * Id of Application set for deletion.
     */
    public deleteId: number;

    /**
     * If all userApplications are loaded, important for the loader.
     * @type ***REMOVED***boolean***REMOVED***
     */
    isLoaded_userApplication: boolean = false;

    /**
     * If all Applications are loaded, important for the loader.
     * @type ***REMOVED***boolean***REMOVED***
     */
    isLoaded_AllApplication: boolean = false;

    /**
     * User which requested the Application ***REMOVED***id: Elixir Id of user : ***REMOVED***name and email***REMOVED******REMOVED***.
     * @type ***REMOVED******REMOVED******REMOVED******REMOVED***
     */
    application_user: ***REMOVED*** [id: string]: ***REMOVED*** [id: string]: string ***REMOVED*** ***REMOVED*** = ***REMOVED******REMOVED***;

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
     * @type ***REMOVED***number***REMOVED***
     */
    public totalNumberOfCores: number = 0;
    /**
     * Total number of ram.
     * @type ***REMOVED***number***REMOVED***
     */
    public totalRAM: number = 0;

    /**
     * Constructor.
     * Loads all Applications if user is vo admin and all user_applications.
     * @param ***REMOVED***ApplicationsService***REMOVED*** applicationsservice
     * @param ***REMOVED***ApplicationStatusService***REMOVED*** applicationstatusservice
     * @param ***REMOVED***UserService***REMOVED*** userservice
     * @param ***REMOVED***GroupService***REMOVED*** groupservice
     * @param ***REMOVED***VoService***REMOVED*** voService
     * @param ***REMOVED***FacilityService***REMOVED*** facilityService
     * @param ***REMOVED***FlavorService***REMOVED*** flavorService
     */
    constructor(private applicationsservice: ApplicationsService,
                private applicationstatusservice: ApplicationStatusService,
                private userservice: UserService,
                private groupservice: GroupService,
                private voService: VoService,
                private facilityService: FacilityService,
                private flavorService: FlavorService) ***REMOVED***

        super();
        this.voService.isVo().subscribe((result: ***REMOVED*** [key: string]: boolean ***REMOVED***) => ***REMOVED***
            this.is_vo_admin = result['Is_Vo_Manager'];
            this.getUserApplications();
            this.getApplicationStatus();
            if (this.is_vo_admin) ***REMOVED***
                this.getAllApplications();
                this.getComputeCenters();

            ***REMOVED*** else ***REMOVED***
                this.isLoaded_AllApplication = true;

            ***REMOVED***

        ***REMOVED***);
        this.getListOfFlavors();
        this.getListOfTypes();
    ***REMOVED***

    /**
     * Checks if the key given represents a flavor and if so returns the respective Flavor
     * @param key the key which is checked
     */
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
     * Resets the values of totalRAM und totalNumberOfCores to 0 and changes the text at the end of the extension form.
     * @param elemIDcores the ID of the label containing the number of cores
     * @param elemIDram the ID of the label containing the amount of RAM
     */
    protected unsetValues(elemIDcores: string, elemIDram: string): void ***REMOVED***
        this.totalRAM = 0;
        this.totalNumberOfCores = 0;
        document.getElementById(elemIDcores).innerHTML = `Number of total cores:  $***REMOVED***this.totalNumberOfCores.toString()***REMOVED***`;
        document.getElementById(elemIDram).innerHTML = `Total amout of RAM:  $***REMOVED***this.totalRAM.toString()***REMOVED*** GB`;

    ***REMOVED***

    /**
     * Called whenvalues of the flavor-input-fields are changed and if so changes the values shown at the end of the form.
     * @param f the form which contains the input-fields
     */
    protected valuesChanged(f: NgForm): void ***REMOVED***

        this.totalRAM = 0;
        this.totalNumberOfCores = 0;
        for (const key in f.controls) ***REMOVED***
            if (f.controls[key].value) ***REMOVED***
                const flavor: Flavor = this.keyIsVM(key.toString());
                if (flavor != null) ***REMOVED***
                    this.totalNumberOfCores = this.totalNumberOfCores + (flavor.vcpus * f.controls[key].value);
                    this.totalRAM = this.totalRAM + (flavor.ram * f.controls[key].value);
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***

        document.getElementById('corenumbers').innerHTML = `Number of total cores:  $***REMOVED***this.totalNumberOfCores.toString()***REMOVED***`;
        document.getElementById('ramnumbers').innerHTML = `Total amout of RAM:  $***REMOVED***this.totalRAM.toString()***REMOVED*** GB`;

    ***REMOVED***

    /**
     * gets a list of all available Flavors from the flavorservice and puts them into the array flavorList
     */
    getListOfFlavors(): void ***REMOVED***
        this.flavorService.getListOfFlavorsAvailable().subscribe((flavors: Flavor[]) => this.flavorList = flavors);
    ***REMOVED***

    /**
     * gets a list of all available types of flavors from the flavorservice and uses them in the function setListOfTypes
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
        for (const t of types) ***REMOVED***

            this.collapseList.push(false); // AS FIX
            if (t.long_name === 'Standart Flavor') ***REMOVED***
                this.collapseList[this.typeList.indexOf(t)] = true;
            ***REMOVED***
        ***REMOVED***

    ***REMOVED***

    /**
     * Gets all available compute centers and saves them in the computeCenters attribute.
     */
    getComputeCenters(): void ***REMOVED***
        this.facilityService.getComputeCenters().subscribe((result: [***REMOVED*** [key: string]: string ***REMOVED***]) => ***REMOVED***
            for (const cc of result) ***REMOVED***
                const compute_center: ComputecenterComponent = new ComputecenterComponent(
                    cc['compute_center_facility_id'],
                    cc['compute_center_name'],
                    cc['compute_center_login'],
                    cc['compute_center_support_mail']);
                this.computeCenters.push(compute_center)
            ***REMOVED***

        ***REMOVED***)
    ***REMOVED***

    /**
     * Gets all affialiations from a user.
     * @param ***REMOVED***number***REMOVED*** user
     */
    getUserAffilaitions(user: number): void ***REMOVED***
        this.userservice.getuserAffiliations(user).subscribe()
    ***REMOVED***

    /**
     * Sets the selected application.
     * @param application
     */
    setSelectedApplication(application: Application): void ***REMOVED***
        this.selectedApplication = application;

    ***REMOVED***

    /**
     * Submits an renewal request for an application.
     * @param ***REMOVED***NgForm***REMOVED*** f
     */
    onSubmit(f: NgForm): void ***REMOVED***
        const values: ***REMOVED*** [key: string]: string | number | boolean ***REMOVED*** = ***REMOVED******REMOVED***;
        for (const v in f.controls) ***REMOVED***
            if (f.controls[v].value) ***REMOVED***
                values[v] = f.controls[v].value;
            ***REMOVED***
        ***REMOVED***
        values['project_application_id'] = this.selectedApplication.Id;
        values['total_cores_new'] = this.totalNumberOfCores;
        values['total_ram_new'] = this.totalRAM;
        this.requestExtension(values);

    ***REMOVED***

    /**
     * Sets the default values in the request renewal form.
     * @param ***REMOVED***NgForm***REMOVED*** f
     */
    ngFormSetDefault(f: NgForm): void ***REMOVED***
        f.reset(***REMOVED***
            project_application_renewal_vms_requested: this.selectedApplication.VMsRequested,
            project_application_renewal_cores_per_vm: this.selectedApplication.CoresPerVM,
            project_application_renewal_ram_per_vm: this.selectedApplication.RamPerVM,
            project_application_renewal_volume_limit: this.selectedApplication.VolumeLimit,
            project_application_renewal_volume_counter: this.selectedApplication.VolumeCounter,
            project_application_renewal_object_storage: this.selectedApplication.ObjectStorage,
            project_application_renewal_comment: this.selectedApplication.Comment

        ***REMOVED***)

    ***REMOVED***

    /**
     * Gets all Application of the user viewing the application overview.
     * Saves them in the userApplication array.
     */
    getUserApplications(): void ***REMOVED***
        this.applicationsservice
            .getUserApplications().subscribe((result: [***REMOVED*** [key: string]: string ***REMOVED***]) => ***REMOVED***
            const res: [***REMOVED*** [key: string]: string ***REMOVED***] = result;
            if (Object.keys(res).length === 0) ***REMOVED***
                this.isLoaded_userApplication = true;
            ***REMOVED***
            for (const key in res) ***REMOVED***
                if (res.hasOwnProperty(key)) ***REMOVED***
                    const aj: object = res[key];
                    const a: Application = new Application();
                    a.Id = aj['project_application_id'];
                    a.Name = aj['project_application_name'];
                    a.Shortname = aj['project_application_shortname'];
                    a.Lifetime = aj['project_application_lifetime'];
                    a.DateSubmitted = aj['project_application_date_submitted'];
                    a.Status = aj['project_application_status']['application_status_name'];
                    a.Description = aj['project_application_description'];
                    a.VMsRequested = aj['project_application_vms_requested'];
                    a.RamPerVM = aj['project_application_ram_per_vm'];
                    a.TotalRam = aj['project_application_total_ram'];
                    a.TotalCores = aj['project_application_total_cores'];
                    a.CoresPerVM = aj['project_application_cores_per_vm'];
                    a.VolumeLimit = aj['project_application_volume_limit'];
                    a.VolumeCounter = aj['project_application_volume_counter'];
                    a.ObjectStorage = aj['project_application_object_storage'];
                    a.OpenStackProject = aj['project_application_openstack_project'];
                    a.Comment = aj['project_application_comment'];
                    a.PerunId = aj['project_application_perun_id'];
                    a.DateApproved = aj['project_application_date_approved'];
                    a.Dissemination = aj['project_application_report_allowed'];
                    a.Horizon2020 = aj['project_application_horizon2020'];

                    for (const f of aj['flavors']) ***REMOVED***
                        a.addFlavorToCurrent(f.flavor_name, f.counter, f.tag, f.ram, f.rootdisk, f.vcpus, f.gpu, f.epheremal_disk)

                    ***REMOVED***

                    if (aj['projectapplicationrenewal']) ***REMOVED***
                        const r: ApplicationExtension = new ApplicationExtension();
                        let requestExtensionTotalCores: number = 0;
                        let requestExtensionTotalRam: number = 0;

                        for (const f of aj['projectapplicationrenewal']['flavors']) ***REMOVED***
                            r.addFlavorToRequested(f.flavor_name, f.counter, f.tag, f.ram, f.rootdisk, f.vcpus, f.gpu, f.epheremal_disk)
                            requestExtensionTotalCores += f.vcpus * f.counter;
                            requestExtensionTotalRam += f.ram * f.counter

                        ***REMOVED***

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

                        a.ApplicationExtension = r;
                    ***REMOVED***
                    this.user_applications.push(a)
                ***REMOVED***
            ***REMOVED***
            this.isLoaded_userApplication = true;

        ***REMOVED***);
    ***REMOVED***

    /**
     * Returns a string with the end-date of a application which depends on the day it was approved and the lifetime in months
     * @param approval date in string when the application was approved
     * @param months number of months the application is permitted
     */
    getEndDate(approval: string, months: number): string ***REMOVED***
        let date1: Date = new Date(Number(approval.substring(0, 4)), Number(approval.substring(5, 7)) - 1, Number(approval.substring(8)));
        const m: number = date1.getMonth();
        if ((m + months) > 11) ***REMOVED***
            date1 = new Date(date1.getFullYear(), (m + months - 12), date1.getDate());
        ***REMOVED*** else ***REMOVED***
            date1.setMonth(date1.getMonth() + months);
        ***REMOVED***

        return `$***REMOVED***date1.getFullYear()***REMOVED***-$***REMOVED***this.fillUp((date1.getMonth() + 1).toString())***REMOVED***-$***REMOVED***this.fillUp(date1.getDate().toString())***REMOVED***`;
    ***REMOVED***

    fillUp(date: string): string ***REMOVED***
        if (date.length === 1) ***REMOVED***
            return `0$***REMOVED***date***REMOVED***`;
        ***REMOVED***

        return date;
    ***REMOVED***

    showLifetime(sa?: Application): string ***REMOVED***
        if (!sa) ***REMOVED***
            return
        ***REMOVED***

        return `$***REMOVED***sa.DateApproved***REMOVED*** - $***REMOVED***this.getEndDate(sa.DateApproved, sa.Lifetime)***REMOVED***`;
    ***REMOVED***

    /**
     * Get all possible application stati.
     */
    getApplicationStatus(): void ***REMOVED***
        this.applicationstatusservice.getAllApplicationStatus().toPromise()
            .then((result: object) => ***REMOVED***
                const res: object = result;
                for (const key in res) ***REMOVED***
                    if (res[key]) ***REMOVED***
                        const asj: object = res[key];
                        const aj: ApplicationStatus = new ApplicationStatus(asj['application_status_id'], asj['application_status_name']);
                        this.application_status.push(aj)
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***);
    ***REMOVED***

    /**
     * Get all Applications if user is admin.
     */
    getAllApplications(): void ***REMOVED***
        // todo check if user is VO Admin

        if (this.is_vo_admin) ***REMOVED***
            this.applicationsservice.getAllApplications().subscribe((res: object) => ***REMOVED***
                if (Object.keys(res).length === 0) ***REMOVED***
                    this.isLoaded_AllApplication = true;
                ***REMOVED***

                for (const key in res) ***REMOVED***
                    if (res.hasOwnProperty(key)) ***REMOVED***

                        const aj: object = res[key];
                        const a: Application = new Application();
                        a.Id = aj['project_application_id'];

                        a.Name = aj['project_application_name'];
                        a.Shortname = aj['project_application_shortname'];
                        a.Description = aj['project_application_description'];
                        a.Lifetime = aj['project_application_lifetime'];

                        a.ObjectStorage = aj['project_application_object_storage'];
                        a.OpenStackProject = aj['project_application_openstack_project'];

                        a.ObjectStorage = aj['project_application_object_storage'];
                        a.SpecialHardware = aj['project_application_special_hardware'];

                        a.Institute = aj['project_application_institute'];
                        a.Workgroup = aj['project_application_workgroup'];
                        a.DateApproved = aj['project_application_date_approved'];

                        a.DateSubmitted = aj['project_application_date_submitted'];
                        a.DateStatusChanged = aj['project_application_date_status_changed'];
                        a.User = aj['project_application_user']['username'];
                        a.UserAffiliations = aj['project_application_user']['profile']['affiliations'];
                        a.UserEmail = aj['project_application_user']['email'];
                        a.Status = aj['project_application_status'];
                        a.Dissemination = aj['project_application_report_allowed'];
                        a.Horizon2020 = aj['project_application_horizon2020'];

                        for (const f of aj['flavors']) ***REMOVED***
                            a.addFlavorToCurrent(f.flavor_name, f.counter, f.tag, f.ram, f.rootdisk, f.vcpus, f.gpu, f.epheremal_disk)

                        ***REMOVED***
                        if (a.Status === this.APPROVED_STATUS) ***REMOVED***

                            a.DaysRunning = Math.ceil((Math.abs(Date.now() - new Date(a.DateStatusChanged).getTime()))
                                / (1000 * 3600 * 24));

                            a.Comment = aj['project_application_comment'];
                            a.PerunId = aj['project_application_perun_id'];
                            if (aj['projectapplicationrenewal']) ***REMOVED***
                                const r: ApplicationExtension = new ApplicationExtension();
                                let requestExtensionTotalCores: number = 0;
                                let requestExtensionTotalRam: number = 0;

                                a.Comment = aj['project_application_comment'];
                                a.PerunId = aj['project_application_perun_id'];
                                a.OpenStackProject = aj['project_application_openstack_project'];

                                for (const f of aj['projectapplicationrenewal']['flavors']) ***REMOVED***
                                    r.addFlavorToRequested(
                                        f.flavor_name,
                                        f.counter,
                                        f.tag,
                                        f.ram,
                                        f.rootdisk,
                                        f.vcpus,
                                        f.gpu,
                                        f.epheremal_disk);
                                    requestExtensionTotalCores += f.vcpus * f.counter;
                                    requestExtensionTotalRam += f.ram * f.counter;

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

                                    a.ApplicationExtension = r;

                                ***REMOVED***

                            ***REMOVED***
                        ***REMOVED***
                        this.all_applications.push(a);

                        this.isLoaded_AllApplication = true;
                        for (const app of this.all_applications) ***REMOVED***
                            if (app.Status === this.application_statuses.WAIT_FOR_CONFIRMATION ||
                                app.Status === this.application_statuses.MODIFICATION_REQUESTED) ***REMOVED***
                                this.getFacilityProject(app);
                            ***REMOVED***
                        ***REMOVED***

                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***);
        ***REMOVED*** else ***REMOVED***
            this.isLoaded_AllApplication = true;

        ***REMOVED***

    ***REMOVED***

    /**
     * Get the facility of an application.
     * @param ***REMOVED***Application***REMOVED*** app
     */
    public getFacilityProject(app: Application): void ***REMOVED***

        if (!app.ComputeCenter && app.Status.toString() !== 'submitted') ***REMOVED***
            this.groupservice.getFacilityByGroup(app.PerunId.toString()).subscribe((res: object) => ***REMOVED***
                const login: string = res['Login'];
                const suport: string = res['Support'];
                const facilityname: string = res['Facility'];
                const facilityId: number = res['FacilityId'];

                app.ComputeCenter = new ComputecenterComponent(facilityId.toString(), facilityname, login, suport);

            ***REMOVED***)
        ***REMOVED***

    ***REMOVED***

    /**
     * Updates an application with the actual values.
     * @param ***REMOVED***Application***REMOVED*** application
     */
    public getApplication(application: Application): void ***REMOVED***
        const index: number = this.all_applications.indexOf(application);

        this.applicationsservice.getApplication(application.Id.toString()).subscribe((aj: object) => ***REMOVED***
            const a: Application = new Application();
            a.Id = aj['project_application_id'];

            a.Name = aj['project_application_name'];
            a.Shortname = aj['project_application_shortname'];
            a.Description = aj['project_application_description'];
            a.Lifetime = aj['project_application_lifetime'];

            a.VMsRequested = aj['project_application_vms_requested'];
            a.RamPerVM = aj['project_application_ram_per_vm'];

            a.TotalRam = aj['project_application_total_ram'];
            a.TotalCores = aj['project_application_total_cores'];
            a.CoresPerVM = aj['project_application_cores_per_vm'];
            a.VolumeLimit = aj['project_application_volume_limit'];
            a.VolumeCounter = aj['project_application_volume_counter'];

            a.ObjectStorage = aj['project_application_object_storage'];
            a.OpenStackProject = aj['project_application_openstack_project'];

            a.Institute = aj['project_application_institute'];
            a.Workgroup = aj['project_application_workgroup'];
            a.DateApproved = aj['project_application_date_approved'];

            a.DateSubmitted = aj['project_application_date_submitted'];
            a.DateStatusChanged = aj['project_application_date_status_changed'];
            a.User = aj['project_application_user']['username'];
            a.UserAffiliations = aj['project_application_user']['profile']['affiliations'];
            a.UserEmail = aj['project_application_user']['email'];
            a.Status = aj['project_application_status'];
            a.Dissemination = aj['project_application_report_allowed'];
            a.Horizon2020 = aj['project_application_horizon2020'];

            if (a.Status === this.application_statuses.APPROVED) ***REMOVED***
                a.DaysRunning = Math.ceil((Math.abs(Date.now() - new Date(a.DateStatusChanged).getTime())) / (1000 * 3600 * 24));

            ***REMOVED***
            a.Comment = aj['project_application_comment'];
            a.PerunId = aj['project_application_perun_id'];
            for (const f of aj['flavors']) ***REMOVED***
                a.addFlavorToCurrent(f.flavor_name, f.counter, f.tag, f.ram, f.rootdisk, f.vcpus, f.gpu, f.epheremal_disk)

            ***REMOVED***
            if (aj['projectapplicationrenewal']) ***REMOVED***
                const r: ApplicationExtension = new ApplicationExtension();
                let requestExtensionTotalCores: number = 0;
                let requestExtensionTotalRam: number = 0;

                for (const f of aj['projectapplicationrenewal']['flavors']) ***REMOVED***
                    r.addFlavorToRequested(f.flavor_name, f.counter, f.tag, f.ram, f.rootdisk, f.vcpus, f.gpu, f.epheremal_disk);
                    requestExtensionTotalCores += f.vcpus * f.counter;
                    requestExtensionTotalRam += f.ram * f.counter

                ***REMOVED***

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

                a.ApplicationExtension = r;
            ***REMOVED***
            this.getFacilityProject(a);

            this.all_applications[index] = a;

        ***REMOVED***)
    ***REMOVED***

    /**
     * Gets a user application with the actual values.
     * @param ***REMOVED***Application***REMOVED*** application
     */
    public getUserApplication(application: Application): void ***REMOVED***
        const index: number = this.user_applications.indexOf(application);

        this.applicationsservice.getUserApplication(application.Id.toString()).subscribe((aj: object) => ***REMOVED***
            const a: Application = new Application();
            a.Id = aj['project_application_id'];
            a.Name = aj['project_application_name'];
            a.Shortname = aj['project_application_shortname'];
            a.Lifetime = aj['project_application_lifetime'];
            a.DateSubmitted = aj['project_application_date_submitted'];
            a.Status = aj['project_application_status']['application_status_name'];
            a.Description = aj['project_application_description'];
            a.VMsRequested = aj['project_application_vms_requested'];
            a.RamPerVM = aj['project_application_ram_per_vm'];
            a.TotalRam = aj['project_application_total_ram'];
            a.TotalCores = aj['project_application_total_cores'];
            a.CoresPerVM = aj['project_application_cores_per_vm'];
            a.VolumeLimit = aj['project_application_volume_limit'];
            a.VolumeCounter = aj['project_application_volume_counter'];
            a.ObjectStorage = aj['project_application_object_storage'];
            a.SpecialHardware = aj['project_application_special_hardware'];
            a.OpenStackProject = aj['project_application_openstack_project'];
            a.DateApproved = aj['project_application_date_approved'];
            a.Dissemination = aj['project_application_report_allowed'];
            a.Horizon2020 = aj['project_application_horizon2020'];

            a.PerunId = aj['project_application_perun_id'];
            a.Horizon2020 = aj['project_application_horizon2020'];

            a.Comment = aj['project_application_comment'];
            for (const f of aj['flavors']) ***REMOVED***
                a.addFlavorToCurrent(f.flavor_name, f.counter, f.tag, f.ram, f.rootdisk, f.vcpus, f.gpu, f.epheremal_disk)

            ***REMOVED***
            if (aj['projectapplicationrenewal']) ***REMOVED***
                const r: ApplicationExtension = new ApplicationExtension();
                let requestExtensionTotalCores: number = 0;
                let requestExtensionTotalRam: number = 0;

                for (const f of aj['projectapplicationrenewal']['flavors']) ***REMOVED***
                    r.addFlavorToRequested(f.flavor_name, f.counter, f.tag, f.ram, f.rootdisk, f.vcpus, f.gpu, f.epheremal_disk);
                    requestExtensionTotalCores += f.vcpus * f.counter;
                    requestExtensionTotalRam += f.ram * f.counter

                ***REMOVED***

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

                a.ApplicationExtension = r;
            ***REMOVED***
            this.user_applications[index] = a;

        ***REMOVED***)

    ***REMOVED***

    /**
     * Request an extension from an application.
     * @param data
     */
    public requestExtension(data: ***REMOVED*** [key: string]: string | number | boolean ***REMOVED***): void ***REMOVED***
        this.applicationsservice.requestRenewal(data).subscribe((result: ***REMOVED*** [key: string]: string ***REMOVED***) => ***REMOVED***
            if (result['Error']) ***REMOVED***
                this.extension_status = 2
            ***REMOVED*** else ***REMOVED***
                this.extension_status = 1;
            ***REMOVED***
            this.getUserApplication(this.selectedApplication);

            for (const app of this.all_applications) ***REMOVED***
                if (this.selectedApplication.PerunId === app.PerunId) ***REMOVED***
                    this.getApplication(app);
                    break;
                ***REMOVED***

            ***REMOVED***
        ***REMOVED***)

    ***REMOVED***

    /**
     * Get details of member like name and email by elixir.
     * @param ***REMOVED***string***REMOVED*** elixir_id
     * @param ***REMOVED***string***REMOVED*** collapse_id
     */
    public getMemberDetailsByElixirIdIfCollapsed(elixir_id: string, collapse_id: string): void ***REMOVED***
        if (!this.getCollapseStatus(collapse_id)) ***REMOVED***
            if (!(elixir_id in this.application_user)) ***REMOVED***
                this.userservice.getMemberDetailsByElixirId(elixir_id).subscribe((result: ***REMOVED*** [key: string]: string ***REMOVED***) => ***REMOVED***

                    const name: string = `$***REMOVED***result['firstName']***REMOVED*** $***REMOVED***result['lastName']***REMOVED***`;
                    const appuser: ***REMOVED*** [id: string]: string ***REMOVED*** = ***REMOVED******REMOVED***;
                    appuser['name'] = name;
                    appuser['email'] = result['email'];
                    this.application_user[elixir_id] = appuser;
                ***REMOVED***)
            ***REMOVED***
        ***REMOVED***

    ***REMOVED***

    /**
     * Approve an extension request.
     * @param ***REMOVED***Application***REMOVED*** app
     */
    public approveExtension(app: Application): void ***REMOVED***

        if (app.OpenStackProject) ***REMOVED***
            this.applicationstatusservice.setApplicationStatus(
                app.Id.toString(),
                this.WAIT_FOR_EXTENSION_STATUS.toString()).subscribe(() => ***REMOVED***
                this.extension_status = 5;
                this.getApplication(app);
                this.getUserApplication(app);

                for (const appl of this.user_applications) ***REMOVED***
                    if (this.selectedApplication.PerunId === appl.PerunId) ***REMOVED***
                        this.getUserApplication(appl);
                        break;
                    ***REMOVED***

                ***REMOVED***
            ***REMOVED***)
        ***REMOVED*** else ***REMOVED***
            this.applicationsservice.approveRenewal(app.Id).subscribe((result: ***REMOVED*** [key: string]: string ***REMOVED***) => ***REMOVED***
                if (result['Error']) ***REMOVED***
                    this.extension_status = 2
                ***REMOVED*** else ***REMOVED***
                    this.extension_status = 3;
                ***REMOVED***
                this.getApplication(this.selectedApplication);

                for (const appl of this.user_applications) ***REMOVED***
                    if (this.selectedApplication.PerunId === appl.PerunId) ***REMOVED***
                        this.getUserApplication(appl);
                        break;
                    ***REMOVED***

                ***REMOVED***
            ***REMOVED***)
        ***REMOVED***
    ***REMOVED***

    /**
     * Decline an extension request.
     * @param ***REMOVED***number***REMOVED*** application_id
     */
    public declineExtension(application_id: number): void ***REMOVED***
        this.applicationsservice.declineRenewal(application_id).subscribe((result: ***REMOVED*** [key: string]: string ***REMOVED***) => ***REMOVED***
            if (result != null) ***REMOVED***
                this.extension_status = 2
            ***REMOVED*** else ***REMOVED***
                this.extension_status = 4;
            ***REMOVED***
            this.getApplication(this.selectedApplication);

            for (const app of this.user_applications) ***REMOVED***
                if (this.selectedApplication.PerunId === app.PerunId) ***REMOVED***
                    this.getUserApplication(app);
                    break;
                ***REMOVED***

            ***REMOVED***
        ***REMOVED***)
    ***REMOVED***

    /**
     * Get status name  by status id.
     * @param ***REMOVED***number***REMOVED*** id
     * @returns ***REMOVED***string***REMOVED***
     */
    public getStatusById(id: number): string ***REMOVED***
        const s: string = 'Unknown';
        for (const status of this.application_status) ***REMOVED***
            if (status.Id === id) ***REMOVED***
                return status.Name;
            ***REMOVED***
        ***REMOVED***

        return s;
    ***REMOVED***

    /**
     * Get id by status name.
     * @param ***REMOVED***string***REMOVED*** name
     * @returns ***REMOVED***number***REMOVED***
     */
    public getIdByStatus(name: string): number ***REMOVED***
        const s: number = -1;
        for (const status of this.application_status) ***REMOVED***
            if (status.Name === name) ***REMOVED***
                return status.Id;
            ***REMOVED***
        ***REMOVED***

        return s;
    ***REMOVED***

    /**
     * Remove Application from facility , where it is for confirmation
     * @param ***REMOVED***Application***REMOVED*** application the application
     */
    removeApplicationFromFacilityConfirmation(application: Application): void ***REMOVED***
        this.groupservice.removeGroupFromResource(application.PerunId.toString()).subscribe(() => ***REMOVED***
            this.getApplication(application)
        ***REMOVED***)

    ***REMOVED***

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
                                       compute_center: string): void ***REMOVED***
        // get memeber id in order to add the user later as the new member and manager of the group
        let manager_member_id: string;
        let manager_member_user_id: string;
        let new_group_id: string;

        this.userservice.getMemberByExtSourceNameAndExtLogin(manager_elixir_id).subscribe(
            (member_raw: ***REMOVED*** [key: string]: string ***REMOVED***) => ***REMOVED***
                const member: ***REMOVED*** [key: string]: string ***REMOVED*** = member_raw;
                manager_member_id = member['id'];
                manager_member_user_id = member['userId'];
                this.groupservice.createGroup(name, description).subscribe((group: ***REMOVED*** [key: string]: string ***REMOVED***) => ***REMOVED***
                    new_group_id = group['id'];
                    this.groupservice.addMember(new_group_id, manager_member_id, compute_center).subscribe();
                    this.groupservice.addAdmin(new_group_id, manager_member_user_id, compute_center).subscribe(() => ***REMOVED***
                        this.groupservice.setPerunGroupAttributes(application_id, new_group_id).subscribe(() => ***REMOVED***
                            this.groupservice.assignGroupToResource(new_group_id.toString(), compute_center).subscribe(() => ***REMOVED***
                                if (compute_center !== 'undefined') ***REMOVED***
                                    this.applicationstatusservice.setApplicationStatus(
                                        application_id,
                                        this.application_statuses.WAIT_FOR_CONFIRMATION.toString())
                                        .subscribe((result: ***REMOVED*** [key: string]: string ***REMOVED***) => ***REMOVED***
                                                if (result['Error']) ***REMOVED***
                                                    this.updateNotificationModal('Failed', result['Error'], true, 'danger');

                                                ***REMOVED*** else ***REMOVED***
                                                    this.updateNotificationModal('Success', 'The new project was created', true, 'success');
                                                ***REMOVED***
                                                for (const app of this.user_applications) ***REMOVED***
                                                    if (app.Id.toString() === application_id) ***REMOVED***
                                                        this.getUserApplication(app);
                                                        break;

                                                    ***REMOVED***

                                                ***REMOVED***
                                                for (const app of this.all_applications) ***REMOVED***
                                                    if (app.Id.toString() === application_id) ***REMOVED***
                                                        this.getApplication(app);
                                                        break;

                                                    ***REMOVED***
                                                ***REMOVED***
                                            ***REMOVED***
                                        )
                                ***REMOVED*** else ***REMOVED***
                                    this.groupservice.setPerunGroupStatus(
                                        new_group_id,
                                        this.application_statuses.APPROVED.toString()).subscribe(() => ***REMOVED***
                                        this.applicationstatusservice.setApplicationStatus(
                                            application_id,
                                            this.application_statuses.APPROVED.toString())
                                            .subscribe((result: ***REMOVED*** [key: string]: string ***REMOVED***) => ***REMOVED***
                                                if (result['Error']) ***REMOVED***
                                                    this.updateNotificationModal('Failed', result['Error'], true, 'danger');

                                                ***REMOVED*** else ***REMOVED***
                                                    this.updateNotificationModal('Success', 'The new project was created', true, 'success');
                                                ***REMOVED***
                                                for (const appl of this.user_applications) ***REMOVED***
                                                    if (appl.Id.toString() === application_id) ***REMOVED***
                                                        this.getUserApplication(appl);
                                                        break;

                                                    ***REMOVED***
                                                    for (const app of this.user_applications) ***REMOVED***
                                                        if (app.Id.toString() === application_id) ***REMOVED***
                                                            this.getUserApplication(app);
                                                            break;

                                                        ***REMOVED***

                                                    ***REMOVED***
                                                    for (const app of this.all_applications) ***REMOVED***
                                                        if (app.Id.toString() === application_id) ***REMOVED***
                                                            this.getApplication(app);
                                                            break;

                                                        ***REMOVED***
                                                    ***REMOVED***
                                                ***REMOVED***
                                            ***REMOVED***)

                                    ***REMOVED***)

                                ***REMOVED***
                            ***REMOVED***);
                        ***REMOVED***)

                    ***REMOVED***)

                ***REMOVED***)
            ***REMOVED***,
            () => ***REMOVED***
                this.updateNotificationModal('Failed', 'Project could not be created!', true, 'danger');
            ***REMOVED***)

    ***REMOVED***

    public resetNotificationModal(): void ***REMOVED***
        this.notificationModalTitle = 'Notification';
        this.notificationModalMessage = 'Please wait...';
        this.notificationModalIsClosable = false;
        this.notificationModalType = 'info';
        this.notificationClientInfo = [];
    ***REMOVED***

    /**
     * Bugfix not scrollable site after closing modal
     */
    removeModalOpen(): void ***REMOVED***
        document.body.classList.remove('modal-open');
    ***REMOVED***

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
                                      compute_center: string): void ***REMOVED***

        // get memeber id in order to add the user later as the new member and manager of the group
        let manager_member_id: string;
        let manager_member_user_id: string;
        let new_group_id: string;
        this.applicationsservice.getApplicationClientAvaiable(application_id).subscribe(
            (res: Client) => ***REMOVED***
                if (res['Info']) ***REMOVED***
                    if (res['Clients']) ***REMOVED***
                        for (const client of res['Clients']) ***REMOVED***
                            const newClient: Client = new Client();
                            newClient.location = client.location;
                            newClient.maxVolumeLimit = client.max_ressources.maxTotalVolumeGigabytes;
                            newClient.maxVolumes = client.max_ressources.maxTotalVolumes;
                            newClient.maxVMs = client.max_ressources.maxTotalInstances;
                            newClient.assignedVMs = client.assigned_ressources.vms;
                            newClient.assignedVolumes = client.assigned_ressources.volumes;
                            newClient.assignedVolumesStorage = client.assigned_ressources.volumeLimit;
                            this.notificationClientInfo.push(newClient);
                        ***REMOVED***
                    ***REMOVED***
                    this.updateNotificationModal('Failed', res['Info'], true, 'danger');

                ***REMOVED*** else ***REMOVED***
                    this.applicationstatusservice.setApplicationStatus(
                        application_id,
                        this.application_statuses.APPROVED.toString()).subscribe((result: ***REMOVED*** [key: string]: string ***REMOVED***) => ***REMOVED***
                        if (result['Error']) ***REMOVED***

                            this.updateNotificationModal('Failed', result['Error'], true, 'danger');

                        ***REMOVED*** else ***REMOVED***
                            this.userservice.getMemberByExtSourceNameAndExtLogin(
                                manager_elixir_id).subscribe((member_raw: ***REMOVED*** [key: string]: string ***REMOVED***) => ***REMOVED***
                                const member: ***REMOVED*** [key: string]: string ***REMOVED*** = member_raw;
                                manager_member_id = member['id'];
                                manager_member_user_id = member['userId'];
                                this.groupservice.createGroup(name, description).subscribe((group: ***REMOVED*** [key: string]: string ***REMOVED***) => ***REMOVED***
                                    new_group_id = group['id'];
                                    this.groupservice.addMember(
                                        new_group_id.toString(),
                                        manager_member_id.toString(),
                                        compute_center).subscribe();
                                    this.groupservice.addAdmin(
                                        new_group_id.toString(),
                                        manager_member_user_id,
                                        compute_center).subscribe(() => ***REMOVED***
                                        this.groupservice.setPerunGroupAttributes(application_id, new_group_id).subscribe(() => ***REMOVED***
                                                if (result['Info']) ***REMOVED***
                                                    this.updateNotificationModal('Failed', result['Info'], true, 'danger');

                                                ***REMOVED*** else ***REMOVED***
                                                    this.applicationsservice.getApplicationClient(
                                                        application_id).subscribe((client: object) => ***REMOVED***
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
                                                            'Success', `The new project was created and assigned to $***REMOVED***newClient.location***REMOVED***.`,
                                                            true,
                                                            'success');

                                                    ***REMOVED***);
                                                ***REMOVED***

                                                for (const app of this.user_applications) ***REMOVED***
                                                    if (app.Id.toString() === application_id) ***REMOVED***
                                                        this.getUserApplication(app);
                                                        break;

                                                    ***REMOVED***

                                                ***REMOVED***
                                                for (const app of this.all_applications) ***REMOVED***
                                                    if (app.Id.toString() === application_id) ***REMOVED***
                                                        this.getApplication(app);
                                                        break;

                                                    ***REMOVED***
                                                ***REMOVED***

                                            ***REMOVED***
                                        )

                                    ***REMOVED***);

                                ***REMOVED***);

                            ***REMOVED***)
                        ***REMOVED***

                    ***REMOVED***)
                ***REMOVED***

            ***REMOVED***,
            (error: object) => ***REMOVED***
                console.log(error);
                this.updateNotificationModal('Failed', 'Project could not be created!', true, 'danger');
            ***REMOVED***)

    ***REMOVED***

    assignGroupToFacility(group_id: string, application_id: string, compute_center: string): void ***REMOVED***
        if (compute_center !== 'undefined') ***REMOVED***
            this.groupservice.assignGroupToResource(group_id.toString(), compute_center).subscribe(
                () => ***REMOVED***
                    this.applicationstatusservice.setApplicationStatus(
                        application_id,
                        this.application_statuses.WAIT_FOR_CONFIRMATION.toString())
                        .subscribe(() => ***REMOVED***
                            for (const app of this.all_applications) ***REMOVED***
                                if (app.Id.toString() === application_id) ***REMOVED***
                                    this.getApplication(app);

                                    break;

                                ***REMOVED***
                            ***REMOVED***
                            this.updateNotificationModal('Success', 'The  project was assigned to the facility.', true, 'success');

                        ***REMOVED***)

                ***REMOVED***,
                (error: object) => ***REMOVED***
                    console.log(error);
                    this.updateNotificationModal('Failed', 'Project could not be created!', true, 'danger');
                ***REMOVED***);
        ***REMOVED*** else ***REMOVED***
            this.updateNotificationModal('Failed', 'You need to select an compute center!', true, 'danger');
        ***REMOVED***

    ***REMOVED***

    /**
     * Decline an application.
     * @param application_id
     */
    public declineApplication(application_id: string): void ***REMOVED***
        this.applicationstatusservice.setApplicationStatus(application_id, this.getIdByStatus('declined').toString()).toPromise()
            .then(() => ***REMOVED***
                this.all_applications = [];
                this.user_applications = [];
                this.getUserApplications();
                this.getAllApplications();
                this.updateNotificationModal('Success', 'The Application was declined', true, 'success');
            ***REMOVED***)
            .catch(() => ***REMOVED***
                this.updateNotificationModal('Failed', 'Application could be declined!', true, 'danger');
            ***REMOVED***);
    ***REMOVED***

    /**
     * Delete an application.
     * @param application_id
     */
    public deleteApplication(application_id: string): void ***REMOVED***
        this.applicationsservice.deleteApplication(application_id).toPromise()
            .then(() => ***REMOVED***
                this.updateNotificationModal('Success', 'The application has been successfully removed', true, 'success');
            ***REMOVED***).then(() => ***REMOVED***
            this.user_applications = [];
            this.all_applications = [];
            this.getUserApplications();
            this.getAllApplications();
        ***REMOVED***)
            .catch(() => ***REMOVED***
                this.updateNotificationModal('Failed', 'Application could not be removed!', true, 'danger');
            ***REMOVED***);
    ***REMOVED***

    /**
     * Check if active applications are available.
     * @returns ***REMOVED***boolean***REMOVED***
     */
    public activeApplicationsAvailable(): boolean ***REMOVED***
        for (const application of this.all_applications) ***REMOVED***
            if (application.Status === 1 || application.Status === 4 || application.Status === 7 || application.Status === 6) ***REMOVED***
                return true;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***

    public setApplicationStatus(status: number, app: Application): void ***REMOVED***
        this.applicationstatusservice.setApplicationStatus(app.Id.toString(), status.toString()).subscribe()
    ***REMOVED***

    /**
     * Set the id of the application which should be deleted.
     * @param applicationId
     */
    public setDeleteId(applicationId: number): void ***REMOVED***
        this.deleteId = applicationId;
    ***REMOVED***

    /**
     * Coming soon.
     */
    public comingSoon(): void ***REMOVED***
        alert('This functinality will be implemented soon!')
    ***REMOVED***

***REMOVED***
