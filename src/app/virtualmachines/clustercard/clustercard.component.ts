import {
	Component, EventEmitter, Input, OnDestroy, OnInit, Output,
} from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { Subscription } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { VirtualMachineStates } from '../virtualmachinemodels/virtualmachinestates';
import { VirtualmachineService } from '../../api-connector/virtualmachine.service';
import { ImageService } from '../../api-connector/image.service';
import { Clusterinfo, WorkerBatch } from '../clusters/clusterinfo';
import { DeleteClusterComponent } from '../modals/delete-cluster/delete-cluster.component';
import { PasswordClusterComponent } from '../modals/password-cluster/password-cluster.component';
import { ScaleClusterComponent } from '../modals/scale-cluster/scale-cluster.component';
import { SharedModal } from '../../shared/shared_modules/baseClass/shared-modal';
import { ResumeClusterComponent } from '../modals/resume-cluster/resume-cluster.component';
import { StopClusterComponent } from '../modals/stop-cluster/stop-cluster.component';

/**
 * Vm card component to be used by vm-overview. Holds information about a virtual machine.
 */
@Component({
	selector: 'app-cluster-card',
	templateUrl: 'clustercard.component.html',
	styleUrls: ['./clustercard.component.scss'],
	providers: [ImageService],
})

export class ClustercardComponent extends SharedModal implements OnInit, OnDestroy {

	SCALE_UP: string = 'scale_up';
	SCALE_DOWN: string = 'scale_down';
	SCALE_SUCCESS: string = 'scale_success';

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

	statusSubscription: Subscription = new Subscription();

	/**
	 * Modal reference to be changed/showed/hidden depending on chosen modal.
	 */
	// bsModalRef: BsModalRef;

	/**
	 * Default wait time between status checks if no other value specified.
	 * @private
	 */
	private checkStatusTimeout: number = 10000;

	/**
	 * Default time in ms to show an error message if no other value specified.
	 */
	ERROR_TIMER: number = 20000;

	/**
	 * Timeout object to control check status loop (i.e. stopping and starting check status loop).
	 */
	checkStatusTimer: ReturnType<typeof setTimeout>;
	/**
	 * Timeout object to control check status loop (i.e. stopping and starting check status loop).
	 */
	checkWorkerStatusTimer: ReturnType<typeof setTimeout>;

	constructor(
		private clipboardService: ClipboardService,
		modalService: BsModalService,
		private virtualmachineservice: VirtualmachineService,
	) {
		super(modalService);
	}

	ngOnInit() {
		this.check_status_loop();
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.statusSubscription.unsubscribe();
		this.stopAllCheckStatusTimer();
	}

	/**
	 * Stop and clear the check status loop.
	 */
	stopCheckStatusTimer(): void {
		if (this.checkStatusTimer) {
			clearTimeout(this.checkStatusTimer);
		}
		if (this.statusSubscription) {
			this.statusSubscription.unsubscribe();
		}
	}

	/**
	 * Stop and clear the worker check status loop.
	 */
	stopCheckWorkerStatusTimer(): void {
		if (this.checkWorkerStatusTimer) {
			clearTimeout(this.checkWorkerStatusTimer);
		}
		if (this.statusSubscription) {
			this.statusSubscription.unsubscribe();
		}
	}

	/**
	 * Stop and clear all check status loop.
	 */
	stopAllCheckStatusTimer(): void {
		this.stopCheckStatusTimer();
		this.stopCheckWorkerStatusTimer();
	}

	/**
	 * Show Cluster Resume modal
	 */
	showResumeModal(): void {
		const initialState = { cluster: this.cluster };

		this.bsModalRef = this.modalService.show(ResumeClusterComponent, { initialState });
		this.bsModalRef.setClass('modal-lg');
		this.subscribeToBsModalRef();
	}

	/**
	 * Show Cluster Stop modal
	 */
	showStopModal(): void {
		const initialState = { cluster: this.cluster };

		this.bsModalRef = this.modalService.show(StopClusterComponent, { initialState });
		this.bsModalRef.setClass('modal-lg');
		this.subscribeToBsModalRef();
	}

	/**
	 * Show deletion modal
	 */
	showDeleteModal(): void {
		this.stopAllCheckStatusTimer();
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
	showScaleModal(mode: string, msg?: string): void {
		this.hideCurrentModal();
		this.stopCheckStatusTimer();
		const initialState = { cluster: this.cluster, mode, msg };
		this.bsModalRef = this.modalService.show(ScaleClusterComponent, { initialState });
		this.bsModalRef.setClass('modal-xl');
		this.subscribeToBsModalRef();
	}

	scaleUpCluster(selectedBatch: WorkerBatch): void {
		const scale_up_count: number = selectedBatch.upscale_count;
		this.showNotificationModal('Upscaling Cluster', `Starting ${scale_up_count} additional workers..`, 'info');

		this.subscription.add(
			this.virtualmachineservice.scaleCluster(this.cluster.cluster_id, selectedBatch.flavor.name, selectedBatch.upscale_count)
				.subscribe((res: any): void => {
					selectedBatch.setNewScalingUpWorkerCount();
					this.cluster.password = res['password'];

					this.check_worker_count_loop();
					this.showScaleModal(this.SCALE_SUCCESS, `The start of ${scale_up_count} workers was successfully initiated. Remember to configure your cluster after the machines are active!'`);

				}),
		);

	}

	check_status_loop(): void {
		this.stopAllCheckStatusTimer();
		this.statusSubscription = new Subscription();
		this.checkStatusTimer = setTimeout(
			(): void => {
				this.statusSubscription.add(this.virtualmachineservice.getClusterInfo(this.cluster.cluster_id)
					.subscribe((updated_cluster: Clusterinfo): void => {
						const password: string = this.cluster.password;
						this.cluster = new Clusterinfo(updated_cluster);
						this.cluster.password = password;
						if (this.cluster.status !== 'Running' && this.cluster.status !== VirtualMachineStates.DELETING
							&& this.cluster.status !== VirtualMachineStates.DELETED) {
							this.check_status_loop();
						} else {
							this.check_worker_count_loop();
						}
					}));
			},
			this.checkStatusTimeout,
		);
	}

	check_worker_count_loop(): void {
		this.stopCheckWorkerStatusTimer();
		this.statusSubscription = new Subscription();
		this.checkWorkerStatusTimer = setTimeout(
			(): void => {
				this.statusSubscription.add(
					this.virtualmachineservice.getClusterInfo(this.cluster.cluster_id)
						.subscribe((updated_cluster: Clusterinfo): void => {
							const password: string = this.cluster.password;
							this.cluster = new Clusterinfo(updated_cluster);
							this.cluster.password = password;
							for (const batch of this.cluster.worker_batches) {
								if (batch.running_worker < batch.worker_count) {
									this.check_worker_count_loop();
									break;
								}
							}
						}),
				);
			},
			this.checkStatusTimeout,
		);
	}

	scaleDownCluster(cluster: Clusterinfo): void {
		this.cluster = cluster;
		let scale_down_count: number = 0;

		const scale_down_batches: any = [];
		this.cluster.worker_batches.forEach((batch: WorkerBatch): void => {
			if (batch.delete_count > 0) {
				scale_down_batches.push({ worker_flavor_name: batch.flavor.name, downscale_count: batch.delete_count });
				scale_down_count += batch.delete_count;
			}
		});
		let msg: string = 'Scaling Down Batches: ';
		for (const batch of scale_down_batches) {
			msg += ` \n[Batch with Flavor ${batch.worker_flavor_name} by ${batch.downscale_count} instances ]`;
		}
		this.showNotificationModal('Scaling Down', msg, 'info');

		this.subscription.add(
			this.virtualmachineservice.scaleDownCluster(this.cluster.cluster_id, scale_down_batches).subscribe((res: any): void => {
				this.cluster.password = res['password'];

				this.cluster.setScaleDownBatchesCount();

				this.cluster.instances_count -= scale_down_count;
				this.showScaleModal(this.SCALE_SUCCESS, 'Successfully Scaled Down!');

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

	resumeCluster(): void {
		this.cluster.status = VirtualMachineStates.POWERING_ON;
		this.subscription.add(this.virtualmachineservice.resumeCluster(this.cluster.cluster_id).subscribe((): void => {
			this.check_status_loop();
		}));
	}

	stopCluster(): void {
		this.cluster.status = VirtualMachineStates.POWERING_OFF;
		this.subscription.add(this.virtualmachineservice.stopCluster(this.cluster.cluster_id).subscribe((): void => {
			this.check_status_loop();
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
					} else if ('scaleUpCluster' in result) {
						this.scaleUpCluster(result['selectedBatch']);
					} else if ('resumeCluster' in result) {
						this.resumeCluster();
					} else if ('stopCluster' in result) {
						this.stopCluster();
					} else {
						this.check_status_loop();
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
