import {
	Component, EventEmitter, OnDestroy,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Clusterinfo } from '../../clusters/clusterinfo';

@Component({
	selector: 'app-resume-cluster',
	templateUrl: './resume-cluster.component.html',
})
export class ResumeClusterComponent implements OnDestroy {

	cluster: Clusterinfo;
	public event: EventEmitter<any> = new EventEmitter();
	private submitted: boolean = false;

	constructor(public bsModalRef: BsModalRef) {
		// eslint-disable-next-line no-empty-function
	}

	resumeCluster(): void {
		this.submitted = true;
		this.event.emit({ resumeCluster: true });
		this.bsModalRef.hide();
	}

	ngOnDestroy() {
		if (!this.submitted) {
			this.event.emit({ resume: true });
		}
	}

}
