import {Component, OnInit} from '@angular/core';
import {ComputecenterComponent} from '../projectmanagement/computecenter.component';
import {FacilityService} from '../api-connector/facility.service';
import {UserService} from '../api-connector/user.service';
import {GroupService} from '../api-connector/group.service';
import {ApiSettings} from '../api-connector/api-settings.service';
import {Application} from '../applications/application.model';
import {ApplicationExtension} from '../applications/application_extension.model';
import {ApplicationStatus} from '../applications/application_status.model';
import {ApplicationStatusService} from '../api-connector/application-status.service';
import {ApplicationsService} from '../api-connector/applications.service';
import {AbstractBaseClasse} from '../shared_modules/baseClass/abstract-base-class';

/**
 * Application component
 */
@Component({
    selector: 'app-facility.application',
    templateUrl: 'facility.application.component.html',
    styleUrls: ['facility.application.component.scss'],
    providers: [FacilityService, UserService, GroupService, ApplicationStatusService,
        ApplicationsService, ApiSettings]

})
export class FacilityApplicationComponent extends AbstractBaseClasse implements OnInit {

    /**
     * User which requested the Application {id: Elixir Id of user : {name and email}}.
     * @type {{}}
     */
    application_user: { [id: string]: { [id: string]: string } } = {};

    /**
     * Array if Applications are collapsed in the html or not.
     * @type {{}}
     */
    collapse_status: { [id: string]: boolean } = {};

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
     * Facilitties where the user is manager ['name',id].
     */
    public managerFacilities: [string, number][];
    /**
     * Chosen facility.
     */
    public selectedFacility: [string, number];
    /**
     * If the site is loaded with values.
     * @type {boolean}
     */
    isLoaded: boolean = false;
    /**
     * List of all applications.
     * @type {Array}
     */
    all_applications: Application[] = [];

    /**
     * List of all application modifications.
     * @type {Array}
     */
    all_application_modifications: Application [] = [];

    applications_history: Application [] = [];

    constructor(private userService: UserService,
                private applicationstatusservice: ApplicationStatusService,
                private facilityService: FacilityService, private applicationsservice: ApplicationsService) {
        super();

        this.facilityService.getManagerFacilities().subscribe(result => {
            this.managerFacilities = result;
            this.selectedFacility = this.managerFacilities[0];
            this.facilityService.getFacilityResources(this.selectedFacility['FacilityId']).subscribe();
            this.getApplicationStatus();
            this.getAllApplicationsWFC(this.selectedFacility ['FacilityId']);
            this.getAllApplicationsModifications(this.selectedFacility ['FacilityId']);
            this.getAllApplicationsHistory(this.selectedFacility ['FacilityId']);

        })
    }

    /**
     * Gets all available compute centers and saves them in the computeCenters attribute.
     */
    getComputeCenters(): void {
        this.facilityService.getComputeCenters().subscribe(result => {
            for (const cc of result) {
                const compute_center: ComputecenterComponent = new ComputecenterComponent(
                    cc['compute_center_facility_id'], cc['compute_center_name'],
                    cc['compute_center_login'], cc['compute_center_support_mail'])
                this.computeCenters.push(compute_center)
            }

        })
    }

    /**
     * Approve an application extension.
     * @param {Application} app the application
     */
    public approveExtension(app: Application): void {

        this.applicationsservice.approveRenewal(app.Id).subscribe(result => {
            if (result['Error']) {
                this.updateNotificationModal('Failed', 'Failed to approve the application modification.', true, 'danger');
            } else {
                this.updateNotificationModal('Success', 'Successfully approved the application modification.', true, 'success');
                this.all_application_modifications.splice(this.all_application_modifications.indexOf(app), 1);
                this.getAllApplicationsHistory(this.selectedFacility ['FacilityId']);

            }
        })
    }

    /**
     * Gets all affialiations from a user.
     * @param {number} user
     */
    getUserAffilaitions(user: number): void {
        this.userService.getuserAffiliations(user).subscribe()
    }

    /**
     * Sets the selected application.
     * @param application
     */
    setSelectedApplication(application: Application): void {
        this.selectedApplication = application;
    }

    /**
     * Get all application modification requests.
     * @param {number} facility id of the facility
     */
    getAllApplicationsModifications(facility: number): void {
        this.isLoaded = false;
        // todo check if user is VO Admin
        this.facilityService.getFacilityModificationApplicationsWaitingForConfirmation(facility).subscribe(res => {
            if (Object.keys(res).length === 0) {
                this.isLoaded = true;
            }

            for (const key in res) {
                if (res.has(key)) {

                    const aj = res[key];
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

                    a.Institute = aj['project_application_institute'];
                    a.Workgroup = aj['project_application_workgroup'];

                    a.DateSubmitted = aj['project_application_date_submitted'];
                    a.DateStatusChanged = aj['project_application_date_status_changed'];
                    a.User = aj['project_application_user']['username'];
                    a.UserAffiliations = aj['project_application_user']['profile']['affiliations'];
                    a.UserEmail = aj['project_application_user']['email'];
                    a.Status = aj['project_application_status'];
                    a.Comment = aj['project_application_comment'];
                    a.PerunId = aj['project_application_perun_id'];
                    a.OpenStackProject = aj['project_application_openstack_project'];
                    for (const f of aj['flavors']) {
                        a.addFlavorToCurrent(f.flavor_name, f.counter, f.tag, f.ram, f.rootdisk, f.vcpus, f.gpu, f.epheremal_disk)

                    }
                    if (aj['projectapplicationrenewal']) {
                        const r: ApplicationExtension = new ApplicationExtension();
                        let requestExtensionTotalCores: number = 0;
                        let requestExtensionTotalRam: number = 0;
                        for (const f of aj['projectapplicationrenewal']['flavors']) {
                            r.addFlavorToRequested(f.flavor_name, f.counter, f.tag, f.ram, f.rootdisk, f.vcpus, f.gpu, f.epheremal_disk);
                            requestExtensionTotalCores += f.vcpus * f.counter;
                            requestExtensionTotalRam += f.ram * f.counter

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

                        a.ApplicationExtension = r;

                    }
                    this.all_application_modifications.push(a);

                }
            }

            this.isLoaded = true;

        });
    }

    /**
     * Get all application ( with all stati) for a facility.
     * @param {number} facility id of the facility
     */
    getAllApplicationsHistory(facility: number): void {
        this.isLoaded = false;
        this.applications_history = [];

        // todo check if user is VO Admin
        this.facilityService.getFacilityApplicationsHistory(facility).subscribe(res => {
            if (Object.keys(res).length === 0) {
                this.isLoaded = true;
            }

            for (const key in res) {
                if (res.has(key)) {


                    const aj = res[key];
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

                    a.Institute = aj['project_application_institute'];
                    a.Workgroup = aj['project_application_workgroup'];

                    a.DateSubmitted = aj['project_application_date_submitted'];
                    a.DateStatusChanged = aj['project_application_date_status_changed'];
                    a.User = aj['project_application_user']['username'];
                    a.UserAffiliations = aj['project_application_user']['profile']['affiliations'];
                    a.UserEmail = aj['project_application_user']['email'];
                    a.Status = aj['project_application_status'];
                    a.Comment = aj['project_application_comment'];
                    a.PerunId = aj['project_application_perun_id'];
                    a.OpenStackProject = aj['project_application_openstack_project'];
                    for (const f of aj['flavors']) {
                        a.addFlavorToCurrent(f.flavor_name, f.counter, f.tag, f.ram, f.rootdisk, f.vcpus, f.gpu, f.epheremal_disk)

                    }
                    if (aj['projectapplicationrenewal']) {
                        const r: ApplicationExtension = new ApplicationExtension();
                        let requestExtensionTotalCores: number = 0;
                        let requestExtensionTotalRam: number = 0;
                        for (const f of aj['projectapplicationrenewal']['flavors']) {
                            r.addFlavorToRequested(f.flavor_name, f.counter, f.tag, f.ram, f.rootdisk, f.vcpus, f.gpu, f.epheremal_disk);
                            requestExtensionTotalCores += f.vcpus * f.counter;
                            requestExtensionTotalRam += f.ram * f.counter

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

                        a.ApplicationExtension = r;

                    }
                    this.applications_history.push(a);

                }
            }
            this.isLoaded = true;

        });
    }

    /**
     * Gets all applications for the facility.
     * @param {number} facility
     */
    getAllApplicationsWFC(facility: number): void {

        // todo check if user is VO Admin
        this.facilityService.getFacilityApplicationsWaitingForConfirmation(facility).subscribe(res => {
            if (Object.keys(res).length === 0) {
                this.isLoaded = true;
            }

            for (const key in res) {
                if (res.has(key)) {
                    const aj = res[key];
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

                    a.Institute = aj['project_application_institute'];
                    a.Workgroup = aj['project_application_workgroup'];

                    a.DateSubmitted = aj['project_application_date_submitted'];
                    a.DateStatusChanged = aj['project_application_date_status_changed'];
                    a.User = aj['project_application_user']['username'];
                    a.UserAffiliations = aj['project_application_user']['profile']['affiliations'];
                    a.UserEmail = aj['project_application_user']['email'];
                    a.Status = aj['project_application_status'];
                    a.Comment = aj['project_application_comment'];
                    a.PerunId = aj['project_application_perun_id'];
                    a.OpenStackProject = aj['project_application_openstack_project'];
                    if (aj['projectapplicationrenewal']) {
                        const r = new ApplicationExtension();

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

                    }
                    this.all_applications.push(a);
                }

            }

            this.isLoaded = true;

        });
    }

    /**
     * Approves an  application.
     * @param {number} application_id
     */
    approveApplication(application_id: number): void {

        this.updateNotificationModal('Approving Application', 'Waiting..', true, 'info')
        this.facilityService.approveFacilityApplication(this.selectedFacility['FacilityId'], application_id).subscribe(
            () => {
                this.updateNotificationModal('Success', 'Successfully approved the application.', true, 'success');

                this.all_applications = [];
                this.getAllApplicationsHistory(this.selectedFacility ['FacilityId']);

                this.getAllApplicationsWFC(this.selectedFacility['FacilityId'])
            },
            () => {
                this.updateNotificationModal('Failed', 'Failed to approve the application.', true, 'danger');

            })
    }

    /**
     * Decline an extension request.
     * @param {number} application_id
     */
    public declineExtension(app: Application): void {
        const modificaton_requested: number = 4;
        this.applicationstatusservice.setApplicationStatus(app.Id, modificaton_requested).subscribe(() => {
            this.updateNotificationModal('Success', 'Successfully declined!', true, 'success');
            this.all_application_modifications.splice(this.all_application_modifications.indexOf(app), 1);
            this.getAllApplicationsHistory(this.selectedFacility ['FacilityId']);
        })

    }

    /**
     * Declines an Application.
     * @param {number} application_id
     */
    declineApplication(application_id: number): void {
        this.updateNotificationModal('Decline Application', 'Waiting..', true, 'info');

        this.facilityService.declineFacilityApplication(this.selectedFacility['FacilityId'], application_id).subscribe(
            () => {
                this.updateNotificationModal('Success', 'Successfully declined the application.', true, 'success');

                this.all_applications = [];
                this.getAllApplicationsWFC(this.selectedFacility['FacilityId'])
            },
            () => {
                this.updateNotificationModal('Failed', 'Failed to decline the application.', true, 'danger');

            })
    }

    /**
     * Get all possible application stati.
     */
    getApplicationStatus(): void {
        this.applicationstatusservice.getAllApplicationStatus().toPromise()
            .then(res => {
                for (const key in res) {
                    if (res[key]) {
                        const asj = res[key];
                        const aj: ApplicationStatus = new ApplicationStatus(asj['application_status_id'], asj['application_status_name']);
                        this.application_status.push(aj)
                    }
                }
            });
    }

    /**
     * Get details of member like name and email by elixir.
     * @param {string} elixir_id
     * @param {string} collapse_id
     */
    public getMemberDetailsByElixirIdIfCollapsed(elixir_id: string, collapse_id: string): void {
        if (!this.getCollapseStatus(collapse_id)) {
            if (!(elixir_id in this.application_user)) {
                this.userService.getMemberDetailsByElixirId(elixir_id).subscribe(result => {

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
     * Get a collapse status.
     * @param {string} id
     * @returns {boolean}
     */
    public getCollapseStatus(id: string): boolean {
        if (id in this.collapse_status) {
            return this.collapse_status[id];
        } else {
            this.collapse_status[id] = true;

            return true;
        }
    }

    /**
     * Switch status of collapse.
     * @param {string} id
     */
    public switchCollapseStatus(id: string): void {
        this.collapse_status[id] = !this.getCollapseStatus(id);
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
     * If the selected facility changes, reload the applicatins.
     * @param value
     */
    onChangeSelectedFacility(): void {
        this.all_applications = [];
        this.getAllApplicationsWFC(this.selectedFacility['FacilityId'])
    }

    ngOnInit(): void {
    }

}
