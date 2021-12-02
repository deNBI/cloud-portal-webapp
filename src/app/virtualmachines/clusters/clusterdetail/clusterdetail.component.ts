import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Clusterinfo } from '../clusterinfo';
import { VirtualmachineService } from '../../../api-connector/virtualmachine.service';
import { VirtualMachineStates } from '../../virtualmachinemodels/virtualmachinestates';
import { VirtualMachine } from '../../virtualmachinemodels/virtualmachine';
import { STATUS_LINK } from '../../../../links/links';

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
	cluster_id: string;
	cluster: Clusterinfo;
	isLoaded: boolean = false;
	notFoundCluster: boolean = false;
	checkStatusTimeout: number = 5000;
	subscription: Subscription = new Subscription();
	selectedWorker: VirtualMachine;
	errorOnLoading = false;
	STATUS_LINK: string = STATUS_LINK;

	constructor(private activatedRoute: ActivatedRoute, private virtualmachineService: VirtualmachineService) {
		this.activatedRoute = activatedRoute;
		this.virtualmachineService = virtualmachineService;
	}

	ngOnInit(): void {
		this.activatedRoute.params.subscribe((paramsId: any): void => {
			this.cluster_id = paramsId.id;
			this.setClusterById();

		});
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

	setClusterById(): void {
		this.virtualmachineService.getClusterInfo(this.cluster_id).subscribe((cluster_info: Clusterinfo): void => {
			this.cluster = new Clusterinfo(cluster_info);
			this.isLoaded = true;
			this.check_status_loop_cluster_vms();
		}, () => {
			this.errorOnLoading = true;
			this.isLoaded = true;
		});
	}

	check_status_loop_vm(vm: VirtualMachine, final_state: string = VirtualMachineStates.ACTIVE): void {

		setTimeout(
			(): void => {
				this.subscription.add(
					this.virtualmachineService.checkVmStatus(vm.openstackid, vm.name).subscribe((updated_vm: VirtualMachine): void => {
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
			if (vm.status !== VirtualMachineStates.ACTIVE && VirtualMachineStates.NOT_IN_PROCESS_STATES.indexOf(vm.status) === -1) {
				this.check_status_loop_vm(vm);
			}
		});

	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

}
