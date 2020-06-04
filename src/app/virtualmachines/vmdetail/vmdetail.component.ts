import {Component, OnInit} from '@angular/core';
import {FlavorService} from '../../api-connector/flavor.service';
import {ApplicationsService} from '../../api-connector/applications.service';
import {FacilityService} from '../../api-connector/facility.service';
import {VoService} from '../../api-connector/vo.service';
import {UserService} from '../../api-connector/user.service';
import {GroupService} from '../../api-connector/group.service';
import {CreditsService} from '../../api-connector/credits.service';
import {AbstractBaseClasse} from '../../shared/shared_modules/baseClass/abstract-base-class';
import {ActivatedRoute} from '@angular/router';
import {VirtualMachine} from '../virtualmachinemodels/virtualmachine';
import {VirtualmachineService} from '../../api-connector/virtualmachine.service';
import {ImageService} from '../../api-connector/image.service';
import {Image} from '../virtualmachinemodels/image';
import {VirtualMachineStates} from '../virtualmachinemodels/virtualmachinestates';
import {IResponseTemplate} from '../../api-connector/response-template';
import {SnapshotModel} from '../snapshots/snapshot.model';
import {Subject} from 'rxjs';
import {PlaybookService} from '../../api-connector/playbook.service';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

import {CondaPackage} from '../condaPackage.model';
import {BiocondaService} from '../../api-connector/bioconda.service';
import {ResenvTemplate} from '../conda/resenvTemplate.model';
import {is_vo} from '../../shared/globalvar';
import {WIKI_GUACAMOLE_LINK, WIKI_MOUNT_VOLUME, WIKI_RSTUDIO_LINK} from '../../../links/links';
import {ClipboardService} from 'ngx-clipboard';
import {Volume} from '../volumes/volume';
import {VolumeStates} from '../volumes/volume_states';

/**
 * VM Detail page component
 */
@Component({
             selector: 'app-virtual-machine-detail',
             templateUrl: 'vmdetail.component.html',
             styleUrls: ['./vmdetail.component.scss'],

             providers: [FlavorService, FacilityService, VoService, UserService, GroupService,
               VoService, CreditsService, VirtualmachineService, ImageService, PlaybookService, BiocondaService]
           })

export class VmDetailComponent extends AbstractBaseClasse implements OnInit {

  vm_id: string;
  title: string = 'Instance Detail';
  image: Image;
  startDate: number;
  stopDate: number;
  VolumeStates: VolumeStates = new VolumeStates()
  virtualMachineStates: VirtualMachineStates = new VirtualMachineStates();
  virtualMachine: VirtualMachine;
  resenvTemplate: ResenvTemplate;
  snapshotSearchTerm: Subject<string> = new Subject<string>();
  errorMessage: boolean = false;
  error_msg: string = '';
  private _condaPackages: CondaPackage[] = [];
  res_env_url: string = '';
  filteredMembers: any = null;
  backend_users: any = [];

  is_vo_admin: boolean = is_vo;
  WIKI_RSTUDIO_LINK: string = WIKI_RSTUDIO_LINK;
  WIKI_GUACAMOLE_LINK: string = WIKI_GUACAMOLE_LINK;
  WIKI_MOUNT_VOLUME: string = WIKI_MOUNT_VOLUME;

  DEBOUNCE_TIME: number = 300;

  volume_to_attach: Volume;
  volume_to_detach: Volume;
  detached_project_volumes: Volume[] = [];

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

  constructor(private activatedRoute: ActivatedRoute,
              private virtualmachineService: VirtualmachineService,
              private userService: UserService,
              private applicationService: ApplicationsService,
              private flavorService: FlavorService,
              private imageService: ImageService,
              private playbookService: PlaybookService,
              private groupService: GroupService,
              private biocondaService: BiocondaService,
              private clipboardService: ClipboardService) {
    super();
  }

  get condaPackages(): CondaPackage[] {
    return this._condaPackages;
  }

  set condaPackages(value: CondaPackage[]) {
    this._condaPackages = value;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((paramsId: any) => {
      this.vm_id = paramsId.id;
      this.getVmById();
      this.snapshotSearchTerm
        .pipe(
          debounceTime(this.DEBOUNCE_TIME),
          distinctUntilChanged())
        .subscribe((event: any) => {
          this.validSnapshotName(event);
        });
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

  setVmNeeded(): void {
    this.virtualmachineService.setVmNeeded(this.virtualMachine.openstackid).subscribe((res: any) => {
      if (res['still_needed']) {
        this.virtualMachine.still_used_confirmation_requested = false;

      }
    })
  }

  /**
   * Delete VM.
   * @param vm which will be deleted
   */
  deleteVm(): void {
    this.virtualmachineService.deleteVM(this.virtualMachine.openstackid).subscribe(
      (updated_vm: VirtualMachine) => {

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
      },
      (error1: any) => {
        this.status_changed = 2;
        if (error1['status'] === 409) {
          this.error_msg = 'Conflict detected. The virtual machine is currently creating a snapshot and must not be altered.'
        }
        this.getVmById();
      })
  }

  getDetachedVolumesByVSelectedMProject(): void {
    this.virtualmachineService.getDetachedVolumesByProject(this.virtualMachine.projectid).subscribe(
      (detached_volumes: Volume[]) => {
        this.detached_project_volumes = detached_volumes;
      }
    )
  }

  attachVolume(volume: Volume): void {
    const volume_status_backup: string = volume.volume_status;
    volume.volume_status = VolumeStates.ATTACHING;

    this.virtualmachineService.attachVolumetoServer(volume.volume_openstackid, this.virtualMachine.openstackid).subscribe(
      (result: IResponseTemplate) => {

        if (result.value === 'attached') {
          this.getVmById();
        }
      },
      (error1: any) => {
        this.status_changed = 2;
        if (error1['error']['error'] === '409') {
          this.volume_to_attach.error_msg = 'Conflict detected. The virtual machine is currently creating a snapshot and must not be altered.';
          setTimeout(() => {
                       this.volume_to_attach.error_msg = null;
                     },
                     5000);
          this.error_msg = 'Conflict detected. The virtual machine is currently creating a snapshot and must not be altered.';
          volume.volume_status = volume_status_backup;
        }
      }
    )
  }

  detachVolume(volume: Volume): void {
    const volume_status_backup: string = volume.volume_status;
    volume.volume_status = VolumeStates.DETACHING;

    this.virtualmachineService.deleteVolumeAttachment(volume.volume_openstackid, this.virtualMachine.openstackid).subscribe(
      (result: any) => {
        if (result.value === 'deleted') {
          this.getDetachedVolumesByVSelectedMProject();
          this.getVmById();

        }
      },
      (error1: any) => {
        this.status_changed = 2;
        if (error1['error']['error'] === '409') {
          volume.error_msg = 'Conflict detected. The virtual machine is currently creating a snapshot and must not be altered.';
          setTimeout(() => {
            volume.error_msg = null;
          },
                     5000);
          this.error_msg = 'Conflict detected. The virtual machine is currently creating a snapshot and must not be altered.'
          volume.volume_status = volume_status_backup;
        }
      })
  }

  /**
   * Reboot a vm.
   * @param vm which will be rebooted
   * @param {string} reboot_type HARD|SOFT
   */
  public rebootVm(reboot_type: string): void {
    this.virtualmachineService.rebootVM(this.virtualMachine.openstackid, reboot_type).subscribe(
      (result: IResponseTemplate) => {
        this.status_changed = 0;
        this.virtualMachine.cardState = 0;

        if (<boolean><Boolean>result.value) {
          this.status_changed = 1;
          this.check_status_loop_when_reboot();
        } else {
          this.status_changed = 2;
        }

      },
      (error1: any) => {
        this.status_changed = 2;
        this.status_check_error = true;
        if (error1['error']['error'] === '409') {
          this.error_msg = 'Conflict detected. The virtual machine is currently creating a snapshot and must not be altered.'
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
      .subscribe(
        (updated_vm: VirtualMachine) => {
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

        },
        (error1: any) => {
          this.status_changed = 2;
          if (error1['error']['error'] === '409') {
            this.error_msg = 'Conflict detected. The virtual machine is currently creating a snapshot and must not be altered.'
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
    this.virtualmachineService.resumeVM(this.virtualMachine.openstackid).subscribe(
      (updated_vm: VirtualMachine) => {
        this.status_changed = 0;
        if (updated_vm.created_at === '') {
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
      },
      (error1: any) => {
        this.status_changed = 2;
        if (error1['error']['error'] === '409') {
          this.error_msg = 'Conflict detected. The virtual machine is currently creating a snapshot and must not be altered.'
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
    this.imageService.createSnapshot(snapshot_instance, snapshot_name, description).subscribe(
      (newSnapshot: SnapshotModel) => {
        if (newSnapshot.snapshot_openstackid) {
          this.snapshotDone = 'true';

        } else {
          this.snapshotDone = 'error';
        }

      },
      (error1: any) => {
        this.snapshotDone = 'error';
        this.status_changed = 2;
        if (error1['error']['error'] === '409') {
          this.error_msg = 'Conflict detected. The virtual machine is currently creating a snapshot and must not be altered.'
        }
      })
  }

  /**
   * Copies the content of the field it get's clicked on (e.g. ssh connection information).
   * @param text the content of the field
   */
  copyToClipboard(text: string): void {
    if (this.clipboardService.isSupported) {
      this.clipboardService.copy(text);
    }
  }

  getVmById(): void {
    this.virtualmachineService.getVmById(this.vm_id).subscribe(
      (vm: VirtualMachine) => {
        vm = new VirtualMachine(vm);
        if (vm == null) {
          this.isLoaded = false;
          this.errorMessage = true;
          // TODO: Redirect back to overview
        } else {

          this.playbookService.getPlaybookForVM(this.vm_id).subscribe((pb: Object) => {
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
                    for (const packageObject in package_list['packages']) {
                      if (package_list['packages'].hasOwnProperty(packageObject)) {
                        const c_index: string = packageObject;
                        const c_package: any = package_list['packages'][c_index];
                        this._condaPackages.push(new CondaPackage(c_package.name, c_package.version, c_package.build));
                      }
                    }
                  }
                }
              }
            }
          });
          this.checkAndGetForcDetails(vm);
          this.title = vm['name'];
          this.virtualMachine = vm;
          this.biocondaService.getTemplateNameByVmName(vm).subscribe((tname: any) => {
            if (tname != null) {
              const template_name: string = tname['template'];
              this.biocondaService.getForcTemplates(vm.client.id).subscribe((templates: any) => {
                if (templates != null) {
                  for (const temp of templates) {
                    if (temp['template_name'] === template_name) {
                      this.resenvTemplate = temp;
                      break;
                    }
                  }
                }
              });
            }
          })
          this.startDate = parseInt(this.virtualMachine.created_at, 10) * 1000;
          this.stopDate = parseInt(this.virtualMachine.stopped_at, 10) * 1000;
          this.stopDate = parseInt(this.virtualMachine.stopped_at, 10) * 1000;
          this.getImageDetails(this.virtualMachine.projectid, this.virtualMachine.image);
          this.getDetachedVolumesByVSelectedMProject();

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

  checkAndGetForcDetails(vm: VirtualMachine): void {
    const checkForForc: boolean = true;
    // for (const mode of vm.modes) {
    //   if (TemplateNames.ALL_TEMPLATE_NAMES.indexOf(mode.name) !== -1) {
    //     checkForForc = false;
    //   }
    // }
    if (checkForForc) {
      this.groupService.getClientForcUrl(vm.client.id, 'true').subscribe((response: JSON) => {
        if (response['forc_url'] !== null) {
          this.virtualmachineService.getLocationUrl(vm.openstackid)
            .subscribe((url: any) => {
              if (url !== '') {
                vm.res_env_url = `${response['forc_url']}${url}/`;
              } else {
                vm.res_env_url = '';
              }
            });
        }
      });
      this.getUsersForBackend();
    }

  }

  filterMembers(searchString: string): void {
    this.userService.getFilteredMembersOfdeNBIVo(searchString).subscribe((result: object) => {
      this.filteredMembers = result;
    })
  }

  addUserToBackend(userId: any): void {
    this.biocondaService.addUserToBackend(this.vm_id, userId).subscribe((result: any) => {
      this.getUsersForBackend();
    });
  }

  getUsersForBackend(): void {
    this.biocondaService.getUsersForBackend(this.vm_id).subscribe((result: any) => {
      this.backend_users = result;
    });
  }

  deleteUserFromBackend(userId: any): void {
    this.biocondaService.deleteUserFromBackend(this.vm_id, userId.toString()).subscribe((result: any) => {
      this.getUsersForBackend();
    });
  }
}
