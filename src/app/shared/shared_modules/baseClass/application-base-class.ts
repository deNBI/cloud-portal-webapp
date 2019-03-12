import ***REMOVED***AbstractBaseClasse***REMOVED*** from './abstract-base-class';
import ***REMOVED***ApplicationStatus***REMOVED*** from '../../../applications/application_status.model';
import ***REMOVED***Application***REMOVED*** from '../../../applications/application.model';
import ***REMOVED***Flavor***REMOVED*** from '../../../virtualmachines/virtualmachinemodels/flavor';
import ***REMOVED***ApplicationExtension***REMOVED*** from '../../../applications/application_extension.model';
import ***REMOVED***ApplicationsService***REMOVED*** from '../../../api-connector/applications.service';
import ***REMOVED***ComputecenterComponent***REMOVED*** from '../../../projectmanagement/computecenter.component';
import ***REMOVED***FlavorType***REMOVED*** from '../../../virtualmachines/virtualmachinemodels/flavorType';
import ***REMOVED***FlavorService***REMOVED*** from '../../../api-connector/flavor.service';
import ***REMOVED***FacilityService***REMOVED*** from '../../../api-connector/facility.service';
import ***REMOVED***Component***REMOVED*** from '@angular/core';
import ***REMOVED***ApplicationStatusService***REMOVED*** from '../../../api-connector/application-status.service';
import ***REMOVED***UserService***REMOVED*** from '../../../api-connector/user.service';

/**
 * Application base component..
 */
@Component(***REMOVED***
    providers: [FacilityService, ApplicationsService, FlavorService]
***REMOVED***)
export class ApplicationBaseClass extends AbstractBaseClasse ***REMOVED***

    /**
     * If all Applications are loaded, important for the loader.
     * @type ***REMOVED***boolean***REMOVED***
     */
    isLoaded_AllApplication: boolean = false;


    /**
     * Selected Application.
     */
    selectedApplication: Application;


    /**
     * All available compute centers.
     * @type ***REMOVED***Array***REMOVED***
     */
    computeCenters: ComputecenterComponent[] = [];

    /**
     * Stati of the differen Applications.
     * @type ***REMOVED***Array***REMOVED***
     */
    application_status: ApplicationStatus[] = [];


    /**
     * User which requested the Application ***REMOVED***id: Elixir Id of user : ***REMOVED***name and email***REMOVED******REMOVED***.
     * @type ***REMOVED******REMOVED******REMOVED******REMOVED***
     */
    application_user: ***REMOVED*** [id: string]: ***REMOVED*** [id: string]: string ***REMOVED*** ***REMOVED*** = ***REMOVED******REMOVED***;

    /**
     * List of flavor types.
     */
    typeList: FlavorType[];
    /**
     * List of all collapse booleans.
     */
    collapseList: boolean[];

    /**
     * List of flavors.
     */
    flavorList: Flavor[];

    /**
     * If all userApplications are loaded, important for the loader.
     * @type ***REMOVED***boolean***REMOVED***
     */
    isLoaded_userApplication: boolean = false;

    /**
     * Applications of the user viewing the Application overview.
     * @type ***REMOVED***Array***REMOVED***
     */
    user_applications: Application[] = [];

    constructor(protected userservice: UserService, protected applicationstatusservice: ApplicationStatusService,
                protected applicationsservice: ApplicationsService,
                protected facilityService: FacilityService) ***REMOVED***
        super();

    ***REMOVED***

    /**
     * Get id by status name.
     * @param ***REMOVED***string***REMOVED*** name
     * @returns ***REMOVED***number***REMOVED***
     */
    getIdByStatus(name: string): number ***REMOVED***
        const s: number = -1;
        for (const status of this.application_status) ***REMOVED***
            if (status.Name === name) ***REMOVED***
                return status.Id;
            ***REMOVED***
        ***REMOVED***

        return s;
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

    public setApplicationStatus(status: number, app: Application): void ***REMOVED***
        this.applicationstatusservice.setApplicationStatus(app.Id.toString(), status.toString()).subscribe()
    ***REMOVED***

    setNewApplication(aj): Application ***REMOVED***

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

        if (newApp.Status === this.application_statuses.APPROVED) ***REMOVED***
            newApp.DaysRunning = Math.ceil((Math.abs(Date.now() - new Date(newApp.DateStatusChanged).getTime())) / (1000 * 3600 * 24));

        ***REMOVED***
        newApp.Comment = aj['project_application_comment'];
        newApp.PerunId = aj['project_application_perun_id'];
        for (const flavor of aj['flavors']) ***REMOVED***
            newApp.addFlavorToCurrent(
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

            newApp.ApplicationExtension = r;
        ***REMOVED***

        return newApp
    ***REMOVED***

    setNewApplications(res): Application[] ***REMOVED***
        const newApplications: Application[] = [];

        for (const key in res) ***REMOVED***
            if (res.hasOwnProperty(key)) ***REMOVED***

                const aj: object = res[key];
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

                for (const flavor of aj['flavors']) ***REMOVED***
                    newApp.addFlavorToCurrent(
                        flavor.flavor_name, flavor.counter, flavor.tag, flavor.ram,
                        flavor.rootdisk, flavor.vcpus, flavor.gpu, flavor.epheremal_disk)

                ***REMOVED***

                newApp.DaysRunning = Math.ceil((Math.abs(Date.now() - new Date(newApp.DateStatusChanged).getTime()))
                    / (1000 * 3600 * 24));
                newApp.Comment = aj['project_application_comment'];
                newApp.PerunId = aj['project_application_perun_id'];
                if (aj['projectapplicationrenewal']) ***REMOVED***
                    const newExtension: ApplicationExtension = new ApplicationExtension();
                    let requestExtensionTotalCores: number = 0;
                    let requestExtensionTotalRam: number = 0;

                    newApp.Comment = aj['project_application_comment'];
                    newApp.PerunId = aj['project_application_perun_id'];
                    newApp.OpenStackProject = aj['project_application_openstack_project'];

                    for (const flavor of aj['projectapplicationrenewal']['flavors']) ***REMOVED***
                        newExtension.addFlavorToRequested(
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

                    ***REMOVED***
                ***REMOVED***
                newApplications.push(newApp)
            ***REMOVED***
        ***REMOVED***

        return newApplications
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

***REMOVED***
