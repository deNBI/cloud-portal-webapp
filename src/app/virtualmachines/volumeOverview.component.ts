import {Component, OnInit, TemplateRef} from '@angular/core';
import {Volume} from "./virtualmachinemodels/volume";
import {VirtualmachineService} from "../api-connector/virtualmachine.service";
import {VirtualMachine} from "./virtualmachinemodels/virtualmachine";
import {GroupService} from "../api-connector/group.service";
import {AbstractBaseClasse} from "../shared_modules/baseClass/abstract-base-class";

/**
 * Enum of all possible volume action statuses.
 */
enum Volume_Action_Statuses {
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

enum Volume_Request_Statuses {
    DELETE = 0,
    DETACH = 1,

}

@Component({

    selector: 'volume-overview',
    templateUrl: 'volumeOverview.component.html',
    providers: [GroupService, VirtualmachineService]
})

export class VolumeOverviewComponent extends AbstractBaseClasse implements OnInit {
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
    isLoaded = false;
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
    projects: string[] = new Array();
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

    volume_action_status: number;
    request_status: number;


    constructor(private groupService: GroupService, private vmService: VirtualmachineService) {
        super();

    }

    setRequestStatus(status: number) {
        this.request_status = status;
    }

    setSelectedVolume(volume: Volume) {
        this.selected_volume = volume;
    }


    getVolumes() {
        this.vmService.getVolumesByUser().subscribe(result => {
            this.volumes = result;
            this.isLoaded = true;

        })
    }

    calcDiskSpaceSum(): void {
        this.selectedProjectDiskSpaceSum = parseInt(this.diskspace.toString()) + parseInt(this.selectedProjectDiskspaceUsed.toString());
    }


    getSelectedProjectDiskspace(): void {
        this.groupService.getGroupMaxDiskspace(this.selectedProject[1].toString()).subscribe(result => {
            if (result['Diskspace']) {


                this.selectedProjectDiskspaceMax = result['Diskspace'];

            }
            else if (result['Diskspace'] === null || result['Diskspace'] === 0) {
                this.selectedProjectDiskspaceMax = 0;
            }

        })
        this.groupService.getGroupUsedDiskspace(this.selectedProject[1].toString()).subscribe(result => {
            if (result['Diskspace']) {

                this.selectedProjectDiskspaceUsed = result['Diskspace'];
            }
            else if (result['Diskspace'] == 0 || result['Diskspace'] == null) {
                this.selectedProjectDiskspaceUsed = 0;
            }


        })

    }

    getSelectedProjectVolumes(): void {
        this.groupService.getVolumeCounter(this.selectedProject[1].toString()).subscribe(result => {
            if (result['VolumeCounter']) {
                this.selectedProjectVolumesMax = result['VolumeCounter'];
            }
            else if (result['VolumeCounter'] === null || result['VolumeCounter'] === 0) {
                this.selectedProjectVolumesMax = 0;
            }
        })
        this.groupService.getVolumesUsed(this.selectedProject[1].toString()).subscribe(result => {
            if (result['UsedVolumes']) {
                this.selectedProjectVolumesUsed = result['UsedVolumes'];
            }
            else if (result['UsedVolumes'] === null || result['UsedVolumes'] === 0) {

                this.selectedProjectVolumesUsed = 0;
            }

        })
    }


    deleteVolume(volume_id: string, instance_id?: string) {
        this.volume_action_status = Volume_Action_Statuses.WAITING;


        if (instance_id) {
            this.volume_action_status = Volume_Action_Statuses.DETACHING_VOLUME;
            this.vmService.deleteVolumeAttachment(volume_id, instance_id).subscribe(result => {
                if (result['Deleted'] && result['Deleted'] === true) {
                    this.volume_action_status = Volume_Action_Statuses.WAITING;
                }

                this.vmService.deleteVolume(volume_id).subscribe(result => {
                    if (result['Deleted'] && result['Deleted'] === true) {
                        this.volume_action_status = Volume_Action_Statuses.SUCCESS;
                    }
                    else {
                        this.volume_action_status = Volume_Action_Statuses.ERROR;
                    }
                    this.getVolumes();
                })
            })

        }
        else {
            this.vmService.deleteVolume(volume_id).subscribe(result => {
                if (result['Deleted'] && result['Deleted'] === true) {
                    this.volume_action_status = Volume_Action_Statuses.SUCCESS;
                }
                else {
                    this.volume_action_status = Volume_Action_Statuses.ERROR;
                }
                this.getVolumes();

            })
        }
    }


    attachVolume(volume_id: string, instance_id: string) {
        this.volume_action_status = Volume_Action_Statuses.ATTACHING;

        this.vmService.attachVolumetoServer(volume_id, instance_id).subscribe(result => {

            if (result['Attached'] && result['Attached'] === true) {
                this.volume_action_status = Volume_Action_Statuses.ATTACHING_SUCCESSFULL;
            }
            else {
                this.volume_action_status = Volume_Action_Statuses.ERROR;
            }
            this.getVolumes();
        })
    }


    renameVolume(volume_id: string, new_volume_name: string) {
        this.volume_action_status = Volume_Action_Statuses.CHANGING_NAME;
        this.vmService.renameVolume(volume_id, new_volume_name).subscribe(result => {
                if (result['volume_name'] == new_volume_name) {
                    this.volume_action_status = Volume_Action_Statuses.CHANGING_NAME_SUCESSFULL;
                }
                else {
                    this.volume_action_status = Volume_Action_Statuses.ERROR;
                }
                this.getVolumes();

            }
        )


    }


    createVolume(volume_name: string, diskspace: number, instance_id: string) {
        this.volume_action_status = Volume_Action_Statuses.WAITING;
        this.vmService.createVolume(volume_name, diskspace.toString(), instance_id).subscribe(result => {
            if (result['Created']) {
                this.volume_action_status = Volume_Action_Statuses.WAIT_CREATION;
            }
            else {
                this.volume_action_status = Volume_Action_Statuses.ERROR;
            }
            this.getVolumes();

        })
    }


    createAndAttachvolume(volume_name: string, diskspace: number, instance_id: string) {
        this.volume_action_status = 7;
        this.vmService.createVolume(volume_name, diskspace.toString(), instance_id).subscribe(result => {
            if (result['Created']) {
                let volume_id = result['Created'];
                this.volume_action_status = Volume_Action_Statuses.ATTACHING;

                this.vmService.attachVolumetoServer(volume_id, instance_id).subscribe(result => {

                    if (result['Attached'] && result['Attached'] === true) {
                        this.volume_action_status = Volume_Action_Statuses.SUCCESSFULLY_CREATED_ATTACHED;
                    }
                    else {
                        this.volume_action_status = Volume_Action_Statuses.ERROR;
                    }
                    this.getVolumes();
                })
            }
            else {
                this.volume_action_status = Volume_Action_Statuses.ERROR;
            }
            this.getVolumes();

        })

    }


    getActiveVmsByProject(groupid: number) {
        this.vmService.getActiveVmsByProject(groupid.toString()).subscribe(result => {


            this.project_vms = result;
        })
    }


    detachVolume(volume_id: string, instance_id: string) {
        this.volume_action_status = Volume_Action_Statuses.DETACHING_VOLUME;
        this.vmService.deleteVolumeAttachment(volume_id, instance_id).subscribe(result => {
            if (result['Deleted'] && result['Deleted'] === true) {
                this.volume_action_status = Volume_Action_Statuses.SUCCESSFULLY_DETACHED_VOLUME;
            }
            else {
                this.volume_action_status = Volume_Action_Statuses.ERROR;
            }
            this.getVolumes();
        })
    }

    getUserApprovedProjects() {
        this.groupService.getMemberGroupsStatus().subscribe(membergroups => {
            for (let project of membergroups) {
                this.projects.push(project);

            }
        });
    }


    ngOnInit(): void {
        this.getVolumes();
        this.getUserApprovedProjects();


    }

}
