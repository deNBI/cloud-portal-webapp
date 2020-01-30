import {Component, OnDestroy, OnInit} from '@angular/core';
import {VirtualmachineService} from '../api-connector/virtualmachine.service';
import {VirtualMachine} from './virtualmachinemodels/virtualmachine';
import {FullLayoutComponent} from '../layouts/full-layout.component';
import {UserService} from '../api-connector/user.service';
import {ImageService} from '../api-connector/image.service';
import {IResponseTemplate} from '../api-connector/response-template';
import {SnapshotModel} from './snapshots/snapshot.model';
import {FacilityService} from '../api-connector/facility.service';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Subject, Subscription} from 'rxjs';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {is_vo} from '../shared/globalvar';
import {VirtualMachineStates} from './virtualmachinemodels/virtualmachinestates';
import {GroupService} from '../api-connector/group.service';
import {environment} from '../../environments/environment';
import {ClientService} from '../api-connector/client.service';
import {Client} from './clients/client.model';
import {TemplateNames} from './conda/template-names';

/**
 * Vm overview componentn.
 */
@Component({
             selector: 'app-vm-overview',
             templateUrl: 'vmOverview.component.html',
             styleUrls: ['./vmOverview.component.scss'],
             providers: [FacilityService, ImageService, UserService,
               VirtualmachineService, FullLayoutComponent, GroupService, ClientService]
           })

export class VmOverviewComponent implements OnInit, OnDestroy {
  title: string = 'Instance Overview';

  private subscription: Subscription = new Subscription();

  VirtualMachineStates: VirtualMachineStates = new VirtualMachineStates();

  /**
   * All  vms.
   */
  vms_content: VirtualMachine[] = [];
  currentPage: number = 1;
  DEBOUNCE_TIME: number = 300;

  filter_status_list: string[] = [VirtualMachineStates.ACTIVE, VirtualMachineStates.SHUTOFF];
  isSearching: boolean = true;

  selectedVm: VirtualMachine = null;
  vm_per_site: number = 7;

  /**
   * Facilitties where the user is manager ['name',id].
   */
  public managerFacilities: [string, number][];
  /**
   * Chosen facility.
   */
  public selectedFacility: [string, number];

  filter: string;

  total_pages: number;
  total_items: number;
  /**
   * If user is vo admin.
   */

  items_per_page: number = 7;

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

  is_facility_manager: boolean = false;

  /**
   * Timeout for checking vm status.
   * @type {number}
   */
  private checkStatusTimeout: number = 5000;
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

  vmPerPageChange: Subject<number> = new Subject<number>();

  filterChanged: Subject<string> = new Subject<string>();
  snapshotSearchTerm: Subject<string> = new Subject<string>();

  actionsForm: FormGroup;
  vmActions: {id: VirtualMachine, name: string}[] = [];
  selectedMachines: VirtualMachine[] = [];

  clientsForcUrls: {[client_id: string]: [string]} = {};

  constructor(private facilityService: FacilityService,

              private imageService: ImageService, private userservice: UserService,
              private virtualmachineservice: VirtualmachineService, private fb: FormBuilder,
              private groupService: GroupService,
              private clientService: ClientService) {
    this.actionsForm = fb.group({
                                  title: fb.control('initial value', Validators.required)
                                });
  }

  /**
   * Apply filter to all vms.
   */
  applyFilter(): void {
    this.isSearching = true;
    if (typeof(this.vm_per_site) !== 'number' || this.vm_per_site <= 0) {
      this.vm_per_site = 7;
    }
    if (this.tab === 'own') {
      this.getVms()
    } else if (this.tab === 'all') {
      this.getAllVms()
    } else if (this.tab === 'facility') {
      this.getAllVmsFacilities()
    }

  }

  copyToClipboard(text: string): void {
    document.addEventListener('copy', (clipEvent: ClipboardEvent) => {
      clipEvent.clipboardData.setData('text/plain', (text));
      clipEvent.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }

  changeFilterStatus(status: string): void {
    this.currentPage = 1;
    const indexOf: number = this.filter_status_list.indexOf(status);
    if (indexOf === -1) {

      this.filter_status_list.push(status)
    } else {
      this.filter_status_list.splice(indexOf, 1);
    }
  }

  get_is_facility_manager(): void {
    this.facilityService.getManagerFacilities().subscribe((result: any) => {
      if (result.length > 0) {
        this.is_facility_manager = true;
      }
    })
  }

  /**
   * Toggle tab own|all.
   * @param {string} tabString
   */
  toggleTab(tabString: string): void {
    this.tab = tabString;
  }

  /**
   * Check if the snapshot name is valid.
   * @param event: name of snapshot
   */
  validSnapshotName(event: any): any {
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
   * @param {VirtualMachine} vm instance
   */
  checkStatus(vm: VirtualMachine): void {
    this.virtualmachineservice.checkVmStatus(vm.openstackid)
      .subscribe((updated_vm: VirtualMachine) => {

                   if (updated_vm.created_at !== '') {
                     updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
                   }

                   this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;
                   this.applyFilter();
                 }
      )
  }

  applyFilterStatus(): void {
    const vm_content_copy: VirtualMachine[] = [];
    for (const vm of this.vms_content) {
      if (vm.status in this.filter_status_list || vm.status !== VirtualMachineStates.ACTIVE
        && vm.status !== VirtualMachineStates.DELETED && vm.status !== VirtualMachineStates.SHUTOFF) {
        vm.cardState = 0;
        vm_content_copy.push(vm)
      }

    }
  }

  /**
   * Delete VM.
   * @param vm which will be deleted
   */
  deleteVm(vm: VirtualMachine): void {
    this.virtualmachineservice.deleteVM(vm.openstackid).subscribe((updated_vm: VirtualMachine) => {

      if (updated_vm.created_at !== '') {
        updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
      }
      updated_vm.cardState = 0;
      this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;
      this.applyFilterStatus();
      if (updated_vm.status === VirtualMachineStates.DELETED) {
        this.status_changed = 1;
      } else {
        this.status_changed = 2;
      }
    })
  }

  /**
   * Reboot a vm.
   * @param vm which will be rebooted
   * @param {string} reboot_type HARD|SOFT
   */
  public rebootVm(vm: VirtualMachine, reboot_type: string): void {
    this.virtualmachineservice.rebootVM(vm.openstackid, reboot_type).subscribe((result: IResponseTemplate) => {
      this.status_changed = 0;
      vm.cardState = 0;

      if (<boolean><Boolean>result.value) {
        this.status_changed = 1;
        this.check_status_loop_when_reboot(vm)
      } else {
        this.status_changed = 2;
      }

    })
  }

  /**
   * Check Status of vm in loop till final state is reached.
   * @param vm
   * @param final_state
   * @param is_selected_vm If the vm should be the selected vm
   */
  check_status_loop(vm: VirtualMachine, final_state?: string, is_selected_vm?: boolean): void {

    setTimeout(
      () => {
        if (vm.openstackid) {
          this.subscription.add(this.virtualmachineservice.checkVmStatus(vm.openstackid).subscribe((updated_vm: VirtualMachine) => {
            if (!updated_vm['error']) {
              this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;
              if (is_selected_vm) {
                this.selectedVm = updated_vm;
              }
            } else {
              updated_vm = vm
            }

            updated_vm.cardState = 0;
            if ((final_state && updated_vm.status === final_state)) {
              this.setForcUrl(updated_vm);
              if (updated_vm.created_at !== '') {
                updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
              }
              this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;

            } else if (VirtualMachineStates.IN_PROCESS_STATES.indexOf(updated_vm.status) !== -1) {
              if (vm['error']) {
                this.status_check_error = true
              }
              if (updated_vm.created_at !== '') {
                updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
              }
              this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;
              this.check_status_loop(updated_vm, final_state, is_selected_vm)
            } else if (VirtualMachineStates.NOT_IN_PROCESS_STATES.indexOf(updated_vm.status) !== -1) {
              this.setForcUrl(updated_vm);
              if (updated_vm.created_at !== '') {
                updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
              }
              this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;
            } else {
              if (vm['error']) {
                this.status_check_error = true
              }
              this.check_status_loop(updated_vm, final_state, is_selected_vm)
            }

          }));
        } else {
          this.subscription.add(this.virtualmachineservice.checkVmStatus(vm.name).subscribe((updated_vm: VirtualMachine) => {
            this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;
            if (is_selected_vm) {
              this.selectedVm = updated_vm;
            }

            updated_vm.cardState = 0;
            if ((final_state && updated_vm.status === final_state)) {
              this.setForcUrl(updated_vm);
              if (updated_vm.created_at !== '') {
                updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
              }
              this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;

            } else if (VirtualMachineStates.IN_PROCESS_STATES.indexOf(updated_vm.status) !== -1) {
              if (vm['error']) {
                this.status_check_error = true
              }
              if (updated_vm.created_at !== '') {
                updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
              }
              this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;
              this.check_status_loop(updated_vm, final_state, is_selected_vm)
            } else if (VirtualMachineStates.NOT_IN_PROCESS_STATES.indexOf(updated_vm.status) !== -1) {
              this.setForcUrl(updated_vm);
              if (updated_vm.created_at !== '') {
                updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
              }
              this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;
            } else {
              if (vm['error']) {
                this.status_check_error = true
              }
              this.check_status_loop(updated_vm, final_state, is_selected_vm)
            }

          }));
        }
      },
      this.checkStatusTimeout
    );
  }

  /**
   * Check Status of vm in loop till active.
   * @param vm
   */
  check_status_loop_when_reboot(vm: VirtualMachine): void {

    setTimeout(
      () => {
        this.virtualmachineservice.checkVmStatusWhenReboot(vm.openstackid).subscribe((updated_vm: VirtualMachine) => {

          if (updated_vm.status === VirtualMachineStates.ACTIVE) {
            this.reboot_done = true;

            if (updated_vm.created_at !== '') {
              updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
            }

            this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;
            this.applyFilter();

          } else {
            if (vm['error']) {
              this.status_check_error = true

            }
            this.check_status_loop_when_reboot(vm)
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
   * @param {VirtualMachine} vm: virtual machine to stop.
   */
  stopVm(vm: VirtualMachine): void {
    this.virtualmachineservice.stopVM(vm.openstackid)
      .subscribe((updated_vm: VirtualMachine) => {

                   this.status_changed = 0;

                   if (updated_vm.created_at !== '') {
                     updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
                   }
                   updated_vm.cardState = 0;
                   this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;
                   this.selectedVm = updated_vm;

                   switch (updated_vm.status) {
                     case VirtualMachineStates.SHUTOFF:
                       this.status_changed = 1;
                       break;
                     case VirtualMachineStates.POWERING_OFF:
                       this.check_status_loop(updated_vm, VirtualMachineStates.SHUTOFF, true);
                       break;
                     default:
                       this.status_changed = 2;
                       break;

                   }

                 }
      )
  }

  /**
   * Load vms depending on page.
   * @param event
   */
  pageChanged(event: any): void {
    this.isSearching = true;

    this.currentPage = event.page;
    if (this.tab === 'own') {
      this.getVms()
    } else if (this.tab === 'all') {
      this.getAllVms()
    } else if (this.tab === 'facility') {
      this.getAllVmsFacilities()
    }
  }

  /**
   * Get all vms of user.
   */
  getVms(): void {

    this.virtualmachineservice.getVmsFromLoggedInUser(
      this.currentPage, this.vm_per_site,
      this.filter, this.filter_status_list)
      .subscribe((vms: any) => {
                   this.prepareVMS(vms);
                 }
      );
  }

  getAllVmsFacilities(): void {

    this.virtualmachineservice.getVmsFromFacilitiesOfLoggedUser(
      this.selectedFacility['FacilityId'],
      this.currentPage, this.vm_per_site,
      this.filter, this.filter_status_list)
      .subscribe((vms: VirtualMachine[]) => {
                   this.prepareVMS(vms);
                 }
      );
  }

  prepareVMS(vms: VirtualMachine[]): void {

    this.vms_content = vms['vm_list'];
    this.total_items = vms['total_items'];
    this.items_per_page = vms['items_per_page'];
    this.total_pages = vms['num_pages'];
    this.vmActions = [];

    this.vms_content.forEach((vm: VirtualMachine, index: number) => {
      vm.userlogin = vm['userlogin'];
      vm.cardState = 0;
      this.setForcUrl(vm);
      if (vm.status === VirtualMachineStates.ACTIVE || vm.status === VirtualMachineStates.SHUTOFF) {
        this.vmActions.push({id: vm, name: vm.name});
      }
      if (vm.created_at !== '') {
        vm.created_at = new Date(parseInt(vm.created_at, 10) * 1000).toLocaleDateString();
      }
    });

    // Create a FormControl for each available music preference, initialize them as unchecked, and put them in an array
    const formControls: any = this.vmActions.map((control: any) => new FormControl(false));

    // Create a FormControl for the select/unselect all checkbox
    const selectAllControl: any = new FormControl(false);

    // Simply add the list of FormControls to the FormGroup as a FormArray, add the selectAllControl separetely
    this.actionsForm = this.fb.group({
                                       vmActions: new FormArray(formControls),
                                       selectAll: selectAllControl
                                     });
    this.onChanges();
    this.isSearching = false;
    this.checkVmTillActive()
  }

  checkVmTillActive(): void {
    this.vms_content.forEach((vm: VirtualMachine) => {
      if (vm.status !== VirtualMachineStates.ACTIVE && vm.status !== VirtualMachineStates.SHUTOFF
        && vm.status !== VirtualMachineStates.DELETED) {
        this.check_status_loop(vm);
      }
    })
  }

  resumeVM(vm: VirtualMachine):
    void {

    this.virtualmachineservice.resumeVM(vm.openstackid).subscribe((updated_vm: VirtualMachine) => {

      this.status_changed = 0;

      if (updated_vm.created_at !== '') {
        updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
      }
      updated_vm.cardState = 0;
      this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;
      switch (updated_vm.status) {
        case VirtualMachineStates.ACTIVE:
          this.status_changed = 1;
          break;
        case VirtualMachineStates.RESTARTING:
          this.check_status_loop(updated_vm, VirtualMachineStates.ACTIVE, true);
          break;
        default:
          this.status_changed = 2;
          break;

      }
    })
  }

  /**
   * Get all vms.
   */
  getAllVms(): void {
    this.virtualmachineservice.getAllVM(this.currentPage, this.vm_per_site,
                                        this.filter, this.filter_status_list)
      .subscribe((vms: VirtualMachine[]) => {
                   this.prepareVMS(vms);
                 }
      );
  }

  ngOnInit(): void {
    this.getClientForcUrls();
    this.getVms();
    this.is_vo_admin = is_vo;
    this.get_is_facility_manager();
    this.facilityService.getManagerFacilities().subscribe((result: any) => {
      this.managerFacilities = result;
      this.selectedFacility = this.managerFacilities[0];
    });

    this.filterChanged
      .pipe(
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged())
      .subscribe(() => {
        this.applyFilter();
      });

    this.vmPerPageChange.pipe(
      debounceTime(this.DEBOUNCE_TIME),
      distinctUntilChanged())
      .subscribe(() => {
        this.applyFilter();
      });

    this.snapshotSearchTerm
      .pipe(
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged())
      .subscribe((event: any) => {
        this.validSnapshotName(event);
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onChanges(): void {
// Subscribe to changes on the selectAll checkbox
    this.actionsForm.get('selectAll').valueChanges.subscribe((bool: any) => {
      this.actionsForm
        .get('vmActions')
        .patchValue(Array(this.vmActions.length).fill(bool), { emitEvent: false });
    });

    // Subscribe to changes on the music preference checkboxes
    this.actionsForm.get('vmActions').valueChanges.subscribe((val: any) => {
      const allSelected: any = val.every((bool: any) => bool);
      if (this.actionsForm.get('selectAll').value !== allSelected) {
        this.actionsForm.get('selectAll').patchValue(allSelected, { emitEvent: false });
      }
    });
  }

  /**
   * Create snapshot.
   * @param {string} snapshot_instance which is used for creating the snapshot
   * @param {string} snapshot_name name of the snapshot
   */
  createSnapshot(snapshot_instance: string, snapshot_name: string, description ?: string
  ):
    void {
    this.imageService.createSnapshot(snapshot_instance, snapshot_name, description).subscribe((newSnapshot: SnapshotModel) => {
      if (newSnapshot.snapshot_openstackid) {
        this.snapshotDone = 'true';

      } else {
        this.snapshotDone = 'error';

      }

    })
  }

  getToBeDeleted(): any {
    // Filter out the unselected ids

    const selectedMachines: VirtualMachine[] = this.actionsForm.value.vmActions
      .map((checked: any, index: any) => checked ? this.vmActions[index].id : null)
      .filter((value: any) => value !== null);

    this.selectedMachines = selectedMachines;

    return selectedMachines;
  }

  deleteAll(): void {
    for (const vm of this.getToBeDeleted()) {
      this.virtualmachineservice.deleteVM(vm.openstackid).subscribe((updated_vm: VirtualMachine) => {

        if (updated_vm.created_at !== '') {
          updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
        }
        updated_vm.cardState = 0;
        this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;
        this.selectedMachines[this.selectedMachines.indexOf(vm)] = updated_vm;
        this.applyFilterStatus();
      })
    }
  }

  setForcUrl(vm: VirtualMachine): void {
    this.virtualmachineservice.getLocationUrl(vm.openstackid)
      .subscribe((url: any) => {
        if (url !== '') {
          if (this.clientsForcUrls.hasOwnProperty(vm.client.id)) {
            vm.res_env_url = `${this.clientsForcUrls[vm.client.id]}${url}/`;
          } else {
            vm.res_env_url = '';
          }
        } else {
          vm.res_env_url = '';
        }
      });
  }

  getClientForcUrls(): void {
    this.clientService.getClientsChecked().subscribe((clients: Client[]) => {
      clients.forEach((client: Client) => {
        this.groupService.getClientHasForc(client.id, 'true').subscribe((hasForc: JSON) => {
          if (hasForc['hasForc'] === 'True') {
            this.groupService.getClientForcUrl(client.id).subscribe((response: JSON) => {
              if (response['forc_url'] !== 'None') {
                this.clientsForcUrls[client.id] = response['forc_url'];
              }
            });
          }
        });
      });
    });
  }

  resenv_by_play(vm: VirtualMachine): boolean {
    for (const mode of vm.modes) {
      if (TemplateNames.ALL_TEMPLATE_NAMES.indexOf(mode.name) !== -1) {
        return false;
      }
    }

    return true;
  }
}
