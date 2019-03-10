import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***ComputecenterComponent***REMOVED*** from '../projectmanagement/computecenter.component';
import ***REMOVED***FacilityService***REMOVED*** from '../api-connector/facility.service';
import ***REMOVED***UserService***REMOVED*** from '../api-connector/user.service';
import ***REMOVED***GroupService***REMOVED*** from '../api-connector/group.service';
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service';
import ***REMOVED***Application***REMOVED*** from '../applications/application.model';
import ***REMOVED***ApplicationExtension***REMOVED*** from '../applications/application_extension.model';
import ***REMOVED***ApplicationStatus***REMOVED*** from '../applications/application_status.model';
import ***REMOVED***ApplicationStatusService***REMOVED*** from '../api-connector/application-status.service';
import ***REMOVED***ApplicationsService***REMOVED*** from '../api-connector/applications.service';
import ***REMOVED***AbstractBaseClasse***REMOVED*** from '../shared_modules/baseClass/abstract-base-class';

/**
 * Application component
 */
@Component(***REMOVED***
    selector: 'app-facility.application',
    templateUrl: 'facility.application.component.html',
    styleUrls: ['facility.application.component.scss'],
    providers: [FacilityService, UserService, GroupService, ApplicationStatusService,
        ApplicationsService, ApiSettings]

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
    isLoaded: boolean = false;
    /**
     * List of all applications.
     * @type ***REMOVED***Array***REMOVED***
     */
    all_applications: Application[] = [];

    /**
     * List of all application modifications.
     * @type ***REMOVED***Array***REMOVED***
     */
    all_application_modifications: Application [] = [];

    applications_history: Application [] = [];

    constructor(private userService: UserService,
                private applicationstatusservice: ApplicationStatusService,
                private facilityService: FacilityService, private applicationsservice: ApplicationsService) ***REMOVED***
        super();

        this.facilityService.getManagerFacilities().subscribe(result => ***REMOVED***
            this.managerFacilities = result;
            this.selectedFacility = this.managerFacilities[0];
            this.facilityService.getFacilityResources(this.selectedFacility['FacilityId']).subscribe();
            this.getApplicationStatus();
            this.getAllApplicationsWFC(this.selectedFacility ['FacilityId']);
            this.getAllApplicationsModifications(this.selectedFacility ['FacilityId']);
            this.getAllApplicationsHistory(this.selectedFacility ['FacilityId']);

        ***REMOVED***)
    ***REMOVED***

    /**
     * Gets all available compute centers and saves them in the computeCenters attribute.
     * @returns ***REMOVED***void***REMOVED***
     */
    getComputeCenters(): void ***REMOVED***
        this.facilityService.getComputeCenters().subscribe(result => ***REMOVED***
            for (const cc of result) ***REMOVED***
                const compute_center: ComputecenterComponent = new ComputecenterComponent(
                    cc['compute_center_facility_id'], cc['compute_center_name'],
                    cc['compute_center_login'], cc['compute_center_support_mail'])
                this.computeCenters.push(compute_center)
            ***REMOVED***

        ***REMOVED***)
    ***REMOVED***

    /**
     * Approve an application extension.
     * @param ***REMOVED***Application***REMOVED*** app the application
     * @returns ***REMOVED***void***REMOVED***
     */
    public approveExtension(app: Application): void ***REMOVED***

        this.applicationsservice.approveRenewal(app.Id).subscribe(result => ***REMOVED***
            if (result['Error']) ***REMOVED***
                this.updateNotificationModal('Failed', 'Failed to approve the application modification.', true, 'danger');
            ***REMOVED*** else ***REMOVED***
                this.updateNotificationModal('Success', 'Successfully approved the application modification.', true, 'success');
                this.all_application_modifications.splice(this.all_application_modifications.indexOf(app), 1);
                this.getAllApplicationsHistory(this.selectedFacility ['FacilityId']);

            ***REMOVED***
        ***REMOVED***)
    ***REMOVED***

    /**
     * Gets all affialiations from a user.
     * @param ***REMOVED***number***REMOVED*** user
     */
    getUserAffilaitions(user: number): void ***REMOVED***
        this.userService.getuserAffiliations(user).subscribe()
    ***REMOVED***

    /**
     * Sets the selected application.
     * @param application
     */
    setSelectedApplication(application: Application): void ***REMOVED***
        this.selectedApplication = application;
    ***REMOVED***

    /**
     * Get all application modification requests.
     * @param ***REMOVED***number***REMOVED*** facility id of the facility
     */
    getAllApplicationsModifications(facility: number): void ***REMOVED***
        this.isLoaded = false;
        // todo check if user is VO Admin
        this.facilityService.getFacilityModificationApplicationsWaitingForConfirmation(facility).subscribe(res => ***REMOVED***
            if (Object.keys(res).length === 0) ***REMOVED***
                this.isLoaded = true;
            ***REMOVED***

            for (const key in res) ***REMOVED***
                if (res.has(key)) ***REMOVED***

                    const aj = res[key];
                    const newApplication: Application = new Application();
                    newApplication.Id = aj['project_application_id'];

                    newApplication.Name = aj['project_application_name'];
                    newApplication.Shortname = aj['project_application_shortname'];
                    newApplication.Description = aj['project_application_description'];
                    newApplication.Lifetime = aj['project_application_lifetime'];

                    newApplication.VMsRequested = aj['project_application_vms_requested'];
                    newApplication.RamPerVM = aj['project_application_ram_per_vm'];
                    newApplication.TotalRam = aj['project_application_total_ram'];
                    newApplication.TotalCores = aj['project_application_total_cores'];
                    newApplication.CoresPerVM = aj['project_application_cores_per_vm'];
                    newApplication.VolumeLimit = aj['project_application_volume_limit'];
                    newApplication.VolumeCounter = aj['project_application_volume_counter'];

                    newApplication.ObjectStorage = aj['project_application_object_storage'];

                    newApplication.Institute = aj['project_application_institute'];
                    newApplication.Workgroup = aj['project_application_workgroup'];

                    newApplication.DateSubmitted = aj['project_application_date_submitted'];
                    newApplication.DateStatusChanged = aj['project_application_date_status_changed'];
                    newApplication.User = aj['project_application_user']['username'];
                    newApplication.UserAffiliations = aj['project_application_user']['profile']['affiliations'];
                    newApplication.UserEmail = aj['project_application_user']['email'];
                    newApplication.Status = aj['project_application_status'];
                    newApplication.Comment = aj['project_application_comment'];
                    newApplication.PerunId = aj['project_application_perun_id'];
                    newApplication.OpenStackProject = aj['project_application_openstack_project'];
                    for (const flavor of aj['flavors']) ***REMOVED***
                        newApplication.addFlavorToCurrent(
                            flavor.flavor_name, flavor.counter, flavor.tag, flavor.ram,
                            flavor.rootdisk, flavor.vcpus, flavor.gpu, flavor.epheremal_disk)

                    ***REMOVED***
                    if (aj['projectapplicationrenewal']) ***REMOVED***
                        const r: ApplicationExtension = new ApplicationExtension();
                        let requestExtensionTotalCores: number = 0;
                        let requestExtensionTotalRam: number = 0;
                        for (const flavor of aj['projectapplicationrenewal']['flavors']) ***REMOVED***
                            r.addFlavorToRequested(
                                flavor.flavor_name, flavor.counter, flavor.tag, flavor.ram,
                                flavor.rootdisk, flavor.vcpus, flavor.gpu, flavor.epheremal_disk);
                            requestExtensionTotalCores += flavor.vcpus * flavor.counter;
                            requestExtensionTotalRam += flavor.ram * flavor.counter

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

                        newApplication.ApplicationExtension = r;

                    ***REMOVED***
                    this.all_application_modifications.push(newApplication);

                ***REMOVED***
            ***REMOVED***

            this.isLoaded = true;

        ***REMOVED***);
    ***REMOVED***

    /**
     * Get all application ( with all stati) for a facility.
     * @param ***REMOVED***number***REMOVED*** facility id of the facility
     */
    getAllApplicationsHistory(facility: number): void ***REMOVED***
        this.isLoaded = false;
        this.applications_history = [];

        // todo check if user is VO Admin
        this.facilityService.getFacilityApplicationsHistory(facility).subscribe(res => ***REMOVED***
            if (Object.keys(res).length === 0) ***REMOVED***
                this.isLoaded = true;
            ***REMOVED***

            for (const key in res) ***REMOVED***
                if (res.has(key)) ***REMOVED***

                    const aj = res[key];
                    const newApplication: Application = new Application();
                    newApplication.Id = aj['project_application_id'];

                    newApplication.Name = aj['project_application_name'];
                    newApplication.Shortname = aj['project_application_shortname'];
                    newApplication.Description = aj['project_application_description'];
                    newApplication.Lifetime = aj['project_application_lifetime'];

                    newApplication.VMsRequested = aj['project_application_vms_requested'];
                    newApplication.RamPerVM = aj['project_application_ram_per_vm'];
                    newApplication.TotalRam = aj['project_application_total_ram'];
                    newApplication.TotalCores = aj['project_application_total_cores'];
                    newApplication.CoresPerVM = aj['project_application_cores_per_vm'];
                    newApplication.VolumeLimit = aj['project_application_volume_limit'];
                    newApplication.VolumeCounter = aj['project_application_volume_counter'];

                    newApplication.ObjectStorage = aj['project_application_object_storage'];

                    newApplication.Institute = aj['project_application_institute'];
                    newApplication.Workgroup = aj['project_application_workgroup'];

                    newApplication.DateSubmitted = aj['project_application_date_submitted'];
                    newApplication.DateStatusChanged = aj['project_application_date_status_changed'];
                    newApplication.User = aj['project_application_user']['username'];
                    newApplication.UserAffiliations = aj['project_application_user']['profile']['affiliations'];
                    newApplication.UserEmail = aj['project_application_user']['email'];
                    newApplication.Status = aj['project_application_status'];
                    newApplication.Comment = aj['project_application_comment'];
                    newApplication.PerunId = aj['project_application_perun_id'];
                    newApplication.OpenStackProject = aj['project_application_openstack_project'];
                    for (const flavor of aj['flavors']) ***REMOVED***
                        newApplication.addFlavorToCurrent(
                            flavor.flavor_name, flavor.counter, flavor.tag, flavor.ram,
                            flavor.rootdisk, flavor.vcpus, flavor.gpu, flavor.epheremal_disk)

                    ***REMOVED***
                    if (aj['projectapplicationrenewal']) ***REMOVED***
                        const r: ApplicationExtension = new ApplicationExtension();
                        let requestExtensionTotalCores: number = 0;
                        let requestExtensionTotalRam: number = 0;
                        for (const flavor of aj['projectapplicationrenewal']['flavors']) ***REMOVED***
                            r.addFlavorToRequested(
                                flavor.flavor_name, flavor.counter, flavor.tag, flavor.ram,
                                flavor.rootdisk, flavor.vcpus, flavor.gpu, flavor.epheremal_disk);
                            requestExtensionTotalCores += flavor.vcpus * flavor.counter;
                            requestExtensionTotalRam += flavor.ram * flavor.counter

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

                        newApplication.ApplicationExtension = r;

                    ***REMOVED***
                    this.applications_history.push(newApplication);

                ***REMOVED***
            ***REMOVED***
            this.isLoaded = true;

        ***REMOVED***);
    ***REMOVED***

    /**
     * Gets all applications for the facility.
     * @param ***REMOVED***number***REMOVED*** facility
     */
    getAllApplicationsWFC(facility: number): void ***REMOVED***

        // todo check if user is VO Admin
        this.facilityService.getFacilityApplicationsWaitingForConfirmation(facility).subscribe(res => ***REMOVED***
            if (Object.keys(res).length === 0) ***REMOVED***
                this.isLoaded = true;
            ***REMOVED***

            for (const key in res) ***REMOVED***
                if (res.has(key)) ***REMOVED***
                    const aj = res[key];
                    const newApplication: Application = new Application();
                    newApplication.Id = aj['project_application_id'];

                    newApplication.Name = aj['project_application_name'];
                    newApplication.Shortname = aj['project_application_shortname'];
                    newApplication.Description = aj['project_application_description'];
                    newApplication.Lifetime = aj['project_application_lifetime'];

                    newApplication.VMsRequested = aj['project_application_vms_requested'];
                    newApplication.RamPerVM = aj['project_application_ram_per_vm'];
                    newApplication.TotalRam = aj['project_application_total_ram'];
                    newApplication.TotalCores = aj['project_application_total_cores'];
                    newApplication.CoresPerVM = aj['project_application_cores_per_vm'];
                    newApplication.VolumeLimit = aj['project_application_volume_limit'];
                    newApplication.VolumeCounter = aj['project_application_volume_counter'];

                    newApplication.ObjectStorage = aj['project_application_object_storage'];

                    newApplication.Institute = aj['project_application_institute'];
                    newApplication.Workgroup = aj['project_application_workgroup'];

                    newApplication.DateSubmitted = aj['project_application_date_submitted'];
                    newApplication.DateStatusChanged = aj['project_application_date_status_changed'];
                    newApplication.User = aj['project_application_user']['username'];
                    newApplication.UserAffiliations = aj['project_application_user']['profile']['affiliations'];
                    newApplication.UserEmail = aj['project_application_user']['email'];
                    newApplication.Status = aj['project_application_status'];
                    newApplication.Comment = aj['project_application_comment'];
                    newApplication.PerunId = aj['project_application_perun_id'];
                    newApplication.OpenStackProject = aj['project_application_openstack_project'];
                    if (aj['projectapplicationrenewal']) ***REMOVED***
                        const newExtension: ApplicationExtension = new ApplicationExtension();

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

                        newApplication.ApplicationExtension = newExtension;

                    ***REMOVED***
                    this.all_applications.push(newApplication);
                ***REMOVED***

            ***REMOVED***

            this.isLoaded = true;

        ***REMOVED***);
    ***REMOVED***

    /**
     * Approves an  application.
     * @param ***REMOVED***number***REMOVED*** application_id
     */
    approveApplication(application_id: number): void ***REMOVED***

        this.updateNotificationModal('Approving Application', 'Waiting..', true, 'info')
        this.facilityService.approveFacilityApplication(this.selectedFacility['FacilityId'], application_id).subscribe(
            () => ***REMOVED***
                this.updateNotificationModal('Success', 'Successfully approved the application.', true, 'success');

                this.all_applications = [];
                this.getAllApplicationsHistory(this.selectedFacility ['FacilityId']);

                this.getAllApplicationsWFC(this.selectedFacility['FacilityId'])
            ***REMOVED***,
            () => ***REMOVED***
                this.updateNotificationModal('Failed', 'Failed to approve the application.', true, 'danger');

            ***REMOVED***)
    ***REMOVED***

    /**
     * Decline an extension request.
     * @param ***REMOVED***number***REMOVED*** application_id
     */
    public declineExtension(app: Application): void ***REMOVED***
        const modificaton_requested: number = 4;
        this.applicationstatusservice.setApplicationStatus(app.Id, modificaton_requested).subscribe(() => ***REMOVED***
            this.updateNotificationModal('Success', 'Successfully declined!', true, 'success');
            this.all_application_modifications.splice(this.all_application_modifications.indexOf(app), 1);
            this.getAllApplicationsHistory(this.selectedFacility ['FacilityId']);
        ***REMOVED***)

    ***REMOVED***

    /**
     * Declines an Application.
     * @param ***REMOVED***number***REMOVED*** application_id
     */
    declineApplication(application_id: number): void ***REMOVED***
        this.updateNotificationModal('Decline Application', 'Waiting..', true, 'info');

        this.facilityService.declineFacilityApplication(this.selectedFacility['FacilityId'], application_id).subscribe(
            () => ***REMOVED***
                this.updateNotificationModal('Success', 'Successfully declined the application.', true, 'success');

                this.all_applications = [];
                this.getAllApplicationsWFC(this.selectedFacility['FacilityId'])
            ***REMOVED***,
            () => ***REMOVED***
                this.updateNotificationModal('Failed', 'Failed to decline the application.', true, 'danger');

            ***REMOVED***)
    ***REMOVED***

    /**
     * Get all possible application stati.
     */
    getApplicationStatus(): void ***REMOVED***
        this.applicationstatusservice.getAllApplicationStatus().toPromise()
            .then(res => ***REMOVED***
                for (const key in res) ***REMOVED***
                    if (res[key]) ***REMOVED***
                        const asj = res[key];
                        const aj: ApplicationStatus = new ApplicationStatus(asj['application_status_id'], asj['application_status_name']);
                        this.application_status.push(aj)
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***);
    ***REMOVED***

    /**
     * Get details of member like name and email by elixir.
     * @param ***REMOVED***string***REMOVED*** elixir_id
     * @param ***REMOVED***string***REMOVED*** collapse_id
     */
    public getMemberDetailsByElixirIdIfCollapsed(elixir_id: string, collapse_id: string): void ***REMOVED***
        if (!this.getCollapseStatus(collapse_id)) ***REMOVED***
            if (!(elixir_id in this.application_user)) ***REMOVED***
                this.userService.getMemberDetailsByElixirId(elixir_id).subscribe(result => ***REMOVED***

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
     * Get a collapse status.
     * @param ***REMOVED***string***REMOVED*** id
     * @returns ***REMOVED***boolean***REMOVED***
     */
    public getCollapseStatus(id: string): boolean ***REMOVED***
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
    public switchCollapseStatus(id: string): void ***REMOVED***
        this.collapse_status[id] = !this.getCollapseStatus(id);
    ***REMOVED***

    /**
     * Get status name  by status id.
     * @param ***REMOVED***number***REMOVED*** id
     * @returns ***REMOVED***string***REMOVED***
     */
    public getStatusById(id: number): string ***REMOVED***

        const dummy: string = 'Unknown';
        for (const status of this.application_status) ***REMOVED***
            if (status.Id === id) ***REMOVED***
                return status.Name;
            ***REMOVED***
        ***REMOVED***

        return dummy;
    ***REMOVED***

    /**
     * Get id by status name.
     * @param ***REMOVED***string***REMOVED*** name
     * @returns ***REMOVED***number***REMOVED***
     */
    public getIdByStatus(name: string): number ***REMOVED***
        const dummy: number = -1;
        for (const status of this.application_status) ***REMOVED***
            if (status.Name === name) ***REMOVED***
                return status.Id;
            ***REMOVED***
        ***REMOVED***

        return dummy;
    ***REMOVED***

    /**
     * If the selected facility changes, reload the applicatins.
     * @param value
     */
    onChangeSelectedFacility(): void ***REMOVED***
        this.all_applications = [];
        this.getAllApplicationsWFC(this.selectedFacility['FacilityId'])
    ***REMOVED***

    ngOnInit(): void ***REMOVED***
    ***REMOVED***

***REMOVED***
