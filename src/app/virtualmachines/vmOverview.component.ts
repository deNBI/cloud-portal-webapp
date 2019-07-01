import {Component, OnInit} from '@angular/core';

import {VirtualmachineService} from '../api-connector/virtualmachine.service';
import {VirtualMachine} from './virtualmachinemodels/virtualmachine';
import {FullLayoutComponent} from '../layouts/full-layout.component';
import {UserService} from '../api-connector/user.service';
import {ImageService} from '../api-connector/image.service';
import {FilterBaseClass} from '../shared/shared_modules/baseClass/filter-base-class';
import {VoService} from '../api-connector/vo.service';
import {IResponseTemplate} from '../api-connector/response-template';
import {SnapshotModel} from './snapshots/snapshot.model';

/**
 * Vm overview componentn.
 */
@Component({
             selector: 'app-vm-overview',
             templateUrl: 'vmOverview.component.html',
             providers: [VoService, ImageService, UserService, VirtualmachineService, FullLayoutComponent]
           })

export class VmOverviewComponent extends FilterBaseClass implements OnInit {
  /**
   * All unfiltered vms.
   */
  vms_content: VirtualMachine[];
  /**
   * All vms filtered.
   */
  vms_filtered: VirtualMachine[];
  /**
   * All vms returned with paging.
   */
  vms_returned: VirtualMachine[];
  /**
   * How many vms are shown per page.
   * @type {number}
   */
  vmsPerPage: number = 5;
  /**
   * Current page.
   * @type {number}
   */
  currentPage: number = 1;
  /**
   * Index where the vm list starts.
   * @type {number}
   */
  vmStart: number = 0;
  /**
   * How to connect for specific vm.
   */
  how_to_connect: string;
  /**
   * End of the vms.
   * @type {number}
   */
  vmEnd: number = this.vmsPerPage;

  selectedVm: VirtualMachine = null;

  /**
   * If user is vo admin.
   */
  is_vo_admin: boolean;
  /**
   * Vm which is used to create a snapshot.
   */
  snapshot_vm: VirtualMachine;
  /**
   * If the snapshot name is valid.
   */
  validSnapshotNameBool: boolean;
  /**
   * String if the snapshot is done.
   * @type {string}
   */
  snapshotNameCheckDone: boolean = false;
  snapshotDone: string = 'Waiting';
  /**
   * name of the snapshot.
   */
  snapshotName: string = '';
  /**
   * Tab which is shown own|all.
   * @type {string}
   */
  tab: string = 'own';
  /**
   * The changed status.
   * @type {number}
   */
  status_changed: number = 0;

  /**
   * Timeout for checking vm status.
   * @type {number}
   */
  private checkStatusTimeout: number = 1500;
  /**
   * Type of reboot HARD|SOFT.
   */
  reboot_type: string;
  /**
   * If an error appeared when checking vm status.
   */
  status_check_error: boolean;
  /**
   * IF reboot is done.
   */
  reboot_done: boolean;

  showSshCommando: boolean = true;
  showUdpCommando: boolean = true;

  constructor(private voService: VoService, private imageService: ImageService, private userservice: UserService,
              private virtualmachineservice: VirtualmachineService) {
    super()
  }

  /**
   * Load vms depending on page.
   * @param event
   */
  pageChanged(event): void {

    const startItem: number = (event.page - 1) * event.itemsPerPage;
    const endItem: number = event.page * event.itemsPerPage;
    this.vmStart = startItem;
    this.vmEnd = endItem;
    this.vms_returned = this.vms_filtered.slice(startItem, endItem)

  }

  /**
   * Check if vm corresponds the filter.
   * @param {VirtualMachine} vm vm which is checked
   * @returns {boolean} True if it matches the filter
   */
  checkFilter(vm: VirtualMachine): boolean {
    return this.isFilterstatus(vm.status) && this.isFilterProjectName(vm.project) && this.isFilterCreated_at(vm.created_at)
      && this.isFilterElixir_id(vm.elixir_id) && this.isFilterName(vm.name) && this.isFilterStopped_at(vm.stopped_at)
      && this.isFilterUsername(vm.username)

  }

  /**
   * Apply filter to all vms.
   */
  applyFilter(): void {

    this.vms_filtered = this.vms_content.filter(vm => this.checkFilter(vm));

    this.vmStart = 0;
    this.vmEnd = this.vmsPerPage;

    this.vms_returned = this.vms_filtered.slice(this.vmStart, this.vmEnd);
    this.currentPage = 1

  }

  /**
   * Toggle tab own|all.
   * @param {string} tabString
   */
  toggleTab(tabString: string): void {
    this.tab = tabString;
  }

  /**
   * Check status of all inactive vms.
   */
  checkInactiveVms(): void {
    this.virtualmachineservice.checkStatusInactiveVms().subscribe(vms => {
      this.vms_content = vms;
      for (const vm of this.vms_content) {
        if (vm.created_at !== '') {
          vm.created_at = new Date(parseInt(vm.created_at, 10) * 1000).toLocaleDateString();
        }
        if (vm.stopped_at !== '' && vm.stopped_at !== 'ACTIVE') {
          vm.stopped_at = new Date(parseInt(vm.stopped_at, 10) * 1000).toLocaleDateString();
        } else {
          vm.stopped_at = ''
        }
      }
      this.applyFilter();

    })
  }

  /**
   * Check if the snapshot name is valid.
   * @param e
   */
  validSnapshotName(e) {
    this.snapshotNameCheckDone = false;
    this.imageService.checkSnapshotNameAvailable(this.snapshotName).subscribe((res: IResponseTemplate) => {

      this.validSnapshotNameBool = this.snapshotName.length > 0 && <boolean><Boolean>res.value;
      this.snapshotNameCheckDone = true;
    })

  }

  /**
   * Reset the snapshotDone to waiting.
   */
  resetSnapshotResult(): void {
    this.snapshotDone = 'Waiting';
  }

  /**
   * Check status of vm.
   * @param {string} openstackid  of the instance
   */
  checkStatus(vm: VirtualMachine): void {
    this.virtualmachineservice.checkVmStatus(vm.openstackid).subscribe((updated_vm: VirtualMachine) => {

                                                                         this.setCollapseStatus(updated_vm.openstackid, false);

                                                                         if (updated_vm.created_at !== '') {
                                                                           updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
                                                                         }
                                                                         if (updated_vm.stopped_at !== '' && updated_vm.stopped_at !== 'ACTIVE') {
                                                                           updated_vm.stopped_at = new Date(parseInt(updated_vm.stopped_at, 10) * 1000).toLocaleDateString();
                                                                         } else {
                                                                           updated_vm.stopped_at = ''
                                                                         }

                                                                         this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;
                                                                         this.applyFilter();
                                                                       }
    )
  }

  /**
   * Delete Vm.
   * @param {string} openstack_id of instance
   */
  deleteVm(vm: VirtualMachine): void {
    this.virtualmachineservice.deleteVM(vm.openstackid).subscribe((updated_vm: VirtualMachine) => {

      this.setCollapseStatus(updated_vm.openstackid, false);

      if (updated_vm.created_at !== '') {
        updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
      }
      if (updated_vm.stopped_at !== '' && updated_vm.stopped_at !== 'ACTIVE') {
        updated_vm.stopped_at = new Date(parseInt(updated_vm.stopped_at, 10) * 1000).toLocaleDateString();
      } else {
        updated_vm.stopped_at = ''
      }

      this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;
      this.applyFilter();
      if (updated_vm.status === 'DELETED') {
        this.status_changed = 1;
      } else {
        this.status_changed = 2;
      }

    })
  }

  /**
   * Reboot a vm.
   * @param {string} openstack_id of the instance
   * @param {string} reboot_type HARD|SOFT
   */
  public

  rebootVm(vm: VirtualMachine, reboot_type: string): void {
    this.virtualmachineservice.rebootVM(vm.openstackid, reboot_type).subscribe((result: IResponseTemplate) => {
      this.status_changed = 0;

      if (<boolean><Boolean>result.value) {
        this.status_changed = 1;
        this.check_status_loop(vm)
      } else {
        this.status_changed = 2;
      }

    })
  }

  /**
   * Check Status of vm in loop till active.
   * @param {string} id of instance.
   */
  check_status_loop(vm: VirtualMachine): void {

    setTimeout(
      () => {
        this.virtualmachineservice.checkVmStatus(vm.openstackid).subscribe((updated_vm: VirtualMachine) => {

          if (updated_vm.status === 'ACTIVE') {
            this.reboot_done = true;
            this.setCollapseStatus(updated_vm.openstackid, false);

            if (updated_vm.created_at !== '') {
              updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
            }
            if (updated_vm.stopped_at !== '' && updated_vm.stopped_at !== 'ACTIVE') {
              updated_vm.stopped_at = new Date(parseInt(updated_vm.stopped_at, 10) * 1000).toLocaleDateString();
            } else {
              updated_vm.stopped_at = ''
            }

            this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;
            this.applyFilter();

          } else {
            if (vm['error']) {
              this.status_check_error = true

            }
            this.check_status_loop(vm)
          }

        })
      }
      ,
      this.checkStatusTimeout
    )
    ;
  }

  /**
   * Stop a vm.
   * @param {string} openstack_id of instance.
   */
  stopVm(vm: VirtualMachine): void {
    this.virtualmachineservice.stopVM(vm.openstackid).subscribe((updated_vm: VirtualMachine) => {

      this.status_changed = 0;

      this.setCollapseStatus(updated_vm.openstackid, false);

      if (updated_vm.created_at !== '') {
        updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
      }
      if (updated_vm.stopped_at !== '' && updated_vm.stopped_at !== 'ACTIVE') {
        updated_vm.stopped_at = new Date(parseInt(updated_vm.stopped_at, 10) * 1000).toLocaleDateString();
      } else {
        updated_vm.stopped_at = ''
      }

      this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;
      this.applyFilter();

      if (updated_vm.status === 'SUSPENDED') {
        this.status_changed = 1;
      } else {
        this.status_changed = 2;
      }

    })
  }

  /**
   * Get all vms of user.
   * @param {string} elixir_id of user
   */
  getVms(): void {
    this.virtualmachineservice.getVmsFromLoggedInUser().subscribe(vms => {
                                                                    this.vms_content = vms;

                                                                    for (const vm of this.vms_content) {
                                                                      this.setCollapseStatus(vm.openstackid, false);

                                                                      if (vm.created_at !== '') {
                                                                        vm.created_at = new Date(parseInt(vm.created_at, 10) * 1000).toLocaleDateString();
                                                                      }

                                                                      if (vm.stopped_at !== '' && vm.stopped_at !== 'ACTIVE') {
                                                                        vm.stopped_at = new Date(parseInt(vm.stopped_at, 10) * 1000).toLocaleDateString();
                                                                      } else {
                                                                        vm.stopped_at = ''
                                                                      }
                                                                    }
                                                                    this.isLoaded = true;
                                                                    this.applyFilter();

                                                                  }
    );
  }

  refreshVms(): void {
    this.vms_returned = [];
    this.virtualmachineservice.getVmsFromLoggedInUser().subscribe(vms => {
                                                                    this.vms_content = vms;

                                                                    for (const vm of this.vms_content) {
                                                                      this.setCollapseStatus(vm.openstackid, false);

                                                                      if (vm.created_at !== '') {
                                                                        vm.created_at = new Date(parseInt(vm.created_at, 10) * 1000).toLocaleDateString();
                                                                      }

                                                                      if (vm.stopped_at !== '' && vm.stopped_at !== 'ACTIVE') {
                                                                        vm.stopped_at = new Date(parseInt(vm.stopped_at, 10) * 1000).toLocaleDateString();
                                                                      } else {
                                                                        vm.stopped_at = ''
                                                                      }
                                                                    }
                                                                    this.isLoaded = true;
                                                                    this.applyFilter();

                                                                  }
    );

  }

  /**
   * Resume a vm.
   * @param {string} openstack_id of instance.
   */
  resumeVM(vm: VirtualMachine): void {

    this.virtualmachineservice.resumeVM(vm.openstackid).subscribe((updated_vm: VirtualMachine) => {

      this.status_changed = 0;
      this.setCollapseStatus(updated_vm.openstackid, false);

      if (updated_vm.created_at !== '') {
        updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
      }
      if (updated_vm.stopped_at !== '' && vm.stopped_at !== 'ACTIVE') {
        updated_vm.stopped_at = new Date(parseInt(updated_vm.stopped_at, 10) * 1000).toLocaleDateString();
      } else {
        updated_vm.stopped_at = ''
      }

      this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;
      this.applyFilter();
      if (updated_vm.status === 'ACTIVE') {
        this.status_changed = 1;
      } else {
        this.status_changed = 2;
      }

    })
  }

  /**
   * Get all vms.
   */
  getAllVms(): void {
    this.virtualmachineservice.getAllVM().subscribe(vms => {
                                                      this.vms_content = vms;
                                                      for (const vm of this.vms_content) {
                                                        this.setCollapseStatus(vm.openstackid, false);

                                                        if (vm.created_at !== '') {
                                                          vm.created_at = new Date(parseInt(vm.created_at, 10) * 1000).toLocaleDateString();
                                                        }
                                                        if (vm.stopped_at !== '' && vm.stopped_at !== 'ACTIVE') {
                                                          vm.stopped_at = new Date(parseInt(vm.stopped_at, 10) * 1000).toLocaleDateString();
                                                        } else {
                                                          vm.stopped_at = ''
                                                        }

                                                      }
                                                      this.applyFilter();

                                                    }
    );
  }

  ngOnInit(): void {
    this.getVms();
    this.checkVOstatus()

  }

  /**
   * Check vm status.
   * @param {UserService} userservice
   */
  checkVOstatus(): void {
    this.voService.isVo().subscribe((result: IResponseTemplate) => {
      this.is_vo_admin = <boolean><Boolean>result.value;
    })
  }

  /**
   * Create snapshot.
   * @param {string} snapshot_instance which is used for creating the snapshot
   * @param {string} snapshot_name name of the snapshot
   */
  createSnapshot(snapshot_instance: string, snapshot_name: string,description?:string): void {
    this.imageService.createSnapshot(snapshot_instance, snapshot_name,description).subscribe((newSnapshot: SnapshotModel) => {
      if (newSnapshot.snapshot_openstackid) {
        this.snapshotDone = 'true';

      } else {
        this.snapshotDone = 'error';

      }

    })
  }

}
