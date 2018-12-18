import ***REMOVED***Component, ViewChild***REMOVED*** from '@angular/core';
import ***REMOVED***ApplicationsService***REMOVED*** from '../api-connector/applications.service'
import ***REMOVED***SpecialHardwareService***REMOVED*** from '../api-connector/special-hardware.service'
import ***REMOVED***ApplicationStatusService***REMOVED*** from '../api-connector/application-status.service'
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service'
import ***REMOVED***PerunSettings***REMOVED*** from "../perun-connector/connector-settings.service";
import ***REMOVED***Application***REMOVED*** from "./application.model";
import ***REMOVED***ApplicationStatus***REMOVED*** from "./application_status.model";
import ***REMOVED***SpecialHardware***REMOVED*** from "./special_hardware.model"
import ***REMOVED***ModalDirective***REMOVED*** from "ngx-bootstrap";
import ***REMOVED***ResourcesManager***REMOVED*** from "../perun-connector/resources_manager";
import ***REMOVED***GroupService***REMOVED*** from "../api-connector/group.service";
import * as moment from 'moment';
import ***REMOVED***UserService***REMOVED*** from "../api-connector/user.service";
import ***REMOVED***ApplicationExtension***REMOVED*** from "./application_extension.model";
import ***REMOVED***NgForm***REMOVED*** from '@angular/forms';
import ***REMOVED***forkJoin***REMOVED*** from 'rxjs';
import ***REMOVED***VoService***REMOVED*** from "../api-connector/vo.service";
import ***REMOVED***ComputecenterComponent***REMOVED*** from "../projectmanagement/computecenter.component";
import ***REMOVED***FacilityService***REMOVED*** from "../api-connector/facility.service";
import ***REMOVED***Project***REMOVED*** from "../projectmanagement/project.model";
import ***REMOVED***AbstractBaseClasse***REMOVED*** from "../shared_modules/baseClass/abstract-base-class";
import ***REMOVED***FlavorType***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavorType';
import ***REMOVED***Flavor***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavor';
import ***REMOVED***FlavorService***REMOVED*** from '../api-connector/flavor.service';
import _date = moment.unitOfTime._date;
import ***REMOVED***forEach***REMOVED*** from '@angular/router/src/utils/collection';


@Component(***REMOVED***
    templateUrl: 'applications.component.html',
    providers: [FacilityService, VoService, UserService, GroupService, PerunSettings, ApplicationStatusService, ApplicationsService, SpecialHardwareService, ApiSettings, FlavorService]
***REMOVED***)
export class ApplicationsComponent extends AbstractBaseClasse ***REMOVED***

    /**
     * Applications of the user viewing the Application overview.
     * @type ***REMOVED***Array***REMOVED***
     */
    user_applications: Application[] = [];

    /**
     * If the user is a vo admin.
     * @type ***REMOVED***boolean***REMOVED***
     */
    is_vo_admin = false;

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
     * Avaiable Special Hardwares.
     * @type ***REMOVED***Array***REMOVED***
     */
    special_hardware: SpecialHardware[] = [];

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
    extension_status = 0;
    /**
     * Id of Application set for deletion.
     */
    public deleteId: number;

    /**
     * If all userApplications are loaded, important for the loader.
     * @type ***REMOVED***boolean***REMOVED***
     */
    isLoaded_userApplication = false;

    /**
     * If all Applications are loaded, important for the loader.
     * @type ***REMOVED***boolean***REMOVED***
     */
    isLoaded_AllApplication = false;

    /**
     * User which requested the Application ***REMOVED***id: Elixir Id of user : ***REMOVED***name and email***REMOVED******REMOVED***.
     * @type ***REMOVED******REMOVED******REMOVED******REMOVED***
     */
    application_user: ***REMOVED*** [id: string]: ***REMOVED*** [id: string]: string ***REMOVED*** ***REMOVED*** = ***REMOVED******REMOVED***;

    //notification Modal variables
    public notificationModalTitle: string = "Notification";
    public notificationModalMessage: string = "Please wait...";
    public notificationModalType: string = "info";
    public notificationModalIsClosable: boolean = false;
    private APPROVED_STATUS = 2;
    private WAIT_FOR_EXTENSION_STATUS = 6;
    private EXTENSION_STATUS = 4;
    private EXTENSTION_STATUS_STRING = 'modification requested';

    /**
     * Special hardware id for FPGA.
     * @type ***REMOVED***number***REMOVED***
     */
    public FPGA = 1;

    /**
     * Special hardware id for GPU.
     * @type ***REMOVED***number***REMOVED***
     */
    public GPU = 2;


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
    public totalNumberOfCores = 0;
    /**
     * Total number of ram.
     * @type ***REMOVED***number***REMOVED***
     */
    public totalRAM = 0;

    /**
     * Constructor.
     * Loads all Applications if user is vo admin and all user_applications.
     * @param ***REMOVED***ApplicationsService***REMOVED*** applicationsservice
     * @param ***REMOVED***ApplicationStatusService***REMOVED*** applicationstatusservice
     * @param ***REMOVED***SpecialHardwareService***REMOVED*** specialhardwareservice
     * @param ***REMOVED***UserService***REMOVED*** userservice
     * @param ***REMOVED***GroupService***REMOVED*** groupservice
     * @param ***REMOVED***VoService***REMOVED*** voService
     * @param ***REMOVED***FacilityService***REMOVED*** facilityService
     */
    constructor(private applicationsservice: ApplicationsService,
                private applicationstatusservice: ApplicationStatusService,
                private specialhardwareservice: SpecialHardwareService,
                private userservice: UserService,
                private groupservice: GroupService,
                private voService: VoService,
                private facilityService: FacilityService,
                private flavorService: FlavorService) ***REMOVED***

      super();
        this.voService.isVo().subscribe(result => ***REMOVED***

            this.is_vo_admin = result['Is_Vo_Manager'];
            this.getUserApplications();
            this.getApplicationStatus();
            this.getSpecialHardware();
            if (this.is_vo_admin) ***REMOVED***
                this.getAllApplications();
                this.getComputeCenters();


            ***REMOVED***
            else ***REMOVED***
                this.isLoaded_AllApplication = true;

            ***REMOVED***

        ***REMOVED***)
        this.getListOfFlavors();
        this.getListOfTypes();
    ***REMOVED***

    /**
     * Checks if the key given represents a flavor and if so returns the respective Flavor
     * @param key the key which is checked
     */
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
     * unused yet
     * @param app
     */
    flavorTuples(app: Application): [string, number][] ***REMOVED***
        let cur_flavors: [string, number][];
        for (let entry in app.CurrentFlavors) ***REMOVED***
            cur_flavors.push([entry, app.CurrentFlavors[entry].counter]);
            console.log(entry);
        ***REMOVED***
        return cur_flavors;
    ***REMOVED***

    /**
     * Resets the values of totalRAM und totalNumberOfCores to 0 and changes the text at the end of the extension form.
     * @param elemIDcores the ID of the label containing the number of cores
     * @param elemIDram the ID of the label containing the amount of RAM
     */
    unsetValues(elemIDcores, elemIDram: string) ***REMOVED***
        this.totalRAM = 0;
        this.totalNumberOfCores = 0;
        document.getElementById(elemIDcores).innerHTML = 'Number of total cores: ' + this.totalNumberOfCores.toString();
        document.getElementById(elemIDram).innerHTML = 'Total amout of RAM: ' + this.totalRAM.toString() + ' GB';


    ***REMOVED***

    /**
     * Called whenvalues of the flavor-input-fields are changed and if so changes the values shown at the end of the form.
     * @param f the form which contains the input-fields
     */
    valuesChanged(f: NgForm) ***REMOVED***

        this.totalRAM = 0;
        this.totalNumberOfCores = 0;
        for (let key in f.controls) ***REMOVED***
            if (f.controls[key].value) ***REMOVED***
                var flavor: Flavor = this.keyIsVM(key.toString());
                if (flavor != null) ***REMOVED***
                    this.totalNumberOfCores = this.totalNumberOfCores + (flavor.vcpus * f.controls[key].value);
                    this.totalRAM = this.totalRAM + (flavor.ram * f.controls[key].value);
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***

        document.getElementById('corenumbers').innerHTML = 'Number of total cores: ' + this.totalNumberOfCores.toString();
        document.getElementById('ramnumbers').innerHTML = 'Total amout of RAM: ' + this.totalRAM.toString() + ' GB';


    ***REMOVED***

    /**
     * gets a list of all available Flavors from the flavorservice and puts them into the array flavorList
     */
    getListOfFlavors() ***REMOVED***
        this.flavorService.getListOfFlavorsAvailable().subscribe(flavors => this.flavorList = flavors);
    ***REMOVED***

    /**
     * gets a list of all available types of flavors from the flavorservice and uses them in the function setListOfTypes
     */
    getListOfTypes() ***REMOVED***
        this.flavorService.getListOfTypesAvailable().subscribe(types => this.setListOfTypes(types));
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

    ***REMOVED***

    /**
     * Gets all available compute centers and saves them in the computeCenters attribute.
     */
    getComputeCenters() ***REMOVED***
        this.facilityService.getComputeCenters().subscribe(result => ***REMOVED***
            for (let cc of result) ***REMOVED***
                let compute_center = new ComputecenterComponent(cc['compute_center_facility_id'], cc['compute_center_name'], cc['compute_center_login'], cc['compute_center_support_mail'])
                this.computeCenters.push(compute_center)
            ***REMOVED***

        ***REMOVED***)
    ***REMOVED***

    /**
     * Gets all affialiations from a user.
     * @param ***REMOVED***number***REMOVED*** user
     */
    getUserAffilaitions(user: number) ***REMOVED***
        this.userservice.getuserAffiliations(user).subscribe()
    ***REMOVED***

    /**
     * Sets the selected application.
     * @param application
     */
    setSelectedApplication(application: any) ***REMOVED***
        this.selectedApplication = application;


    ***REMOVED***


    /**
     * Submits an renewal request for an application.
     * @param ***REMOVED***NgForm***REMOVED*** f
     */
    onSubmit(f: NgForm) ***REMOVED***
        let values = ***REMOVED******REMOVED***;
        values['project_application_renewal_special_hardware'] = this.special_hardware.filter(hardware => hardware.Checked).map(hardware => hardware.Id)
        for (let v in f.controls) ***REMOVED***
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
    ngFormSetDefault(f: NgForm) ***REMOVED***
        f.reset(***REMOVED***
            project_application_renewal_vms_requested: this.selectedApplication.VMsRequested,
            project_application_renewal_cores_per_vm: this.selectedApplication.CoresPerVM,
            project_application_renewal_ram_per_vm: this.selectedApplication.RamPerVM,
            project_application_renewal_volume_limit: this.selectedApplication.VolumeLimit,
            project_application_renewal_volume_counter: this.selectedApplication.VolumeCounter,
            project_application_renewal_object_storage: this.selectedApplication.ObjectStorage,
            project_application_renewal_comment: this.selectedApplication.Comment,


        ***REMOVED***)

    ***REMOVED***

    /**
     * Gets all Application of the user viewing the application overview.
     * Saves them in the userApplication array.
     */
    getUserApplications() ***REMOVED***
        this.applicationsservice
            .getUserApplications().subscribe(result => ***REMOVED***
            let res = result;
            if (Object.keys(res).length == 0) ***REMOVED***
                this.isLoaded_userApplication = true;
            ***REMOVED***
            for (let key in res) ***REMOVED***
                let aj = res[key];
                let a = new Application();
                a.Id = aj["project_application_id"];
                a.Name = aj["project_application_name"];
                a.Shortname = aj["project_application_shortname"];
                a.Lifetime = aj["project_application_lifetime"];
                a.DateSubmitted = aj["project_application_date_submitted"];
                a.Status = aj["project_application_status"]["application_status_name"];
                a.Description = aj["project_application_description"];
                a.VMsRequested = aj["project_application_vms_requested"];
                a.RamPerVM = aj["project_application_ram_per_vm"];
                a.TotalRam = aj["project_application_total_ram"];
                a.TotalCores = aj["project_application_total_cores"];
                a.CoresPerVM = aj["project_application_cores_per_vm"];
                a.VolumeLimit = aj["project_application_volume_limit"];
                a.VolumeCounter = aj["project_application_volume_counter"];
                a.ObjectStorage = aj["project_application_object_storage"];
                a.SpecialHardware = aj["project_application_special_hardware"];
                a.OpenStackProject = aj["project_application_openstack_project"];
                a.Comment = aj["project_application_comment"];
                a.PerunId = aj['project_application_perun_id'];
                a.DateApproved = aj['project_application_date_approved'];

                for (let f of aj['flavors']) ***REMOVED***
                    a.addFlavorToCurrent(f.flavor_name, f.counter, f.tag, f.ram, f.rootdisk, f.vcpus, f.gpu, f.epheremal_disk)

                ***REMOVED***

                if (aj['projectapplicationrenewal']) ***REMOVED***
                    let r = new ApplicationExtension();
                    let requestExtensionTotalCores = 0;
                    let requestExtensionTotalRam = 0;


                    for (let f of aj['projectapplicationrenewal']['flavors']) ***REMOVED***
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
                    let special_hardware = [];
                    if (aj['projectapplicationrenewal']['project_application_renewal_special_hardware'] != null) ***REMOVED***
                        let special_hardware_string = aj['projectapplicationrenewal']['project_application_renewal_special_hardware'].toString();

                        for (let c = 0; c < special_hardware_string.length; c++) ***REMOVED***
                            let sh = special_hardware_string.charAt(c) == this.FPGA ? "FPGA" : "GPU";
                            special_hardware.push(sh)

                        ***REMOVED***

                        r.SpecialHardware = special_hardware;
                    ***REMOVED***
                    a.ApplicationExtension = r;
                ***REMOVED***
                this.user_applications.push(a)
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
        var date1 = new Date(Number(approval.substring(0, 4)), Number(approval.substring(5, 7)) - 1, Number(approval.substring(8)));
        var m = date1.getMonth();
        if ((m + months) > 11) ***REMOVED***
            date1 = new Date(date1.getFullYear(), (m + months - 12), date1.getDate());
        ***REMOVED***
        else ***REMOVED***
            date1.setMonth(date1.getMonth() + months);
        ***REMOVED***

        return date1.getFullYear() + '-' + this.fillUp((date1.getMonth() + 1).toString()) + '-' + this.fillUp(date1.getDate().toString());
    ***REMOVED***

    fillUp(date: string): string ***REMOVED***
        if (date.length === 1) ***REMOVED***
            return '0' + date;
        ***REMOVED***
        return date;
    ***REMOVED***

    showLifetime(sa?: Application): string ***REMOVED***
        if (!sa) ***REMOVED***
            return
        ***REMOVED***
        return sa.DateApproved + ' - ' + this.getEndDate(sa.DateApproved, sa.Lifetime);
    ***REMOVED***

    /**
     * Returns a boolean indicating if the special Hardware which is represented by nums is in use.
     * @param nums number representing special Hardware
     * @param application application where it might be in use
     */
    specialHardwareInUse(nums: number, application: Application): boolean ***REMOVED***
        console.log(application.SpecialHardware.toString() + ' ' + nums.toString())
        return (application.SpecialHardware.toString().includes(nums.toString()));
    ***REMOVED***


    /**
     * Get all possible application stati.
     */
    getApplicationStatus() ***REMOVED***
        this.applicationstatusservice.getAllApplicationStatus().toPromise()
            .then(result => ***REMOVED***
                let res = result;
                for (let key in res) ***REMOVED***
                    let asj = res[key];
                    let aj = new ApplicationStatus(asj["application_status_id"], asj["application_status_name"]);
                    this.application_status.push(aj)
                ***REMOVED***
            ***REMOVED***);
    ***REMOVED***

    /**
     * Get all available special hardware.
     */
    getSpecialHardware() ***REMOVED***
        this.specialhardwareservice.getAllSpecialHardware().toPromise()
            .then(result => ***REMOVED***
                let res = result;
                for (let key in res) ***REMOVED***
                    let shj = res[key];
                    let sh = new SpecialHardware(shj["special_hardware_id"], shj["special_hardware_key"], shj["special_hardware_name"]);
                    this.special_hardware.push(sh)
                ***REMOVED***
            ***REMOVED***);
    ***REMOVED***

    /**
     * Get all Applications if user is admin.
     */
    getAllApplications() ***REMOVED***
        //todo check if user is VO Admin

        if (this.is_vo_admin) ***REMOVED***
            this.applicationsservice.getAllApplications().subscribe(res => ***REMOVED***
                if (Object.keys(res).length == 0) ***REMOVED***
                    this.isLoaded_AllApplication = true;
                ***REMOVED***

                for (let key in res) ***REMOVED***

                    let aj = res[key];
                    let a = new Application();
                    a.Id = aj["project_application_id"];

                    a.Name = aj["project_application_name"];
                    a.Shortname = aj["project_application_shortname"];
                    a.Description = aj["project_application_description"];
                    a.Lifetime = aj["project_application_lifetime"];

                    a.VMsRequested = aj["project_application_vms_requested"];
                    a.RamPerVM = aj["project_application_ram_per_vm"];
                    a.TotalRam = aj["project_application_total_ram"];
                    a.TotalCores = aj["project_application_total_cores"];
                    a.CoresPerVM = aj["project_application_cores_per_vm"];
                    a.VolumeLimit = aj["project_application_volume_limit"];
                    a.VolumeCounter = aj["project_application_volume_counter"];

                    a.ObjectStorage = aj["project_application_object_storage"];
                    a.SpecialHardware = aj["project_application_special_hardware"];

                    a.Institute = aj["project_application_institute"];
                    a.Workgroup = aj["project_application_workgroup"];
                    a.DateApproved = aj['project_application_date_approved'];


                    a.DateSubmitted = aj["project_application_date_submitted"];
                    a.DateStatusChanged = aj["project_application_date_status_changed"];
                    a.User = aj["project_application_user"]["username"];
                    a.UserAffiliations = aj["project_application_user"]['profile']['affiliations'];
                    a.UserEmail = aj["project_application_user"]["email"];
                    a.Status = aj["project_application_status"];

                    for (let f of aj['flavors']) ***REMOVED***
                        a.addFlavorToCurrent(f.flavor_name, f.counter, f.tag, f.ram, f.rootdisk, f.vcpus, f.gpu, f.epheremal_disk)

                    ***REMOVED***
                    if (a.Status === this.APPROVED_STATUS) ***REMOVED***

                        a.DaysRunning = Math.ceil((Math.abs(Date.now() - new Date(a.DateStatusChanged).getTime())) / (1000 * 3600 * 24));


                    ***REMOVED***

                    a.Comment = aj["project_application_comment"];
                    a.PerunId = aj['project_application_perun_id'];
                    a.OpenStackProject = aj["project_application_openstack_project"];
                    if (aj['projectapplicationrenewal']) ***REMOVED***
                        let r = new ApplicationExtension();
                        let requestExtensionTotalCores = 0;
                        let requestExtensionTotalRam = 0;


                        for (let f of aj['projectapplicationrenewal']['flavors']) ***REMOVED***
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
                        let special_hardware = [];
                        if (aj['projectapplicationrenewal']['project_application_renewal_special_hardware'] != null) ***REMOVED***
                            let special_hardware_string = aj['projectapplicationrenewal']['project_application_renewal_special_hardware'].toString();
                            console.log(special_hardware_string)

                            for (let c = 0; c < special_hardware_string.length; c++) ***REMOVED***
                                let sh = special_hardware_string.charAt(c) == this.FPGA ? "FPGA" : "GPU";
                                special_hardware.push(sh)

                            ***REMOVED***

                            r.SpecialHardware = special_hardware;
                        ***REMOVED***
                        a.ApplicationExtension = r;

                    ***REMOVED***

                    this.all_applications.push(a);

                ***REMOVED***

                this.isLoaded_AllApplication = true;
                for (let app of this.all_applications) ***REMOVED***
                    if (app.Status == this.application_statuses.WAIT_FOR_CONFIRMATION || app.Status == this.application_statuses.MODIFICATION_REQUESTED) ***REMOVED***
                        this.getFacilityProject(app);
                    ***REMOVED***
                ***REMOVED***

            ***REMOVED***);
        ***REMOVED***
        else ***REMOVED***
            this.isLoaded_AllApplication = true;

        ***REMOVED***


    ***REMOVED***

    /**
     * Get the facility of an application.
     * @param ***REMOVED***Application***REMOVED*** app
     */
    public getFacilityProject(app: Application) ***REMOVED***

        if (!app.ComputeCenter && app.Status.toString() != 'submitted') ***REMOVED***
            this.groupservice.getFacilityByGroup(app.PerunId.toString()).subscribe(res => ***REMOVED***
                let login = res['Login'];
                let suport = res['Support'];
                let facilityname = res['Facility'];
                let facilityId = res['FacilityId'];

                let cc = new ComputecenterComponent(facilityId, facilityname, login, suport);
                app.ComputeCenter = cc


            ***REMOVED***)
        ***REMOVED***

    ***REMOVED***

    /**
     * Updates an application with the actual values.
     * @param ***REMOVED***Application***REMOVED*** application
     */
    public getApplication(application: Application) ***REMOVED***
        let index = this.all_applications.indexOf(application);

        this.applicationsservice.getApplication(application.Id.toString()).subscribe(aj => ***REMOVED***
            let a = new Application();
            a.Id = aj["project_application_id"];

            a.Name = aj["project_application_name"];
            a.Shortname = aj["project_application_shortname"];
            a.Description = aj["project_application_description"];
            a.Lifetime = aj["project_application_lifetime"];

            a.VMsRequested = aj["project_application_vms_requested"];
            a.RamPerVM = aj["project_application_ram_per_vm"];

            a.TotalRam = aj["project_application_total_ram"];
            a.TotalCores = aj["project_application_total_cores"];
            a.CoresPerVM = aj["project_application_cores_per_vm"];
            a.VolumeLimit = aj["project_application_volume_limit"];
            a.VolumeCounter = aj["project_application_volume_counter"];

            a.ObjectStorage = aj["project_application_object_storage"];
            a.SpecialHardware = aj["project_application_special_hardware"];

            a.Institute = aj["project_application_institute"];
            a.Workgroup = aj["project_application_workgroup"];
            a.DateApproved = aj['project_application_date_approved'];


            a.DateSubmitted = aj["project_application_date_submitted"];
            a.DateStatusChanged = aj["project_application_date_status_changed"];
            a.User = aj["project_application_user"]["username"];
            a.UserAffiliations = aj["project_application_user"]['profile']['affiliations'];
            a.UserEmail = aj["project_application_user"]["email"];
            a.Status = aj["project_application_status"];
            if (a.Status == this.application_statuses.APPROVED) ***REMOVED***
                a.DaysRunning = Math.ceil((Math.abs(Date.now() - new Date(a.DateStatusChanged).getTime())) / (1000 * 3600 * 24));


            ***REMOVED***
            a.Comment = aj["project_application_comment"];
            a.PerunId = aj['project_application_perun_id'];
            for (let f of aj['flavors']) ***REMOVED***
                a.addFlavorToCurrent(f.flavor_name, f.counter, f.tag, f.ram, f.rootdisk, f.vcpus, f.gpu, f.epheremal_disk)

            ***REMOVED***
            if (aj['projectapplicationrenewal']) ***REMOVED***
                let r = new ApplicationExtension();
                let requestExtensionTotalCores = 0;
                let requestExtensionTotalRam = 0;


                for (let f of aj['projectapplicationrenewal']['flavors']) ***REMOVED***
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
                let special_hardware = [];
                if (aj['projectapplicationrenewal']['project_application_renewal_special_hardware'] != null) ***REMOVED***
                    let special_hardware_string = aj['projectapplicationrenewal']['project_application_renewal_special_hardware'].toString();

                    for (let c = 0; c < special_hardware_string.length; c++) ***REMOVED***
                        let sh = special_hardware_string.charAt(c) == this.FPGA ? "FPGA" : "GPU";
                        special_hardware.push(sh)

                    ***REMOVED***

                    r.SpecialHardware = special_hardware;
                ***REMOVED***
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
    public getUserApplication(application: Application) ***REMOVED***
        let index = this.user_applications.indexOf(application);
        console.log(index)

        this.applicationsservice.getUserApplication(application.Id.toString()).subscribe(aj => ***REMOVED***
            let a = new Application();
            a.Id = aj["project_application_id"];
            a.Name = aj["project_application_name"];
            a.Shortname = aj["project_application_shortname"];
            a.Lifetime = aj["project_application_lifetime"];
            a.DateSubmitted = aj["project_application_date_submitted"];
            a.Status = aj["project_application_status"]["application_status_name"];
            a.Description = aj["project_application_description"];
            a.VMsRequested = aj["project_application_vms_requested"];
            a.RamPerVM = aj["project_application_ram_per_vm"];
            a.TotalRam = aj["project_application_total_ram"];
            a.TotalCores = aj["project_application_total_cores"];
            a.CoresPerVM = aj["project_application_cores_per_vm"];
            a.VolumeLimit = aj["project_application_volume_limit"];
            a.VolumeCounter = aj["project_application_volume_counter"];
            a.ObjectStorage = aj["project_application_object_storage"];
            a.SpecialHardware = aj["project_application_special_hardware"];
            a.OpenStackProject = aj["project_application_openstack_project"];
            a.DateApproved = aj['project_application_date_approved'];
            a.PerunId = aj['project_application_perun_id'];


            a.Comment = aj["project_application_comment"];
            for (let f of aj['flavors']) ***REMOVED***
                a.addFlavorToCurrent(f.flavor_name, f.counter, f.tag, f.ram, f.rootdisk, f.vcpus, f.gpu, f.epheremal_disk)

            ***REMOVED***
            if (aj['projectapplicationrenewal']) ***REMOVED***
                let r = new ApplicationExtension();
                let requestExtensionTotalCores = 0;
                let requestExtensionTotalRam = 0;


                for (let f of aj['projectapplicationrenewal']['flavors']) ***REMOVED***
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
                let special_hardware = [];
                if (aj['projectapplicationrenewal']['project_application_renewal_special_hardware'] != null) ***REMOVED***
                    let special_hardware_string = aj['projectapplicationrenewal']['project_application_renewal_special_hardware'].toString();

                    for (let c = 0; c < special_hardware_string.length; c++) ***REMOVED***
                        let sh = special_hardware_string.charAt(c) == this.FPGA ? "FPGA" : "GPU";
                        special_hardware.push(sh)

                    ***REMOVED***

                    r.SpecialHardware = special_hardware;
                ***REMOVED***
                a.ApplicationExtension = r;
            ***REMOVED***
            this.user_applications[index] = a;


        ***REMOVED***)


    ***REMOVED***

    /**
     * Request an extension from an application.
     * @param data
     */
    public requestExtension(data) ***REMOVED***
        this.applicationsservice.requestRenewal(data).subscribe(result => ***REMOVED***
            if (result['Error']) ***REMOVED***
                this.extension_status = 2
            ***REMOVED***
            else ***REMOVED***
                this.extension_status = 1;
            ***REMOVED***
            this.getUserApplication(this.selectedApplication);

            for (let app of this.all_applications) ***REMOVED***
                if (this.selectedApplication.PerunId == app.PerunId) ***REMOVED***
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
    public getMemberDetailsByElixirIdIfCollapsed(elixir_id: string, collapse_id: string) ***REMOVED***
        if (!this.getCollapseStatus(collapse_id)) ***REMOVED***
            if (!(elixir_id in this.application_user)) ***REMOVED***
                this.userservice.getMemberDetailsByElixirId(elixir_id).subscribe(result => ***REMOVED***

                    let name = result['firstName'] + ' ' + result['lastName'];
                    let appuser: ***REMOVED*** [id: string]: string ***REMOVED*** = ***REMOVED******REMOVED***;
                    appuser['name'] = name;
                    appuser['email'] = result['email'];
                    this.application_user[elixir_id] = appuser;
                ***REMOVED***)
            ***REMOVED***
        ***REMOVED***


    ***REMOVED***

    /**
     * Approve an extension request.
     * @param ***REMOVED***number***REMOVED*** application_id
     */
    public approveExtension(application_id: number) ***REMOVED***
        this.applicationsservice.approveRenewal(application_id).subscribe(result => ***REMOVED***
            if (result['Error']) ***REMOVED***
                this.extension_status = 2
            ***REMOVED***
            else ***REMOVED***
                this.extension_status = 3;
            ***REMOVED***
            this.getApplication(this.selectedApplication);

            for (let app of this.user_applications) ***REMOVED***
                if (this.selectedApplication.PerunId == app.PerunId) ***REMOVED***
                    this.getUserApplication(app);
                    break;
                ***REMOVED***

            ***REMOVED***
        ***REMOVED***)
    ***REMOVED***

    /**
     * Decline an extension request.
     * @param ***REMOVED***number***REMOVED*** application_id
     */
    public declineExtension(application_id: number) ***REMOVED***
        this.applicationsservice.declineRenewal(application_id).subscribe(result => ***REMOVED***
            if (result != null) ***REMOVED***
                this.extension_status = 2
            ***REMOVED***
            else ***REMOVED***
                this.extension_status = 4;
            ***REMOVED***
            this.getApplication(this.selectedApplication);

            for (let app of this.user_applications) ***REMOVED***
                if (this.selectedApplication.PerunId == app.PerunId) ***REMOVED***
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
        let s = "Unknown";
        for (let status of this.application_status) ***REMOVED***
            if (status.Id == id) ***REMOVED***
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
        let s = -1;
        for (let status of this.application_status) ***REMOVED***
            if (status.Name == name) ***REMOVED***
                return status.Id;
            ***REMOVED***
        ***REMOVED***
        return s;
    ***REMOVED***


    /**
     * Remove Application from facility , where it is for confirmation
     * @param ***REMOVED***Application***REMOVED*** application the application
     */
    removeApplicationFromFacilityConfirmation(application: Application) ***REMOVED***
        this.groupservice.removeGroupFromResource(application.PerunId.toString()).subscribe(res => ***REMOVED***
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
    public createOpenStackProjectGroup(name, description, manager_elixir_id, application_id, compute_center) ***REMOVED***
        //get memeber id in order to add the user later as the new member and manager of the group
        let manager_member_id: number;
        let manager_member_user_id: number;
        let new_group_id: number;

        this.userservice.getMemberByExtSourceNameAndExtLogin(manager_elixir_id).subscribe(member_raw => ***REMOVED***
                let member = member_raw;
                manager_member_id = member["id"];
                manager_member_user_id = member["userId"];
                this.groupservice.createGroup(name, description).subscribe(group_raw => ***REMOVED***
                    let group = group_raw;
                    new_group_id = group["id"];
                    this.groupservice.addMember(new_group_id, manager_member_id, compute_center).subscribe();
                    this.groupservice.addAdmin(new_group_id, manager_member_user_id, compute_center).subscribe(res => ***REMOVED***
                        this.groupservice.setPerunGroupAttributes(application_id, new_group_id).subscribe(res => ***REMOVED***
                            this.groupservice.assignGroupToResource(new_group_id.toString(), compute_center).subscribe(res => ***REMOVED***
                                if (compute_center != 'undefined') ***REMOVED***

                                    this.applicationstatusservice.setApplicationStatus(application_id, this.application_statuses.WAIT_FOR_CONFIRMATION, compute_center).subscribe(result => ***REMOVED***
                                            if (result['Error']) ***REMOVED***
                                                this.updateNotificationModal("Failed", result['Error'], true, "danger");

                                            ***REMOVED***
                                            else ***REMOVED***
                                                this.updateNotificationModal("Success", "The new project was created", true, "success");
                                            ***REMOVED***
                                            for (let app of this.user_applications) ***REMOVED***
                                                if (app.Id == application_id) ***REMOVED***
                                                    this.getUserApplication(app);
                                                    break;

                                                ***REMOVED***


                                            ***REMOVED***
                                            for (let app of this.all_applications) ***REMOVED***
                                                if (app.Id == application_id) ***REMOVED***
                                                    this.getApplication(app);
                                                    break;

                                                ***REMOVED***
                                            ***REMOVED***
                                        ***REMOVED***
                                    )
                                ***REMOVED*** else ***REMOVED***
                                    this.groupservice.setPerunGroupStatus(new_group_id, this.application_statuses.APPROVED).subscribe(res => ***REMOVED***
                                        this.applicationstatusservice.setApplicationStatus(application_id, this.application_statuses.APPROVED, compute_center).subscribe(result => ***REMOVED***
                                            if (result['Error']) ***REMOVED***
                                                this.updateNotificationModal("Failed", result['Error'], true, "danger");

                                            ***REMOVED***
                                            else ***REMOVED***
                                                this.updateNotificationModal("Success", "The new project was created", true, "success");
                                            ***REMOVED***
                                            for (let app of this.user_applications) ***REMOVED***
                                                if (app.Id == application_id) ***REMOVED***
                                                    this.getUserApplication(app);
                                                    break;

                                                ***REMOVED***


                                            ***REMOVED***
                                            for (let app of this.all_applications) ***REMOVED***
                                                if (app.Id == application_id) ***REMOVED***
                                                    this.getApplication(app);
                                                    break;

                                                ***REMOVED***
                                            ***REMOVED***
                                        ***REMOVED***)

                                    ***REMOVED***)

                                ***REMOVED***
                            ***REMOVED***);
                        ***REMOVED***)

                    ***REMOVED***)

                ***REMOVED***)
            ***REMOVED***

            , error => ***REMOVED***
                console.log(error);
                this.updateNotificationModal("Failed", "Project could not be created!", true, "danger");
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
    public createSimpleVmProjectGroup(name, description, manager_elixir_id, application_id, compute_center) ***REMOVED***

        //get memeber id in order to add the user later as the new member and manager of the group
        let manager_member_id: number;
        let manager_member_user_id: number;
        let new_group_id: number;
        this.applicationstatusservice.setApplicationStatus(application_id, this.application_statuses.APPROVED, compute_center).subscribe(result => ***REMOVED***
            if (result['Error']) ***REMOVED***
                this.updateNotificationModal("Failed", result['Error'], true, "danger");
                this

            ***REMOVED***
            else ***REMOVED***


                this.userservice.getMemberByExtSourceNameAndExtLogin(manager_elixir_id).subscribe(member_raw => ***REMOVED***
                    let member = member_raw;
                    manager_member_id = member["id"];
                    manager_member_user_id = member["userId"];
                    this.groupservice.createGroup(name, description).subscribe(group_raw => ***REMOVED***
                        let group = group_raw;
                        new_group_id = group["id"];
                        this.groupservice.addMember(new_group_id, manager_member_id, compute_center).subscribe();
                        this.groupservice.addAdmin(new_group_id, manager_member_user_id, compute_center).subscribe(res => ***REMOVED***
                            this.groupservice.setPerunGroupAttributes(application_id, new_group_id).subscribe(res => ***REMOVED***
                                    if (result['Error']) ***REMOVED***
                                        this.updateNotificationModal("Failed", result['Error'], true, "danger");

                                    ***REMOVED***
                                    else ***REMOVED***
                                        this.updateNotificationModal("Success", "The new project was created", true, "success");
                                    ***REMOVED***

                                    for (let app of this.user_applications) ***REMOVED***
                                        if (app.Id == application_id) ***REMOVED***
                                            this.getUserApplication(app);
                                            break;

                                        ***REMOVED***


                                    ***REMOVED***
                                    for (let app of this.all_applications) ***REMOVED***
                                        if (app.Id == application_id) ***REMOVED***
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

        ***REMOVED***, error => ***REMOVED***
            console.log(error);
            this.updateNotificationModal("Failed", "Project could not be created!", true, "danger");
        ***REMOVED***)


    ***REMOVED***

    assignGroupToFacility(group_id, application_id, compute_center) ***REMOVED***
        if (compute_center != 'undefined') ***REMOVED***
            this.groupservice.assignGroupToResource(group_id.toString(), compute_center).subscribe(res => ***REMOVED***
                    this.applicationstatusservice.setApplicationStatus(application_id, this.application_statuses.WAIT_FOR_CONFIRMATION, compute_center).subscribe(res => ***REMOVED***
                        for (let app of this.all_applications) ***REMOVED***
                            if (app.Id == application_id) ***REMOVED***
                                this.getApplication(app);

                                break;

                            ***REMOVED***
                        ***REMOVED***
                        this.updateNotificationModal("Success", "The  project was assigned to the facility.", true, "success");

                    ***REMOVED***)


                ***REMOVED***,
                error => ***REMOVED***
                    console.log(error);
                    this.updateNotificationModal("Failed", "Project could not be created!", true, "danger");
                ***REMOVED***);
        ***REMOVED***
        else ***REMOVED***
            this.updateNotificationModal("Failed", "You need to select an compute center!", true, "danger");
        ***REMOVED***

    ***REMOVED***

    /**
     * Decline an application.
     * @param application_id
     */
    public declineApplication(application_id) ***REMOVED***
        this.applicationstatusservice.setApplicationStatus(application_id, this.getIdByStatus("declined"), '').toPromise()
            .then(result => ***REMOVED***
                this.all_applications = [];
                this.user_applications = [];
                this.getUserApplications();
                this.getAllApplications();
                this.updateNotificationModal("Success", "The Application was declined", true, "success");
            ***REMOVED***)
            .catch(error => ***REMOVED***
                this.updateNotificationModal("Failed", "Application could be declined!", true, "danger");
            ***REMOVED***);
    ***REMOVED***

    /**
     * Delete an application.
     * @param application_id
     */
    public deleteApplication(application_id) ***REMOVED***
        this.applicationsservice.deleteApplication(application_id).toPromise()
            .then(result => ***REMOVED***
                this.updateNotificationModal('Success', 'The application has been successfully removed', true, 'success');
            ***REMOVED***).then(result => ***REMOVED***
            this.user_applications = [];
            this.all_applications = [];
            this.getUserApplications();
            this.getAllApplications();
        ***REMOVED***)
            .catch(error => ***REMOVED***
                this.updateNotificationModal("Failed", "Application could not be removed!", true, "danger");
            ***REMOVED***);
    ***REMOVED***

    /**
     * Check if active applications are available.
     * @returns ***REMOVED***boolean***REMOVED***
     */
    public activeApplicationsAvailable(): boolean ***REMOVED***
        for (let application of this.all_applications) ***REMOVED***
            if (application.Status == 1 || application.Status == 4 || application.Status == 7 || application.Status == 6) ***REMOVED***
                return true;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***


    /**
     * Set the id of the application which should be deleted.
     * @param applicationId
     */
    public setDeleteId(applicationId) ***REMOVED***
        this.deleteId = applicationId;
    ***REMOVED***


    /**
     * Coming soon.
     */
    public comingSoon() ***REMOVED***
        alert("This functinality will be implemented soon!")
    ***REMOVED***


***REMOVED***
