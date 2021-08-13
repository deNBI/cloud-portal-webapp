import {
	Component, EventEmitter, OnDestroy,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { VirtualMachine } from '../../virtualmachinemodels/virtualmachine';

@Component({
	selector: 'app-delete-vm',
	templateUrl: './delete-vm.component.html',
})
export class DeleteVmComponent implements OnDestroy {

	virtualMachine: VirtualMachine;
	public event: EventEmitter<any> = new EventEmitter();
	private submitted: boolean = false;

	constructor(public bsModalRef: BsModalRef) {
		// eslint-disable-next-line no-empty-function
	}

	deleteVM(): void {
		this.submitted = true;
		this.event.emit({ deleteVM: true });
		this.bsModalRef.hide();
	}

	ngOnDestroy() {
		if (!this.submitted) {
			this.event.emit({ resume: true });
		}
	}

}
