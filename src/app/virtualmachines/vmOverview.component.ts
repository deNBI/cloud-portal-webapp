import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';

import ***REMOVED***VirtualmachineService***REMOVED*** from '../api-connector/virtualmachine.service';
import ***REMOVED***VirtualMachine***REMOVED*** from './virtualmachinemodels/virtualmachine';
import ***REMOVED***FullLayoutComponent***REMOVED*** from '../layouts/full-layout.component';
import ***REMOVED***UserService***REMOVED*** from '../api-connector/user.service';
import ***REMOVED***ImageService***REMOVED*** from '../api-connector/image.service';
import ***REMOVED***FilterBaseClass***REMOVED*** from '../shared_modules/baseClass/filter-base-class';
import ***REMOVED***VoService***REMOVED*** from '../api-connector/vo.service';

/**
 * Vm overview componentn.
 */
@Component(***REMOVED***
    selector: 'app-vm-overview',
    templateUrl: 'vmOverview.component.html',
    providers: [VoService, ImageService, UserService, VirtualmachineService, FullLayoutComponent]
***REMOVED***)

export class VmOverviewComponent extends FilterBaseClass implements OnInit ***REMOVED***
    /**
     * All unfiltered vms.
     */
    vms_content: VirtualMachine[];
    /**
     * All vms filtered.
     */
    vms_filtered: VirtualMachine[];
    /**
     * All vms returned with paging.
     */
    vms_returned: VirtualMachine[];
    /**
     * How many vms are shown per page.
     * @type ***REMOVED***number***REMOVED***
     */
    vmsPerPage: number = 5;
    /**
     * Current page.
     * @type ***REMOVED***number***REMOVED***
     */
    currentPage: number = 1;
    /**
     * Index where the vm list starts.
     * @type ***REMOVED***number***REMOVED***
     */
    vmStart: number = 0;
    /**
     * How to connect for specific vm.
     */
    how_to_connect: string;
    /**
     * End of the vms.
     * @type ***REMOVED***number***REMOVED***
     */
    vmEnd: number = this.vmsPerPage;
    /**
     * Name of vm which changed status.
     */
    status_changed_vm: string;
    /**
     * Id of vm which changed status.
     */
    status_changed_vm_id: string;

    /**
     * If user is vo admin.
     */
    is_vo_admin: boolean;
    /**
     * Vm which is used to create a snapshot.
     */
    snapshot_vm: VirtualMachine;
    /**
     * If the snapshot name is valid.
     */
    validSnapshotNameBool: boolean;
    /**
     * String if the snapshot is done.
     * @type ***REMOVED***string***REMOVED***
     */
    snapshotNameCheckDone: boolean = false;
    snapshotDone: string = 'Waiting';
    /**
     * Name of the snapshot.
     */
    snapshotName: string = '';
    /**
     * Tab which is shown own|all.
     * @type ***REMOVED***string***REMOVED***
     */
    tab: string = 'own';
    /**
     * The changed status.
     * @type ***REMOVED***number***REMOVED***
     */
    status_changed: number = 0;

    /**
     * Timeout for checking vm status.
     * @type ***REMOVED***number***REMOVED***
     */
    private checkStatusTimeout: number = 1500;
    /**
     * Type of reboot HARD|SOFT.
     */
    reboot_type: string;
    /**
     * If an error appeared when checking vm status.
     */
    status_check_error: boolean;
    /**
     * IF reboot is done.
     */
    reboot_done: boolean;

    constructor(private voService: VoService, private imageService: ImageService, private userservice: UserService,
                private virtualmachineservice: VirtualmachineService) ***REMOVED***
        super()
    ***REMOVED***

    /**
     * Load vms depending on page.
     * @param event
     */
    pageChanged(event): void ***REMOVED***

        const startItem: number = (event.page - 1) * event.itemsPerPage;
        const endItem: number = event.page * event.itemsPerPage;
        this.vmStart = startItem;
        this.vmEnd = endItem;
        this.vms_returned = this.vms_filtered.slice(startItem, endItem)

    ***REMOVED***

    /**
     * Check if vm corresponds the filter.
     * @param ***REMOVED***VirtualMachine***REMOVED*** vm vm which is checked
     * @returns ***REMOVED***boolean***REMOVED*** True if it matches the filter
     */
    checkFilter(vm: VirtualMachine): boolean ***REMOVED***
        return this.isFilterstatus(vm.status) && this.isFilterProjectName(vm.project) && this.isFilterCreated_at(vm.created_at)
            && this.isFilterElixir_id(vm.elixir_id) && this.isFilterName(vm.name) && this.isFilterStopped_at(vm.stopped_at)
            && this.isFilterUsername(vm.username)

    ***REMOVED***

    /**
     * Apply filter to all vms.
     */
    applyFilter(): void ***REMOVED***

        this.vms_filtered = this.vms_content.filter(vm => this.checkFilter(vm));

        this.vmStart = 0;
        this.vmEnd = this.vmsPerPage;

        this.vms_returned = this.vms_filtered.slice(this.vmStart, this.vmEnd);
        this.currentPage = 1

    ***REMOVED***

    /**
     * Toggle tab own|all.
     * @param ***REMOVED***string***REMOVED*** tabString
     */
    toggleTab(tabString: string): void ***REMOVED***
        this.tab = tabString;
    ***REMOVED***

    /**
     * Check status of all inactive vms.
     */
    checkInactiveVms(): void ***REMOVED***
        this.virtualmachineservice.checkStatusInactiveVms().subscribe(vms => ***REMOVED***
            this.vms_content = vms;
            for (const vm of this.vms_content) ***REMOVED***
                if (vm.created_at !== '') ***REMOVED***
                    vm.created_at = new Date(parseInt(vm.created_at, 10) * 1000).toLocaleDateString();
                ***REMOVED***
                if (vm.stopped_at !== '' && vm.stopped_at !== 'ACTIVE') ***REMOVED***
                    vm.stopped_at = new Date(parseInt(vm.stopped_at, 10) * 1000).toLocaleDateString();
                ***REMOVED*** else ***REMOVED***
                    vm.stopped_at = ''
                ***REMOVED***
            ***REMOVED***
            this.applyFilter();

        ***REMOVED***)
    ***REMOVED***

    /**
     * Check if the snapshot name is valid.
     * @param e
     */
    validSnapshotName(e) ***REMOVED***
        this.snapshotNameCheckDone = false;
        this.imageService.checkSnapshotNameVaiable(this.snapshotName).subscribe(res => ***REMOVED***

            this.validSnapshotNameBool = this.snapshotName.length > 0 && res['valid']
            this.snapshotNameCheckDone = true;
        ***REMOVED***)

    ***REMOVED***

    /**
     * Reset the snapshotDone to waiting.
     */
    resetSnapshotResult(): void ***REMOVED***
        this.snapshotDone = 'Waiting';
    ***REMOVED***

    /**
     * Check status of vm.
     * @param ***REMOVED***string***REMOVED*** openstackid  of the instance
     */
    checkStatus(openstackid: string): void ***REMOVED***
        this.virtualmachineservice.checkVmStatus(openstackid).subscribe(() => ***REMOVED***

                this.virtualmachineservice.getVmsFromLoggedInUser().subscribe(vms => ***REMOVED***
                        this.vms_content = vms;
                        for (const vm of this.vms_content) ***REMOVED***
                            if (vm.created_at !== '') ***REMOVED***
                                vm.created_at = new Date(parseInt(vm.created_at, 10) * 1000).toLocaleDateString();
                            ***REMOVED***
                            if (vm.stopped_at !== '' && vm.stopped_at !== 'ACTIVE') ***REMOVED***
                                vm.stopped_at = new Date(parseInt(vm.stopped_at, 10) * 1000).toLocaleDateString();
                            ***REMOVED*** else ***REMOVED***
                                vm.stopped_at = ''
                            ***REMOVED***
                        ***REMOVED***
                        this.applyFilter()

                    ***REMOVED***
                );

            ***REMOVED***
        )
    ***REMOVED***

    /**
     * Delete Vm.
     * @param ***REMOVED***string***REMOVED*** openstack_id of instance
     */
    deleteVm(openstack_id: string): void ***REMOVED***
        this.virtualmachineservice.deleteVM(openstack_id).subscribe(result => ***REMOVED***

            this.status_changed = 0;

            if (this.tab === 'own') ***REMOVED***
                this.getVms();
            ***REMOVED*** else if (this.tab === 'all') ***REMOVED***
                this.getAllVms();

            ***REMOVED***

            if (result['deleted'] === true) ***REMOVED***
                this.status_changed = 1;
            ***REMOVED*** else ***REMOVED***
                this.status_changed = 2;
            ***REMOVED***

        ***REMOVED***)
    ***REMOVED***

    /**
     * Reboot a vm.
     * @param ***REMOVED***string***REMOVED*** openstack_id of the instance
     * @param ***REMOVED***string***REMOVED*** reboot_type HARD|SOFT
     */
    public rebootVm(openstack_id: string, reboot_type: string): void ***REMOVED***
        this.virtualmachineservice.rebootVM(openstack_id, reboot_type).subscribe(result => ***REMOVED***
            this.status_changed = 0;

            if (result['reboot']) ***REMOVED***
                this.status_changed = 1;
                this.check_status_loop(openstack_id)
            ***REMOVED*** else ***REMOVED***
                this.status_changed = 2;
            ***REMOVED***

        ***REMOVED***)
    ***REMOVED***

    /**
     * Check Status of vm in loop till active.
     * @param ***REMOVED***string***REMOVED*** id of instance.
     */
    check_status_loop(id: string): void ***REMOVED***

        setTimeout(
            () => ***REMOVED***
                this.virtualmachineservice.checkVmStatus(id).subscribe(res => ***REMOVED***

                    if (res['Started']) ***REMOVED***
                        this.reboot_done = true;
                        if (this.tab === 'own') ***REMOVED***
                            this.getVms();
                        ***REMOVED*** else if (this.tab === 'all') ***REMOVED***
                            this.getAllVms();

                        ***REMOVED***

                    ***REMOVED*** else ***REMOVED***
                        if (res['Error']) ***REMOVED***
                            this.status_check_error = true

                        ***REMOVED***
                        this.check_status_loop(id)
                    ***REMOVED***

                ***REMOVED***)
            ***REMOVED***,
            this.checkStatusTimeout);
    ***REMOVED***

    /**
     * Stop a vm.
     * @param ***REMOVED***string***REMOVED*** openstack_id of instance.
     */
    stopVm(openstack_id: string): void ***REMOVED***
        this.virtualmachineservice.stopVM(openstack_id).subscribe(result => ***REMOVED***

            this.status_changed = 0;

            if (this.tab === 'own') ***REMOVED***
                this.getVms();
            ***REMOVED*** else if (this.tab === 'all') ***REMOVED***
                this.getAllVms();

            ***REMOVED***

            if (result['stopped']) ***REMOVED***
                this.status_changed = 1;
            ***REMOVED*** else ***REMOVED***
                this.status_changed = 2;
            ***REMOVED***

        ***REMOVED***)
    ***REMOVED***

    /**
     * Get all vms of user.
     * @param ***REMOVED***string***REMOVED*** elixir_id of user
     */
    getVms(): void ***REMOVED***
        this.virtualmachineservice.getVmsFromLoggedInUser().subscribe(vms => ***REMOVED***
                this.vms_content = vms;

                for (const vm of this.vms_content) ***REMOVED***
                    this.setCollapseStatus(vm.openstackid, false);

                    if (vm.created_at !== '') ***REMOVED***
                        vm.created_at = new Date(parseInt(vm.created_at, 10) * 1000).toLocaleDateString();
                    ***REMOVED***

                    if (vm.stopped_at !== '' && vm.stopped_at !== 'ACTIVE') ***REMOVED***
                        vm.stopped_at = new Date(parseInt(vm.stopped_at, 10) * 1000).toLocaleDateString();
                    ***REMOVED*** else ***REMOVED***
                        vm.stopped_at = ''
                    ***REMOVED***
                ***REMOVED***
                this.isLoaded = true;
                this.applyFilter();

            ***REMOVED***
        );
    ***REMOVED***

    refreshVms(): void ***REMOVED***
        this.vms_returned = [];
        this.virtualmachineservice.getVmsFromLoggedInUser().subscribe(vms => ***REMOVED***
                this.vms_content = vms;

                for (const vm of this.vms_content) ***REMOVED***
                    this.setCollapseStatus(vm.openstackid, false);

                    if (vm.created_at !== '') ***REMOVED***
                        vm.created_at = new Date(parseInt(vm.created_at, 10) * 1000).toLocaleDateString();
                    ***REMOVED***

                    if (vm.stopped_at !== '' && vm.stopped_at !== 'ACTIVE') ***REMOVED***
                        vm.stopped_at = new Date(parseInt(vm.stopped_at, 10) * 1000).toLocaleDateString();
                    ***REMOVED*** else ***REMOVED***
                        vm.stopped_at = ''
                    ***REMOVED***
                ***REMOVED***
                this.isLoaded = true;
                this.applyFilter();

            ***REMOVED***
        );

    ***REMOVED***

    /**
     * Resume a vm.
     * @param ***REMOVED***string***REMOVED*** openstack_id of instance.
     */
    resumeVM(openstack_id: string): void ***REMOVED***

        this.virtualmachineservice.resumeVM(openstack_id).subscribe(result => ***REMOVED***

            this.status_changed = 0;

            if (this.tab === 'own') ***REMOVED***
                this.getVms();
            ***REMOVED*** else if (this.tab === 'all') ***REMOVED***
                this.getAllVms();

            ***REMOVED***

            if (result['resumed']) ***REMOVED***
                this.status_changed = 1;
            ***REMOVED*** else ***REMOVED***
                this.status_changed = 2;
            ***REMOVED***

        ***REMOVED***)
    ***REMOVED***

    /**
     * Get all vms.
     */
    getAllVms(): void ***REMOVED***
        this.virtualmachineservice.getAllVM().subscribe(vms => ***REMOVED***
                this.vms_content = vms;
                for (const vm of this.vms_content) ***REMOVED***
                    this.setCollapseStatus(vm.openstackid, false)

                    if (vm.created_at !== '') ***REMOVED***
                        vm.created_at = new Date(parseInt(vm.created_at, 10) * 1000).toLocaleDateString();
                    ***REMOVED***
                    if (vm.stopped_at !== '' && vm.stopped_at !== 'ACTIVE') ***REMOVED***
                        vm.stopped_at = new Date(parseInt(vm.stopped_at, 10) * 1000).toLocaleDateString();
                    ***REMOVED*** else ***REMOVED***
                        vm.stopped_at = ''
                    ***REMOVED***

                ***REMOVED***
                this.applyFilter();

            ***REMOVED***
        );
    ***REMOVED***

    ngOnInit(): void ***REMOVED***
        this.getVms();
        this.checkVOstatus()

    ***REMOVED***

    /**
     * Check vm status.
     * @param ***REMOVED***UserService***REMOVED*** userservice
     */
    checkVOstatus(): void ***REMOVED***
        this.voService.isVo().subscribe(res => ***REMOVED***
            this.is_vo_admin = res['Is_Vo_Manager'];
        ***REMOVED***)
    ***REMOVED***

    /**
     * Create snapshot.
     * @param ***REMOVED***string***REMOVED*** snapshot_instance which is used for creating the snapshot
     * @param ***REMOVED***string***REMOVED*** snapshot_name name of the snapshot
     */
    createSnapshot(snapshot_instance: string, snapshot_name: string): void ***REMOVED***
        this.imageService.createSnapshot(snapshot_instance, snapshot_name).subscribe(result => ***REMOVED***
            if (result['Error']) ***REMOVED***
                this.snapshotDone = result['Error'].toString();
            ***REMOVED*** else if (result['Created']) ***REMOVED***
                this.imageService.getSnapshot(result['Created']).subscribe(() => ***REMOVED***
                ***REMOVED***)
                this.snapshotDone = 'true';
            ***REMOVED***

        ***REMOVED***)
    ***REMOVED***

***REMOVED***
