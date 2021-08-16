import {
	Component, EventEmitter, Input, OnDestroy, OnInit, Output,
} from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { VirtualMachineStates } from '../virtualmachinemodels/virtualmachinestates';
import { VirtualmachineService } from '../../api-connector/virtualmachine.service';
import { ImageService } from '../../api-connector/image.service';
import { Clusterinfo, WorkerBatch } from '../clusters/clusterinfo';
import { DeleteClusterComponent } from '../modals/delete-cluster/delete-cluster.component';
import { PasswordClusterComponent } from '../modals/password-cluster/password-cluster.component';
import { ScaleClusterComponent } from '../modals/scale-cluster/scale-cluster.component';

/**
 * Vm card component to be used by vm-overview. Holds information about a virtual machine.
 */
@Component({
	           selector: 'app-cluster-card',
	           templateUrl: 'clustercard.component.html',
	           styleUrls: ['./clustercard.component.scss'],
	           providers: [ImageService],
})

export class ClustercardComponent implements OnInit, OnDestroy {

	SCALE_UP: string = 'scale_up';
	SCALE_DOWN: string = 'scale_down';

	/**
	 * The virtual machine this card is for.
	 */
	@Input() cluster: Clusterinfo;

	/**
	 * Possible virtual machine states.
	 */
	VirtualMachineStates: VirtualMachineStates = new VirtualMachineStates();

	/**
	 * Is the vm checked.
	 */
	is_checked: boolean = false;

	/**
	 * If connection info are shown.
	 */
	show_connection_info: boolean = false;

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
	 * If the user is an admin of the group the cluster belongs to.
	 */
	@Input() is_cluster_admin: boolean = false;

	/**
	 * Subscription objcet to listen to different events.
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
	 * Timeout object to control check status loop (i.e. stopping and starting check status loop).
	 */
	checkStatusTimer: ReturnType<typeof setTimeout>;

	constructor(private clipboardService: ClipboardService,
	            private modalService: BsModalService,
	            private virtualmachineservice: VirtualmachineService,
	            private imageService: ImageService) {
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
		// this.check_status_loop();
	}

	/**
	 * Stop and clear the check status loop. Then resume it with a value between 1 second and 3 seconds.
	 */
	restartAndResumeCheckStatusTimer(): void {
		this.stopCheckStatusTimer();
		// so not all requests are at the same time for the vms
		const min: number = 1000;
		const max: number = 3000;
		// this.check_status_loop(null, Math.floor(Math.random() * (max - min)) + min);
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
	 * Show deletion modal
	 */
	showDeleteModal(): void {
		this.stopCheckStatusTimer();
		const initialState = { cluster: this.cluster };

		this.bsModalRef = this.modalService.show(DeleteClusterComponent, { initialState });
		this.bsModalRef.setClass('modal-lg');
		this.subscribeToBsModalRef();
	}

	/**
	 * Show password modal
	 */
	showPasswordModal(): void {
		this.stopCheckStatusTimer();
		const initialState = { cluster: this.cluster };

		this.bsModalRef = this.modalService.show(PasswordClusterComponent, { initialState });
		this.bsModalRef.setClass('modal-lg');
		this.subscribeToBsModalRef();
	}

	/**
	 * Show password modal
	 */
	showScaleModal(mode: string): void {
		this.stopCheckStatusTimer();
		const initialState = { cluster: this.cluster, mode };

		this.bsModalRef = this.modalService.show(ScaleClusterComponent, { initialState });
		this.bsModalRef.setClass('modal-lg');
		this.subscribeToBsModalRef();
	}

	scaleUpCluster(selectedBatch): void {

	}

	scaleDownCluster(cluster: Clusterinfo): void {
		this.cluster = cluster;
		let scale_down_count: number = 0;

		const scale_down_batches: WorkerBatch[] = [];
		this.cluster.worker_batches.forEach((batch: WorkerBatch): void => {
			if (batch.delete_count > 0) {
				scale_down_batches.push(batch);
				scale_down_count += batch.delete_count;
			}
		});
		let msg: string = 'Scaling Down Batches: ';
		for (const batch of scale_down_batches) {
			msg += ` \n[Batch ${batch.index} by ${batch.delete_count} instances ]`;
		}

		this.subscription.add(
			this.virtualmachineservice.scaleDownCluster(this.cluster.cluster_id, scale_down_batches).subscribe((res: any): void => {
				this.cluster.password = res['password'];

				this.cluster.setScaleDownBatchesCount();

				this.cluster.instances_count -= scale_down_count;

			}),
		);
	}

	/**
	 * Run function to delete a cluster.
	 */
	deleteCluster(): void {
		this.cluster.status = VirtualMachineStates.DELETING;
		this.subscription.add(this.virtualmachineservice.deleteCluster(this.cluster.cluster_id).subscribe((): void => {
			this.cluster.status = VirtualMachineStates.DELETED;
		}));
	}

	/**
	 * Function to listen to modal results.
	 */
	subscribeToBsModalRef(): void {
		this.subscription.add(
			this.bsModalRef.content.event.subscribe(
				(result: any) => {
					if ('deleteCluster' in result) {
						this.deleteCluster();
					} else if ('scaleDownCluster' in result) {
						this.scaleDownCluster(result['cluster']);
					}
				},
			),
		);
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

}
