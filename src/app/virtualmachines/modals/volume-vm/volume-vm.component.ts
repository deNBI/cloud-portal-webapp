import {
	Component, EventEmitter, OnDestroy, OnInit,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { VirtualMachine } from '../../virtualmachinemodels/virtualmachine';
import { WIKI_VOLUME_OVERVIEW } from '../../../../links/links';
import { Volume } from '../../volumes/volume';
import { VirtualmachineService } from '../../../api-connector/virtualmachine.service';

@Component({
	selector: 'app-volume-vm',
	templateUrl: './volume-vm.component.html',
	providers: [VirtualmachineService],
})
export class VolumeVmComponent implements OnInit, OnDestroy {

	virtualMachine: VirtualMachine;
	selectedVolume: Volume;
	detached_project_volumes: Volume[] = [];
	public event: EventEmitter<any> = new EventEmitter();
	private subscription: Subscription = new Subscription();
	private submitted: boolean = false;
	WIKI_VOLUME_OVERVIEW: string = WIKI_VOLUME_OVERVIEW;
	attach: boolean = false;
	detach: boolean = false;
	mode: string = '';

	constructor(public bsModalRef: BsModalRef, private virtualmachineservice: VirtualmachineService) {
		// eslint-disable-next-line no-empty-function
	}

	attachVolume(): void {
		this.submitted = true;
		this.event.emit({ attachVolume: true, volume: this.selectedVolume });
		this.bsModalRef.hide();
	}

	detachVolume(): void {
		this.submitted = true;
		this.event.emit({ detachVolume: true, volume: this.selectedVolume });
		this.bsModalRef.hide();
	}

	ngOnInit(): void {
		if (this.mode === 'attach') {
			this.subscription.add(
				this.virtualmachineservice.getDetachedVolumesByProject(this.virtualMachine.projectid).subscribe(
					(detached_volumes: Volume[]): void => {
						this.detached_project_volumes = detached_volumes;
					},
				),
			);
			this.attach = true;
		} else if (this.mode === 'detach') this.detach = true;
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		if (!this.submitted) {
			this.event.emit({ resume: true });
		}
	}

}
