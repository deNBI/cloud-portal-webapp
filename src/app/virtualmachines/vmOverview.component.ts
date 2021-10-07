import {
	Component, OnDestroy, OnInit, QueryList, ViewChildren,
} from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { ClipboardService } from 'ngx-clipboard';
import { VirtualmachineService } from '../api-connector/virtualmachine.service';
import { VirtualMachine } from './virtualmachinemodels/virtualmachine';
import { VirtualMachinePage } from './virtualmachinemodels/virtualMachinePage';
import { FullLayoutComponent } from '../layouts/full-layout.component';
import { UserService } from '../api-connector/user.service';
import { ImageService } from '../api-connector/image.service';
import { FacilityService } from '../api-connector/facility.service';
import { is_vo, elixir_id } from '../shared/globalvar';
import { VirtualMachineStates } from './virtualmachinemodels/virtualmachinestates';
import { GroupService } from '../api-connector/group.service';
import { ClientService } from '../api-connector/client.service';
import { VmCardComponent } from './vmcard/vmcard.component';

/**
 * Vm overview component.
 */
@Component({
	selector: 'app-vm-overview',
	templateUrl: 'vmOverview.component.html',
	styleUrls: ['./vmOverview.component.scss'],
	providers: [FacilityService, ImageService, UserService,
		FullLayoutComponent, GroupService, ClientService],
})

export class VmOverviewComponent implements OnInit, OnDestroy {

	/**
	 * Title of page
	 */
	title: string = 'Instance Overview';

	/**
	 * Subscription to events
	 * @private
	 */
	private subscription: Subscription = new Subscription();

	/**
	 * States a virtual machine can have
	 */
	VirtualMachineStates: VirtualMachineStates = new VirtualMachineStates();

	/**
	 * Current page.
	 */
	currentPage: number = 1;

	/**
	 * Pagination object which holds vm objects and pagination information
	 */
	vm_page: VirtualMachinePage = new VirtualMachinePage();

	/**
	 * Child vm cards to call their functions and get information.
	 */
	@ViewChildren(VmCardComponent) children: QueryList<VmCardComponent>;

	/**
	 * Debounce time to apply filter if filter was clicked.
	 */
	LONG_DEBOUNCE_TIME: number = 1000;

	/**
	 * If cluster machines should be shown.
	 */
	filter_cluster: boolean = false;

	/**
	 * If machines set for termination should be shown.
	 */
	filter_set_for_termination: boolean = false;

	/**
	 * List with statuses to filter vms by.
	 */
	filter_status_list: string[] = [VirtualMachineStates.ACTIVE, VirtualMachineStates.SHUTOFF];

	/**
	 * If page is loading/searching backend for vms.
	 */
	isSearching: boolean = true;

	/**
	 * If 'Select all' is clicked.
	 */
	all_checked: boolean = false;

	/**
	 * Facilities where the user is manager ['name',id].
	 */
	public managerFacilities: [string, number][];

	/**
	 * Chosen facility.
	 */
	public selectedFacility: [string, number];

	/**
	 * Custom string value to filter vms by.
	 */
	filter: string;

	/**
	 * If user is vo admin.
	 */
	is_vo_admin: boolean;

	/**
	 * Elixir is of user.
	 */
	user_elixir_id: string;

	/**
	 * Tab which is shown own|all.
	 *
	 * @type {string}
	 */
	tab: string = 'own';

	/**
	 * If user is manager of a facility.
	 */
	is_facility_manager: boolean = false;

	/**
	 * If user is allowed to see cluster related things.
	 */
	cluster_allowed: boolean = false;

	/**
	 * Subject to listen and react to page changes.
	 */
	vmPerPageChange: Subject<number> = new Subject<number>();

	/**
	 * List for all machines which are checked.
	 */
	selectedMachines: VmCardComponent[] = [];

	/**
	 * List for all not user-owned machines which are checked.
	 */
	otherSelectedMachines: VmCardComponent[] = [];

	/**
	 * To check if the user agreed to deleting someone else's VMs
	 */
	deleteOtherMachines_confirmation: boolean = false;

	/**
	 * List of groups of which the user is admin.
	 */
	vms_admin: string[] = [];

	/**
	 * Perun id of user.
	 */
	user_perun_id: string;

	constructor(private facilityService: FacilityService,
							private clipboardService: ClipboardService,
							private imageService: ImageService, private userService: UserService,
							private virtualmachineservice: VirtualmachineService,
							private groupService: GroupService) {
		// eslint-disable-next-line no-empty-function
	}

	ngOnInit(): void {
		this.set_cluster_allowed();
		this.getVms();
		this.is_vo_admin = is_vo;
		this.user_elixir_id = elixir_id;
		this.get_is_facility_manager();
		this.subscription.add(
			this.facilityService.getManagerFacilities().subscribe((result: any): void => {
				this.managerFacilities = result;
				this.selectedFacility = this.managerFacilities[0];
			}),
		);
		this.subscription.add(
			this.vmPerPageChange.pipe(
				debounceTime(this.LONG_DEBOUNCE_TIME),
				distinctUntilChanged(),
			)
				.subscribe((): void => {
					this.applyFilter();
				}),
		);
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	/**
	 * Apply filter to all vms.
	 */
	applyFilter(): void {
		if (this.filter) {
			this.filter = this.filter.trim();
		}
		this.isSearching = true;
		if (typeof (this.vm_page.items_per_page) !== 'number' || this.vm_page.items_per_page <= 0) {
			this.vm_page.items_per_page = 7;
		}

		if (this.tab === 'own') {
			this.getVms();
		} else if (this.tab === 'all') {
			this.getAllVms();
		} else if (this.tab === 'facility') {
			this.getAllVmsFacilities();
		}

	}

	/**
	 * How to track the child vm cards.
	 * @param index Track by a number or a string.
	 * @param vm Track by vm openstackid.
	 */
	trackByVm(index: number | string, vm: VirtualMachine): string {
		return vm.openstackid;
	}

	/**
	 * Set value if user has a project with cluster allowed status.
	 */
	set_cluster_allowed(): void {
		this.subscription.add(
			this.virtualmachineservice.getClusterAllowed().subscribe((res: any): void => {
				this.cluster_allowed = res['allowed'];
			}),
		);
	}

	/**
	 * Add/Remove status to filter vms by.
	 * @param status Which status to add/remove from status filter.
	 */
	changeFilterStatus(status: string): void {
		this.currentPage = 1;
		const indexOf: number = this.filter_status_list.indexOf(status);
		if (indexOf === -1) {

			this.filter_status_list.push(status);
		} else {
			this.filter_status_list.splice(indexOf, 1);
		}
	}

	/**
	 * Check if user is a facility manager.
	 */
	get_is_facility_manager(): void {
		this.subscription.add(
			this.facilityService.getManagerFacilities().subscribe((result: any): void => {
				if (result.length > 0) {
					this.is_facility_manager = true;
				}
			}),
		);
	}

	/**
	 * Toggle tab own|all.
	 *
	 * @param tabString
	 */
	toggleTab(tabString: string): void {
		this.tab = tabString;
	}

	/**
	 * Load vms depending on page.
	 *
	 * @param event
	 */
	pageChanged(event: any): void {
		this.isSearching = true;

		this.currentPage = event.page;
		if (this.tab === 'own') {
			this.getVms();
		} else if (this.tab === 'all') {
			this.getAllVms();
		} else if (this.tab === 'facility') {
			this.getAllVmsFacilities();
		}
	}

	/**
	 * Get all vms of user.
	 */
	getVms(): void {
		this.subscription.add(
			this.virtualmachineservice.getVmsFromLoggedInUser(
				this.currentPage, this.vm_page.items_per_page,
				this.filter, this.filter_status_list, this.filter_cluster, this.filter_set_for_termination,
			)
				.subscribe((vm_page: VirtualMachinePage): void => {
					this.vm_page = vm_page;
					this.prepareVMS();
				}),
		);
	}

	/**
	 * Get all vms of a facility.
	 */
	getAllVmsFacilities(): void {
		this.subscription.add(
			this.virtualmachineservice.getVmsFromFacilitiesOfLoggedUser(
				this.selectedFacility['FacilityId'],
				this.currentPage, this.vm_page.items_per_page,
				this.filter, this.filter_status_list, this.filter_cluster, this.filter_set_for_termination,
			)
				.subscribe((vm_page: VirtualMachinePage): void => {
					this.vm_page = vm_page;
					this.prepareVMS();
				}),
		);
	}

	/**
	 * Checks and lists machines for which the visiting user is a project-administrator
	 */
	checkVMAdminState(): void {
		this.subscription.add(
			this.userService.getMemberByUser().subscribe(
				(res: any): void => {
					this.user_perun_id = res['userId'];
					this.vm_page.vm_list.forEach((vm: VirtualMachine): void => {
						this.subscription.add(
							this.groupService.isLoggedUserGroupAdmin(vm.projectid).subscribe((result): any => {
								if (result['admin']) {
									this.vms_admin.push(vm.openstackid);
								}
							}),
						);
					});
				},
			),
		);
	}

	/**
	 * Prepare to show vms.
	 */
	prepareVMS(): void {
		this.checkVMAdminState();
		this.children.forEach(
			(child: VmCardComponent) => {
				child.restartAndResumeCheckStatusTimer();
			},
		);
		this.isSearching = false;
	}

	/**
	 * Get all vms.
	 */
	getAllVms(): void {
		this.subscription.add(
			this.virtualmachineservice.getAllVM(this.currentPage, this.vm_page.items_per_page,
				this.filter, this.filter_status_list, this.filter_cluster, this.filter_set_for_termination)
				.subscribe((vm_page: VirtualMachinePage): void => {
					this.vm_page = vm_page;
					this.prepareVMS();
				}),
		);

	}

	/**
	 * Called if 'Select all' is toggled. Will call a function of every child vm card with value of 'Select all'.
	 */
	toggleAllChecked(): void {
		this.all_checked = !this.all_checked;
		this.children.forEach(
			(child: VmCardComponent) => {
				child.toggleAllChecked(this.all_checked);
			},
		);
	}

	/**
	 * Function to be called if a vm card child emits a checked event. Does not trust the emitted event and checks all
	 * vm cards for their checked values.
	 */
	childChecked(): void {
		let total: number = 0;
		let total_child_checked: number = 0;
		this.children.forEach(
			(child: VmCardComponent) => {
				total += child.is_checkable();
				total_child_checked += child.vm_is_checked();
			},
		);
		this.all_checked = total_child_checked === total;
	}

	/**
	 * Delete all vms which are in selectedMachines list.
	 */
	deleteAllCheckedVms(): void {
		this.selectedMachines.forEach(
			(child: VmCardComponent) => {
				child.deleteVM();
			},
		);
	}

	/**
	 * Gather all vms which are checked.
	 */
	gatherAllSelectedVMs(): void {
		this.selectedMachines = [];
		this.otherSelectedMachines = [];
		this.children.forEach(
			(child: VmCardComponent) => {
				if (child.is_checked) {
					if (this.user_elixir_id !== child.vm.elixir_id) {
						this.otherSelectedMachines.push(child);
					}
					this.selectedMachines.push(child);
				}
			},
		);
	}

}
