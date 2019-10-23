import {Component, OnInit} from '@angular/core';
import {Volume} from './volume';
import {VirtualmachineService} from '../../api-connector/virtualmachine.service';
import {VirtualMachine} from '../virtualmachinemodels/virtualmachine';
import {GroupService} from '../../api-connector/group.service';
import {AbstractBaseClasse} from '../../shared/shared_modules/baseClass/abstract-base-class';
import {VolumeActionStates} from './volume-action-states.enum';
import {VolumeRequestStates} from './volume-request-states.enum';
import {IResponseTemplate} from '../../api-connector/response-template';
import {FacilityService} from '../../api-connector/facility.service';

/**
 * Volume overview component.
 */
@Component({

             selector: 'app-volume-overview',
             templateUrl: 'volumeOverview.component.html',
             providers: [FacilityService, GroupService, VirtualmachineService]
           })

export class VolumeOverviewComponent extends AbstractBaseClasse implements OnInit {
  title: string = 'Volume Overview';
  /**
   * Enum of all volume action states.
   */
  volumeActionStates: typeof VolumeActionStates = VolumeActionStates;

  showFacilities: boolean = false;

  /**
   * Enum of all request states.
   * @type {VolumeRequestStates}
   */
  volumeRequestStates: typeof VolumeRequestStates = VolumeRequestStates;

  /**
   * Facilitties where the user is manager ['name',id].
   */
  managerFacilities: [string, number][];
  /**
   * Chosen facility.
   */
  selectedFacility: [string, number];

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

  constructor(private facilityService: FacilityService, private groupService: GroupService, private vmService: VirtualmachineService) {
    super();

  }

  ngOnInit(): void {
    this.getVolumes();
    this.getUserApprovedProjects();
    this.facilityService.getManagerFacilities().subscribe((result: any) => {
      this.managerFacilities = result;
      this.selectedFacility = this.managerFacilities[0];
    });

  }

  /**
   * Attach a volume to an instance.
   * @param {string} volume_id openstack_id of the volume
   * @param {string} instance_id openstack_id of the instance
   * @returns {void}
   */
  attachVolume(volume_id: string, instance_id: string): void {
    this.volume_action_status = this.volumeActionStates.ATTACHING;

    this.vmService.attachVolumetoServer(volume_id, instance_id).subscribe((result: IResponseTemplate) => {

      if (result.value === 'attached') {
        this.volume_action_status = this.volumeActionStates.ATTACHING_SUCCESSFULL;
      } else {
        this.volume_action_status = this.volumeActionStates.ERROR;
      }
      this.getVolumes();
    })
  }

  getFacilityVolumes(): void {
    this.volumes = [];

    this.facilityService.getFacilityVolumes(this.selectedFacility['FacilityId']).subscribe((res: any) => {
      this.volumes = res;
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
    this.vmService.createVolume(volume_name, diskspace.toString(), instance_id).subscribe((newVolume: Volume) => {
      if (newVolume.volume_openstackid) {
        this.volume_action_status = this.volumeActionStates.ATTACHING;
        this.vmService.attachVolumetoServer(newVolume.volume_openstackid, instance_id).subscribe((res: IResponseTemplate) => {

          if (res.value === 'attached') {
            this.volume_action_status = this.volumeActionStates.SUCCESSFULLY_CREATED_ATTACHED;
          } else {
            this.volume_action_status = this.volumeActionStates.ERROR;
          }
          this.getVolumes();
        })
      } else {
        this.volume_action_status = this.volumeActionStates.ERROR;
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
    this.volume_action_status = this.volumeActionStates.WAITING;
    this.vmService.createVolume(volume_name, diskspace.toString(), instance_id).subscribe((newVolume: Volume) => {
      if (newVolume.volume_openstackid) {
        this.volume_action_status = this.volumeActionStates.WAIT_CREATION;
        this.volumes.push(newVolume)
      } else {
        this.volume_action_status = this.volumeActionStates.ERROR;
      }
    })
  }

  /**
   * Delete Volume (detach first if attached).
   * @param {string} volume_id openstack_id of volume
   * @param {string} instance_id oopenstack_id of instance
   * @returns {void}
   */
  deleteVolume(volume_id: string, instance_id?: string): void {
    this.volume_action_status = this.volumeActionStates.WAITING;

    if (instance_id) {
      this.volume_action_status = this.volumeActionStates.DETACHING_VOLUME;
      this.vmService.deleteVolumeAttachment(volume_id, instance_id).subscribe((res: IResponseTemplate) => {
        if (res.value === 'deleted') {
          this.volume_action_status = this.volumeActionStates.WAITING;
        }

        this.vmService.deleteVolume(volume_id).subscribe((result: IResponseTemplate) => {
          if (result.value === 'deleted') {
            this.volume_action_status = this.volumeActionStates.SUCCESS;
          } else {
            this.volume_action_status = this.volumeActionStates.ERROR;
          }
          this.getVolumes();
        })
      })

    } else {
      this.vmService.deleteVolume(volume_id).subscribe((result: IResponseTemplate) => {
        if (result.value === 'deleted') {
          this.volume_action_status = this.volumeActionStates.SUCCESS;
        } else {
          this.volume_action_status = this.volumeActionStates.ERROR;
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
    this.volume_action_status = this.volumeActionStates.DETACHING_VOLUME;
    this.vmService.deleteVolumeAttachment(volume_id, instance_id).subscribe((result: any) => {
      if (result.value === 'deleted') {
        this.volume_action_status = this.volumeActionStates.SUCCESSFULLY_DETACHED_VOLUME;
      } else {
        this.volume_action_status = this.volumeActionStates.ERROR;
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
  renameVolume(volume: Volume, new_volume_name: string): void {
    this.volume_action_status = this.volumeActionStates.CHANGING_NAME;
    this.vmService.renameVolume(volume.volume_openstackid, new_volume_name)
      .subscribe((changed_volume: Volume) => {
                   if (changed_volume.volume_name === new_volume_name) {
                     this.volume_action_status = this.volumeActionStates.CHANGING_NAME_SUCESSFULL;
                   } else {
                     this.volume_action_status = this.volumeActionStates.ERROR;
                   }
                   this.volumes[this.volumes.indexOf(volume)] = changed_volume;

                 }
      )

  }

  /**
   * Get all volumes from user.
   * @returns {void}
   */
  getVolumes(): void {
    this.volumes = [];
    this.vmService.getVolumesByUser().subscribe((result: any) => {
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
    this.groupService.getSimpleVmByUser().subscribe((membergroups: any) => {
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
    this.groupService.getGroupMaxDiskspace(this.selectedProject[1].toString()).subscribe((result: IResponseTemplate) => {
      if (result.value) {

        this.selectedProjectDiskspaceMax = <number>result.value;

      } else {
        this.selectedProjectDiskspaceMax = 0;
      }

    });
    this.groupService.getGroupUsedDiskspace(this.selectedProject[1].toString()).subscribe((result: IResponseTemplate) => {
      if (result.value) {

        this.selectedProjectDiskspaceUsed = <number>result.value;
      } else {
        this.selectedProjectDiskspaceUsed = 0;
      }

    })

  }

  /**
   * Get volumes of selected project.
   * @returns {void}
   */
  getSelectedProjectVolumes(): void {
    this.groupService.getVolumeCounter(this.selectedProject[1].toString()).subscribe((result: IResponseTemplate) => {
      if (result.value) {
        this.selectedProjectVolumesMax = <number>result.value;
      } else {
        this.selectedProjectVolumesMax = 0;
      }
    });
    this.groupService.getVolumesUsed(this.selectedProject[1].toString()).subscribe((result: IResponseTemplate) => {
      if (result.value) {
        this.selectedProjectVolumesUsed = <number>result.value;
      } else {

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
    this.vmService.getActiveVmsByProject(groupid.toString()).subscribe((result: any) => {

      this.project_vms = result;
    })
  }

}
