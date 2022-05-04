import {
	Component, EventEmitter, OnDestroy, OnInit,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { VirtualMachine } from '../../virtualmachinemodels/virtualmachine';
import { SnapshotModel } from '../../snapshots/snapshot.model';
import { IResponseTemplate } from '../../../api-connector/response-template';
import { ImageService } from '../../../api-connector/image.service';
import { VirtualMachineStates } from '../../virtualmachinemodels/virtualmachinestates';

@Component({
	selector: 'app-snapshot-vm',
	templateUrl: './snapshot-vm.component.html',
	providers: [ImageService],
})
export class SnapshotVmComponent implements OnDestroy, OnInit {
	virtualMachine: VirtualMachine;
	public event: EventEmitter<any> = new EventEmitter();
	private submitted: boolean = false;
	SNAPSHOT_MAX_RAM: number = SnapshotModel.MAX_RAM;
	snapshotSearchTerm: Subject<string> = new Subject<string>();
	subscription: Subscription = new Subscription();
	DEBOUNCE_TIME: number = 300;
	validSnapshotNameBool: boolean;
	snapshotNameCheckDone: boolean = false;
	snapshotName: string = '';
	VirtualMachineStates: VirtualMachineStates = new VirtualMachineStates();

	constructor(public bsModalRef: BsModalRef, private imageService: ImageService) {
		// eslint-disable-next-line no-empty-function
	}

	snapshotVM(description: any): void {
		this.submitted = true;
		this.event.emit({ snapshotVM: true, snapshotName: this.snapshotName, description });
		this.bsModalRef.hide();
	}

	validSnapshotName(): any {
		this.snapshotNameCheckDone = false;
		this.imageService
			.checkSnapshotNameAvailable(this.snapshotName.trim(), this.virtualMachine.client.id)
			.subscribe((res: IResponseTemplate): void => {
				this.validSnapshotNameBool = this.snapshotName.length > 0 && (res.value as boolean);
				this.snapshotNameCheckDone = true;
			});
	}

	ngOnInit() {
		this.subscription.add(
			this.snapshotSearchTerm.pipe(debounceTime(this.DEBOUNCE_TIME), distinctUntilChanged()).subscribe((): void => {
				this.validSnapshotName();
			}),
		);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		if (!this.submitted) {
			this.event.emit({ resume: true });
		}
	}
}
