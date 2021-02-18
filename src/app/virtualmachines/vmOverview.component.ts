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
import {elixir_id, is_vo} from '../shared/globalvar';

import {VirtualMachineStates} from './virtualmachinemodels/virtualmachinestates';
import {GroupService} from '../api-connector/group.service';
import {ClientService} from '../api-connector/client.service';
import {Client} from '../vo_manager/clients/client.model';
import {TemplateNames} from './conda/template-names';
import {PlaybookService} from '../api-connector/playbook.service';
import {BiocondaService} from '../api-connector/bioconda.service';
import {ClipboardService} from 'ngx-clipboard';
import {Volume} from './volumes/volume';
import {VolumeStates} from './volumes/volume_states';
import {WIKI_GUACAMOLE_LINK, WIKI_RSTUDIO_LINK, WIKI_VOLUME_OVERVIEW} from '../../links/links';

/**
 * Vm overview componentn.
 */
@Component({
             selector: 'app-vm-overview',
             templateUrl: 'vmOverview.component.html',
             styleUrls: ['./vmOverview.component.scss'],
             providers: [FacilityService, ImageService, UserService,
               VirtualmachineService, FullLayoutComponent, GroupService, ClientService, PlaybookService, BiocondaService]
           })

export class VmOverviewComponent implements OnInit, OnDestroy {
  title: string = 'Instance Overview';

  private subscription: Subscription = new Subscription();

  VirtualMachineStates: VirtualMachineStates = new VirtualMachineStates();
  volume_to_attach: Volume;
  volume_to_detach: Volume;
  detached_project_volumes: Volume[] = [];

  WIKI_RSTUDIO_LINK: string = WIKI_RSTUDIO_LINK;
  WIKI_GUACAMOLE_LINK: string = WIKI_GUACAMOLE_LINK;
  WIKI_VOLUME_OVERVIEW: string = WIKI_VOLUME_OVERVIEW;

  ERROR_MSG: string = '';
  ERROR_TIMER: number = 10000;
  SNAPSHOT_CREATING_ERROR_MSG: string
    = 'Conflict detected. The virtual machine is currently creating a snapshot and must not be altered.'

  /**
   * All  vms.
   */
  vms_content: VirtualMachine[] = [];
  currentPage: number = 1;
  DEBOUNCE_TIME: number = 300;
  LONG_DEBOUNCE_TIME: number = 1000;
  filter_cluster: boolean = false;
  filter_set_for_termination: boolean = false;
  filter_status_list: string[] = [VirtualMachineStates.ACTIVE, VirtualMachineStates.SHUTOFF];
  isSearching: boolean = true;

  selectedVm: VirtualMachine = null;

  /**
   * Facilities where the user is manager ['name',id].
   */
  public managerFacilities: [string, number][];
  /**
   * Chosen facility.
   */
  public selectedFacility: [string, number];

  filter: string;
  vm_per_site: number = 7;

  total_pages: number;
  total_items: number;
  /**
   * If user is vo admin.
   */

  items_per_page: number = 7;

  is_vo_admin: boolean;
  user_elixir_id: string;
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
  cluster_allowed: boolean = false;

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

  snapshotSearchTerm: Subject<string> = new Subject<string>();

  actionsForm: FormGroup;
  vmActions: {id: VirtualMachine, name: string}[] = [];
  selectedMachines: VirtualMachine[] = [];

  clientsForcUrls: {[client_id: string]: [string]} = {};

  /*
    Key-Value-Map for Conda Packages installed on machine.
   */
  condaPackagesByVM: {[vm_id: string]: number} = {};

  constructor(private facilityService: FacilityService,
              private clipboardService: ClipboardService,
              private imageService: ImageService, private userservice: UserService,
              private virtualmachineservice: VirtualmachineService, private fb: FormBuilder,
              private groupService: GroupService,
              private clientService: ClientService,
              private playbookService: PlaybookService,
              private biocondaService: BiocondaService) {
    this.actionsForm = fb.group({
                                  title: fb.control('initial value', Validators.required)
                                });
  }

  /**
   * Apply filter to all vms.
   */
  applyFilter(): void {
    this.filter = this.filter.trim();
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
    if (this.clipboardService.isSupported) {
      this.clipboardService.copy(text);
    }
  }

  getDetachedVolumesByVSelectedMProject(): void {
    this.virtualmachineservice.getDetachedVolumesByProject(this.selectedVm.projectid).subscribe(
      (detached_volumes: Volume[]): void => {
        this.detached_project_volumes = detached_volumes;
      }
    )
  }

  trackByVm(index: number | string, vm: VirtualMachine): string {
    return vm.openstackid
  }

  check_status_loop_volume(volume: Volume, initial_timeout: number = this.checkStatusTimeout, final_state?: string): void {

    setTimeout(
      (): void => {
        if (volume.volume_openstackid) {
          this.subscription.add(this.virtualmachineservice.getVolumeById(volume.volume_openstackid).subscribe((vol: Volume): void => {

            // tslint:disable-next-line:max-line-length
            if (volume.volume_status !== VolumeStates.AVAILABLE && volume.volume_status !== VolumeStates.NOT_FOUND && volume.volume_status !== VolumeStates.IN_USE && volume.volume_status !== final_state) {
              this.check_status_loop_volume(volume, this.checkStatusTimeout, final_state)
            }
          }))
        } else {
          // tslint:disable-next-line:max-line-length
          this.subscription.add(this.virtualmachineservice.getVolumeByNameAndVmName(volume.volume_name, volume.volume_virtualmachine.name).subscribe((vol: Volume): void => {
            // tslint:disable-next-line:max-line-length
            if (volume.volume_status !== VolumeStates.AVAILABLE && volume.volume_status !== VolumeStates.NOT_FOUND && volume.volume_status !== VolumeStates.IN_USE && volume.volume_status !== final_state) {
              this.check_status_loop_volume(volume, this.checkStatusTimeout, final_state)
            }
          }))

        }
      },
      initial_timeout
    )
  }

  attachVolume(volume: Volume, vm: VirtualMachine): void {
    const idx: number = this.vms_content.indexOf(vm);

    this.virtualmachineservice.attachVolumetoServer(volume.volume_openstackid, vm.openstackid).subscribe(
      (result: IResponseTemplate): void => {

        if (result.value === 'attached') {
          this.virtualmachineservice.getVmById(vm.openstackid).subscribe((upd_vm: VirtualMachine): void => {
            const new_vm: VirtualMachine = new VirtualMachine(upd_vm);
            this.checkCondaPackages(new_vm);
            this.vms_content[idx] = new_vm;

          })
        }
      },
      (error1: any): void => {
        this.status_changed = 2;
        if (error1['error']['error'] === '409') {
          vm.setErrorMsgWithTimeout(this.SNAPSHOT_CREATING_ERROR_MSG, this.ERROR_TIMER);
        }
      }
    )
  }

  detachVolume(volume: Volume, vm: VirtualMachine): void {

    const idx: number = this.vms_content.indexOf(vm);
    this.virtualmachineservice.deleteVolumeAttachment(volume.volume_openstackid, vm.openstackid).subscribe(
      (result: any): void => {
        if (result.value === 'deleted') {
          this.virtualmachineservice.getVmById(vm.openstackid).subscribe((upd_vm: VirtualMachine): void => {
            const new_vm: VirtualMachine = new VirtualMachine(upd_vm);
            this.checkCondaPackages(new_vm);
            this.vms_content[idx] = new_vm;

          })
        }
      },
      (error1: any): void => {
        this.status_changed = 2;
        if (error1['error']['error'] === '409') {
          vm.setErrorMsgWithTimeout(this.SNAPSHOT_CREATING_ERROR_MSG, this.ERROR_TIMER);
        }

      })
  }

  set_cluster_allowed(): void {
    this.virtualmachineservice.getClusterAllowed().subscribe((res: any): void => {
      this.cluster_allowed = res['allowed'];
    })
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
    this.facilityService.getManagerFacilities().subscribe((result: any): void => {
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
    this.imageService.checkSnapshotNameAvailable(this.snapshotName.trim()).subscribe((res: IResponseTemplate): void => {

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
      .subscribe((updated_vm: VirtualMachine): void => {
                   updated_vm = new VirtualMachine(updated_vm);

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
    if (this.vms_content.indexOf(vm) === -1) {
      vm = this.vms_content.find((vm_cont: VirtualMachine): boolean => vm.openstackid === vm_cont.openstackid)[0]

    }

    vm.status = VirtualMachineStates.DELETING;
    this.subscription.add(this.virtualmachineservice.deleteVM(vm.openstackid).subscribe(
      (updated_vm: VirtualMachine): void => {
        updated_vm = new VirtualMachine(updated_vm);

        updated_vm.cardState = 0
        this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;
        this.applyFilterStatus();
        if (updated_vm.status !== VirtualMachineStates.DELETED) {
          setTimeout(
            (): void => {
              this.deleteVm(updated_vm)
            },
            this.checkStatusTimeout
          );
        }
      },
      (error1: any): void => {
        this.status_changed = 2;
        this.checkStatus(vm);
        if (error1['status'] === 409) {
          vm.setErrorMsgWithTimeout(this.SNAPSHOT_CREATING_ERROR_MSG, this.ERROR_TIMER);

        }
      }))
  }

  /**
   * Reboot a vm.
   * @param vm which will be rebooted
   * @param {string} reboot_type HARD|SOFT
   */
  public rebootVm(vm: VirtualMachine, reboot_type: string): void {
    this.virtualmachineservice.rebootVM(vm.openstackid, reboot_type).subscribe(
      (result: IResponseTemplate): void => {
        this.status_changed = 0;
        vm.cardState = 0;

        if (<boolean><Boolean>result.value) {
          this.status_changed = 1;
          this.check_status_loop_when_reboot(vm)
        } else {
          this.status_changed = 2;
        }

      },
      (error1: any): void => {
        this.status_check_error = true;
        this.status_changed = 2;
        if (error1['error']['error'] === '409') {
          vm.setErrorMsgWithTimeout(this.SNAPSHOT_CREATING_ERROR_MSG, this.ERROR_TIMER);

        }
      })
  }

  /**
   * Check Status of vm in loop till final state is reached.
   * @param vm
   * @param final_state
   * @param is_selected_vm If the vm should be the selected vm
   */
  check_status_loop(vm: VirtualMachine, final_state?: string, is_selected_vm?: boolean, timeout: number = this.checkStatusTimeout): void {

    setTimeout(
      (): void => {

        // tslint:disable-next-line:max-line-length
        this.subscription.add(this.virtualmachineservice.checkVmStatus(vm.openstackid, vm.name).subscribe((updated_vm: VirtualMachine): void => {
          updated_vm = new VirtualMachine(updated_vm);
          updated_vm.cardState = vm.cardState;
          const const_entry: any = this.vmActions.filter((item: any): any => item.id.openstackid === vm.openstackid)[0]
          const const_idx: number = this.vmActions.indexOf(const_entry)
          const_entry.id = updated_vm
          this.vmActions[const_idx] = const_entry
          this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;
          if (is_selected_vm) {
            this.selectedVm = updated_vm;
          }

          if (VirtualMachineStates.IN_PROCESS_STATES.indexOf(updated_vm.status) !== -1) {
            this.check_status_loop(updated_vm, final_state, is_selected_vm)
          } else if (updated_vm.status !== VirtualMachineStates.DELETED) {
            // so not all requests are at the same time for the vms
            const min: number = 20000;
            const max: number = 40000;
            this.check_status_loop(updated_vm, final_state, is_selected_vm, Math.floor(Math.random() * (max - min)) + max)

          }

        }));

      },

      timeout
    );
  }

  /**
   * Check Status of vm in loop till active.
   * @param vm
   */
  check_status_loop_when_reboot(vm: VirtualMachine): void {

    setTimeout(
      (): void => {
        this.virtualmachineservice.checkVmStatusWhenReboot(vm.openstackid).subscribe((updated_vm: VirtualMachine): void => {
          updated_vm = new VirtualMachine(updated_vm);

          if (updated_vm.status === VirtualMachineStates.ACTIVE) {
            this.reboot_done = true;
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
      .subscribe(
        (updated_vm: VirtualMachine): void => {
          updated_vm = new VirtualMachine(updated_vm);

          this.status_changed = 0;
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

        },
        (error1: any): void => {
          this.status_changed = 2;
          if (error1['error']['error'] === '409') {
            vm.setErrorMsgWithTimeout(this.SNAPSHOT_CREATING_ERROR_MSG, this.ERROR_TIMER);

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
      this.filter, this.filter_status_list, this.filter_cluster, this.filter_set_for_termination)
      .subscribe((vms: any): void => {
                   this.prepareVMS(vms);
                 }
      );
  }

  getAllVmsFacilities(): void {

    this.virtualmachineservice.getVmsFromFacilitiesOfLoggedUser(
      this.selectedFacility['FacilityId'],
      this.currentPage, this.vm_per_site,
      this.filter, this.filter_status_list, this.filter_cluster, this.filter_set_for_termination)
      .subscribe((vms: VirtualMachine[]): void => {
                   this.prepareVMS(vms);
                 }
      );
  }

  setVmActions(): void {
    const actions: { id: VirtualMachine, name: string }[] = [];
    // tslint:disable-next-line:no-for-each-push
    this.vms_content.forEach((vm: VirtualMachine): void => {
        actions.push({id: vm, name: vm.name});

    });
    this.vmActions = actions;

    // Create a FormControl for each available music preference, initialize them as unchecked, and put them in an array
    const formControls: any = this.vmActions.map((): FormControl => new FormControl(false));

    // Create a FormControl for the select/unselect all checkbox
    const selectAllControl: any = new FormControl(false);

    // Simply add the list of FormControls to the FormGroup as a FormArray, add the selectAllControl separetely
    this.actionsForm = this.fb.group({
                                       vmActions: new FormArray(formControls),
                                       selectAll: selectAllControl
                                     });
    this.onChanges();
    this.checkVmTillActive();

  }

  checkCondaPackages(vm: VirtualMachine): void {
    this.playbookService.getPlaybookForVM(vm.openstackid).subscribe((pb: Object): void => {
      if (pb != null) {
        let pbs: string = pb['playbooks'].toString();
        if (pbs != null) {
          pbs = pbs.replace(/\\/g, '');
          pbs = pbs.replace('"[', '[');
          pbs = pbs.replace(']"', ']');
          const pkgs: Object = JSON.parse(pbs);
          if (pkgs != null) {
            const package_list: Object = pkgs['bioconda'];
            if (package_list != null) {
              let numberOfPackages: number = 0;
              for (const packageObject in package_list['packages']) {
                if (package_list['packages'].hasOwnProperty(packageObject)) {
                  numberOfPackages++;
                }
              }
              this.condaPackagesByVM[vm.openstackid] = numberOfPackages;
            }
          }
        }
      }
    });
  }

  showCopiedMessage(name: string): void {
    const span_id: string = `${name}resenvSpan`;
    const innerHTML: string = document.getElementById(span_id).innerHTML;
    document.getElementById(span_id).innerHTML = 'Copied URL!';
    setTimeout((): void => {
                 document.getElementById(span_id).innerHTML = innerHTML;
               },
               1000);
  }

  prepareVMS(vms: any): void {

    const vm_list: VirtualMachine[] = vms['vm_list'];
    const tmp_vms: VirtualMachine[] = [];

    // tslint:disable-next-line:no-for-each-push
    vm_list.forEach((new_vm: VirtualMachine): void => {
      const vm: VirtualMachine = new VirtualMachine(new_vm);
      this.checkCondaPackages(vm);
      tmp_vms.push(vm);

    });
    this.vms_content = [];
    this.vms_content = tmp_vms;
    this.total_items = vms['total_items'];
    this.items_per_page = vms['items_per_page'];
    this.total_pages = vms['num_pages'];
    this.vmActions = [];

    this.setVmActions();
    this.isSearching = false;
  }

  checkVmTillActive(): void {
    this.vms_content.forEach((vm: VirtualMachine): void => {
    if (vm.status !== VirtualMachineStates.DELETED) {
        this.check_status_loop(vm, null, null, 1000);
      }
    })
  }

  resumeVM(vm: VirtualMachine):
    void {

    this.virtualmachineservice.resumeVM(vm.openstackid).subscribe(
      (updated_vm: VirtualMachine): void => {
        updated_vm = new VirtualMachine(updated_vm);

        this.status_changed = 0;
        updated_vm.cardState = 0;
        this.vms_content[this.vms_content.indexOf(vm)] = updated_vm;
        switch (updated_vm.status) {
          case VirtualMachineStates.ACTIVE:
            this.status_changed = 1;
            break;
          case VirtualMachineStates.POWERING_ON:
            this.check_status_loop(updated_vm, VirtualMachineStates.ACTIVE, true);
            break;
          default:
            this.status_changed = 2;
            break;

        }
      },
      (error1: any): void => {
        this.status_changed = 2;
        if (error1['error']['error'] === '409') {
          vm.setErrorMsgWithTimeout(this.SNAPSHOT_CREATING_ERROR_MSG, this.ERROR_TIMER);

        }
      });
  }

  /**
   * Get all vms.
   */
  getAllVms(): void {
    this.virtualmachineservice.getAllVM(this.currentPage, this.vm_per_site,
                                        this.filter, this.filter_status_list, this.filter_cluster, this.filter_set_for_termination)
      .subscribe((vms: VirtualMachine[]): void => {
                   this.prepareVMS(vms);
                 }
      );
  }

  ngOnInit(): void {
    this.set_cluster_allowed();
    this.getClientForcUrls();
    this.getVms();
    this.is_vo_admin = is_vo;
    this.user_elixir_id = elixir_id;
    this.get_is_facility_manager();
    this.facilityService.getManagerFacilities().subscribe((result: any): void => {
      this.managerFacilities = result;
      this.selectedFacility = this.managerFacilities[0];
    });

    this.vmPerPageChange.pipe(
        debounceTime(this.LONG_DEBOUNCE_TIME),
        distinctUntilChanged())
      .subscribe((): void => {
        this.applyFilter();
      });

    this.snapshotSearchTerm
      .pipe(
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged())
      .subscribe((event: any): void => {
        this.validSnapshotName(event);
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onChanges(): void {
// Subscribe to changes on the selectAll checkbox
    this.actionsForm.get('selectAll').valueChanges.subscribe((bool: any): void => {
      this.actionsForm
        .get('vmActions')
        .patchValue(Array(this.vmActions.length).fill(bool), {emitEvent: false});
    });

    // Subscribe to changes on the music preference checkboxes
    this.actionsForm.get('vmActions').valueChanges.subscribe((val: any): void => {
      const allSelected: any = val.every((bool: any): void => bool);
      if (this.actionsForm.get('selectAll').value !== allSelected) {
        this.actionsForm.get('selectAll').patchValue(allSelected, {emitEvent: false});
      }
    });
  }

  /**
   * Create snapshot.
   * @param {string} vm which is used for creating the snapshot
   * @param {string} snapshot_name name of the snapshot
   */
  createSnapshot(vm: VirtualMachine, snapshot_name: string, description ?: string
  ):
    void {
    this.imageService.createSnapshot(vm.openstackid, snapshot_name.trim(), description).subscribe(
      (newSnapshot: SnapshotModel): void => {
        if (newSnapshot.snapshot_openstackid) {
          this.snapshotDone = 'true';

        } else {
          this.snapshotDone = 'error';

        }

      },
      (error1: any): void => {
        this.snapshotDone = 'error';
        this.status_changed = 2;
        if (error1['error']['error'] === '409') {
          vm.setErrorMsgWithTimeout(this.SNAPSHOT_CREATING_ERROR_MSG, this.ERROR_TIMER);

        }
      })
  }

  setToBeDeletedVms(): any {
    // Filter out the unselected ids

    const selectedMachines: VirtualMachine[] = this.actionsForm.value.vmActions
      .map((checked: any, index: any): VirtualMachine => checked && (this.vmActions[index].id.status === VirtualMachineStates.ACTIVE
        || this.vmActions[index].id.status === VirtualMachineStates.SHUTOFF)
        ? this.vmActions[index].id : null)
      .filter((value: any): boolean => value !== null);

    this.selectedMachines = selectedMachines;

  }

  deleteAll(): void {

    this.selectedMachines.forEach((vm: VirtualMachine): void => {
      // tslint:disable-next-line:triple-equals
      if (vm != undefined) {
        this.deleteVm(vm)
      }
    })

  }

  getClientForcUrls(): void {
    this.clientService.getClientsChecked().subscribe((clients: Client[]): void => {
      clients.forEach((client: Client): void => {
        if (client.activated && client.status === 'Connected') {

          this.groupService.getClientForcUrl(client.id, 'true').subscribe((response: JSON): void => {
            if (response['forc_url'] !== null) {
              this.clientsForcUrls[client.id] = response['forc_url'];
            }
          });
        }
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
