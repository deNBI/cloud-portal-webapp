import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';

import ***REMOVED***VirtualmachineService***REMOVED*** from '../api-connector/virtualmachine.service';
import ***REMOVED***VirtualMachine***REMOVED*** from './virtualmachinemodels/virtualmachine';
import ***REMOVED***FullLayoutComponent***REMOVED*** from '../layouts/full-layout.component';
import ***REMOVED***UserService***REMOVED*** from '../api-connector/user.service';
import ***REMOVED***ImageService***REMOVED*** from '../api-connector/image.service';
import ***REMOVED***FilterBaseClass***REMOVED*** from '../shared/shared_modules/baseClass/filter-base-class';
import ***REMOVED***VoService***REMOVED*** from '../api-connector/vo.service';
import ***REMOVED***IResponseTemplate***REMOVED*** from '../api-connector/response-template';
import ***REMOVED***SnapshotModel***REMOVED*** from './snapshots/snapshot.model';
import ***REMOVED***FacilityService***REMOVED*** from '../api-connector/facility.service';
import ***REMOVED***debounceTime, distinctUntilChanged***REMOVED*** from 'rxjs/operators';
import ***REMOVED***Subject***REMOVED*** from 'rxjs';

/**
 * Vm overview componentn.
 */
@Component(***REMOVED***
             selector: 'app-vm-overview',
             templateUrl: 'vmOverview.component.html',
             providers: [FacilityService, VoService, ImageService, UserService, VirtualmachineService, FullLayoutComponent]
           ***REMOVED***)

export class VmOverviewComponent extends FilterBaseClass implements OnInit ***REMOVED***
  /**
   * All  vms.
   */
  vms_content: VirtualMachine[];
  currentPage: number = 1;
  DEBOUNCE_TIME: number = 300;

  filter_status_list: string[] = [this.vm_statuses[this.vm_statuses.ACTIVE], this.vm_statuses[this.vm_statuses.SHUTOFF]];

  selectedVm: VirtualMachine = null;

  STATIC_IMG_FOLDER: String = 'static/webapp/assets/img/';

  CPU_ICON_PATH: string = this.STATIC_IMG_FOLDER + '/new_instance/cpu_icon.svg';
  RAM_ICON_PATH: string = this.STATIC_IMG_FOLDER + '/new_instance/ram_icon.svg';
  STORAGE_ICON_PATH: string = this.STATIC_IMG_FOLDER + '/new_instance/storage_icon.svg';
  GPU_ICON_PATH: string = this.STATIC_IMG_FOLDER + '/new_instance/gpu_icon.svg';

  total_pages: number;
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
   * @type ***REMOVED***string***REMOVED***
   */
  snapshotNameCheckDone: boolean = false;
  snapshotDone: string = 'Waiting';
  /**
   * name of the snapshot.
   */
  snapshotName: string = '';
  /**
   * Tab which is shown own|all.
   * @type ***REMOVED***string***REMOVED***
   */
  tab: string = 'own';
  /**
   * The changed status.
   * @type ***REMOVED***number***REMOVED***
   */
  status_changed: number = 0;

  is_facility_manager: boolean = false;

  /**
   * Timeout for checking vm status.
   * @type ***REMOVED***number***REMOVED***
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

  filterNameChanged: Subject<string> = new Subject<string>();
  filterProjectNameChanged: Subject<string> = new Subject<string>();
  filterElixirIdChanged: Subject<string> = new Subject<string>();

  constructor(private facilityService: FacilityService, private voService: VoService, private imageService: ImageService, private userservice: UserService,
              private virtualmachineservice: VirtualmachineService) ***REMOVED***
    super()
  ***REMOVED***

  /**
   * Check if vm corresponds the filter.
   * @param ***REMOVED***VirtualMachine***REMOVED*** vm vm which is checked
   * @returns ***REMOVED***boolean***REMOVED*** True if it matches the filter
   */
  checkFilter(vm: VirtualMachine): boolean ***REMOVED***
    return this.isFilterstatus(vm.status) && this.isFilterProjectName(vm.project) && this.isFilterCreated_at(vm.created_at)
      && this.isFilterElixir_id(vm.elixir_id) && this.isFilterName(vm.name) && this.isFilterStopped_at(vm.stopped_at)
      && this.isFilterUsername(vm.username)

  ***REMOVED***

  /**
   * Apply filter to all vms.
   */
  applyFilter(): void ***REMOVED***
    if (this.tab === 'own') ***REMOVED***
      this.getVms()
    ***REMOVED*** else if (this.tab === 'all') ***REMOVED***
      this.getAllVms()
    ***REMOVED*** else if (this.tab === 'facility') ***REMOVED***
      this.getAllVmsFacilities()
    ***REMOVED***

  ***REMOVED***

  changeFilterStatus(status: string): void ***REMOVED***
    this.currentPage = 1;
    const indexOf: number = this.filter_status_list.indexOf(status);
    if (indexOf === -1) ***REMOVED***

      this.filter_status_list.push(status)
    ***REMOVED*** else ***REMOVED***
      this.filter_status_list.splice(indexOf, 1);
    ***REMOVED***
  ***REMOVED***

  get_is_facility_manager(): void ***REMOVED***
    this.facilityService.getManagerFacilities().subscribe(result => ***REMOVED***
      if (result.length > 0) ***REMOVED***
        this.is_facility_manager = true;
      ***REMOVED***
    ***REMOVED***)
  ***REMOVED***

  /**
   * Toggle tab own|all.
   * @param ***REMOVED***string***REMOVED*** tabString
   */
  toggleTab(tabString: string): void ***REMOVED***
    this.tab = tabString;
  ***REMOVED***

  /**
   * Check status of all inactive vms.
   */
  checkInactiveVms(): void ***REMOVED***
    this.virtualmachineservice.checkStatusInactiveVms().subscribe(vms => ***REMOVED***
      this.vms_content = vms;
      for (const vm of this.vms_content) ***REMOVED***
        if (vm.created_at !== '') ***REMOVED***
          vm.created_at = new Date(parseInt(vm.created_at, 10) * 1000).toLocaleDateString();
        ***REMOVED***
        if (vm.stopped_at !== '' && vm.stopped_at !== this.vm_statuses[this.vm_statuses.ACTIVE]) ***REMOVED***
          vm.stopped_at = new Date(parseInt(vm.stopped_at, 10) * 1000).toLocaleDateString();
        ***REMOVED*** else ***REMOVED***
          vm.stopped_at = ''
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***)
  ***REMOVED***

  /**
   * Check if the snapshot name is valid.
   * @param e
   */
  validSnapshotName(event) ***REMOVED***
    this.snapshotNameCheckDone = false;
    this.imageService.checkSnapshotNameAvailable(this.snapshotName).subscribe((res: IResponseTemplate) => ***REMOVED***

      this.validSnapshotNameBool = this.snapshotName.length > 0 && <boolean><Boolean>res.value;
      this.snapshotNameCheckDone = true;
    ***REMOVED***)

  ***REMOVED***

  /**
   * Reset the snapshotDone to waiting.
   */
  resetSnapshotResult(): void ***REMOVED***
    this.snapshotDone = 'Waiting';
  ***REMOVED***

  /**
   * Check status of vm.
   * @param ***REMOVED***string***REMOVED*** openstackid  of the instance
   */
  checkStatus(vm: VirtualMachine): void ***REMOVED***
    this.virtualmachineservice.checkVmStatus(vm.openstackid)
      .subscribe((updated_vm: VirtualMachine) => ***REMOVED***

                   this.setCollapseStatus(updated_vm.openstackid, false);

                   if (updated_vm.created_at !== '') ***REMOVED***
                     updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
                   ***REMOVED***
                   if (updated_vm.stopped_at !== '' && updated_vm.stopped_at !== this.vm_statuses[this.vm_statuses.ACTIVE]) ***REMOVED***
                     updated_vm.stopped_at = new Date(parseInt(updated_vm.stopped_at, 10) * 1000).toLocaleDateString();
                   ***REMOVED*** else ***REMOVED***
                     updated_vm.stopped_at = ''
                   ***REMOVED***

                   this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;
                   this.applyFilter();
                 ***REMOVED***
      )
  ***REMOVED***

  /**
   * Delete Vm.
   * @param ***REMOVED***string***REMOVED*** openstack_id of instance
   */
  deleteVm(vm: VirtualMachine): void ***REMOVED***
    this.virtualmachineservice.deleteVM(vm.openstackid).subscribe((updated_vm: VirtualMachine) => ***REMOVED***

      this.setCollapseStatus(updated_vm.openstackid, false);

      if (updated_vm.created_at !== '') ***REMOVED***
        updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
      ***REMOVED***
      if (updated_vm.stopped_at !== '' && updated_vm.stopped_at !== this.vm_statuses[this.vm_statuses.ACTIVE]) ***REMOVED***
        updated_vm.stopped_at = new Date(parseInt(updated_vm.stopped_at, 10) * 1000).toLocaleDateString();
      ***REMOVED*** else ***REMOVED***
        updated_vm.stopped_at = ''
      ***REMOVED***

      this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;
      this.applyFilter();
      if (updated_vm.status === this.vm_statuses[this.vm_statuses.DELETED]) ***REMOVED***
        this.status_changed = 1;
      ***REMOVED*** else ***REMOVED***
        this.status_changed = 2;
      ***REMOVED***

    ***REMOVED***)
  ***REMOVED***

  /**
   * Reboot a vm.
   * @param ***REMOVED***string***REMOVED*** openstack_id of the instance
   * @param ***REMOVED***string***REMOVED*** reboot_type HARD|SOFT
   */
  public rebootVm(vm: VirtualMachine, reboot_type: string): void ***REMOVED***
    this.virtualmachineservice.rebootVM(vm.openstackid, reboot_type).subscribe((result: IResponseTemplate) => ***REMOVED***
      this.status_changed = 0;

      if (<boolean><Boolean>result.value) ***REMOVED***
        this.status_changed = 1;
        this.check_status_loop_when_reboot(vm)
      ***REMOVED*** else ***REMOVED***
        this.status_changed = 2;
      ***REMOVED***

    ***REMOVED***)
  ***REMOVED***

  /**
   * Check Status of vm in loop till active.
   * @param ***REMOVED***string***REMOVED*** id of instance.
   */
  check_status_loop(vm: VirtualMachine, final_state: string): void ***REMOVED***

    setTimeout(
      () => ***REMOVED***
        this.virtualmachineservice.checkVmStatus(vm.openstackid).subscribe((updated_vm: VirtualMachine) => ***REMOVED***
          this.selectedVm = updated_vm;
          console.log(this.selectedVm)

          if (updated_vm.status === final_state) ***REMOVED***
            this.reboot_done = true;
            this.setCollapseStatus(updated_vm.openstackid, false);

            if (updated_vm.created_at !== '') ***REMOVED***
              updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
            ***REMOVED***
            if (updated_vm.stopped_at !== '' && updated_vm.stopped_at !== final_state) ***REMOVED***
              updated_vm.stopped_at = new Date(parseInt(updated_vm.stopped_at, 10) * 1000).toLocaleDateString();
            ***REMOVED*** else ***REMOVED***
              updated_vm.stopped_at = ''
            ***REMOVED***

            this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;
            this.applyFilter();

          ***REMOVED*** else ***REMOVED***
            if (vm['error']) ***REMOVED***
              this.status_check_error = true

            ***REMOVED***
            this.check_status_loop(vm, final_state)
          ***REMOVED***

        ***REMOVED***)
      ***REMOVED***
      ,
      this.checkStatusTimeout
    )
    ;
  ***REMOVED***

  /**
   * Check Status of vm in loop till active.
   * @param ***REMOVED***string***REMOVED*** id of instance.
   */
  check_status_loop_when_reboot(vm: VirtualMachine): void ***REMOVED***

    setTimeout(
      () => ***REMOVED***
        this.virtualmachineservice.checkVmStatusWhenReboot(vm.openstackid).subscribe((updated_vm: VirtualMachine) => ***REMOVED***

          if (updated_vm.status === this.vm_statuses[this.vm_statuses.ACTIVE]) ***REMOVED***
            this.reboot_done = true;
            this.setCollapseStatus(updated_vm.openstackid, false);

            if (updated_vm.created_at !== '') ***REMOVED***
              updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
            ***REMOVED***
            if (updated_vm.stopped_at !== '' && updated_vm.stopped_at !== this.vm_statuses[this.vm_statuses.ACTIVE]) ***REMOVED***
              updated_vm.stopped_at = new Date(parseInt(updated_vm.stopped_at, 10) * 1000).toLocaleDateString();
            ***REMOVED*** else ***REMOVED***
              updated_vm.stopped_at = ''
            ***REMOVED***

            this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;
            this.applyFilter();

          ***REMOVED*** else ***REMOVED***
            if (vm['error']) ***REMOVED***
              this.status_check_error = true

            ***REMOVED***
            this.check_status_loop_when_reboot(vm)
          ***REMOVED***

        ***REMOVED***)
      ***REMOVED***
      ,
      this.checkStatusTimeout
    )
    ;
  ***REMOVED***

  /**
   * Stop a vm.
   * @param ***REMOVED***string***REMOVED*** openstack_id of instance.
   */
  stopVm(vm: VirtualMachine): void ***REMOVED***
    this.virtualmachineservice.stopVM(vm.openstackid)
      .subscribe((updated_vm: VirtualMachine) => ***REMOVED***

                   this.status_changed = 0;

                   this.setCollapseStatus(updated_vm.openstackid, false);

                   if (updated_vm.created_at !== '') ***REMOVED***
                     updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
                   ***REMOVED***
                   if (updated_vm.stopped_at !== '' && updated_vm.stopped_at !== this.vm_statuses[this.vm_statuses.ACTIVE]) ***REMOVED***
                     updated_vm.stopped_at = new Date(parseInt(updated_vm.stopped_at, 10) * 1000).toLocaleDateString();
                   ***REMOVED*** else ***REMOVED***
                     updated_vm.stopped_at = ''
                   ***REMOVED***

                   this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;
                   this.applyFilter();
                   this.selectedVm = updated_vm;

                   switch (updated_vm.status) ***REMOVED***
                     case this.vm_statuses[this.vm_statuses.SHUTOFF]:
                       this.status_changed = 1;
                       break;
                     case 'POWERING OFF':
                       this.check_status_loop(updated_vm, this.vm_statuses[this.vm_statuses.SHUTOFF]);
                       break;
                     default:
                       this.status_changed = 2;
                       break;

                   ***REMOVED***

                 ***REMOVED***
      )
  ***REMOVED***

  /**
   * Load vms depending on page.
   * @param event
   */
  pageChanged(event)
    :
    void ***REMOVED***
    this.currentPage = event.page;
    if (this.tab === 'own') ***REMOVED***
      this.getVms()
    ***REMOVED*** else if (this.tab === 'all') ***REMOVED***
      this.getAllVms()
    ***REMOVED*** else if (this.tab === 'facility') ***REMOVED***
      this.getAllVmsFacilities()
    ***REMOVED***
  ***REMOVED***

  /**
   * Get all vms of user.
   * @param ***REMOVED***string***REMOVED*** elixir_id of user
   */
  getVms(): void ***REMOVED***

    this.virtualmachineservice.getVmsFromLoggedInUser(
      this.currentPage,
      this.filterVmName,
      this.filterProjectName,
      this.filter_status_list,
      this.filterVmElixir_id,
      this.filterVmCreated_at,
      this.filterVmStopped_at)
      .subscribe(vms => ***REMOVED***
                   this.vms_content = vms['vm_list'];
                   this.total_pages = vms['total_items'];

                   for (const vm of this.vms_content) ***REMOVED***
                     this.setCollapseStatus(vm.openstackid, false);

                     if (vm.created_at !== '') ***REMOVED***
                       vm.created_at = new Date(parseInt(vm.created_at, 10) * 1000).toLocaleDateString();
                     ***REMOVED***

                     if (vm.stopped_at !== '' && vm.stopped_at !== this.vm_statuses[this.vm_statuses.ACTIVE]) ***REMOVED***
                       vm.stopped_at = new Date(parseInt(vm.stopped_at, 10) * 1000).toLocaleDateString();
                     ***REMOVED*** else ***REMOVED***
                       vm.stopped_at = ''
                     ***REMOVED***
                   ***REMOVED***
                   this.isLoaded = true;

                 ***REMOVED***
      );
  ***REMOVED***

  getAllVmsFacilities()
    :
    void ***REMOVED***

    this.virtualmachineservice.getVmsFromFacilitiesOfLoggedUser(
      this.currentPage,
      this.filterVmName,
      this.filterProjectName,
      this.filter_status_list,
      this.filterVmElixir_id,
      this.filterVmCreated_at,
      this.filterVmStopped_at)
      .subscribe(vms => ***REMOVED***
                   this.vms_content = vms['vm_list'];
                   this.total_pages = vms['total_items'];

                   for (const vm of this.vms_content) ***REMOVED***
                     this.setCollapseStatus(vm.openstackid, false);

                     if (vm.created_at !== '') ***REMOVED***
                       vm.created_at = new Date(parseInt(vm.created_at, 10) * 1000).toLocaleDateString();
                     ***REMOVED***

                     if (vm.stopped_at !== '' && vm.stopped_at !== this.vm_statuses[this.vm_statuses.ACTIVE]) ***REMOVED***
                       vm.stopped_at = new Date(parseInt(vm.stopped_at, 10) * 1000).toLocaleDateString();
                     ***REMOVED*** else ***REMOVED***
                       vm.stopped_at = ''
                     ***REMOVED***
                   ***REMOVED***
                   this.isLoaded = true;

                 ***REMOVED***
      );
  ***REMOVED***

  /**
   * Resume a vm.
   * @param ***REMOVED***string***REMOVED*** openstack_id of instance.
   */
  resumeVM(vm: VirtualMachine):
    void ***REMOVED***

    this.virtualmachineservice.resumeVM(vm.openstackid).subscribe((updated_vm: VirtualMachine) => ***REMOVED***

      this.status_changed = 0;
      this.setCollapseStatus(updated_vm.openstackid, false);

      if (updated_vm.created_at !== '') ***REMOVED***
        updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
      ***REMOVED***
      if (updated_vm.stopped_at !== '' && vm.stopped_at !== this.vm_statuses[this.vm_statuses.ACTIVE]) ***REMOVED***
        updated_vm.stopped_at = new Date(parseInt(updated_vm.stopped_at, 10) * 1000).toLocaleDateString();
      ***REMOVED*** else ***REMOVED***
        updated_vm.stopped_at = ''
      ***REMOVED***

      this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;
      this.applyFilter();
      switch (updated_vm.status) ***REMOVED***
        case this.vm_statuses[this.vm_statuses.ACTIVE]:
          this.status_changed = 1;
          break;
        case this.vm_statuses[this.vm_statuses.RESTARTING]:
          this.check_status_loop(updated_vm, this.vm_statuses[this.vm_statuses.ACTIVE]);
          break;
        default:
          this.status_changed = 2;
          break;

      ***REMOVED***
    ***REMOVED***)
  ***REMOVED***

  /**
   * Get all vms.
   */
  getAllVms()
    :
    void ***REMOVED***
    this.virtualmachineservice.getAllVM(this.currentPage,
                                        this.filterVmName,
                                        this.filterProjectName,
                                        this.filter_status_list,
                                        this.filterVmElixir_id,
                                        this.filterVmCreated_at,
                                        this.filterVmStopped_at)
      .subscribe(vms => ***REMOVED***
                   this.vms_content = vms['vm_list'];
                   this.total_pages = vms['total_items'];

                   for (const vm of this.vms_content) ***REMOVED***
                     this.setCollapseStatus(vm.openstackid, false);

                     if (vm.created_at !== '') ***REMOVED***
                       vm.created_at = new Date(parseInt(vm.created_at, 10) * 1000).toLocaleDateString();
                     ***REMOVED***
                     if (vm.stopped_at !== '' && vm.stopped_at !== this.vm_statuses[this.vm_statuses.ACTIVE]) ***REMOVED***
                       vm.stopped_at = new Date(parseInt(vm.stopped_at, 10) * 1000).toLocaleDateString();
                     ***REMOVED*** else ***REMOVED***
                       vm.stopped_at = ''
                     ***REMOVED***

                   ***REMOVED***
                 ***REMOVED***
      );
  ***REMOVED***

  changedNameFilter(text
                      :
                      string
  ):
    void ***REMOVED***
    this.filterNameChanged.next(text);

  ***REMOVED***

  ngOnInit()
    :
    void ***REMOVED***
    this.getVms();
    this.checkVOstatus();
    this.get_is_facility_manager();

    this.filterNameChanged
      .pipe(
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged())
      .subscribe(() => ***REMOVED***
        this.applyFilter();
      ***REMOVED***);

    this.filterProjectNameChanged
      .pipe(
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged())
      .subscribe(() => ***REMOVED***
        this.applyFilter();
      ***REMOVED***);

    this.filterElixirIdChanged
      .pipe(
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged())
      .subscribe(() => ***REMOVED***
        this.applyFilter();
      ***REMOVED***);
  ***REMOVED***

  /**
   * Check vm status.
   * @param ***REMOVED***UserService***REMOVED*** userservice
   */
  checkVOstatus()
    :
    void ***REMOVED***
    this.voService.isVo().subscribe((result: IResponseTemplate) => ***REMOVED***
      this.is_vo_admin = <boolean><Boolean>result.value;
    ***REMOVED***)
  ***REMOVED***

  /**
   * Create snapshot.
   * @param ***REMOVED***string***REMOVED*** snapshot_instance which is used for creating the snapshot
   * @param ***REMOVED***string***REMOVED*** snapshot_name name of the snapshot
   */
  createSnapshot(snapshot_instance: string, snapshot_name: string, description ?: string
  ):
    void ***REMOVED***
    this.imageService.createSnapshot(snapshot_instance, snapshot_name, description).subscribe((newSnapshot: SnapshotModel) => ***REMOVED***
      if (newSnapshot.snapshot_openstackid) ***REMOVED***
        this.snapshotDone = 'true';

      ***REMOVED*** else ***REMOVED***
        this.snapshotDone = 'error';

      ***REMOVED***

    ***REMOVED***)
  ***REMOVED***

  logsome(v1, v2) ***REMOVED***
    console.log(v1, v2);
  ***REMOVED***
***REMOVED***
