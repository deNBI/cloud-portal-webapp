import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***Volume***REMOVED*** from './virtualmachinemodels/volume';
import ***REMOVED***VirtualmachineService***REMOVED*** from '../api-connector/virtualmachine.service';
import ***REMOVED***VirtualMachine***REMOVED*** from './virtualmachinemodels/virtualmachine';
import ***REMOVED***GroupService***REMOVED*** from '../api-connector/group.service';
import ***REMOVED***AbstractBaseClasse***REMOVED*** from '../shared_modules/baseClass/abstract-base-class';

/**
 * Enum of all possible volume action statuses.
 */
enum Volume_Action_Statuses ***REMOVED***
    WAITING = 0,
    SUCCESS = 1,
    ERROR = 2,
    DETACHING_VOLUME = 3,
    SUCCESSFULLY_DETACHED_VOLUME = 4,
    ATTACHING = 5,
    ATTACHING_SUCCESSFULL = 6,
    WAIT_CREATION = 7,
    SUCCESSFULLY_CREATED_ATTACHED = 8,
    CHANGING_NAME = 9,
    CHANGING_NAME_SUCESSFULL = 10

***REMOVED***

/**
 * Volume overview component.
 */
@Component(***REMOVED***

    selector: 'app-volume-overview',
    templateUrl: 'volumeOverview.component.html',
    providers: [GroupService, VirtualmachineService]
***REMOVED***)

export class VolumeOverviewComponent extends AbstractBaseClasse implements OnInit ***REMOVED***
    /**
     * Array of all volumes.
     */
    volumes: Volume[];
    /**
     * Array of volumes from the selected Project.
     */
    project_vms: VirtualMachine[];
    /**
     * Selected vm.
     */
    selected_vm: VirtualMachine;
    /**
     * If the site is loaded.
     * @type ***REMOVED***boolean***REMOVED***
     */
    isLoaded: boolean = false;
    /**
     * Selected volume.
     */
    selected_volume: Volume;
    /**
     * Diskspace max from selected Project.
     */
    selectedProjectDiskspaceMax: number;
    /**
     * Diskspace used from selected Project.
     */
    selectedProjectDiskspaceUsed: number;
    /**
     * Volumes max from selected Project.
     */
    selectedProjectVolumesMax: number;
    /**
     * Volumes used from selected Project.
     */
    selectedProjectVolumesUsed: number;
    /**
     * Diskspace actual + addition if new volume would be created for selected Project.
     */
    selectedProjectDiskSpaceSum: number;
    /**
     * The selected Project [name,id].
     */
    selectedProject: [string, number];
    /**
     * List of all projects from the user.
     * @type ***REMOVED***any[]***REMOVED***
     */
    projects: string[] = [];
    /**
     * Default diskspace.
     * @type ***REMOVED***number***REMOVED***
     */
    diskspace: number = 1;
    /**
     * Default volumename.
     * @type ***REMOVED***string***REMOVED***
     */
    volumeName: string = '';
    /**
     * Action which is performed with a volume.
     */
    volume_action_status: number;

    /**
     * Type of request.
     */
    request_status: number;

    constructor(private groupService: GroupService, private vmService: VirtualmachineService) ***REMOVED***
        super();

    ***REMOVED***


    ngOnInit(): void ***REMOVED***
        this.getVolumes();
        this.getUserApprovedProjects();

    ***REMOVED***


    /**
     * Attach a volume to an instance.
     * @param ***REMOVED***string***REMOVED*** volume_id openstack_id of the volume
     * @param ***REMOVED***string***REMOVED*** instance_id openstack_id of the instance
     * @returns ***REMOVED***void***REMOVED***
     */
    attachVolume(volume_id: string, instance_id: string): void ***REMOVED***
        this.volume_action_status = Volume_Action_Statuses.ATTACHING;

        this.vmService.attachVolumetoServer(volume_id, instance_id).subscribe(result => ***REMOVED***

            if (result['Attached'] && result['Attached'] === true) ***REMOVED***
                this.volume_action_status = Volume_Action_Statuses.ATTACHING_SUCCESSFULL;
            ***REMOVED*** else ***REMOVED***
                this.volume_action_status = Volume_Action_Statuses.ERROR;
            ***REMOVED***
            this.getVolumes();
        ***REMOVED***)
    ***REMOVED***


    /**
     * Create an volume and attach to an instance.
     * @param ***REMOVED***string***REMOVED*** volume_name name of the volume
     * @param ***REMOVED***number***REMOVED*** diskspace diskspace of the volume
     * @param ***REMOVED***string***REMOVED*** instance_id opentack_id of the instance
     * @returns ***REMOVED***void***REMOVED***
     */
    createAndAttachvolume(volume_name: string, diskspace: number, instance_id: string): void ***REMOVED***
        this.volume_action_status = 7;
        this.vmService.createVolume(volume_name, diskspace.toString(), instance_id).subscribe(result => ***REMOVED***
            if (result['Created']) ***REMOVED***
                const volume_id = result['Created'];
                this.volume_action_status = Volume_Action_Statuses.ATTACHING;

                this.vmService.attachVolumetoServer(volume_id, instance_id).subscribe(res => ***REMOVED***

                    if (res['Attached'] && res['Attached'] === true) ***REMOVED***
                        this.volume_action_status = Volume_Action_Statuses.SUCCESSFULLY_CREATED_ATTACHED;
                    ***REMOVED*** else ***REMOVED***
                        this.volume_action_status = Volume_Action_Statuses.ERROR;
                    ***REMOVED***
                    this.getVolumes();
                ***REMOVED***)
            ***REMOVED*** else ***REMOVED***
                this.volume_action_status = Volume_Action_Statuses.ERROR;
            ***REMOVED***
            this.getVolumes();

        ***REMOVED***)

    ***REMOVED***


    /**
     * Create an volume.
     * @param ***REMOVED***string***REMOVED*** volume_name name of the volume.
     * @param ***REMOVED***number***REMOVED*** diskspace diskspace of the new volume
     * @param ***REMOVED***string***REMOVED*** instance_id openstack_id of instance.
     * @returns ***REMOVED***void***REMOVED***
     */
    createVolume(volume_name: string, diskspace: number, instance_id: string): void ***REMOVED***
        this.volume_action_status = Volume_Action_Statuses.WAITING;
        this.vmService.createVolume(volume_name, diskspace.toString(), instance_id).subscribe(result => ***REMOVED***
            if (result['Created']) ***REMOVED***
                this.volume_action_status = Volume_Action_Statuses.WAIT_CREATION;
            ***REMOVED*** else ***REMOVED***
                this.volume_action_status = Volume_Action_Statuses.ERROR;
            ***REMOVED***
            this.getVolumes();

        ***REMOVED***)
    ***REMOVED***

    /**
     * Delete Volume (detach first if attached).
     * @param ***REMOVED***string***REMOVED*** volume_id openstack_id of volume
     * @param ***REMOVED***string***REMOVED*** instance_id oopenstack_id of instance
     * @returns ***REMOVED***void***REMOVED***
     */
    deleteVolume(volume_id: string, instance_id?: string): void ***REMOVED***
        this.volume_action_status = Volume_Action_Statuses.WAITING;

        if (instance_id) ***REMOVED***
            this.volume_action_status = Volume_Action_Statuses.DETACHING_VOLUME;
            this.vmService.deleteVolumeAttachment(volume_id, instance_id).subscribe(res => ***REMOVED***
                if (res['Deleted'] && res['Deleted'] === true) ***REMOVED***
                    this.volume_action_status = Volume_Action_Statuses.WAITING;
                ***REMOVED***

                this.vmService.deleteVolume(volume_id).subscribe(result => ***REMOVED***
                    if (result['Deleted'] && result['Deleted'] === true) ***REMOVED***
                        this.volume_action_status = Volume_Action_Statuses.SUCCESS;
                    ***REMOVED*** else ***REMOVED***
                        this.volume_action_status = Volume_Action_Statuses.ERROR;
                    ***REMOVED***
                    this.getVolumes();
                ***REMOVED***)
            ***REMOVED***)

        ***REMOVED*** else ***REMOVED***
            this.vmService.deleteVolume(volume_id).subscribe(result => ***REMOVED***
                if (result['Deleted'] && result['Deleted'] === true) ***REMOVED***
                    this.volume_action_status = Volume_Action_Statuses.SUCCESS;
                ***REMOVED*** else ***REMOVED***
                    this.volume_action_status = Volume_Action_Statuses.ERROR;
                ***REMOVED***
                this.getVolumes();

            ***REMOVED***)
        ***REMOVED***
    ***REMOVED***


    /**
     * Detach volume from instance.
     * @param ***REMOVED***string***REMOVED*** volume_id openstack_id of the volume
     * @param ***REMOVED***string***REMOVED*** instance_id openstack_id of the  instance
     * @returns ***REMOVED***void***REMOVED***
     */
    detachVolume(volume_id: string, instance_id: string): void ***REMOVED***
        this.volume_action_status = Volume_Action_Statuses.DETACHING_VOLUME;
        this.vmService.deleteVolumeAttachment(volume_id, instance_id).subscribe(result => ***REMOVED***
            if (result['Deleted'] && result['Deleted'] === true) ***REMOVED***
                this.volume_action_status = Volume_Action_Statuses.SUCCESSFULLY_DETACHED_VOLUME;
            ***REMOVED*** else ***REMOVED***
                this.volume_action_status = Volume_Action_Statuses.ERROR;
            ***REMOVED***
            this.getVolumes();
        ***REMOVED***)
    ***REMOVED***


    /**
     * Rename a volume ( just in Django DB not in OpenStack).
     * @param ***REMOVED***string***REMOVED*** volume_id openstack_id of volume
     * @param ***REMOVED***string***REMOVED*** new_volume_name the new name
     * @returns ***REMOVED***void***REMOVED***
     */
    renameVolume(volume_id: string, new_volume_name: string): void ***REMOVED***
        this.volume_action_status = Volume_Action_Statuses.CHANGING_NAME;
        this.vmService.renameVolume(volume_id, new_volume_name).subscribe(result => ***REMOVED***
                if (result['volume_name'] === new_volume_name) ***REMOVED***
                    this.volume_action_status = Volume_Action_Statuses.CHANGING_NAME_SUCESSFULL;
                ***REMOVED*** else ***REMOVED***
                    this.volume_action_status = Volume_Action_Statuses.ERROR;
                ***REMOVED***
                this.getVolumes();

            ***REMOVED***
        )

    ***REMOVED***

    /**
     * Get all volumes from user.
     * @returns ***REMOVED***void***REMOVED***
     */
    getVolumes(): void ***REMOVED***
        this.vmService.getVolumesByUser().subscribe(result => ***REMOVED***
            this.volumes = result;
            for (const volume of this.volumes) ***REMOVED***
                this.setCollapseStatus(volume.volume_openstackid, false);
            ***REMOVED***

            this.isLoaded = true;

        ***REMOVED***)
    ***REMOVED***


    /**
     * Get all approved projects from the user.
     * @returns ***REMOVED***void***REMOVED***
     */
    getUserApprovedProjects(): void ***REMOVED***
        this.groupService.getMemberGroupsStatus().subscribe(membergroups => ***REMOVED***
            for (const project of membergroups) ***REMOVED***
                this.projects.push(project);

            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***


    /**
     * Set request status.
     * @param ***REMOVED***number***REMOVED*** status
     * @returns ***REMOVED***void***REMOVED***
     */
    setRequestStatus(status: number): void ***REMOVED***
        this.request_status = status;
    ***REMOVED***

    /**
     * Set selected volume.
     * @param ***REMOVED***Volume***REMOVED*** volume
     * @returns ***REMOVED***void***REMOVED***
     */
    setSelectedVolume(volume: Volume): void ***REMOVED***
        this.selected_volume = volume;
    ***REMOVED***


    /**
     * Calc diskspace sum of selected project diskspace and additional diskspace of new volume.
     */
    calcDiskSpaceSum(): void ***REMOVED***
        this.selectedProjectDiskSpaceSum = parseInt(this.diskspace.toString(), 10)
            + parseInt(this.selectedProjectDiskspaceUsed.toString(), 10);
    ***REMOVED***

    /**
     * Get diskspace of selected project.
     * @returns ***REMOVED***void***REMOVED***
     */
    getSelectedProjectDiskspace(): void ***REMOVED***
        this.groupService.getGroupMaxDiskspace(this.selectedProject[1].toString()).subscribe(result => ***REMOVED***
            if (result['Diskspace']) ***REMOVED***

                this.selectedProjectDiskspaceMax = result['Diskspace'];

            ***REMOVED*** else if (result['Diskspace'] === null || result['Diskspace'] === 0) ***REMOVED***
                this.selectedProjectDiskspaceMax = 0;
            ***REMOVED***

        ***REMOVED***);
        this.groupService.getGroupUsedDiskspace(this.selectedProject[1].toString()).subscribe(result => ***REMOVED***
            if (result['Diskspace']) ***REMOVED***

                this.selectedProjectDiskspaceUsed = result['Diskspace'];
            ***REMOVED*** else if (result['Diskspace'] === 0 || result['Diskspace'] == null) ***REMOVED***
                this.selectedProjectDiskspaceUsed = 0;
            ***REMOVED***

        ***REMOVED***)

    ***REMOVED***

    /**
     * Get volumes of selected project.
     * @returns ***REMOVED***void***REMOVED***
     */
    getSelectedProjectVolumes(): void ***REMOVED***
        this.groupService.getVolumeCounter(this.selectedProject[1].toString()).subscribe(result => ***REMOVED***
            if (result['VolumeCounter']) ***REMOVED***
                this.selectedProjectVolumesMax = result['VolumeCounter'];
            ***REMOVED*** else if (result['VolumeCounter'] === null || result['VolumeCounter'] === 0) ***REMOVED***
                this.selectedProjectVolumesMax = 0;
            ***REMOVED***
        ***REMOVED***);
        this.groupService.getVolumesUsed(this.selectedProject[1].toString()).subscribe(result => ***REMOVED***
            if (result['UsedVolumes']) ***REMOVED***
                this.selectedProjectVolumesUsed = result['UsedVolumes'];
            ***REMOVED*** else if (result['UsedVolumes'] === null || result['UsedVolumes'] === 0) ***REMOVED***

                this.selectedProjectVolumesUsed = 0;
            ***REMOVED***

        ***REMOVED***)
    ***REMOVED***


    /**
     * Get all active vms from a project.
     * @param ***REMOVED***number***REMOVED*** groupid id of the perun group from the project.
     * @returns ***REMOVED***void***REMOVED***
     */
    getActiveVmsByProject(groupid: number): void ***REMOVED***
        this.vmService.getActiveVmsByProject(groupid.toString()).subscribe(result => ***REMOVED***

            this.project_vms = result;
        ***REMOVED***)
    ***REMOVED***


***REMOVED***
