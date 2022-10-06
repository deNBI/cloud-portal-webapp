import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Clusterinfo} from '../clusterinfo';
import {VirtualmachineService} from '../../../api-connector/virtualmachine.service';
import {VirtualMachineStates} from '../../virtualmachinemodels/virtualmachinestates';
import {VirtualMachine} from '../../virtualmachinemodels/virtualmachine';
import {STATUS_LINK} from '../../../../links/links';
import {DeleteVmComponent} from '../../modals/delete-vm/delete-vm.component';
import {ClipboardService} from 'ngx-clipboard';
import {TemplateNames} from '../../conda/template-names';
import {
		WIKI_GUACAMOLE_LINK,
		WIKI_RSTUDIO_LINK,
		WIKI_VOLUME_OVERVIEW,
		WIKI_PERSISTENT_TERMINAL_LINK
} from '../../../../links/links'

/**
 * Clusterdetail component.
 */
@Component({
		selector: 'app-clusterdetail',
		templateUrl: './clusterdetail.component.html',
		styleUrls: ['./clusterdetail.component.scss'],
		providers: [VirtualmachineService],
})
export class ClusterdetailComponent implements OnInit, OnDestroy {
		WIKI_RSTUDIO_LINK: string = WIKI_RSTUDIO_LINK;
		WIKI_GUACAMOLE_LINK: string = WIKI_GUACAMOLE_LINK;
		WIKI_VOLUME_OVERVIEW: string = WIKI_VOLUME_OVERVIEW;

		WIKI_PERSISTENT_TERMINAL_LINK: string = WIKI_PERSISTENT_TERMINAL_LINK;
			virtualMachineStates: VirtualMachineStates = new VirtualMachineStates();

		cluster_id: string;
		cluster: Clusterinfo;
		isLoaded: boolean = false;
		notFoundCluster: boolean = false;
		checkStatusTimeout: number = 5000;
		subscription: Subscription = new Subscription();
		errorOnLoading = false;
		STATUS_LINK: string = STATUS_LINK;
		bsModalRef: BsModalRef;
		VirtualMachineStates: VirtualMachineStates = new VirtualMachineStates();

		constructor(
				private activatedRoute: ActivatedRoute,
				private virtualmachineService: VirtualmachineService,
				private modalService: BsModalService,
				private clipboardService: ClipboardService,
		) {
				this.activatedRoute = activatedRoute;
				this.virtualmachineService = virtualmachineService;
		}

		ngOnInit(): void {
				this.activatedRoute.params.subscribe((paramsId: any): void => {
						this.cluster_id = paramsId.id;
						this.setClusterById();
				});
		}

		resenv_by_play(vm: VirtualMachine): boolean {
				for (const mode of vm.modes) {
						if (TemplateNames.ALL_TEMPLATE_NAMES.indexOf(mode.name) !== -1) {
								return false;
						}
				}

				return true;
		}

		deleteCluster(): void {
				this.virtualmachineService.deleteCluster(this.cluster_id).subscribe((): void => {
						this.cluster.status = 'Deleted';
						this.cluster.master_instance.status = VirtualMachineStates.DELETED;
						this.cluster.worker_instances.forEach((vm: VirtualMachine): void => {
								vm.status = VirtualMachineStates.DELETED;
						});
				});
		}

		copyToClipboard(text: string): void {
				if (this.clipboardService.isSupported) {
						this.clipboardService.copy(text);
				}
		}

		setClusterById(): void {
				this.virtualmachineService.getClusterInfo(this.cluster_id).subscribe(
						(cluster_info: Clusterinfo): void => {
								this.cluster = new Clusterinfo(cluster_info);
								this.isLoaded = true;
								this.check_status_loop_cluster_vms();
						},
						() => {
								this.errorOnLoading = true;
								this.isLoaded = true;
						},
				);
		}

		check_status_loop_vm(vm: VirtualMachine, final_state: string = VirtualMachineStates.ACTIVE): void {
				setTimeout(
						(): void => {
								this.subscription.add(
										this.virtualmachineService
												.checkVmStatus(vm.openstackid, vm.name)
												.subscribe((updated_vm: VirtualMachine): void => {
														updated_vm = new VirtualMachine(updated_vm);
														// tslint:disable-next-line:triple-equals
														if (vm !== undefined) {
																this.cluster.worker_instances[this.cluster.worker_instances.indexOf(vm)] = updated_vm;
																if (VirtualMachineStates.IN_PROCESS_STATES.indexOf(updated_vm.status) !== -1) {
																		this.check_status_loop_vm(updated_vm, final_state);
																} else if (VirtualMachineStates.NOT_IN_PROCESS_STATES.indexOf(updated_vm.status) !== -1) {
																		if (final_state && updated_vm.status !== final_state) {
																				this.check_status_loop_vm(updated_vm, final_state);
																		} else {
																				this.check_status_loop_vm(updated_vm, final_state);
																		}
																}
														}
												}),
								);
						},

						this.checkStatusTimeout,
				);
		}

		check_status_loop_cluster_vms(): void {
				this.cluster.worker_instances.forEach((vm: VirtualMachine): void => {
						if (
								vm.status !== VirtualMachineStates.ACTIVE
								&& VirtualMachineStates.NOT_IN_PROCESS_STATES.indexOf(vm.status) === -1
						) {
								this.check_status_loop_vm(vm);
						}
				});
		}

		ngOnDestroy(): void {
				this.subscription.unsubscribe();
		}

		showDeleteModal(worker: VirtualMachine): void {
				const initialState = {virtualMachine: worker, clusterWorker: true};

				this.bsModalRef = this.modalService.show(DeleteVmComponent, {initialState});
				this.bsModalRef.setClass('modal-lg');
				this.subscribeToBsModalRef();
		}

		subscribeToBsModalRef(): void {
				this.subscription.add(
						this.bsModalRef.content.event.subscribe((result: any) => {
								if ('deleteVM' in result) {
										this.deleteVM(result['worker']);
								}
						}),
				);
		}

		deleteVM(worker: VirtualMachine): void {
				this.setInstanceStatus(worker, VirtualMachineStates.DELETING);
				this.subscription.add(
						this.virtualmachineService.deleteVM(worker.openstackid).subscribe((updated_vm: VirtualMachine): void => {
								if (updated_vm.status !== VirtualMachineStates.DELETED) {
										setTimeout((): void => {
												this.deleteVM(worker);
										}, this.checkStatusTimeout);
								} else {
										this.removeInstance(worker);
								}
						}),
				);
		}

		removeInstance(worker: VirtualMachine): void {
				const worker_instances: VirtualMachine[] = [];
				for (const vm of this.cluster.worker_instances) {
						if (vm.openstackid === worker.openstackid) {
								continue;
						}
						worker_instances.push(vm);
				}
				this.cluster.worker_instances = worker_instances;
		}

		setInstanceStatus(worker: VirtualMachine, status: string): void {
				const worker_instances: VirtualMachine[] = [];
				for (const vm of this.cluster.worker_instances) {
						if (vm.openstackid === worker.openstackid) {
								vm.status = status;
						}
						worker_instances.push(vm);
				}
				this.cluster.worker_instances = worker_instances;
		}
}
