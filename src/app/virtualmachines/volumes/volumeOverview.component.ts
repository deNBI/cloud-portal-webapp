import {Component, OnDestroy, OnInit} from '@angular/core';
import {Volume} from './volume';
import {VirtualmachineService} from '../../api-connector/virtualmachine.service';
import {VirtualMachine} from '../virtualmachinemodels/virtualmachine';
import {GroupService} from '../../api-connector/group.service';
import {AbstractBaseClasse} from '../../shared/shared_modules/baseClass/abstract-base-class';
import {VolumeActionStates} from './volume-action-states.enum';
import {VolumeRequestStates} from './volume-request-states.enum';
import {IResponseTemplate} from '../../api-connector/response-template';
import {FacilityService} from '../../api-connector/facility.service';
import {WIKI_EXTEND_VOLUME, WIKI_MOUNT_VOLUME, WIKI_VOLUME_OVERVIEW} from '../../../links/links';
import {forkJoin, Subject, Subscription} from 'rxjs';
import {VolumeStates} from './volume_states';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

/**
 * Volume overview component.
 */
@Component({

             selector: 'app-volume-overview',
             templateUrl: 'volumeOverview.component.html',
             providers: [FacilityService, GroupService, VirtualmachineService],
             styleUrls: ['../vmOverview.component.scss']

           })

export class VolumeOverviewComponent extends AbstractBaseClasse implements OnInit, OnDestroy {
  WIKI_MOUNT_VOLUME: string = WIKI_MOUNT_VOLUME;
  WIKI_EXTEND_VOLUME: string = WIKI_EXTEND_VOLUME;
  WIKI_VOLUME_OVERVIEW: string = WIKI_VOLUME_OVERVIEW;
  title: string = 'Volume Overview';
  selected_volume_data_loaded: boolean = false;
  filter: string;
  checked_volumes: Volume [] = [];

  /**
   * Enum of all volume action states.
   */
  volumeActionStates: typeof VolumeActionStates = VolumeActionStates;
  extendError: boolean = false;
  extendDone: boolean = false;

  showFacilities: boolean = false;

  /**
   * Enum of all request states.
   * @type {VolumeRequestStates}
   */
  volumeRequestStates: typeof VolumeRequestStates = VolumeRequestStates;

  /**
   * Facilitties where the user is manager ['name',id].
   */
  managerFacilities: [string, number][] = [];
  /**
   * Chosen facility.
   */
  selectedFacility: [string, number];

  /**
   * Array of all volumes.
   */
  volumes: Volume[] = [];
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
   * Default volumeStorage.
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

  extendVolumeStorage: number;

  /**
   * Type of request.
   */
  request_status: number;
  private checkStatusSubscription: Subscription = new Subscription();
  private getVolumesSubscription: Subscription = new Subscription();
  private checkStatusTimeout: number = 5000;
  VolumeStates: VolumeStates = new VolumeStates();
  items_per_page: number = 7;
  total_pages: number;
  total_items: number;
  volumePerPageChange: Subject<number> = new Subject<number>();
  filterChanged: Subject<string> = new Subject<string>();
  DEBOUNCE_TIME: number = 1000;
  currentPage: number = 1;
  isSearching: boolean = true;
  all_volumes_checked: boolean = false;
  selected_volumes_to_detach: boolean = false;

  constructor(private facilityService: FacilityService, private groupService: GroupService, private vmService: VirtualmachineService) {
    super();

  }

  ngOnDestroy(): void {
    this.checkStatusSubscription.unsubscribe();
    this.getVolumesSubscription.unsubscribe();
  }

  changedFilter(text: string): void {
    this.filterChanged.next(text);

  }

  isVolChecked(vol: Volume): boolean {
    return this.checked_volumes.indexOf(vol) !== -1
  }

  changeCheckedVolume(vol: Volume): void {
    if (!this.isVolChecked(vol)) {
      this.checked_volumes.push(vol);

    } else {
      this.checked_volumes.splice(this.checked_volumes.indexOf(vol), 1)
    }
    this.areAllVolumesChecked();
    this.areSelectedVolumesDetachable()

  }

  areSelectedVolumesDetachable(): void {
    this.selected_volumes_to_detach = false;
    this.checked_volumes.forEach((vol: Volume): void => {
      if (vol.volume_virtualmachine) {
        this.selected_volumes_to_detach = true;
      }
    })
  }

  uncheckAll(): void {
    this.checked_volumes = [];
    this.all_volumes_checked = false;
    this.selected_volumes_to_detach = false;
  }

  deleteSelectedVolumes(): void {
    this.checked_volumes.forEach((vol: Volume): void => {
      if (vol.volume_virtualmachine) {
        this.deleteVolume(vol, vol.volume_virtualmachine.openstackid)
      } else {
        this.deleteVolume(vol)
      }
    });
    this.uncheckAll()
  }

  detachSelectedVolumes(): void {
    this.checked_volumes.forEach((vol: Volume): void => {

      if (vol.volume_virtualmachine) {
        this.detachVolume(vol, vol.volume_virtualmachine.openstackid)
      }
    });
    this.uncheckAll()
  }

  areAllVolumesChecked(): void {
    let all_checked: boolean = true;
    this.volumes.forEach((vol: Volume): void => {
      if (!this.isVolChecked(vol)) {
        all_checked = false;

      }
    });

    this.all_volumes_checked = all_checked;

  }

  changeCheckAllVolumes(): void {
    if (this.all_volumes_checked) {
      this.checked_volumes = [];
      this.all_volumes_checked = false;

      return;

    }

    this.volumes.forEach((vol: Volume): void => {
      if (!this.isVolChecked(vol)) {
        this.checked_volumes.push(vol);
      }
    });
    this.all_volumes_checked = true;
    this.areSelectedVolumesDetachable()

  }

  setSelectedProjectByVolume(volume: Volume): void {
    this.selectedProject = [volume.volume_project, parseInt(volume.volume_projectid, 10)];
  }

  ngOnInit(): void {
    this.getVolumes();
    this.getUserApprovedProjects();
    this.facilityService.getManagerFacilities().subscribe((result: any): void => {
      this.managerFacilities = result;
      this.selectedFacility = this.managerFacilities[0];
    });
    this.filterChanged
      .pipe(
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged(), switchMap((filter: string): any => {
                                            this.isSearching = true;

                                            this.filter = filter.trim();

                                            return this.vmService.getVolumesByUser(this.items_per_page, this.currentPage, this.filter)
                                          }
        )).subscribe((result: any): void => {
      this.volumes = result['volume_list'];
      this.total_pages = result['num_pages'];
      this.total_items = result['total_items'];
      this.items_per_page = result['items_per_page'];
      for (const volume of this.volumes) {
        this.setCollapseStatus(volume.volume_openstackid, false);
      }

      this.isSearching = false;
      this.volumes.forEach((vol: Volume): void => {
        // tslint:disable-next-line:max-line-length
        if (vol.volume_status !== VolumeStates.AVAILABLE && vol.volume_status !== VolumeStates.NOT_FOUND && vol.volume_status !== VolumeStates.IN_USE) {

          this.check_status_loop(vol)
        }
      })

    });
    this.volumePerPageChange.pipe(
      debounceTime(this.DEBOUNCE_TIME),
      distinctUntilChanged())
      .subscribe((): void => {
        if (this.items_per_page && this.items_per_page > 0) {
          if (this.showFacilities) {
            this.getFacilityVolumes()
          } else {
            this.getVolumes()
          }
        }

      });

  }

  /**
   * Attach a volume to an instance.
   * @param {string} volume_id openstack_id of the volume
   * @param {string} instance_id openstack_id of the instance
   * @returns {void}
   */
  attachVolume(volume: Volume, instance_id: string): void {

    volume.volume_status = VolumeStates.ATTACHING;
    this.vmService.attachVolumetoServer(volume.volume_openstackid, instance_id).subscribe(
      (result: IResponseTemplate): void => {

        if (result.value === 'attached') {
          this.volume_action_status = this.volumeActionStates.ATTACHING_SUCCESSFULL;
        } else {
          this.volume_action_status = this.volumeActionStates.ERROR;
        }
        this.check_status_loop(volume, 0)
      },
      (error: any): void => {
        if (error['error']['error'] === '409') {
          volume.error_msg = 'Conflict detected. The virtual machine is currently creating a snapshot and must not be altered.';
          setTimeout((): void => {
                       volume.error_msg = null;
                     },
                     5000);
        }
        this.check_status_loop(volume, 0)
      }
    )
  }

  extendVolume(volume: Volume, new_storage: number): void {
    volume.volume_status = VolumeStates.EXTENDING;
    this.vmService.extendVolume(volume.volume_openstackid, new_storage.toString()).subscribe(
      (res: any): void => {
        if (res['status_code'] === 0) {
          this.check_status_loop(volume, 0, undefined, new_storage);
        } else {
          this.extendError = true;
          this.check_status_loop(volume, 0);
        }
      }
    )
  }

  /**
   * Load volumes depending on page.
   * @param event
   */
  pageChanged(event: any): void {
    this.isSearching = true;

    this.currentPage = event.page;
    if (this.showFacilities) {
      this.getFacilityVolumes()
    } else {
      this.getVolumes()
    }
  }

  getFacilityVolumes(): void {
    this.isSearching = true;
    this.getVolumesSubscription.unsubscribe();
    this.getVolumesSubscription = new Subscription();

    this.getVolumesSubscription.add(
      this.facilityService.getFacilityVolumes(
        this.selectedFacility['FacilityId'], this.items_per_page, this.currentPage).subscribe((result: any): void => {
        this.volumes = result['volume_list'];
        this.total_pages = result['num_pages'];
        this.total_items = result['total_items'];
        this.items_per_page = result['items_per_page'];
        for (const volume of this.volumes) {
          this.setCollapseStatus(volume.volume_openstackid, false);
        }

        this.isLoaded = true;
        this.isSearching = false;
        this.volumes.forEach((vol: Volume): void => {
          // tslint:disable-next-line:max-line-length
          if (vol.volume_status !== VolumeStates.AVAILABLE && vol.volume_status !== VolumeStates.NOT_FOUND && vol.volume_status !== VolumeStates.IN_USE) {

            this.check_status_loop(vol)
          }
        })
      }))
  }

  /**
   * Create an volume and attach to an instance.
   * @param {string} volume_name name of the volume
   * @param {number} diskspace volumeStorage of the volume
   * @param {string} instance_id opentack_id of the instance
   * @returns {void}
   */
  createAndAttachvolume(volume_name: string, diskspace: number, instance_id: string): void {
    this.volume_action_status = 7;
    this.vmService.createVolume(volume_name, diskspace.toString(), instance_id).subscribe(
      (newVolume: Volume): void => {
        newVolume.volume_created_by_user = true;

        if (newVolume.volume_openstackid) {
          newVolume.volume_status = VolumeStates.ATTACHING;
          this.volumes.push(newVolume);

          this.volume_action_status = this.volumeActionStates.ATTACHING;

          this.vmService.attachVolumetoServer(newVolume.volume_openstackid, instance_id).subscribe(
            (res: IResponseTemplate): void => {

              if (res.value === 'attached') {
                this.volume_action_status = this.volumeActionStates.SUCCESSFULLY_CREATED_ATTACHED;
              } else {
                this.volume_action_status = this.volumeActionStates.ERROR;
              }
              this.check_status_loop(newVolume, 0)
            },
            (error: any): void => {
              if (error['error']['error'] === '409') {
                newVolume.error_msg = 'Conflict detected. The virtual machine is currently creating a snapshot and must not be altered.';
                setTimeout((): void => {
                             newVolume.error_msg = null;
                           },
                           5000);
              }
              this.check_status_loop(newVolume, 0);
            }
          )
        } else {
          this.volume_action_status = this.volumeActionStates.ERROR;
        }
      })

  }

  /**
   * Create an volume.
   * @param {string} volume_name name of the volume.
   * @param {number} diskspace volumeStorage of the new volume
   * @param {string} instance_id openstack_id of instance.
   * @returns {void}
   */
  createVolume(volume_name: string, diskspace: number, instance_id: string): void {
    this.volume_action_status = this.volumeActionStates.WAITING;
    this.vmService.createVolume(volume_name, diskspace.toString(), instance_id).subscribe((newVolume: Volume): void => {
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
   * @param {Volume} Volume
   * @param {string} instance_id oopenstack_id of instance
   * @returns {void}
   */
  deleteVolume(volume: Volume, instance_id?: string): void {
    const idx: number = this.volumes.indexOf(volume);

    if (instance_id) {
      volume.volume_status = VolumeStates.DETACHING;
      this.vmService.deleteVolumeAttachment(volume.volume_openstackid, instance_id).subscribe(
        (res: IResponseTemplate): void => {
          if (res.value === 'deleted') {
            this.volume_action_status = this.volumeActionStates.WAITING;
          }
          volume.volume_status = VolumeStates.DELETING;

          this.vmService.deleteVolume(volume.volume_openstackid).subscribe((result: IResponseTemplate): void => {
            if (result.value === 'deleted') {
              this.volume_action_status = this.volumeActionStates.SUCCESS;
            } else {
              this.volume_action_status = this.volumeActionStates.ERROR;
            }
            this.volumes.splice(idx, 1)
          })
        },
        (error: any): void => {
          if (error['error']['error'] === '409') {
            volume.error_msg = 'Conflict detected. The virtual machine is currently creating a snapshot and must not be altered.';
            setTimeout((): void => {
                         volume.error_msg = null;
                       },
                       5000);
          }
          this.check_status_loop(volume, 0)
        }
      )

    } else {
      volume.volume_status = VolumeStates.DELETING;
      this.vmService.deleteVolume(volume.volume_openstackid).subscribe(
        (result: IResponseTemplate): void => {
          if (result.value === 'deleted') {
            this.volume_action_status = this.volumeActionStates.SUCCESS;
          } else {
            this.volume_action_status = this.volumeActionStates.ERROR;
          }
          this.volumes.splice(idx, 1)

        },
        (error: any): void => {
          if (error['error']['error'] === '409') {
            volume.error_msg = 'Conflict detected. The virtual machine is currently creating a snapshot and must not be altered.';
            setTimeout((): void => {
                         volume.error_msg = null;
                       },
                       5000);
          }
          this.check_status_loop(volume, 0);
        })
    }
  }

  /**
   * Detach volume from instance.
   * @param {Volume} volume
   * @param {string} instance_id openstack_id of the  instance
   * @returns {void}
   */
  detachVolume(volume: Volume, instance_id: string): void {

    this.volume_action_status = this.volumeActionStates.DETACHING_VOLUME;
    volume.volume_status = VolumeStates.DETACHING;
    this.vmService.deleteVolumeAttachment(volume.volume_openstackid, instance_id).subscribe(
      (result: any): void => {
        if (result.value === 'deleted') {
          this.volume_action_status = this.volumeActionStates.SUCCESSFULLY_DETACHED_VOLUME;
        } else {
          this.volume_action_status = this.volumeActionStates.ERROR;
        }
        this.check_status_loop(volume, 0)
      },
      (error: any): void => {
        if (error['error']['error'] === '409') {
          volume.error_msg = 'Conflict detected. The virtual machine is currently creating a snapshot and must not be altered.';
          setTimeout((): void => {
                       volume.error_msg = null;
                     },
                     5000);
        }
        this.check_status_loop(volume, 0)
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
      .subscribe((changed_volume: Volume): void => {
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
    this.isSearching = true;
    this.getVolumesSubscription.unsubscribe();
    this.getVolumesSubscription = new Subscription();
    this.getVolumesSubscription.add(
      this.vmService.getVolumesByUser(this.items_per_page, this.currentPage)
        .subscribe((result: any): void => {
          this.volumes = result['volume_list'];
          this.total_pages = result['num_pages'];
          this.total_items = result['total_items'];
          this.items_per_page = result['items_per_page'];
          for (const volume of this.volumes) {
            this.setCollapseStatus(volume.volume_openstackid, false);
          }

          this.isLoaded = true;
          this.isSearching = false;
          this.volumes.forEach((vol: Volume): void => {
            // tslint:disable-next-line:max-line-length
            if (vol.volume_status !== VolumeStates.AVAILABLE && vol.volume_status !== VolumeStates.NOT_FOUND && vol.volume_status !== VolumeStates.IN_USE) {

              this.check_status_loop(vol)
            }
          })

        }))

  }

  getVolume(volume: Volume): void {
    const idx: number = this.volumes.indexOf(volume);
    this.vmService.getVolumeById(volume.volume_openstackid).subscribe((vol: Volume): void => {
      this.volumes[idx] = vol;

    })
  }

  check_status_loop(volume: Volume, initial_timeout: number = this.checkStatusTimeout, final_state?: string, expected_storage?: number):
    void {
    const created: boolean = volume.volume_created_by_user;

    setTimeout(
      (): void => {
        const idx: number = this.volumes.indexOf(volume);
        if (volume.volume_openstackid) {

          this.checkStatusSubscription.add(this.vmService.getVolumeById(volume.volume_openstackid).subscribe((vol: Volume): void => {
            if (expected_storage && vol.volume_storage !== expected_storage) {
              return this.check_status_loop(volume, this.checkStatusTimeout, final_state, expected_storage);
            } else if (expected_storage && vol.volume_storage === expected_storage) {
              this.extendDone = true;
            }
            if (volume.error_msg !== '' && volume.error_msg !== undefined && volume.error_msg !== null) {
              vol.error_msg = volume.error_msg;
              setTimeout((): void => {
                           vol.error_msg = null;
                         },
                         5000);
            }
            if (idx > -1) {
              vol.volume_created_by_user = created;
              this.volumes[idx] = vol;
            }
            // tslint:disable-next-line:max-line-length
            if (vol.volume_status !== VolumeStates.AVAILABLE && vol.volume_status !== VolumeStates.NOT_FOUND && vol.volume_status !== VolumeStates.IN_USE && vol.volume_status !== final_state) {
              this.check_status_loop(this.volumes[idx], this.checkStatusTimeout, final_state)
            }
          }))
        } else {
          // tslint:disable-next-line:max-line-length
          this.checkStatusSubscription.add(this.vmService.getVolumeByNameAndVmName(volume.volume_name, volume.volume_virtualmachine.name).subscribe((vol: Volume): void => {
            if (volume.error_msg !== '' && volume.error_msg !== undefined && volume.error_msg !== null) {
              vol.error_msg = volume.error_msg;
              setTimeout((): void => {
                           vol.error_msg = null;
                         },
                         5000);
            }
            if (idx > -1) {
              vol.volume_created_by_user = created;
              this.volumes[idx] = vol;
            }
            // tslint:disable-next-line:max-line-length
            if (vol.volume_status !== VolumeStates.AVAILABLE && vol.volume_status !== VolumeStates.NOT_FOUND && vol.volume_status !== VolumeStates.IN_USE && vol.volume_status !== final_state) {
              this.check_status_loop(this.volumes[idx], this.checkStatusTimeout, final_state)
            }
          }))

        }
      },
      initial_timeout
    )
  }

  /**
   * Get all approved projects from the user.
   * @returns {void}
   */
  getUserApprovedProjects(): void {
    this.groupService.getSimpleVmByUser().subscribe((membergroups: any): void => {
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
   * Calc volumeStorage sum of selected project volumeStorage and additional volumeStorage of new volume.
   */
  calcDiskSpaceSum(): void {
    this.selectedProjectDiskSpaceSum = parseInt(this.diskspace.toString(), 10)
      + parseInt(this.selectedProjectDiskspaceUsed.toString(), 10);
  }

  getSelectedVolumeStorage(): void {
    this.setSelectedProjectByVolume(this.selected_volume);
    this.selected_volume_data_loaded = false;
    forkJoin(this.groupService.getGroupMaxDiskspace(this.selectedProject[1].toString()),
             this.groupService.getGroupUsedDiskspace(this.selectedProject[1].toString()))
      .subscribe((result: any): void => {
                   if (result[0]['value']) {
                     this.selectedProjectDiskspaceMax = result[0]['value'];

                   } else {
                     this.selectedProjectDiskspaceMax = 0;
                   }
                   if (result[1]['value']) {

                     this.selectedProjectDiskspaceUsed = result[1]['value'];
                   } else {
                     this.selectedProjectDiskspaceUsed = 0;
                   }
                   this.selected_volume_data_loaded = true;

                 }
      )
  }

  /**
   * Get volumeStorage of selected project.
   * @returns {void}
   */
  getSelectedProjectDiskspace(): void {
    this.groupService.getGroupMaxDiskspace(this.selectedProject[1].toString()).subscribe((result: IResponseTemplate): void => {
      if (result.value) {

        this.selectedProjectDiskspaceMax = <number>result.value;

      } else {
        this.selectedProjectDiskspaceMax = 0;
      }

    });
    this.groupService.getGroupUsedDiskspace(this.selectedProject[1].toString()).subscribe((result: IResponseTemplate): void => {
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
    this.groupService.getVolumeCounter(this.selectedProject[1].toString()).subscribe((result: IResponseTemplate): void => {
      if (result.value) {
        this.selectedProjectVolumesMax = <number>result.value;
      } else {
        this.selectedProjectVolumesMax = 0;
      }
    });
    this.groupService.getVolumesUsed(this.selectedProject[1].toString()).subscribe((result: IResponseTemplate): void => {
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
  getActiveVmsByProject(groupid: number | string): void {
    this.vmService.getActiveVmsByProject(groupid.toString()).subscribe((result: any): void => {

      this.project_vms = result;
    })
  }

}
