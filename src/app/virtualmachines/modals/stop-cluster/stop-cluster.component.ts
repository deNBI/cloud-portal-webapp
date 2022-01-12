import {
	Component, EventEmitter,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Clusterinfo } from '../../clusters/clusterinfo';

@Component({
	selector: 'app-cluster-vm',
	templateUrl: './stop-cluster.component.html',
})
export class StopClusterComponent {

	cluster: Clusterinfo;
	public event: EventEmitter<any> = new EventEmitter();
	private submitted: boolean = false;

	constructor(public bsModalRef: BsModalRef) {
		// eslint-disable-next-line no-empty-function
	}

	stopCluster(): void {
		this.submitted = true;
		this.event.emit({ stopCluster: true });
		this.bsModalRef.hide();
	}

}
