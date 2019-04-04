import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***ApplicationsService***REMOVED*** from '../api-connector/applications.service'
import ***REMOVED***ApplicationStatusService***REMOVED*** from '../api-connector/application-status.service'
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service'
import ***REMOVED***Application***REMOVED*** from './application.model';
import ***REMOVED***GroupService***REMOVED*** from '../api-connector/group.service';
import ***REMOVED***UserService***REMOVED*** from '../api-connector/user.service';
import ***REMOVED***NgForm***REMOVED*** from '@angular/forms';
import ***REMOVED***VoService***REMOVED*** from '../api-connector/vo.service';
import ***REMOVED***FacilityService***REMOVED*** from '../api-connector/facility.service';
import ***REMOVED***Flavor***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavor';
import ***REMOVED***FlavorService***REMOVED*** from '../api-connector/flavor.service';
import ***REMOVED***Client***REMOVED*** from "../virtualmachines/clients/client.model";
import ***REMOVED***ApplicationBaseClass***REMOVED*** from '../shared/shared_modules/baseClass/application-base-class';
import ***REMOVED***ComputecenterComponent***REMOVED*** from '../projectmanagement/computecenter.component';
import ***REMOVED***FlavorType***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavorType';
import ***REMOVED***IResponseTemplate***REMOVED*** from "../api-connector/response-template";

/**
 * Application Overview component.
 */
@Component(***REMOVED***
    templateUrl: 'applications.component.html',
    providers: [FacilityService, VoService, UserService, GroupService, ApplicationStatusService,
        ApplicationsService, ApiSettings, FlavorService]
***REMOVED***)
export class ApplicationsComponent extends ApplicationBaseClass implements OnInit ***REMOVED***

    /**
     * All Applications, just visibile for a vo admin.
     * @type ***REMOVED***Array***REMOVED***
     */
    all_applications: Application[] = [];


    /**
     * Limits information for Client tested/used for Simple Vm Project creation.
     */
    notificationClientInfo: Client[] = [];


    /**
     * id of the extension status.
     * @type ***REMOVED***number***REMOVED***
     */
    extension_status: number = 0;
    /**
     * id of Application set for deletion.
     */
    public deleteId: number;

    private WAIT_FOR_EXTENSION_STATUS: number = 6;

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
    constructor(applicationsservice: ApplicationsService,
                applicationstatusservice: ApplicationStatusService,
                userservice: UserService,
                private groupservice: GroupService,
                private voService: VoService,
                facilityService: FacilityService,
                private flavorService: FlavorService) ***REMOVED***

        super(userservice, applicationstatusservice, applicationsservice, facilityService);
        this.voService.isVo().subscribe((result: IResponseTemplate) => ***REMOVED***
            this.is_vo_admin = <boolean><Boolean>result.value;
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

    ngOnInit(): void ***REMOVED***


    ***REMOVED***

    /**
     * Checks if the key given represents a flavor and if so returns the respective Flavor
     * @param key the key which is checked
     */
    isKeyFlavor(key: string): Flavor ***REMOVED***
        for (const fkey in this.flavorList) ***REMOVED***
            if (fkey in this.flavorList) ***REMOVED***
                if (this.flavorList[fkey].name === key.substring(20)) ***REMOVED***
                    return this.flavorList[fkey];
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***

        return null;

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
     * Get the facility of an application.
     * @param ***REMOVED***Application***REMOVED*** app
     */
    getFacilityProject(app: Application): void ***REMOVED***

        if (!app.ComputeCenter && app.Status !== this.application_states.SUBMITTED && app.Status !== this.application_states.TERMINATED) ***REMOVED***
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
     * Get all Applications if user is admin.
     */
    getAllApplications(): void ***REMOVED***
        // todo check if user is VO Admin

        if (this.is_vo_admin) ***REMOVED***

            this.applicationsservice.getAllApplications().subscribe(res  => ***REMOVED***
                if (Object.keys(res).length === 0) ***REMOVED***
                    this.isLoaded_userApplication = true;
                ***REMOVED***
                const newApps: Application [] = this.setNewApplications(res);
                this.all_applications.push.apply(this.all_applications, newApps);

                this.isLoaded_AllApplication = true;
                for (const app of this.all_applications) ***REMOVED***
                    if (app.Status === this.application_states.WAIT_FOR_CONFIRMATION ||
                        app.Status === this.application_states.MODIFICATION_REQUESTED) ***REMOVED***
                        this.getFacilityProject(app);
                    ***REMOVED***
                ***REMOVED***

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
            const newApp: Application = this.setNewApplication(aj);
            this.all_applications[index] = newApp;
            this.getFacilityProject(newApp);
        ***REMOVED***);

    ***REMOVED***


    /**
     * Gets all Application of the user viewing the application overview.
     * Saves them in the userApplication array.
     */
    getUserApplications(): void ***REMOVED***
        this.applicationsservice
            .getUserApplications().subscribe((res: [***REMOVED*** [key: string]: string ***REMOVED***]) => ***REMOVED***
            if (Object.keys(res).length === 0) ***REMOVED***
                this.isLoaded_userApplication = true;
            ***REMOVED***
            const newApps: Application [] = this.setNewApplications(res);
            this.user_applications.push.apply(this.user_applications, newApps);
            this.isLoaded_userApplication = true;

        ***REMOVED***)


    ***REMOVED***

    /**
     * Gets a user application with the actual values.
     * @param ***REMOVED***Application***REMOVED*** application
     */
    public getUserApplication(application: Application): void ***REMOVED***
        let index: number = this.user_applications.indexOf(application);

        this.applicationsservice.getUserApplication(application.Id.toString()).subscribe(aj => ***REMOVED***
            const newApp: Application = this.setNewApplication(aj);

            this.user_applications[index] = newApp;


        ***REMOVED***)


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
     * Resets the values of totalRAM und totalNumberOfCores to 0 and changes the text at the end of the extension form.
     * @param elemIDcores the ID of the label containing the number of cores
     * @param elemIDram the ID of the label containing the amount of RAM
     */
    unsetValues(elemIDcores: string, elemIDram: string): void ***REMOVED***
        this.totalRAM = 0;
        this.totalNumberOfCores = 0;
        //document.getElementById(elemIDcores).innerHTML = `Number of total cores:  $***REMOVED***this.totalNumberOfCores.toString()***REMOVED***`;
        //document.getElementById(elemIDram).innerHTML = `Total amout of RAM:  $***REMOVED***this.totalRAM.toString()***REMOVED*** GB`;

    ***REMOVED***

    calculateRamCores() ***REMOVED***
      this.totalNumberOfCores=0;
      this.totalRAM=0;
      for (const key in this.selectedApplication.CurrentFlavors) ***REMOVED***
        const flavor = this.selectedApplication.CurrentFlavors[key];
         if (flavor != null) ***REMOVED***
            this.totalNumberOfCores = this.totalNumberOfCores + (flavor.vcpus * flavor.counter);
            this.totalRAM = this.totalRAM + (flavor.ram * flavor.counter);

        ***REMOVED***

      ***REMOVED***
    ***REMOVED***
    /**
     * Called whenvalues of the flavor-input-fields are changed and if so changes the values shown at the end of the form.
     * @param form the form which contains the input-fields
     */
    protected valuesChanged(form: NgForm): void ***REMOVED***
      this.totalNumberOfCores=0;
      this.totalRAM=0;
      for (const key in form.controls) ***REMOVED***
            if (form.controls[key].value) ***REMOVED***
                const flavor: Flavor = this.isKeyFlavor(key.toString());
                if (flavor != null) ***REMOVED***
                    this.totalNumberOfCores = this.totalNumberOfCores + (flavor.vcpus * form.controls[key].value);
                    this.totalRAM = this.totalRAM + (flavor.ram * form.controls[key].value);
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***

      //  document.getElementById('corenumbers').innerHTML = `Number of total cores:  $***REMOVED***this.totalNumberOfCores.toString()***REMOVED***`;
        //document.getElementById('ramnumbers').innerHTML = `Total amout of RAM:  $***REMOVED***this.totalRAM.toString()***REMOVED*** GB`;

    ***REMOVED***


    /**
     * Submits an renewal request for an application.
     * @param ***REMOVED***NgForm***REMOVED*** form
     */
    onSubmit(form: NgForm): void ***REMOVED***
        const values: ***REMOVED*** [key: string]: string | number | boolean ***REMOVED*** = ***REMOVED******REMOVED***;
        for (const value in form.controls) ***REMOVED***
            if (form.controls[value].value) ***REMOVED***
                values[value] = form.controls[value].value;
            ***REMOVED***
        ***REMOVED***
        values['project_application_id'] = this.selectedApplication.Id;
        values['total_cores_new'] = this.totalNumberOfCores;
        values['total_ram_new'] = this.totalRAM;
        this.requestExtension(values);

    ***REMOVED***




    /**
     * Returns a string with the end-date of a application which depends on the day it was approved and the lifetime in months
     * @param approval date in string when the application was approved
     * @param months number of months the application is permitted
     */
    getEndDate(months: number, approval?: string,): string ***REMOVED***
        if (!approval) ***REMOVED***
            return ''
        ***REMOVED***
        let date1: Date = new Date(Number(approval.substring(0, 4)), Number(approval.substring(5, 7)) - 1, Number(approval.substring(8)));
        const month: number = date1.getMonth();
        if ((month + months) > 11) ***REMOVED***
            date1 = new Date(date1.getFullYear(), (month + months - 12), date1.getDate());
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

        return `$***REMOVED***sa.DateApproved***REMOVED*** - $***REMOVED***this.getEndDate(sa.Lifetime, sa.DateApproved,)***REMOVED***`;
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
     * Terminateda project.
     * Deletes the Perun Group and sets the application status to terminated.
     * @param ***REMOVED***Application***REMOVED*** app
     */
    public terminateProject(app: Application): void ***REMOVED***
        this.applicationstatusservice.setApplicationStatus(app.Id, this.application_states.TERMINATED).subscribe(res => ***REMOVED***
            this.getApplication(app);
            if (res === 'null') ***REMOVED***
                this.updateNotificationModal('Success', 'The  project was terminated.', true, 'success');

            ***REMOVED*** else ***REMOVED***
                this.updateNotificationModal('Failed', 'The project could not be terminated.', true, 'danger');

            ***REMOVED***

        ***REMOVED***)
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
                    if (this.selectedApplication.Id.toString() === appl.Id.toString()) ***REMOVED***
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
                    if (this.selectedApplication.Id.toString() === appl.PerunId.toString()) ***REMOVED***
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
                if (this.selectedApplication.PerunId.toString() === app.PerunId.toString()) ***REMOVED***
                    this.getUserApplication(app);
                    break;
                ***REMOVED***

            ***REMOVED***
        ***REMOVED***)
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
                            this.groupservice.assignGroupToResource(new_group_id, compute_center).subscribe(() => ***REMOVED***
                                if (compute_center !== 'undefined') ***REMOVED***
                                    this.applicationstatusservice.setApplicationStatus(
                                        application_id,
                                        this.application_states.WAIT_FOR_CONFIRMATION)
                                        .subscribe((result: ***REMOVED*** [key: string]: string ***REMOVED***) => ***REMOVED***
                                                if (result['Error']) ***REMOVED***
                                                    this.updateNotificationModal('Failed', result['Error'], true, 'danger');

                                                ***REMOVED*** else ***REMOVED***
                                                    this.updateNotificationModal('Success', 'The new project was created', true, 'success');
                                                ***REMOVED***
                                                for (const app of this.user_applications) ***REMOVED***

                                                    if (app.Id.toString() === application_id.toString()) ***REMOVED***
                                                        this.getUserApplication(app);
                                                        break;

                                                    ***REMOVED***

                                                ***REMOVED***
                                                for (const app of this.all_applications) ***REMOVED***
                                                    if (app.Id.toString() === application_id.toString()) ***REMOVED***
                                                        this.getApplication(app);
                                                        break;

                                                    ***REMOVED***
                                                ***REMOVED***
                                            ***REMOVED***
                                        )
                                ***REMOVED*** else ***REMOVED***
                                    this.groupservice.setPerunGroupStatus(
                                        new_group_id,
                                        this.application_states.APPROVED.toString()).subscribe(() => ***REMOVED***
                                        this.applicationstatusservice.setApplicationStatus(
                                            application_id,
                                            this.application_states.APPROVED.toString())
                                            .subscribe((result: ***REMOVED*** [key: string]: string ***REMOVED***) => ***REMOVED***
                                                if (result['Error']) ***REMOVED***
                                                    this.updateNotificationModal('Failed', result['Error'], true, 'danger');

                                                ***REMOVED*** else ***REMOVED***
                                                    this.updateNotificationModal('Success', 'The new project was created', true, 'success');
                                                ***REMOVED***
                                                for (const appl of this.user_applications) ***REMOVED***
                                                    if (appl.Id.toString() === application_id.toString()) ***REMOVED***
                                                        this.getUserApplication(appl);
                                                        break;

                                                    ***REMOVED***
                                                ***REMOVED***
                                                for (const app of this.all_applications) ***REMOVED***
                                                    if (app.Id.toString() === application_id.toString()) ***REMOVED***
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
                            const newClient: Client = new Client(client['host'], client['port'], client['location'], client['id']);
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
                        this.application_states.APPROVED.toString()).subscribe((result: ***REMOVED*** [key: string]: string ***REMOVED***) => ***REMOVED***
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
                                                        const newClient: Client = new Client(client['host'], client['port'], client['location'], client['id']);
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
                                                    if (app.Id.toString() === application_id.toString()) ***REMOVED***
                                                        this.getUserApplication(app);
                                                        break;

                                                    ***REMOVED***

                                                ***REMOVED***
                                                for (const app of this.all_applications) ***REMOVED***
                                                    if (app.Id.toString() === application_id.toString()) ***REMOVED***
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
            this.groupservice.assignGroupToResource(group_id, compute_center).subscribe(
                () => ***REMOVED***
                    this.applicationstatusservice.setApplicationStatus(
                        application_id,
                        this.application_states.WAIT_FOR_CONFIRMATION.toString())
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
    public deleteApplication(application_id: string | number): void ***REMOVED***
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
     * Set the id of the application which should be deleted.
     * @param applicationId
     */
    public setDeleteId(applicationId: number): void ***REMOVED***
        this.deleteId = applicationId;
    ***REMOVED***


***REMOVED***
