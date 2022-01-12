import {
	Component, Input, Output, EventEmitter, OnDestroy, OnInit,
} from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { VirtualMachine } from '../virtualmachinemodels/virtualmachine';
import { VirtualMachineStates } from '../virtualmachinemodels/virtualmachinestates';
import { WIKI_GUACAMOLE_LINK, WIKI_RSTUDIO_LINK } from '../../../links/links';
import { TemplateNames } from '../conda/template-names';
import { StopVmComponent } from '../modals/stop-vm/stop-vm.component';
import { VirtualmachineService } from '../../api-connector/virtualmachine.service';
import { ResumeVmComponent } from '../modals/resume-vm/resume-vm.component';
import { DeleteVmComponent } from '../modals/delete-vm/delete-vm.component';
import { SnapshotModel } from '../snapshots/snapshot.model';
import { ImageService } from '../../api-connector/image.service';
import { SnapshotVmComponent } from '../modals/snapshot-vm/snapshot-vm.component';
import { VolumeVmComponent } from '../modals/volume-vm/volume-vm.component';
import { Volume } from '../volumes/volume';
import { IResponseTemplate } from '../../api-connector/response-template';
import { RebootVmComponent } from '../modals/reboot-vm/reboot-vm.component';

/**
 * Vm card component to be used by vm-overview. Holds information about a virtual machine.
 */
@Component({
	selector: 'app-vm-card',
	templateUrl: 'vmcard.component.html',
	styleUrls: ['./vmcard.component.scss'],
	providers: [ImageService],
})

export class VmCardComponent implements OnInit, OnDestroy {

	/**
	 * The virtual machine this card is for.
	 */
	@Input() vm: VirtualMachine;

	/**
	 * Possible virtual machine states.
	 */
	VirtualMachineStates: VirtualMachineStates = new VirtualMachineStates();

	/**
	 * Is the vm checked.
	 */
	is_checked: boolean = false;

	/**
	 * Eventemitter when the vm is checked/unchecked.
	 */
	@Output() check_change_event: EventEmitter<number> = new EventEmitter();

	/**
	 * Elixir id of the user.
	 */
	@Input() user_elixir_id: string = '';

	/**
	 * If the user is a vo admin.
	 */
	@Input() is_vo_admin: boolean = false;

	/**
	 * If the user is an admin of the group the vm belongs to.
	 */
	@Input() is_vm_admin: boolean = false;

	/**
	 * Link to rstudio wiki
	 */
	WIKI_RSTUDIO_LINK: string = WIKI_RSTUDIO_LINK;

	/**
	 * Link to guacamole wiki.
	 */
	WIKI_GUACAMOLE_LINK: string = WIKI_GUACAMOLE_LINK;

	/**
	 * Subscription object to listen to different events.
	 */
	subscription: Subscription = new Subscription();

	/**
	 * Modal reference to be changed/showed/hidden depending on chosen modal.
	 */
	bsModalRef: BsModalRef;

	/**
	 * Default wait time between status checks if no other value specified.
	 * @private
	 */
	private checkStatusTimeout: number = 5000;

	/**
	 * Default time in ms to show an error message if no other value specified.
	 */
	ERROR_TIMER: number = 10000;

	/**
	 * Error message to show if 409 status was returned, typically returned if vm is creating a snapshot.
	 */
	SNAPSHOT_CREATING_ERROR_MSG: string		= 'Conflict detected. The virtual machine is currently creating a snapshot and must not be altered.';

	/**
	 * Timeout object to control check status loop (i.e. stopping and starting check status loop).
	 */
	checkStatusTimer: ReturnType<typeof setTimeout>;

	constructor(
private clipboardService: ClipboardService,
							private modalService: BsModalService,
							private virtualmachineservice: VirtualmachineService,
							private imageService: ImageService,
	) {
		// eslint-disable-next-line no-empty-function
	}

	ngOnInit() {
		this.resumeCheckStatusTimer();
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.stopCheckStatusTimer();
	}

	/**
	 * Start the check status loop without arguments.
	 */
	resumeCheckStatusTimer(): void {
		this.check_status_loop();
	}

	/**
	 * Stop and clear the check status loop. Then resume it with a value between 1 second and 3 seconds.
	 */
	restartAndResumeCheckStatusTimer(): void {
		this.stopCheckStatusTimer();
		// so not all requests are at the same time for the vms
		const min: number = 1000;
		const max: number = 3000;
		this.check_status_loop(null, Math.floor(Math.random() * (max - min)) + min);
	}

	/**
	 * Stop and clear the check status loop.
	 */
	stopCheckStatusTimer(): void {
		if (this.checkStatusTimer) {
			clearTimeout(this.checkStatusTimer);
		}
	}

	/**
	 * Show stop modal.
	 */
	showStopModal(): void {
		this.stopCheckStatusTimer();
		const initialState = { virtualMachine: this.vm };

		this.bsModalRef = this.modalService.show(StopVmComponent, { initialState });
		this.bsModalRef.setClass('modal-lg');
		this.subscribeToBsModalRef();
	}

	/**
	 * Run function to stop a vm.
	 */
	stopVM(): void {
		this.subscription.add(
			this.virtualmachineservice.stopVM(this.vm.openstackid)
				.subscribe(
					(updated_vm: VirtualMachine): void => {
						updated_vm.cardState = 0;
						this.vm = updated_vm;
						if (this.vm.status === VirtualMachineStates.SHUTOFF) {
							this.resumeCheckStatusTimer();
						} else {
							this.check_status_loop(VirtualMachineStates.SHUTOFF);
						}
					},
					(error1: any): void => {
						if (error1['error']['error'] === '409') {
							this.vm.setErrorMsgWithTimeout(this.SNAPSHOT_CREATING_ERROR_MSG, this.ERROR_TIMER);
							this.resumeCheckStatusTimer();
						}
					},
				),
		);
	}

	/**
	 * Show attach/detach modal.
	 */
	showVolumeModal(mode: string): void {
		this.stopCheckStatusTimer();
		const initialState = { virtualMachine: this.vm, mode };

		this.bsModalRef = this.modalService.show(VolumeVmComponent, { initialState });
		this.bsModalRef.setClass('modal-lg');
		this.subscribeToBsModalRef();
	}

	/**
	 * Run function to attach a volume to a vm.
	 */
	attachVolume(volume: Volume): void {
		this.vm.status = VirtualMachineStates.GETTING_STATUS;
		this.subscription.add(
			this.virtualmachineservice.attachVolumetoServer(volume.volume_openstackid, this.vm.openstackid).subscribe(
				(result: IResponseTemplate): void => {
					if (result.value === 'attached') {
						this.vm.setMsgWithTimeout('Volume attached');
						this.check_status_loop(null, 1000);
					} else {
						this.vm.setErrorMsgWithTimeout('Volume not attached');
						this.resumeCheckStatusTimer();
					}
				},
				(error1: any): void => {
					if (error1['error']['error'] === '409') {
						this.vm.setErrorMsgWithTimeout(this.SNAPSHOT_CREATING_ERROR_MSG, this.ERROR_TIMER);
						this.resumeCheckStatusTimer();
					}
				},
			),
		);
	}

	/**
	 * Run function to detach a volume from a vm.
	 */
	detachVolume(volume: Volume): void {
		this.vm.status = VirtualMachineStates.GETTING_STATUS;
		this.subscription.add(
			this.virtualmachineservice.deleteVolumeAttachment(volume.volume_openstackid, this.vm.openstackid).subscribe(
				(result: any): void => {
					if (result.value === 'deleted') {
						this.vm.setMsgWithTimeout('Volume detached');
						this.check_status_loop(null, 1000);
					} else {
						this.vm.setErrorMsgWithTimeout('Volume not detached');
						this.resumeCheckStatusTimer();
					}
				},
				(error1: any): void => {
					if (error1['error']['error'] === '409') {
						this.vm.setErrorMsgWithTimeout(this.SNAPSHOT_CREATING_ERROR_MSG, this.ERROR_TIMER);
					}
				},
			),
		);
	}

	/**
	 * Show resume/restart modal.
	 */
	showRestartModal(): void {
		this.stopCheckStatusTimer();
		const initialState = { virtualMachine: this.vm };

		this.bsModalRef = this.modalService.show(ResumeVmComponent, { initialState });
		this.bsModalRef.setClass('modal-lg');
		this.subscribeToBsModalRef();
	}

	/**
	 * Run function to resume a shutoff vm.
	 */
	resumeVM(): void {
		this.subscription.add(
			this.virtualmachineservice.resumeVM(this.vm.openstackid).subscribe(
				(updated_vm: VirtualMachine): void => {
					updated_vm.cardState = 0;
					this.vm = updated_vm;
					if (this.vm.status === VirtualMachineStates.ACTIVE) {
						this.resumeCheckStatusTimer();
					} else {
						this.check_status_loop(VirtualMachineStates.ACTIVE);
					}
				},
				(error1: any): void => {
					if (error1['error']['error'] === '409') {
						this.vm.setErrorMsgWithTimeout(this.SNAPSHOT_CREATING_ERROR_MSG, this.ERROR_TIMER);
						this.resumeCheckStatusTimer();
					}
				},
			),
		);
	}

	/**
	 * Show hard/soft reboot modal.
	 */
	showRebootModal(): void {
		this.stopCheckStatusTimer();
		const initialState = { virtualMachine: this.vm };

		this.bsModalRef = this.modalService.show(RebootVmComponent, { initialState });
		this.bsModalRef.setClass('modal-lg');
		this.subscribeToBsModalRef();
	}

	/**
	 * Run function to soft/hard reboot a vm.
	 */
	rebootVM(reboot_type: string): void {
		this.vm.status = VirtualMachineStates.GETTING_STATUS;
		this.subscription.add(
			this.virtualmachineservice.rebootVM(this.vm.openstackid, reboot_type).subscribe(
				(result: IResponseTemplate): void => {
					this.vm.cardState = 0;
					if (result.value as boolean) {
						this.vm.setMsgWithTimeout('Reboot initiated', 2000);
						this.resumeCheckStatusTimer();
					} else {
						this.check_status_loop(VirtualMachineStates.ACTIVE);
					}
				},
				(error1: any): void => {
					if (error1['error']['error'] === '409') {
						this.vm.setErrorMsgWithTimeout(this.SNAPSHOT_CREATING_ERROR_MSG, this.ERROR_TIMER);
					}
				},
			),
		);
	}

	/**
	 * Show snapshot modal.
	 */
	showSnapshotModal(): void {
		this.stopCheckStatusTimer();
		const initialState = { virtualMachine: this.vm };

		this.bsModalRef = this.modalService.show(SnapshotVmComponent, { initialState });
		this.bsModalRef.setClass('modal-lg');
		this.subscribeToBsModalRef();
	}

	/**
	 * Run function to create a snapshot of a vm.
	 */
	createSnapshot(snapshot_name: string, description?: string): void {
		this.vm.setMsgWithTimeout('Queuing Snapshot...');
		const final_state: string = this.vm.status;
		this.vm.status = VirtualMachineStates.IMAGE_PENDING_UPLOAD;
		this.subscription.add(
			this.imageService.createSnapshot(this.vm.openstackid, snapshot_name.trim(), description).subscribe(
				(newSnapshot: SnapshotModel): void => {
					if (!newSnapshot.snapshot_openstackid) {
						this.vm.setErrorMsgWithTimeout('Error creating Snapshot', this.ERROR_TIMER);
					} else {
						const text: string = `Successfully queued Snapshot.<br>
							It might take some minutes till you can use it for starting a new instance at the "New Instance" tab.<br>
							You can see the current status in the <a routerLinkActive="active"
          [routerLink]="['/virtualmachines/snapshotOverview']">Snapshot Overview.</a>`;
						this.vm.setMsgWithTimeout(text, 30000);
					}
					this.check_status_loop(final_state, 15000);
				},
				(error1: any): void => {
					if (error1['error']['error'] === '409') {
						this.vm.setErrorMsgWithTimeout(this.SNAPSHOT_CREATING_ERROR_MSG, this.ERROR_TIMER);
						this.resumeCheckStatusTimer();
					}
				},
			),
		);
	}

	/**
	 * Show deletion modal
	 */
	showDeleteModal(): void {
		this.stopCheckStatusTimer();
		const initialState = { virtualMachine: this.vm };

		this.bsModalRef = this.modalService.show(DeleteVmComponent, { initialState });
		this.bsModalRef.setClass('modal-lg');
		this.subscribeToBsModalRef();
	}

	/**
	 * Run function to delete a vm.
	 */
	deleteVM(): void {
		this.is_checked = false;
		this.vm.status = VirtualMachineStates.DELETING;
		this.vm.cardState = 0;
		this.subscription.add(this.virtualmachineservice.deleteVM(this.vm.openstackid).subscribe(
			(updated_vm: VirtualMachine): void => {
				updated_vm.cardState = 0;

				if (updated_vm.status !== VirtualMachineStates.DELETED) {
					setTimeout(
						(): void => {
							this.deleteVM();
						},
						this.checkStatusTimeout,
					);
				} else {
					this.stopCheckStatusTimer();
					this.vm = updated_vm;
				}
			},
			(error1: any): void => {
				if (error1['status'] === 409) {
					this.vm.setErrorMsgWithTimeout(this.SNAPSHOT_CREATING_ERROR_MSG, this.ERROR_TIMER);
				}
			},
		));
	}

	/**
	 * Function to listen to modal results.
	 */
	subscribeToBsModalRef(): void {
		this.subscription.add(
			this.bsModalRef.content.event.subscribe(
				(result: any) => {
					if ('resume' in result) {
						this.resumeCheckStatusTimer();
					} else if ('stopVM' in result) {
						this.stopVM();
					} else if ('resumeVM' in result) {
						this.resumeVM();
					} else if ('deleteVM' in result) {
						this.deleteVM();
					} else if ('snapshotVM' in result) {
						this.createSnapshot(result['snapshotName'], result['description']);
					} else if ('attachVolume' in result) {
						this.attachVolume(result['volume']);
					} else if ('detachVolume' in result) {
						this.detachVolume(result['volume']);
					} else if ('reboot_type' in result) {
						this.rebootVM(result['reboot_type']);
					}
				},
			),
		);
	}

	/**
	 * Loop which checks status of a vm depending on its status. Will always stop the timer if it exists first.
	 */
	check_status_loop(final_state?: string, timeout: number = this.checkStatusTimeout): void {
		this.stopCheckStatusTimer();
		this.checkStatusTimer = setTimeout((): void => {
			this.subscription.add(this.virtualmachineservice.checkVmStatus(this.vm.openstackid, this.vm.name)
				.subscribe((updated_vm: VirtualMachine): void => {
					updated_vm.cardState = this.vm.cardState;
					if (this.vm.msg) {
						updated_vm.setMsgWithTimeout(this.vm.msg);
					}
					if (this.vm.error_msg) {
						updated_vm.setErrorMsgWithTimeout(this.vm.error_msg);
					}
					this.vm = updated_vm;
					if (final_state) {
						if (final_state === this.vm.status) {
							this.resumeCheckStatusTimer();
						} else {
							this.check_status_loop(final_state);
						}
					} else if (VirtualMachineStates.IN_PROCESS_STATES.indexOf(this.vm.status) !== -1) {
						this.check_status_loop();
					} else if (this.vm.status !== VirtualMachineStates.DELETED) {
						// so not all requests are at the same time for the vms
						const min: number = 20000;
						const max: number = 40000;
						this.check_status_loop(null, Math.floor(Math.random() * (max - min)) + max);
					}

				}));
		}, timeout);
	}

	/**
	 * Function called by parent if 'Select all' was clicked.
	 */
	toggleAllChecked(all_checked: boolean): void {
		if (this.vm.status === VirtualMachineStates.ACTIVE || this.vm.status === VirtualMachineStates.SHUTOFF) {
			this.is_checked = all_checked;
		} else {
			this.is_checked = false;
		}
	}

	/**
	 * Toggle checked status and notify parent.
	 */
	toggleChecked(): void {
		this.is_checked = !this.is_checked;
		if (this.is_checked) {
			this.check_change_event.emit(1);
		} else {
			this.check_change_event.emit(-1);
		}
	}

	/**
	 * Function to call by parent. Returns 1 if vm is active or shutoff, -1 otherwise.
	 */
	is_checkable(): number {
		if (this.vm.status === VirtualMachineStates.ACTIVE || this.vm.status === VirtualMachineStates.SHUTOFF) {
			return 1;
		} else {
			return -1;
		}
	}

	/**
	 * Function to call by parent. Returns 1 if vm is active or shutoff and checked, -1 otherwise.
	 */
	vm_is_checked(): number {
		if ((this.vm.status === VirtualMachineStates.ACTIVE || this.vm.status === VirtualMachineStates.SHUTOFF)
			&& this.is_checked) {
			return 1;
		} else {
			return -1;
		}
	}

	/**
	 * Copy some text to clipboard.
	 */
	copyToClipboard(text: string): void {
		if (this.clipboardService.isSupported) {
			this.clipboardService.copy(text);
		}
	}

	/**
	 * Show message in span that text was copied.
	 */
	showCopiedMessage(name: string): void {
		const span_id: string = `${name}resenvSpan`;
		const { innerHTML } = document.getElementById(span_id);
		document.getElementById(span_id).innerHTML = 'Copied URL!';
		setTimeout((): void => {
			document.getElementById(span_id).innerHTML = innerHTML;
		}, 1000);
	}

	/**
	 * Return false if resenv was not started by playbook (e.g. by Image instead).
	 */
	resenv_by_play(vm: VirtualMachine): boolean {
		for (const mode of vm.modes) {
			if (TemplateNames.ALL_TEMPLATE_NAMES.indexOf(mode.name) !== -1) {
				return false;
			}
		}

		return true;
	}
}
