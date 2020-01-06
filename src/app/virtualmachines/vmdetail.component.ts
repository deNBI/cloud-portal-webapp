import {Component, OnInit} from '@angular/core';
import {FlavorService} from '../api-connector/flavor.service';
import {ApplicationsService} from '../api-connector/applications.service';
import {FacilityService} from '../api-connector/facility.service';
import {VoService} from '../api-connector/vo.service';
import {UserService} from '../api-connector/user.service';
import {GroupService} from '../api-connector/group.service';
import {ApiSettings} from '../api-connector/api-settings.service';
import {CreditsService} from '../api-connector/credits.service';
import {AbstractBaseClasse} from '../shared/shared_modules/baseClass/abstract-base-class';
import {ActivatedRoute} from '@angular/router';
import {VirtualMachine} from './virtualmachinemodels/virtualmachine';
import {VirtualmachineService} from '../api-connector/virtualmachine.service';
import {ImageService} from '../api-connector/image.service';
import {Image} from './virtualmachinemodels/image';
import {VirtualMachineStates} from './virtualmachinemodels/virtualmachinestates';
import {IResponseTemplate} from '../api-connector/response-template';
import {SnapshotModel} from './snapshots/snapshot.model';
import {Subject} from 'rxjs';


@Component({
  selector: 'app-virtual-machine-detail',
  templateUrl: 'vmdetail.component.html',
  styleUrls: ['./vmdetail.component.scss'],
             providers: [FlavorService, FacilityService, VoService, UserService, GroupService, ApiSettings,
               VoService, CreditsService, VirtualmachineService, ImageService]
})

export class VmDetailComponent extends AbstractBaseClasse implements OnInit {
  vm_id: string;
  title: string = 'Instance Detail';
  image: Image;
  startDate: number;
  stopDate: number;
  virtualMachineStates: VirtualMachineStates = new VirtualMachineStates();
  virtualMachine: VirtualMachine;
  snapshotSearchTerm: Subject<string> = new Subject<string>();


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
  // @ts-ignore
  /**
   * Tab which is shown own|all.
   * @type {string}
   */

  constructor(private activatedRoute: ActivatedRoute,
              private virtualmachineService: VirtualmachineService,
              private userService: UserService,
              private applicationService: ApplicationsService,
              private flavorService: FlavorService,
              private imageService: ImageService) {
    super();
  }
  ngOnInit(): void {

    this.activatedRoute.params.subscribe((paramsId: any) => {
     this.vm_id = paramsId.id;
     this.getVmById();

    });
  }

  // from vmOverview.component.ts - may be refactored in the future
  /**
   * Check if the snapshot name is valid.
   * @param e
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
  checkStatus(): void {
    this.virtualmachineService.checkVmStatus(this.virtualMachine.openstackid)
      .subscribe((updated_vm: VirtualMachine) => {

          if (updated_vm.created_at !== '') {
            updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
          }
          this.virtualMachine = updated_vm;
        }
      )
  }

  /**
   * Delete VM.
   * @param vm which will be deleted
   */
  deleteVm(): void {
    this.virtualmachineService.deleteVM(this.virtualMachine.openstackid).subscribe((updated_vm: VirtualMachine) => {

      if (updated_vm.created_at !== '') {
        updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
      }
      updated_vm.cardState = 0;
      this.virtualMachine = updated_vm;
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
  public rebootVm(reboot_type: string): void {
    this.virtualmachineService.rebootVM(this.virtualMachine.openstackid, reboot_type).subscribe((result: IResponseTemplate) => {
      this.status_changed = 0;
      this.virtualMachine.cardState = 0;

      if (<boolean><Boolean>result.value) {
        this.status_changed = 1;
        this.check_status_loop_when_reboot();
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
  check_status_loop(final_state: string, is_selected_vm?: boolean): void {

    setTimeout(
      () => {
        if (this.virtualMachine.openstackid) {
          this.virtualmachineService.checkVmStatus(this.virtualMachine.openstackid).subscribe((updated_vm: VirtualMachine) => {
            this.virtualMachine = updated_vm;
            this.virtualMachine.cardState = 0;

            if (updated_vm.status === final_state) {
              if (updated_vm.created_at !== '') {
                updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
              }
              this.virtualMachine = updated_vm;

            } else {
              if (this.virtualMachine['error']) {
                this.status_check_error = true

              }
              this.check_status_loop( final_state, is_selected_vm)
            }

          })
        } else {
          this.virtualmachineService.checkVmStatus(this.virtualMachine.name).subscribe((updated_vm: VirtualMachine) => {
            this.virtualMachine = updated_vm;
            this.virtualMachine.cardState = 0;

            if (updated_vm.status === final_state) {
              if (updated_vm.created_at !== '') {
                updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
              }
              this.virtualMachine = updated_vm;

            } else {
              if (this.virtualMachine['error']) {
                this.status_check_error = true

              }
              this.check_status_loop(final_state, is_selected_vm)
            }

          })
        }
      }
      ,
      this.checkStatusTimeout
    )
    ;
  }

  /**
   * Check Status of vm in loop till active.
   * @param vm
   */
  check_status_loop_when_reboot(): void {

    setTimeout(
      () => {
        this.virtualmachineService.checkVmStatusWhenReboot(this.virtualMachine.openstackid).subscribe((updated_vm: VirtualMachine) => {

          if (updated_vm.status === VirtualMachineStates.ACTIVE) {
            this.reboot_done = true;

            if (updated_vm.created_at !== '') {
              updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
            }

            this.virtualMachine = updated_vm;

          } else {
            if (this.virtualMachine['error']) {
              this.status_check_error = true

            }
            this.check_status_loop_when_reboot();
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
  stopVm(): void {
    this.virtualmachineService.stopVM(this.virtualMachine.openstackid)
      .subscribe((updated_vm: VirtualMachine) => {
          this.status_changed = 0;

          if (updated_vm.created_at !== '') {
            updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
          }
          updated_vm.cardState = 0;
          this.virtualMachine = updated_vm;

          switch (updated_vm.status) {
            case VirtualMachineStates.SHUTOFF:
              this.status_changed = 1;
              break;
            case VirtualMachineStates.POWERING_OFF:
              this.check_status_loop(VirtualMachineStates.SHUTOFF, true);
              break;
            default:
              this.status_changed = 2;
              break;

          }

        }
      )
  }

  checkVmTillActive(): void {
      if (this.virtualMachine.status !== VirtualMachineStates.ACTIVE &&
        this.virtualMachine.status !== VirtualMachineStates.SHUTOFF &&
        this.virtualMachine.status !== VirtualMachineStates.DELETED) {
        this.check_status_loop(VirtualMachineStates.ACTIVE);
      }
  }

  resumeVM(): void {
    this.virtualmachineService.resumeVM(this.virtualMachine.openstackid).subscribe((updated_vm: VirtualMachine) => {
      this.status_changed = 0;
      if (updated_vm.created_at !== '') {
        updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
      }
      updated_vm.cardState = 0;
      this.virtualMachine = updated_vm;
      switch (updated_vm.status) {
        case VirtualMachineStates.ACTIVE:
          this.status_changed = 1;
          break;
        case VirtualMachineStates.RESTARTING:
          this.check_status_loop(VirtualMachineStates.ACTIVE, true);
          break;
        default:
          this.status_changed = 2;
          break;

      }
    })
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

  getVmById(): void {
    this.virtualmachineService.getVmById(this.vm_id).subscribe(
      (vm: VirtualMachine) => {
        console.log(vm);
        if (vm == null) {
          this.isLoaded = false
          // TODO: Redirect back to overview
        } else {
          this.title = vm['name'];
          this.virtualMachine = vm;
          this.startDate = parseInt(this.virtualMachine.created_at, 10) * 1000;
          this.stopDate = parseInt(this.virtualMachine.stopped_at, 10) * 1000;
          this.stopDate = parseInt(this.virtualMachine.stopped_at, 10) * 1000;
          this.getImageDetails(this.virtualMachine.projectid, this.virtualMachine.image);
          this.isLoaded = true;
        }
      }
    );
  }

  getImageDetails(project_id: number, name: string): Image {
    const newImage: Image = new Image();
    this.imageService.getImageByProjectAndName(project_id, name).subscribe(
      (image: Image) => {
        this.image = image;
      },
      (error: any) => {
        this.isLoaded = false;
    }
    );

    return newImage;
  }

  copySSHCommand(): void {
    this.copyToClipboard(this.virtualMachine.ssh_command.substring(65, this.virtualMachine.ssh_command.length));
  }
  copyUDPCommand(): void {
    this.copyToClipboard(this.virtualMachine.udp_command);
  }

  copyToClipboard(text: string): void {
    document.addEventListener('copy', (clipEvent: ClipboardEvent) => {
      clipEvent.clipboardData.setData('text/plain', (text));
      clipEvent.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }
}
