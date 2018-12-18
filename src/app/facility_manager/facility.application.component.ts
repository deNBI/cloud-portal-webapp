import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';
import * as moment from 'moment';
import ***REMOVED***Project***REMOVED*** from "../projectmanagement/project.model";
import ***REMOVED***ComputecenterComponent***REMOVED*** from "../projectmanagement/computecenter.component";
import ***REMOVED***FacilityService***REMOVED*** from "../api-connector/facility.service";
import ***REMOVED***UserService***REMOVED*** from "../api-connector/user.service";
import ***REMOVED***GroupService***REMOVED*** from "../api-connector/group.service";
import ***REMOVED***PerunSettings***REMOVED*** from "../perun-connector/connector-settings.service";
import ***REMOVED***ApiSettings***REMOVED*** from "../api-connector/api-settings.service";
import ***REMOVED***Application***REMOVED*** from "../applications/application.model";
import ***REMOVED***ApplicationExtension***REMOVED*** from "../applications/application_extension.model";
import ***REMOVED***SpecialHardware***REMOVED*** from "../applications/special_hardware.model";
import ***REMOVED***ApplicationStatus***REMOVED*** from "../applications/application_status.model";
import ***REMOVED***ApplicationStatusService***REMOVED*** from "../api-connector/application-status.service";
import ***REMOVED***ApplicationsService***REMOVED*** from "../api-connector/applications.service";
import ***REMOVED***SpecialHardwareService***REMOVED*** from "../api-connector/special-hardware.service";
import ***REMOVED***AbstractBaseClasse***REMOVED*** from "../shared_modules/baseClass/abstract-base-class";

@Component(***REMOVED***
    selector: 'app-facility.application',
    templateUrl: 'facility.application.component.html',
    styleUrls: ['facility.application.component.scss'],
    providers: [FacilityService, UserService, GroupService, PerunSettings, ApplicationStatusService, ApplicationsService, SpecialHardwareService, ApiSettings]

***REMOVED***)
export class FacilityApplicationComponent extends AbstractBaseClasse implements OnInit ***REMOVED***

    /**
     * User which requested the Application ***REMOVED***id: Elixir Id of user : ***REMOVED***name and email***REMOVED******REMOVED***.
     * @type ***REMOVED******REMOVED******REMOVED******REMOVED***
     */
    application_user: ***REMOVED*** [id: string]: ***REMOVED*** [id: string]: string ***REMOVED*** ***REMOVED*** = ***REMOVED******REMOVED***;

    /**
     * Array if Applications are collapsed in the html or not.
     * @type ***REMOVED******REMOVED******REMOVED******REMOVED***
     */
    collapse_status: ***REMOVED*** [id: string]: boolean ***REMOVED*** = ***REMOVED******REMOVED***;

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
     * Facilitties where the user is manager ['name',id].
     */
    public managerFacilities: [string, number][];
    /**
     * Chosen facility.
     */
    public selectedFacility: [string, number];
    /**
     * If the site is loaded with values.
     * @type ***REMOVED***boolean***REMOVED***
     */
    isLoaded = false;
    /**
     * List of all applications.
     * @type ***REMOVED***Array***REMOVED***
     */
    all_applications: Application[] = [];
    /**
     * Special hardware id for FPGA.
     * @type ***REMOVED***number***REMOVED***
     */
    public FPGA = 1;


    constructor(private userService: UserService,
                private applicationstatusservice: ApplicationStatusService,
                private specialhardwareservice: SpecialHardwareService,
                private  facilityService: FacilityService) ***REMOVED***
        super();

        this.facilityService.getManagerFacilities().subscribe(result => ***REMOVED***
            this.managerFacilities = result;
            this.selectedFacility = this.managerFacilities[0];
            this.getAllApplications(this.selectedFacility ['FacilityId']);

        ***REMOVED***)
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
        this.userService.getuserAffiliations(user).subscribe()
    ***REMOVED***

    /**
     * Sets the selected application.
     * @param application
     */
    setSelectedApplication(application: any) ***REMOVED***
        this.selectedApplication = application;
    ***REMOVED***

    /**
     * Gets all applications for the facility.
     * @param ***REMOVED***number***REMOVED*** facility
     */
    getAllApplications(facility: number) ***REMOVED***
        //todo check if user is VO Admin
        this.facilityService.getFacilityApplicationsWaitingForConfirmation(facility).subscribe(res => ***REMOVED***
            if (Object.keys(res).length == 0) ***REMOVED***
                this.isLoaded = true;
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

                a.DateSubmitted = aj["project_application_date_submitted"];
                a.DateStatusChanged = aj["project_application_date_status_changed"];
                a.User = aj["project_application_user"]["username"];
                a.UserAffiliations = aj["project_application_user"]['profile']['affiliations'];
                a.UserEmail = aj["project_application_user"]["email"];
                a.Status = aj["project_application_status"];
                a.Comment = aj["project_application_comment"];
                a.PerunId = aj['project_application_perun_id'];
                a.OpenStackProject = aj["project_application_openstack_project"];
                if (aj['projectapplicationrenewal']) ***REMOVED***
                    let r = new ApplicationExtension();

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
                    if (aj['projectapplicationrenewal']['project_application_renewalspecial_hardware'] != null) ***REMOVED***
                        let special_hardware_string = aj['projectapplicationrenewal']['project_application_renewal_special_hardware'].toString();

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

            this.isLoaded = true;


        ***REMOVED***);
    ***REMOVED***

    /**
     * Approves an  application.
     * @param ***REMOVED***number***REMOVED*** application_id
     */
    approveApplication(application_id: number) ***REMOVED***


        this.updateNotificationModal('Approving Application', 'Waiting..', true, 'info')
        this.facilityService.approveFacilityApplication(this.selectedFacility['FacilityId'], application_id).subscribe(res => ***REMOVED***
            this.updateNotificationModal('Success', 'Successfully approved the application.', true, 'success');

            this.all_applications = [];
            this.getAllApplications(this.selectedFacility['FacilityId'])
        ***REMOVED***, error => ***REMOVED***
            this.updateNotificationModal('Failed', 'Failed to approve the application.', true, 'danger');


        ***REMOVED***)
    ***REMOVED***

    /**
     * Declines an Application.
     * @param ***REMOVED***number***REMOVED*** application_id
     */
    declineApplication(application_id: number) ***REMOVED***
        this.updateNotificationModal('Decline Application', 'Waiting..', true, 'info');

        this.facilityService.declineFacilityApplication(this.selectedFacility['FacilityId'], application_id).subscribe(res => ***REMOVED***
            this.updateNotificationModal('Success', 'Successfully declined the application.', true, 'success');

            this.all_applications = [];
            this.getAllApplications(this.selectedFacility['FacilityId'])
        ***REMOVED***, error => ***REMOVED***
            this.updateNotificationModal('Failed', 'Failed to decline the application.', true, 'danger');


        ***REMOVED***)
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
     * Get details of member like name and email by elixir.
     * @param ***REMOVED***string***REMOVED*** elixir_id
     * @param ***REMOVED***string***REMOVED*** collapse_id
     */
    public getMemberDetailsByElixirIdIfCollapsed(elixir_id: string, collapse_id: string) ***REMOVED***
        if (!this.getCollapseStatus(collapse_id)) ***REMOVED***
            if (!(elixir_id in this.application_user)) ***REMOVED***
                this.userService.getMemberDetailsByElixirId(elixir_id).subscribe(result => ***REMOVED***

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
     * Get a collapse status.
     * @param ***REMOVED***string***REMOVED*** id
     * @returns ***REMOVED***boolean***REMOVED***
     */
    public getCollapseStatus(id: string) ***REMOVED***
        if (id in this.collapse_status) ***REMOVED***
            return this.collapse_status[id];
        ***REMOVED*** else ***REMOVED***
            this.collapse_status[id] = true;
            return true;
        ***REMOVED***
    ***REMOVED***

    /**
     * Switch status of collapse.
     * @param ***REMOVED***string***REMOVED*** id
     */
    public switchCollapseStatus(id: string) ***REMOVED***
        this.collapse_status[id] = !this.getCollapseStatus(id);
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
     * If the selected facility changes, reload the applicatins.
     * @param value
     */
    onChangeSelectedFacility(value) ***REMOVED***
        this.getAllApplications(this.selectedFacility['FacilityId'])
    ***REMOVED***


    ngOnInit() ***REMOVED***
    ***REMOVED***

***REMOVED***
