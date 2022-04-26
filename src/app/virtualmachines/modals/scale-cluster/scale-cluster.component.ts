import {
	Component, EventEmitter, OnDestroy, OnInit,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ClipboardService } from 'ngx-clipboard';
import { Subscription } from 'rxjs';
import { Clusterinfo, WorkerBatch } from '../../clusters/clusterinfo';
import { VirtualMachineStates } from '../../virtualmachinemodels/virtualmachinestates';
import { SCALE_SCRIPT_LINK } from '../../../../links/links';
import { Flavor } from '../../virtualmachinemodels/flavor';
import { ApplicationRessourceUsage } from '../../../applications/application-ressource-usage/application-ressource-usage';
import { FlavorService } from '../../../api-connector/flavor.service';
import { GroupService } from '../../../api-connector/group.service';

@Component({
	selector: 'app-scale-cluster',
	templateUrl: './scale-cluster.component.html',
	providers: [FlavorService, GroupService],
})
export class ScaleClusterComponent implements OnDestroy, OnInit {
	/**
	 * Possible virtual machine states.
	 */
	VirtualMachineStates: VirtualMachineStates = new VirtualMachineStates();
	private subscription: Subscription = new Subscription();

	scaling_warning_read: boolean = false;
	SCALING_SCRIPT_LINK: string = SCALE_SCRIPT_LINK;
	SCALING_SCRIPT_NAME: string = 'scaling.py';
	scale_down: boolean = false;
	scale_up: boolean = false;
	scale_success: boolean = false;
	projectDataLoaded: boolean = false;
	selectedBatch: WorkerBatch;
	scale_down_count: number = 0;
	scale_up_worker_count: number;
	created_new_batch: boolean = false;
	flavors: Flavor[] = [];
	flavors_usable: Flavor[] = [];
	flavors_loaded: boolean = false;
	selectedProjectRessources: ApplicationRessourceUsage;
	max_scale_up_count: number = 0;
	max_scale_up_count_loaded: boolean = false;
	mode: string;
	msg: string;

	cluster: Clusterinfo;
	old_cluster: Clusterinfo;
	public event: EventEmitter<any> = new EventEmitter();
	private submitted: boolean = false;

	// eslint-disable-next-line max-len
	constructor(
		public bsModalRef: BsModalRef,
		private clipboardService: ClipboardService,
		private flavorService: FlavorService,
		private groupService: GroupService,
	) {
		// eslint-disable-next-line no-empty-function
	}

	ngOnInit(): void {
		if (this.mode === 'scale_up') {
			this.scale_up = true;
			this.calcRess();
		} else if (this.mode === 'scale_down') {
			this.scale_down = true;
		} else if (this.mode === 'scale_success') {
			this.scale_success = true;
		}
	}

	/**
	 * Copy some text to clipboard.projectDataLoaded
	 */
	copyToClipboard(text: string): void {
		if (this.clipboardService.isSupported) {
			this.clipboardService.copy(text);
		}
	}

	checkDelCount(batch: WorkerBatch): void {
		if (batch.delete_count > batch.worker_count) {
			batch.delete_count = batch.worker_count;
		}
		this.scale_down_count = 0;

		this.cluster.worker_batches.forEach((bat: WorkerBatch): void => {
			if (bat.delete_count > 0) {
				this.scale_down_count += bat.delete_count;
			}
		});
	}

	loadProjectRessource(): void {
		this.projectDataLoaded = false;
		this.flavors_loaded = false;

		this.flavors = [];
		this.subscription.add(
			this.groupService.getGroupResources(this.cluster.project_id).subscribe((res: ApplicationRessourceUsage): void => {
				this.selectedProjectRessources = new ApplicationRessourceUsage(res);
				this.getFlavors(this.cluster.project_id);
				this.projectDataLoaded = true;
			}),
		);
	}

	checkUpCount(batch: WorkerBatch): void {
		if (batch.upscale_count > batch.max_scale_up_count) {
			batch.upscale_count = batch.max_scale_up_count;
		}
	}

	calcRess(): void {
		this.max_scale_up_count_loaded = false;

		// tslint:disable-next-line:max-line-length
		this.subscription.add(
			this.groupService
				.getGroupResources(this.cluster.master_instance.projectid.toString())
				.subscribe((res: ApplicationRessourceUsage): void => {
					this.selectedProjectRessources = new ApplicationRessourceUsage(res);
					for (const workerBatch of this.cluster.worker_batches) {
						workerBatch.max_scale_up_count = this.selectedProjectRessources.calcMaxScaleUpWorkerInstancesByFlavor(
							workerBatch.flavor,
						);
					}
					this.max_scale_up_count_loaded = true;
				}),
		);
	}

	setSelectedBatch(batch: WorkerBatch): void {
		this.selectedBatch = batch;
	}
	resizeFix(): void {
		window.dispatchEvent(new Event('resize'));
	}

	getFlavors(project_id: number | string): void {
		this.subscription.add(
			this.flavorService.getFlavors(project_id).subscribe(
				(flavors: Flavor[]): void => {
					this.flavors = flavors;
					this.checkFlavorsUsableForCluster();
				},
				(error: any) => {
					console.log(error);
					this.flavors = [];
					this.flavors_usable = [];
					this.flavors_loaded = true;
				},
			),
		);
	}

	calcMaxWorkerInstancesByFlavor(): void {
		this.selectedBatch.setMaxWorkerCount(this.selectedProjectRessources);
	}

	removeNewBatchSelectedCluster(): void {
		if (this.created_new_batch && this.selectedBatch) {
			this.cluster.remove_batch(this.selectedBatch);
			this.created_new_batch = false;
			this.selectedBatch = null;
		}
	}

	createNewBatchSelectedCluster(): void {
		this.created_new_batch = true;
		const idx: number = this.getBatchUpscaleIndexNumber();
		this.cluster.create_new_batch(idx);
		this.selectedBatch = this.cluster.worker_batches[this.cluster.worker_batches.length - 1];
		this.loadProjectRessource();
	}

	getBatchUpscaleIndexNumber(): number {
		const indexList: number[] = [];
		this.cluster.worker_batches.forEach((cwb: WorkerBatch): void => {
			indexList.push(cwb.index);
		});
		indexList.sort();
		let idx: number = 1;
		while (indexList.indexOf(idx) !== -1) {
			idx += 1;
		}

		return idx;
	}

	checkFlavorsUsableForCluster(): void {
		this.flavors_usable = [];
		const used_flavors: Flavor[] = [];
		let flavors_to_filter: Flavor[] = [];

		// tslint:disable-next-line:no-for-each-push
		this.cluster.worker_batches.forEach((batch: WorkerBatch): void => {
			if (batch.flavor) {
				used_flavors.push(batch.flavor);
			}
		});
		if (used_flavors.length > 0) {
			flavors_to_filter = this.flavors.filter((flavor: Flavor): boolean => {
				let not_used: boolean = true;

				used_flavors.forEach((used_flavor: Flavor): void => {
					if (flavor.name === used_flavor.name) {
						not_used = false;
					}
				});

				return not_used;
			});
		} else {
			flavors_to_filter = this.flavors;
		}
		this.flavors_usable = flavors_to_filter.filter((flav: Flavor): boolean => this.selectedProjectRessources.filterFlavorsTestUpScaling(flav));

		this.flavors_loaded = true;
	}

	scaleDownCluster(): void {
		this.submitted = true;
		this.event.emit({ scaleDownCluster: true, cluster: this.cluster });

		this.bsModalRef.hide();
	}

	scaleUpCluster(): void {
		this.submitted = true;
		this.event.emit({
			scaleUpCluster: true,
			selectedBatch: this.selectedBatch,
			created_new_batch: this.created_new_batch,
		});

		this.bsModalRef.hide();
	}

	resetScalingBatches(): void {
		for (const workerBatch of this.cluster.worker_batches) {
			workerBatch.upscale_count = 0;
			workerBatch.delete_count = 0;
		}
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();

		if (!this.submitted) {
			this.removeNewBatchSelectedCluster();
			this.resetScalingBatches();
			this.event.emit({ resume: true });
		}
	}
}
