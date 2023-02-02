import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { VirtualMachine } from '../../virtualmachinemodels/virtualmachine';
import { VirtualMachineStates } from '../../virtualmachinemodels/virtualmachinestates';
import { WIKI_MOUNT_VOLUME } from '../../../../links/links';

@Component({
	selector: 'app-reboot-vm',
	templateUrl: './reboot-vm.component.html',
})
export class RebootVmComponent implements OnDestroy {
	virtualMachine: VirtualMachine;
	VirtualMachineStates: VirtualMachineStates = new VirtualMachineStates();
	public event: EventEmitter<any> = new EventEmitter();
	private submitted: boolean = false;
	choosingType: boolean = true;
	confirm: boolean = false;
	reboot_type: string = '';

	WIKI_MOUNT_VOLUME: string = WIKI_MOUNT_VOLUME;

	constructor(public bsModalRef: BsModalRef) {
		// eslint-disable-next-line no-empty-function
	}

	rebootVm(): void {
		this.submitted = true;
		this.event.emit({ reboot_type: this.reboot_type });
		this.bsModalRef.hide();
	}

	softRebootShow(): void {
		this.choosingType = false;
		this.confirm = true;
		this.reboot_type = 'SOFT';
	}

	hardRebootShow(): void {
		this.choosingType = false;
		this.confirm = true;
		this.reboot_type = 'HARD';
	}

	ngOnDestroy() {
		if (!this.submitted) {
			this.event.emit({ resume: true });
		}
	}
}
