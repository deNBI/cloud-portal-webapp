import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Clusterinfo } from '../../clusters/clusterinfo';
import { VirtualMachineStates } from '../../virtualmachinemodels/virtualmachinestates';

@Component({
	selector: 'app-rename-cluster',
	templateUrl: '../rename-cluster/rename-cluster.component.html',
})
export class RenameClusterComponent implements OnDestroy {
	/**
	 * Possible virtual machine states.
	 */
	VirtualMachineStates: VirtualMachineStates = new VirtualMachineStates();

	cluster: Clusterinfo;
	all_loaded: boolean = true;
	public event: EventEmitter<any> = new EventEmitter();
	private submitted: boolean = false;

	constructor(public bsModalRef: BsModalRef) {
		// eslint-disable-next-line no-empty-function
	}

	renameCluster(name: string): void {
		this.submitted = true;
		this.event.emit({ new_name: name });
		this.bsModalRef.hide();
	}

	ngOnDestroy() {
		if (!this.submitted) {
			this.event.emit({ resume: true });
		}
	}
}
