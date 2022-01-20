import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Clusterinfo } from '../../clusters/clusterinfo';
import { VirtualMachineStates } from '../../virtualmachinemodels/virtualmachinestates';

@Component({
	selector: 'app-delete-cluster',
	templateUrl: '../delete-cluster/delete-cluster.component.html',
})
export class DeleteClusterComponent implements OnDestroy {

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

	deleteCluster(): void {
		this.submitted = true;
		this.event.emit({ deleteCluster: true });
		this.bsModalRef.hide();
	}

	ngOnDestroy() {
		if (!this.submitted) {
			this.event.emit({ resume: true });
		}
	}

}
