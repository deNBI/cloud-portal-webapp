import {
	Component, EventEmitter, OnDestroy,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { VirtualMachine } from '../../virtualmachinemodels/virtualmachine';
import { elixir_id } from '../../../shared/globalvar';

@Component({
	selector: 'app-delete-vm',
	templateUrl: './delete-vm.component.html',
})
export class DeleteVmComponent implements OnDestroy {

	virtualMachine: VirtualMachine;
	public event: EventEmitter<any> = new EventEmitter();
	private submitted: boolean = false;
	user_elixir_id: string = elixir_id;

	/**
	 * To check if the user agreed to deleting someone else's VM
	 */
	delete_foreign_vm: boolean = false;

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
