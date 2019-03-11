import {Component, OnInit} from '@angular/core';
import {Volume} from './virtualmachinemodels/volume';
import {VirtualmachineService} from '../api-connector/virtualmachine.service';
import {VirtualMachine} from './virtualmachinemodels/virtualmachine';
import {GroupService} from '../api-connector/group.service';
import {AbstractBaseClasse} from '../shared/shared_modules/baseClass/abstract-base-class';

/**
 * Enum of all possible volume action statuses.
 */
export enum Volume_Action_Statuses {
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

}

/**
 * Volume overview component.
 */
@Component({

    selector: 'app-volume-overview',
    templateUrl: 'volumeOverview.component.html',
    providers: [GroupService, VirtualmachineService]
})

export class VolumeOverviewComponent extends AbstractBaseClasse implements OnInit {

    Volume_Action_Statuses: Volume_Action_Statuses;
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
     * @type {boolean}
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
     * @type {any[]}
     */
    projects: string[] = [];
    /**
     * Default diskspace.
     * @type {number}
     */
    diskspace: number = 1;
    /**
     * Default volumename.
     * @type {string}
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

    constructor(private groupService: GroupService, private vmService: VirtualmachineService) {
        super();

    }

    ngOnInit(): void {
        this.getVolumes();
        this.getUserApprovedProjects();

    }

    /**
     * Attach a volume to an instance.
     * @param {string} volume_id openstack_id of the volume
     * @param {string} instance_id openstack_id of the instance
     * @returns {void}
     */
    attachVolume(volume_id: string, instance_id: string): void {
        this.volume_action_status = this.Volume_Action_Statuses.ATTACHING;

        this.vmService.attachVolumetoServer(volume_id, instance_id).subscribe(result => {

            if (result['Attached'] && result['Attached'] === true) {
                this.volume_action_status = Volume_Action_Statuses.ATTACHING_SUCCESSFULL;
            } else {
                this.volume_action_status = Volume_Action_Statuses.ERROR;
            }
            this.getVolumes();
        })
    }

    /**
     * Create an volume and attach to an instance.
     * @param {string} volume_name name of the volume
     * @param {number} diskspace diskspace of the volume
     * @param {string} instance_id opentack_id of the instance
     * @returns {void}
     */
    createAndAttachvolume(volume_name: string, diskspace: number, instance_id: string): void {
        this.volume_action_status = 7;
        this.vmService.createVolume(volume_name, diskspace.toString(), instance_id).subscribe(result => {
            if (result['Created']) {
                const volume_id = result['Created'];
                this.volume_action_status = Volume_Action_Statuses.ATTACHING;

                this.vmService.attachVolumetoServer(volume_id, instance_id).subscribe(res => {

                    if (res['Attached'] && res['Attached'] === true) {
                        this.volume_action_status = Volume_Action_Statuses.SUCCESSFULLY_CREATED_ATTACHED;
                    } else {
                        this.volume_action_status = Volume_Action_Statuses.ERROR;
                    }
                    this.getVolumes();
                })
            } else {
                this.volume_action_status = Volume_Action_Statuses.ERROR;
            }
            this.getVolumes();

        })

    }

    /**
     * Create an volume.
     * @param {string} volume_name name of the volume.
     * @param {number} diskspace diskspace of the new volume
     * @param {string} instance_id openstack_id of instance.
     * @returns {void}
     */
    createVolume(volume_name: string, diskspace: number, instance_id: string): void {
        this.volume_action_status = Volume_Action_Statuses.WAITING;
        this.vmService.createVolume(volume_name, diskspace.toString(), instance_id).subscribe(result => {
            if (result['Created']) {
                this.volume_action_status = Volume_Action_Statuses.WAIT_CREATION;
            } else {
                this.volume_action_status = Volume_Action_Statuses.ERROR;
            }
            this.getVolumes();

        })
    }

    /**
     * Delete Volume (detach first if attached).
     * @param {string} volume_id openstack_id of volume
     * @param {string} instance_id oopenstack_id of instance
     * @returns {void}
     */
    deleteVolume(volume_id: string, instance_id?: string): void {
        this.volume_action_status = Volume_Action_Statuses.WAITING;

        if (instance_id) {
            this.volume_action_status = Volume_Action_Statuses.DETACHING_VOLUME;
            this.vmService.deleteVolumeAttachment(volume_id, instance_id).subscribe(res => {
                if (res['Deleted'] && res['Deleted'] === true) {
                    this.volume_action_status = Volume_Action_Statuses.WAITING;
                }

                this.vmService.deleteVolume(volume_id).subscribe(result => {
                    if (result['Deleted'] && result['Deleted'] === true) {
                        this.volume_action_status = Volume_Action_Statuses.SUCCESS;
                    } else {
                        this.volume_action_status = Volume_Action_Statuses.ERROR;
                    }
                    this.getVolumes();
                })
            })

        } else {
            this.vmService.deleteVolume(volume_id).subscribe(result => {
                if (result['Deleted'] && result['Deleted'] === true) {
                    this.volume_action_status = Volume_Action_Statuses.SUCCESS;
                } else {
                    this.volume_action_status = Volume_Action_Statuses.ERROR;
                }
                this.getVolumes();

            })
        }
    }

    /**
     * Detach volume from instance.
     * @param {string} volume_id openstack_id of the volume
     * @param {string} instance_id openstack_id of the  instance
     * @returns {void}
     */
    detachVolume(volume_id: string, instance_id: string): void {
        this.volume_action_status = Volume_Action_Statuses.DETACHING_VOLUME;
        this.vmService.deleteVolumeAttachment(volume_id, instance_id).subscribe(result => {
            if (result['Deleted'] && result['Deleted'] === true) {
                this.volume_action_status = Volume_Action_Statuses.SUCCESSFULLY_DETACHED_VOLUME;
            } else {
                this.volume_action_status = Volume_Action_Statuses.ERROR;
            }
            this.getVolumes();
        })
    }

    /**
     * Rename a volume ( just in Django DB not in OpenStack).
     * @param {string} volume_id openstack_id of volume
     * @param {string} new_volume_name the new name
     * @returns {void}
     */
    renameVolume(volume_id: string, new_volume_name: string): void {
        this.volume_action_status = Volume_Action_Statuses.CHANGING_NAME;
        this.vmService.renameVolume(volume_id, new_volume_name).subscribe(result => {
                if (result['volume_name'] === new_volume_name) {
                    this.volume_action_status = Volume_Action_Statuses.CHANGING_NAME_SUCESSFULL;
                } else {
                    this.volume_action_status = Volume_Action_Statuses.ERROR;
                }
                this.getVolumes();

            }
        )

    }

    /**
     * Get all volumes from user.
     * @returns {void}
     */
    getVolumes(): void {
        this.vmService.getVolumesByUser().subscribe(result => {
            this.volumes = result;
            for (const volume of this.volumes) {
                this.setCollapseStatus(volume.volume_openstackid, false);
            }

            this.isLoaded = true;

        })
    }

    /**
     * Get all approved projects from the user.
     * @returns {void}
     */
    getUserApprovedProjects(): void {
        this.groupService.getMemberGroupsStatus().subscribe(membergroups => {
            for (const project of membergroups) {
                this.projects.push(project);

            }
        });
    }

    /**
     * Set request status.
     * @param {number} status
     * @returns {void}
     */
    setRequestStatus(status: number): void {
        this.request_status = status;
    }

    /**
     * Set selected volume.
     * @param {Volume} volume
     * @returns {void}
     */
    setSelectedVolume(volume: Volume): void {
        this.selected_volume = volume;
    }

    /**
     * Calc diskspace sum of selected project diskspace and additional diskspace of new volume.
     */
    calcDiskSpaceSum(): void {
        this.selectedProjectDiskSpaceSum = parseInt(this.diskspace.toString(), 10)
            + parseInt(this.selectedProjectDiskspaceUsed.toString(), 10);
    }

    /**
     * Get diskspace of selected project.
     * @returns {void}
     */
    getSelectedProjectDiskspace(): void {
        this.groupService.getGroupMaxDiskspace(this.selectedProject[1].toString()).subscribe(result => {
            if (result['Diskspace']) {

                this.selectedProjectDiskspaceMax = result['Diskspace'];

            } else if (result['Diskspace'] === null || result['Diskspace'] === 0) {
                this.selectedProjectDiskspaceMax = 0;
            }

        });
        this.groupService.getGroupUsedDiskspace(this.selectedProject[1].toString()).subscribe(result => {
            if (result['Diskspace']) {

                this.selectedProjectDiskspaceUsed = result['Diskspace'];
            } else if (result['Diskspace'] === 0 || result['Diskspace'] == null) {
                this.selectedProjectDiskspaceUsed = 0;
            }

        })

    }

    /**
     * Get volumes of selected project.
     * @returns {void}
     */
    getSelectedProjectVolumes(): void {
        this.groupService.getVolumeCounter(this.selectedProject[1].toString()).subscribe(result => {
            if (result['VolumeCounter']) {
                this.selectedProjectVolumesMax = result['VolumeCounter'];
            } else if (result['VolumeCounter'] === null || result['VolumeCounter'] === 0) {
                this.selectedProjectVolumesMax = 0;
            }
        });
        this.groupService.getVolumesUsed(this.selectedProject[1].toString()).subscribe(result => {
            if (result['UsedVolumes']) {
                this.selectedProjectVolumesUsed = result['UsedVolumes'];
            } else if (result['UsedVolumes'] === null || result['UsedVolumes'] === 0) {

                this.selectedProjectVolumesUsed = 0;
            }

        })
    }

    /**
     * Get all active vms from a project.
     * @param {number} groupid id of the perun group from the project.
     * @returns {void}
     */
    getActiveVmsByProject(groupid: number): void {
        this.vmService.getActiveVmsByProject(groupid.toString()).subscribe(result => {

            this.project_vms = result;
        })
    }

}
