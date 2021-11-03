import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ClipboardService } from 'ngx-clipboard';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FlavorService } from '../../api-connector/flavor.service';
import { ApplicationsService } from '../../api-connector/applications.service';
import { FacilityService } from '../../api-connector/facility.service';
import { VoService } from '../../api-connector/vo.service';
import { UserService } from '../../api-connector/user.service';
import { GroupService } from '../../api-connector/group.service';
import { CreditsService } from '../../api-connector/credits.service';
import { AbstractBaseClass } from '../../shared/shared_modules/baseClass/abstract-base-class';
import { VirtualMachine } from '../virtualmachinemodels/virtualmachine';
import { VirtualmachineService } from '../../api-connector/virtualmachine.service';
import { ImageService } from '../../api-connector/image.service';
import { Image } from '../virtualmachinemodels/image';
import { VirtualMachineStates } from '../virtualmachinemodels/virtualmachinestates';
import { IResponseTemplate } from '../../api-connector/response-template';
import { SnapshotModel } from '../snapshots/snapshot.model';
import { PlaybookService } from '../../api-connector/playbook.service';
import { BiocondaService } from '../../api-connector/bioconda.service';
import { ResenvTemplate } from '../conda/resenvTemplate.model';
import { elixir_id, is_vo } from '../../shared/globalvar';
import { WIKI_GUACAMOLE_LINK, WIKI_RSTUDIO_LINK, WIKI_VOLUME_OVERVIEW } from '../../../links/links';
import { Volume } from '../volumes/volume';
import { VolumeStates } from '../volumes/volume_states';
import { Condalog } from '../conda/condalog';
import { Backend } from '../conda/backend/backend';
import { DeleteVmComponent } from '../modals/delete-vm/delete-vm.component';

/**
 * VM Detail page component
 */
@Component({
	selector: 'app-virtual-machine-detail',
	templateUrl: 'vmdetail.component.html',
	styleUrls: ['./vmdetail.component.scss'],

	providers: [FlavorService, FacilityService, VoService, UserService, GroupService,
		VoService, CreditsService, VirtualmachineService, ImageService, PlaybookService, BiocondaService],
})

export class VmDetailComponent extends AbstractBaseClass implements OnInit {

	vm_id: string;
	conda_logs: Condalog;
	title: string = 'Instance Detail';
	image: Image;
	VolumeStates: VolumeStates = new VolumeStates()
	virtualMachineStates: VirtualMachineStates = new VirtualMachineStates();
	virtualMachine: VirtualMachine;
	resenvTemplate: ResenvTemplate;
	snapshotSearchTerm: Subject<string> = new Subject<string>();
	errorMessage: boolean = false;
	error_msg: string = '';
	filteredMembers: any = null;
	backend_users: any = [];
	extendDone: boolean = false;
	VOLUME_END_STATES: string[] = [VolumeStates.AVAILABLE, VolumeStates.NOT_FOUND,
		VolumeStates.IN_USE, VirtualMachineStates.DELETED,
		VirtualMachineStates.DELETING_FAILED]

	is_vo_admin: boolean = is_vo;
	WIKI_RSTUDIO_LINK: string = WIKI_RSTUDIO_LINK;
	WIKI_GUACAMOLE_LINK: string = WIKI_GUACAMOLE_LINK;
	WIKI_VOLUME_OVERVIEW: string = WIKI_VOLUME_OVERVIEW;
	SNAPSHOT_MAX_RAM: number = SnapshotModel.MAX_RAM;

	DEBOUNCE_TIME: number = 300;

	volume_to_attach: Volume;
	detached_project_volumes: Volume[] = [];
	user_elixir_id: string = elixir_id;

	is_project_admin: boolean = false;

	/**
	 * The changed status.
	 *
	 * @type {number}
	 */
	status_changed: number = 0;
	/**
	 * Timeout for checking vm status.
	 *
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
	 *
	 * @type {string}
	 */
	snapshotNameCheckDone: boolean = false;
	snapshotDone: string = 'Waiting';
	/**
	 * name of the snapshot.
	 */
	snapshotName: string = '';

	/**
	 * Modal reference to be changed/showed/hidden depending on chosen modal.
	 */
	bsModalRef: BsModalRef;

	/**
	 * Default time in ms to show an error message if no other value specified.
	 */
	ERROR_TIMER: number = 10000;

	/**
	 * Error message to show if 409 status was returned, typically returned if vm is creating a snapshot.
	 */
	SNAPSHOT_CREATING_ERROR_MSG: string
		= 'Conflict detected. The virtual machine is currently creating a snapshot and must not be altered.';

	constructor(private activatedRoute: ActivatedRoute,
							private virtualmachineService: VirtualmachineService,
							private modalService: BsModalService,
							// public bsModalRef: BsModalRef, TODO: bsModalRef in constructor?
							private router: Router,
							private userService: UserService,
							private applicationService: ApplicationsService,
							private flavorService: FlavorService,
							private imageService: ImageService,
							private playbookService: PlaybookService,
							private biocondaService: BiocondaService,
							private clipboardService: ClipboardService,
							private groupService: GroupService) {
		super();
	}

	getVmCondaLogs(): void {
		this.virtualmachineService.getCondaLogs(this.vm_id).subscribe((log: Condalog): void => {
			if (log) {
				this.conda_logs = new Condalog(log);
			}
		});
	}

	ngOnInit(): void {
		this.activatedRoute.params.subscribe((paramsId: any): void => {
			this.vm_id = paramsId.id;
			this.getVmCondaLogs();
			this.getVmById();
			this.snapshotSearchTerm
				.pipe(
					debounceTime(this.DEBOUNCE_TIME),
					distinctUntilChanged(),
				)
				.subscribe((event: any): void => {
					this.validSnapshotName(event);
				});
		});
	}

	/**
	 * Check if the snapshot name is valid.
	 *
	 * @param e
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	validSnapshotName(event: any): any {
		this.snapshotNameCheckDone = false;
		this.imageService.checkSnapshotNameAvailable(this.snapshotName.trim(), this.virtualMachine.client.id)
			.subscribe((res: IResponseTemplate): void => {

				this.validSnapshotNameBool = this.snapshotName.length > 0 && res.value as boolean;
				this.snapshotNameCheckDone = true;
			});
	}

	/**
	 * Reset the snapshotDone to waiting.
	 */
	resetSnapshotResult(): void {
		this.snapshotDone = 'Waiting';
	}

	/**
	 * Check status of vm.
	 *
	 * @param vm instance
	 */
	checkStatus(): void {
		this.virtualmachineService.checkVmStatus(this.virtualMachine.openstackid)
			.subscribe((updated_vm: VirtualMachine): void => {

				this.virtualMachine = updated_vm;
			});
	}

	setVmNeeded(): void {
		this.virtualmachineService.setVmNeeded(this.virtualMachine.openstackid).subscribe((res: any): void => {
			if (res['still_needed']) {
				this.virtualMachine.still_used_confirmation_requested = false;

			}
		});
	}

	checkVmVolumesStatus(): void {

		this.virtualMachine.volumes.forEach((vol: Volume): void => {
			if (vol.volume_status !== VolumeStates.AVAILABLE
				&& vol.volume_status !== VolumeStates.NOT_FOUND && vol.volume_status !== VolumeStates.IN_USE) {

				this.check_status_loop_vol(vol);
			}
		});
	}

	check_status_loop_vol(volume: Volume, initial_timeout: number = this.checkStatusTimeout, final_state?: string, expected_storage?: number):
		void {
		const created: boolean = volume.volume_created_by_user;

		setTimeout(
			(): void => {
				const idx: number = this.virtualMachine.volumes.indexOf(volume);
				if (volume.volume_openstackid) {

					// eslint-disable-next-line consistent-return
					this.virtualmachineService.getVolumeById(volume.volume_openstackid).subscribe((vol: Volume): void => {
						if (expected_storage && vol.volume_storage !== expected_storage) {
							return this.check_status_loop_vol(volume, this.checkStatusTimeout, final_state, expected_storage);
						} else if (expected_storage && vol.volume_storage === expected_storage) {
							this.extendDone = true;
						}
						if (volume.error_msg !== '' && volume.error_msg !== undefined && volume.error_msg !== null) {
							vol.error_msg = volume.error_msg;
							setTimeout((): void => {
								vol.error_msg = null;
							}, 5000);
						}
						if (idx > -1) {
							vol.volume_created_by_user = created;
							this.virtualMachine.volumes[idx] = vol;
						}
						// tslint:disable-next-line:max-line-length
						if (this.VOLUME_END_STATES.indexOf(vol.volume_status) === -1 && final_state !== vol.volume_status) {
							this.check_status_loop_vol(this.virtualMachine.volumes[idx], this.checkStatusTimeout, final_state);
						}
					});
				} else {
					// tslint:disable-next-line:max-line-length
					this.virtualmachineService.getVolumeByNameAndVmName(volume.volume_name, volume.volume_virtualmachine.name)
						.subscribe((vol: Volume): void => {
							if (volume.error_msg !== '' && volume.error_msg !== undefined && volume.error_msg !== null) {
								vol.error_msg = volume.error_msg;
								setTimeout((): void => {
									vol.error_msg = null;
								}, 5000);
							}
							if (idx > -1) {
								vol.volume_created_by_user = created;
								this.virtualMachine.volumes[idx] = vol;
							}
							// tslint:disable-next-line:max-line-length
							if (vol.volume_status !== VolumeStates.AVAILABLE && vol.volume_status !== VolumeStates.NOT_FOUND
								&& vol.volume_status !== VolumeStates.IN_USE && vol.volume_status !== final_state) {
								this.check_status_loop_vol(this.virtualMachine.volumes[idx], this.checkStatusTimeout, final_state);
							}
						});

				}
			},
			initial_timeout,
		);
	}

	/**
	 * Delete VM.
	 *
	 * @param vm which will be deleted
	 */
	deleteVm(): void {
		this.virtualMachine.status = VirtualMachineStates.DELETING;
		this.virtualmachineService.deleteVM(this.virtualMachine.openstackid).subscribe(
			(updated_vm: VirtualMachine): void => {

				updated_vm.cardState = 0;
				this.virtualMachine = updated_vm;
				if (updated_vm.status === VirtualMachineStates.DELETED) {
					this.status_changed = 1;
				} else {
					this.status_changed = 2;
				}
			},
			(error1: any): void => {
				this.status_changed = 2;
				if (error1['status'] === 409) {
					this.error_msg = 'Conflict detected. The virtual machine is currently creating a snapshot and must not be altered.';
				}
				this.getVmById();
			},
		);
	}

	/**
	 * Subscription object to listen to different events.
	 */
	subscription: Subscription = new Subscription();

	/**
	 * Function to listen to modal results.
	 */
	subscribeToBsModalRef(): void {
		this.subscription.add(
			this.bsModalRef.content.event.subscribe(
				(result: any) => {
					if ('deleteVM' in result) {
						this.deleteVm();
						// } else if ('stopVM' in result) {
						// 	this.stopVM();
						// } else if ('resumeVM' in result) {
						// 	this.resumeVM();
						// } else if ('resume' in result) {
						// 	this.resumeCheckStatusTimer();
						// 	} else if ('snapshotVM' in result) {
						// 	this.createSnapshot(result['snapshotName'], result['description']);
						// } else if ('attachVolume' in result) {
						// 	this.attachVolume(result['volume']);
						// } else if ('detachVolume' in result) {
						// 	this.detachVolume(result['volume']);
						// } else if ('reboot_type' in result) {
						// 	this.rebootVM(result['reboot_type']);
					}
				},
			),
		);
	}

	/**
	 * Show deletion modal
	 */
	showDeleteModal(): void {
		const initialState = { virtualMachine: this.virtualMachine };

		this.bsModalRef = this.modalService.show(DeleteVmComponent, { initialState });
		this.bsModalRef.setClass('modal-lg');
		this.subscribeToBsModalRef();
	}

	getDetachedVolumesByVSelectedMProject(): void {
		this.virtualmachineService.getDetachedVolumesByProject(this.virtualMachine.projectid).subscribe(
			(detached_volumes: Volume[]): void => {
				this.detached_project_volumes = detached_volumes;
			},
		);
	}

	attachVolume(volume: Volume): void {
		const volume_status_backup: string = volume.volume_status;
		volume.volume_status = VolumeStates.ATTACHING;

		this.virtualmachineService.attachVolumetoServer(volume.volume_openstackid, this.virtualMachine.openstackid).subscribe(
			(result: IResponseTemplate): void => {

				if (result.value === 'attached') {
					this.getVmById();
				}
			},
			(error1: any): void => {
				this.status_changed = 2;
				if (error1['error']['error'] === '409') {
					this.volume_to_attach.error_msg = 'Conflict detected.'
						+ ' The virtual machine is currently creating a snapshot and must not be altered.';
					setTimeout((): void => {
						this.volume_to_attach.error_msg = null;
					}, 5000);
					this.error_msg = 'Conflict detected. The virtual machine is currently creating a snapshot and must not be altered.';
					volume.volume_status = volume_status_backup;
				}
			},
		);
	}

	detachVolume(volume: Volume): void {
		const volume_status_backup: string = volume.volume_status;
		volume.volume_status = VolumeStates.DETACHING;

		this.virtualmachineService.deleteVolumeAttachment(volume.volume_openstackid, this.virtualMachine.openstackid).subscribe(
			(result: any): void => {
				if (result.value === 'deleted') {
					this.getDetachedVolumesByVSelectedMProject();
					this.getVmById();

				}
			},
			(error1: any): void => {
				this.status_changed = 2;
				if (error1['error']['error'] === '409') {
					volume.error_msg = 'Conflict detected. The virtual machine is currently creating a snapshot and must not be altered.';
					setTimeout((): void => {
						volume.error_msg = null;
					}, 5000);
					this.error_msg = 'Conflict detected. The virtual machine is currently creating a snapshot and must not be altered.';
					volume.volume_status = volume_status_backup;
				}
			},
		);
	}

	/**
	 * Reboot a vm.
	 *
	 * @param vm which will be rebooted
	 * @param reboot_type HARD|SOFT
	 */
	public rebootVm(reboot_type: string): void {
		this.virtualmachineService.rebootVM(this.virtualMachine.openstackid, reboot_type).subscribe(
			(result: IResponseTemplate): void => {
				this.status_changed = 0;
				this.virtualMachine.cardState = 0;

				if (result.value as boolean) {
					this.status_changed = 1;
					this.check_status_loop_when_reboot();
				} else {
					this.status_changed = 2;
				}

			},
			(error1: any): void => {
				this.status_changed = 2;
				this.status_check_error = true;
				if (error1['error']['error'] === '409') {
					this.error_msg = 'Conflict detected. The virtual machine is currently creating a snapshot and must not be altered.';
				}
			},
		);
	}

	/**
	 * Check Status of vm in loop till final state is reached.
	 *
	 * @param vm
	 * @param final_state
	 * @param is_selected_vm If the vm should be the selected vm
	 */
	check_status_loop(final_state: string, is_selected_vm?: boolean, timeout: number = this.checkStatusTimeout): void {

		setTimeout(
			(): void => {
				if (this.virtualMachine.openstackid) {
					this.virtualmachineService.checkVmStatus(this.virtualMachine.openstackid).subscribe((updated_vm: VirtualMachine): void => {
						this.virtualMachine = updated_vm;
						this.virtualMachine.cardState = 0;

						if (updated_vm.status === final_state) {

							this.virtualMachine = updated_vm;

						} else {
							if (this.virtualMachine['error']) {
								this.status_check_error = true;

							}
							this.check_status_loop(final_state, is_selected_vm);
						}

					});
				} else {
					this.virtualmachineService.checkVmStatus(this.virtualMachine.name).subscribe((updated_vm: VirtualMachine): void => {
						this.virtualMachine = updated_vm;
						this.virtualMachine.cardState = 0;

						if (updated_vm.status === final_state) {

							this.virtualMachine = updated_vm;

						} else {
							if (this.virtualMachine['error']) {
								this.status_check_error = true;

							}
							this.check_status_loop(final_state, is_selected_vm);
						}

					});
				}
			},
			timeout,
		);
	}

	/**
	 * Check Status of vm in loop till active.
	 *
	 * @param vm
	 */
	check_status_loop_when_reboot(): void {

		setTimeout(
			(): void => {
				this.virtualmachineService.checkVmStatusWhenReboot(
					this.virtualMachine.openstackid,
				).subscribe((updated_vm: VirtualMachine): void => {

					if (updated_vm.status === VirtualMachineStates.ACTIVE) {
						this.reboot_done = true;
						this.virtualMachine = updated_vm;

					} else {
						if (this.virtualMachine['error']) {
							this.status_check_error = true;

						}
						this.check_status_loop_when_reboot();
					}

				});
			},
			this.checkStatusTimeout,
		);
	}

	/**
	 * Stop a vm.
	 *
	 * @param openstack_id of instance.
	 */
	stopVm(): void {
		this.virtualmachineService.stopVM(this.virtualMachine.openstackid)
			.subscribe(
				(updated_vm: VirtualMachine): void => {
					this.status_changed = 0;

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
				(error1: any): void => {
					this.status_changed = 2;
					if (error1['error']['error'] === '409') {
						this.error_msg = 'Conflict detected. The virtual machine is currently creating a snapshot and must not be altered.';
					}
				},
			);
	}

	checkVmTillActive(): void {
		if (this.virtualMachine.status !== VirtualMachineStates.ACTIVE
			&& this.virtualMachine.status !== VirtualMachineStates.SHUTOFF
			&& this.virtualMachine.status !== VirtualMachineStates.DELETED) {
			this.check_status_loop(VirtualMachineStates.ACTIVE);
		}
	}

	resumeVM(): void {
		this.virtualmachineService.resumeVM(this.virtualMachine.openstackid).subscribe(
			(updated_vm: VirtualMachine): void => {
				this.status_changed = 0;
				updated_vm.cardState = 0;
				this.virtualMachine = updated_vm;
				switch (updated_vm.status) {
					case VirtualMachineStates.ACTIVE:
						this.status_changed = 1;
						break;
					case VirtualMachineStates.POWERING_ON:
						this.check_status_loop(VirtualMachineStates.ACTIVE, true);
						break;
					default:
						this.status_changed = 2;
						break;

				}
			},
			(error1: any): void => {
				this.status_changed = 2;
				if (error1['error']['error'] === '409') {
					this.error_msg = 'Conflict detected. The virtual machine is currently creating a snapshot and must not be altered.';
				}
			},
		);
	}

	/**
	 * Create snapshot.
	 *
	 * @param snapshot_instance which is used for creating the snapshot
	 * @param snapshot_name name of the snapshot
	 */
	createSnapshot(snapshot_instance: string, snapshot_name: string, description?: string):
		void {
		this.imageService.createSnapshot(snapshot_instance, snapshot_name.trim(), description).subscribe(
			(newSnapshot: SnapshotModel): void => {
				if (newSnapshot.snapshot_openstackid) {
					this.snapshotDone = 'true';
					this.virtualMachine.status = VirtualMachineStates.IMAGE_PENDING_UPLOAD;
					this.check_status_loop(VirtualMachineStates.ACTIVE, null, 10000);

				} else {
					this.snapshotDone = 'error';
					this.check_status_loop(VirtualMachineStates.ACTIVE);

				}

			},
			(error1: any): void => {
				this.snapshotDone = 'error';
				this.status_changed = 2;
				if (error1['error']['error'] === '409') {
					this.error_msg = 'Conflict detected. The virtual machine is currently creating a snapshot and must not be altered.';
				}
			},
		);
	}

	/**
	 * Copies the content of the field it get's clicked on (e.g. ssh connection information).
	 *
	 * @param text the content of the field
	 */
	copyToClipboard(text: string): void {
		if (this.clipboardService.isSupported) {
			this.clipboardService.copy(text);
		}
	}

	/**
	 * Checks if the user visiting the detail-page is admin of the project
	 */
	checkVMAdminState(): void {
		this.userService.getMemberByUser().subscribe(
			(): void => {
				this.groupService.isLoggedUserGroupAdmin(this.virtualMachine.projectid).subscribe((result): any => {
					if (result['admin']) {
						this.is_project_admin = true;
					}
				});

			},
		);

	}

	getVmById(): void {
		this.virtualmachineService.getVmById(this.vm_id).subscribe(
			(vm: VirtualMachine): void => {
				vm = new VirtualMachine(vm);
				this.checkAndGetForcDetails(vm);
				this.title = vm['name'];
				this.virtualMachine = vm;
				this.checkVMAdminState();
				this.biocondaService.getTemplateNameByVmName(vm).subscribe((backend: Backend): void => {
					if (backend != null) {
						const template_name: string = backend.template;
						this.biocondaService.getForcTemplates(vm.client.id).subscribe((templates: any): void => {
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
				});
				this.getImageDetails(this.virtualMachine.projectid, this.virtualMachine.image);
				this.getDetachedVolumesByVSelectedMProject();
				this.checkVmVolumesStatus();
				this.isLoaded = true;
			},
		);
	}

	getImageDetails(project_id: number, name: string): Image {
		const newImage: Image = new Image();
		this.imageService.getImageByProjectAndName(project_id, name).subscribe(
			(image: Image): void => {
				this.image = image;
			},
			(): void => {
				this.isLoaded = false;
			},
		);

		return newImage;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	checkAndGetForcDetails(vm: VirtualMachine): void {
		// for (const mode of vm.modes) {
		//   if (TemplateNames.ALL_TEMPLATE_NAMES.indexOf(mode.name) !== -1) {
		//     checkForForc = false;
		//   }
		// }

		this.getUsersForBackend();

	}

	filterMembers(searchString: string): void {
		this.groupService.getFilteredMembersByProject(searchString, this.virtualMachine.projectid).subscribe((result: object): void => {
			this.filteredMembers = result;
		});
	}

	addUserToBackend(userId: any): void {
		this.biocondaService.addUserToBackend(this.vm_id, userId).subscribe((): void => {
			this.getUsersForBackend();
		});
	}

	getUsersForBackend(): void {
		this.biocondaService.getUsersForBackend(this.vm_id).subscribe((result: any): void => {
			this.backend_users = result;
		});
	}

	deleteUserFromBackend(userId: any): void {
		this.biocondaService.deleteUserFromBackend(this.vm_id, userId.toString()).subscribe((): void => {
			this.getUsersForBackend();
		});
	}
}
