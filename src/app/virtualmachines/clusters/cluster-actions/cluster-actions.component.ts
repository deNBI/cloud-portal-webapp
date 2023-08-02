import {
	Component, EventEmitter, Input, OnDestroy, Output,
} from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { CLOUD_PORTAL_SUPPORT_MAIL } from '../../../../links/links';
import { Clusterinfo, WorkerBatch } from '../clusterinfo';
import { VirtualMachineStates } from '../../virtualmachinemodels/virtualmachinestates';
import { ResumeClusterComponent } from '../../modals/resume-cluster/resume-cluster.component';
import { StopClusterComponent } from '../../modals/stop-cluster/stop-cluster.component';
import { DeleteClusterComponent } from '../../modals/delete-cluster/delete-cluster.component';
import { RenameClusterComponent } from '../../modals/rename-cluster/rename-cluster.component';
import { PasswordClusterComponent } from '../../modals/password-cluster/password-cluster.component';
import { ScaleClusterComponent } from '../../modals/scale-cluster/scale-cluster.component';
import { VirtualmachineService } from '../../../api-connector/virtualmachine.service';
import { NotificationModalComponent } from '../../../shared/modal/notification-modal';

@Component({
	selector: 'app-cluster-actions',
	templateUrl: './cluster-actions.component.html',
	styleUrls: ['./cluster-actions.component.scss'],
})
export class ClusterActionsComponent implements OnDestroy {
	@Input() cluster: Clusterinfo;
	bsModalRef: BsModalRef;
	subscription: Subscription = new Subscription();
	SCALE_UP: string = 'scale_up';
	SCALE_DOWN: string = 'scale_down';
	SCALE_SUCCESS: string = 'scale_success';
	show_connection_info: boolean = false;

	VirtualMachineStates: VirtualMachineStates = new VirtualMachineStates();
	@Output() readonly stopStatusLoop: EventEmitter<void> = new EventEmitter();
	@Output() readonly startStatusLoop: EventEmitter<void> = new EventEmitter();

	protected readonly CLOUD_PORTAL_SUPPORT_MAIL = CLOUD_PORTAL_SUPPORT_MAIL;

	constructor(
		private clipboardService: ClipboardService,
		private modalService: BsModalService,
		private virtualmachineservice: VirtualmachineService,
	) {}

	copyToClipboard(text: string): void {
		if (this.clipboardService.isSupported) {
			this.clipboardService.copy(text);
		}
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		//	this.statusSubscription.unsubscribe();
		//	this.stopAllCheckStatusTimer();
	}

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

	showDeleteModal(): void {
		//		this.stopAllCheckStatusTimer();
		// const all_loaded: boolean = this.get_all_batches_loaded();
		const initialState = { cluster: this.cluster };

		this.bsModalRef = this.modalService.show(DeleteClusterComponent, { initialState });
		this.bsModalRef.setClass('modal-lg');
		this.subscribeToBsModalRef();
	}

	/**
	 * Show rename modal
	 */
	showRenameModal(): void {
		//		this.stopAllCheckStatusTimer();
		//		const all_loaded: boolean = this.get_all_batches_loaded();
		const initialState = { cluster: this.cluster };

		this.bsModalRef = this.modalService.show(RenameClusterComponent, { initialState });
		this.bsModalRef.setClass('modal-lg');
		this.subscribeToBsModalRef();
	}

	showPasswordModal(): void {
		//	this.stopCheckStatusTimer();
		const initialState = { cluster: this.cluster };

		this.bsModalRef = this.modalService.show(PasswordClusterComponent, { initialState });
		this.bsModalRef.setClass('modal-lg');
		this.subscribeToBsModalRef();
	}

	showScaleModal(mode: string, msg?: string): void {
		this.hideCurrentModal();
		//	this.stopCheckStatusTimer();
		const initialState = { cluster: this.cluster, mode, msg };
		this.bsModalRef = this.modalService.show(ScaleClusterComponent, { initialState });
		this.bsModalRef.setClass('modal-xl');
		this.subscribeToBsModalRef();
	}

	hideCurrentModal() {
		if (this.bsModalRef) {
			this.modalService.hide(this.bsModalRef.id);
		}
	}

	stopCluster(): void {
		this.stopStatusLoop.emit();

		this.cluster.status = VirtualMachineStates.POWERING_OFF;
		this.subscription.add(
			this.virtualmachineservice.stopCluster(this.cluster.cluster_id).subscribe((): void => {
				this.cluster.status === VirtualMachineStates.POWERING_OFF;
				this.startStatusLoop.emit();
			}),
		);
	}

	renameCluster(name: string): void {
		this.stopStatusLoop.emit();

		this.subscription.add(
			this.virtualmachineservice.renameCluster(this.cluster.cluster_id, name).subscribe((cl: Clusterinfo): void => {
				this.cluster.name = cl.name;
				this.startStatusLoop.emit();
			}),
		);
	}

	deleteCluster(): void {
		this.stopStatusLoop.emit();

		this.cluster.status = VirtualMachineStates.DELETING;
		this.subscription.add(
			this.virtualmachineservice.deleteCluster(this.cluster.cluster_id).subscribe((): void => {
				this.cluster.status = VirtualMachineStates.DELETED;
				this.startStatusLoop.emit();
			}),
		);
	}

	resumeCluster(): void {
		this.stopStatusLoop.emit();
		this.cluster.status = VirtualMachineStates.POWERING_ON;
		this.subscription.add(
			this.virtualmachineservice.resumeCluster(this.cluster.cluster_id).subscribe((): void => {
				this.startStatusLoop.emit();
			}),
		);
	}

	showNotificationModal(
		notificationModalTitle: string,
		notificationModalMessage: string,
		notificationModalType: string,
	) {
		const initialState = { notificationModalTitle, notificationModalType, notificationModalMessage };
		if (this.bsModalRef) {
			this.bsModalRef.hide();
		}

		this.bsModalRef = this.modalService.show(NotificationModalComponent, { initialState });
		this.bsModalRef.setClass('modal-lg');
	}

	scaleDownCluster(cluster: Clusterinfo): void {
		this.stopStatusLoop.emit();

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
			this.virtualmachineservice
				.scaleDownCluster(this.cluster.cluster_id, scale_down_batches)
				.subscribe((res: any): void => {
					this.cluster.password = res['password'];

					this.cluster.setScaleDownBatchesCount();

					this.cluster.instances_count -= scale_down_count;
					this.startStatusLoop.emit();
					this.showScaleModal(this.SCALE_SUCCESS, 'Successfully Scaled Down!');
				}),
		);
	}

	scaleUpCluster(selectedBatch: WorkerBatch): void {
		this.stopStatusLoop.emit();

		const scale_up_count: number = selectedBatch.upscale_count;
		this.showNotificationModal('Upscaling Cluster', `Starting ${scale_up_count} additional workers..`, 'info');

		this.subscription.add(
			this.virtualmachineservice
				.scaleCluster(
					this.cluster.cluster_id,
					encodeURIComponent(selectedBatch.flavor.name),
					selectedBatch.upscale_count,
				)
				.subscribe((res: any): void => {
					selectedBatch.setNewScalingUpWorkerCount();
					this.cluster.password = res['password'];
					this.startStatusLoop.emit();

					this.showScaleModal(
						this.SCALE_SUCCESS,
						`The start of ${scale_up_count} workers was successfully initiated. Remember to configure your cluster after the machines are active!'`,
					);
				}),
		);
	}

	subscribeToBsModalRef(): void {
		this.subscription.add(
			this.bsModalRef.content.event.subscribe((result: any) => {
				if ('new_name' in result) {
					this.renameCluster(result['new_name']);
				} else if ('deleteCluster' in result) {
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
					//	this.check_status_loop();
				}
			}),
		);
	}
}
