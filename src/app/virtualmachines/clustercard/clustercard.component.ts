import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { ClipboardService } from 'ngx-clipboard'
import { Subscription } from 'rxjs'
import { BsModalService } from 'ngx-bootstrap/modal'
import { VirtualMachineStates } from '../virtualmachinemodels/virtualmachinestates'
import { VirtualmachineService } from '../../api-connector/virtualmachine.service'
import { ImageService } from '../../api-connector/image.service'
import { Clusterinfo } from '../clusters/clusterinfo'

import { SharedModal } from '../../shared/shared_modules/baseClass/shared-modal'

import { CLOUD_PORTAL_SUPPORT_MAIL } from '../../../links/links'

/**
 * Vm card component to be used by vm-overview. Holds information about a virtual machine.
 */
@Component({
	selector: 'app-cluster-card',
	templateUrl: 'clustercard.component.html',
	styleUrls: ['./clustercard.component.scss'],
	providers: [ImageService]
})
export class ClustercardComponent extends SharedModal implements OnInit, OnDestroy {
	CLOUD_PORTAL_SUPPORT_MAIL: string = CLOUD_PORTAL_SUPPORT_MAIL

	/**
	 * The virtual machine this card is for.
	 */
	@Input() cluster: Clusterinfo

	/**
	 * Possible virtual machine states.
	 */
	VirtualMachineStates: VirtualMachineStates = new VirtualMachineStates()

	/**
	 * Eventemitter when the vm is checked/unchecked.
	 */
	@Output() check_change_event: EventEmitter<number> = new EventEmitter()

	/**
	 * Elixir id of the user.
	 */
	@Input() user_elixir_id: string = ''

	/**
	 * If the user is a vo admin.
	 */
	@Input() is_vo_admin: boolean = false

	/**
	 * If the user is an admin of the group the cluster belongs to.
	 */
	@Input() is_cluster_admin: boolean = false

	/**
	 * Subscription objcet to listen to different events.
	 */
	subscription: Subscription = new Subscription()

	statusSubscription: Subscription = new Subscription()

	/**
	 * Modal reference to be changed/showed/hidden depending on chosen modal.
	 */
	// bsModalRef: BsModalRef;

	/**
	 * Default wait time between status checks if no other value specified.
	 * @private
	 */
	private checkStatusTimeout: number = 15000

	/**
	 * Default time in ms to show an error message if no other value specified.
	 */
	ERROR_TIMER: number = 20000

	/**
	 * Timeout object to control check status loop (i.e. stopping and starting check status loop).
	 */
	checkStatusTimer: ReturnType<typeof setTimeout>
	/**
	 * Timeout object to control check status loop (i.e. stopping and starting check status loop).
	 */
	checkWorkerStatusTimer: ReturnType<typeof setTimeout>

	all_worker_loaded: boolean = false

	constructor(
		private clipboardService: ClipboardService,
		modalService: BsModalService,
		private virtualmachineservice: VirtualmachineService
	) {
		super(modalService)
	}

	ngOnInit() {
		this.statusSubscription = new Subscription()

		this.check_status_loop()
	}

	ngOnDestroy() {
		this.subscription.unsubscribe()
		this.statusSubscription.unsubscribe()
		this.stopAllCheckStatusTimer()
	}

	/**
	 * Stop and clear the check status loop.
	 */
	stopCheckStatusTimer(): void {
		if (this.checkStatusTimer) {
			clearTimeout(this.checkStatusTimer)
		}
		if (this.statusSubscription) {
			this.statusSubscription.unsubscribe()
		}
	}

	/**
	 * Stop and clear the worker check status loop.
	 */
	stopCheckWorkerStatusTimer(): void {
		if (this.checkWorkerStatusTimer) {
			clearTimeout(this.checkWorkerStatusTimer)
		}
		if (this.statusSubscription) {
			this.statusSubscription.unsubscribe()
		}
	}

	/**
	 * Stop and clear all check status loop.
	 */
	stopAllCheckStatusTimer(): void {
		this.stopCheckStatusTimer()
		this.stopCheckWorkerStatusTimer()
	}

	get_all_batches_loaded(): boolean {
		let worker_amount: number = 0
		for (const worker_batch of this.cluster.worker_batches) {
			worker_amount += worker_batch.worker_count
		}

		return this.cluster.worker_instances.length === worker_amount
	}

	check_status_loop(): void {
		this.all_worker_loaded = this.get_all_batches_loaded()
		this.checkStatusTimer = setTimeout((): void => {
			this.statusSubscription.add(
				this.virtualmachineservice
					.getClusterInfo(this.cluster.cluster_id)
					.subscribe((updated_cluster: Clusterinfo): void => {
						const password: string = this.cluster.password
						this.cluster = new Clusterinfo(updated_cluster)
						this.cluster.password = password
						if (
							this.cluster.status !== VirtualMachineStates.DELETED &&
							this.cluster.status !== VirtualMachineStates.NOT_FOUND &&
							this.cluster.status !== VirtualMachineStates.MIGRATED
						) {
							this.check_status_loop()
						}
					})
			)
		}, this.checkStatusTimeout)
	}

	/**
	 * Copy some text to clipboard.
	 */
	copyToClipboard(text: string): void {
		if (this.clipboardService.isSupported) {
			this.clipboardService.copy(text)
		}
	}

	/**
	 * Show message in span that text was copied.
	 */
	showCopiedMessage(name: string): void {
		const span_id: string = `${name}resenvSpan`
		const { innerHTML } = document.getElementById(span_id)
		document.getElementById(span_id).innerHTML = 'Copied URL!'
		setTimeout((): void => {
			document.getElementById(span_id).innerHTML = innerHTML
		}, 1000)
	}
}
