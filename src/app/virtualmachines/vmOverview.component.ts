import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {PerunSettings} from "../perun-connector/connector-settings.service";
import {VirtualmachineService} from "../api-connector/virtualmachine.service";
import {VirtualMachine} from "./virtualmachinemodels/virtualmachine";
import {FullLayoutComponent} from "../layouts/full-layout.component";
import {UserService} from "../api-connector/user.service";
import {ImageService} from "../api-connector/image.service";
import {Vmclient} from "./virtualmachinemodels/vmclient";
import {FilterBaseClass} from "../shared_modules/baseClass/filter-base-class";
import {Image} from "./virtualmachinemodels/image";
import {VoService} from "../api-connector/vo.service";

@Component({
    selector: 'vm-overview',
    templateUrl: 'vmOverview.component.html',
    providers: [VoService,ImageService, UserService, VirtualmachineService, FullLayoutComponent, PerunSettings]
})


export class VmOverviewComponent extends FilterBaseClass implements OnInit {
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
     * @type {number}
     */
    vmsPerPage = 5;
    /**
     * Current page.
     * @type {number}
     */
    currentPage = 1;
    /**
     * Index where the vm list starts.
     * @type {number}
     */
    vmStart = 0;
    /**
     * How to connect for specific vm.
     */
    how_to_connect: string;
    /**
     * End of the vms.
     * @type {number}
     */
    vmEnd = this.vmsPerPage;
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
     * @type {string}
     */
    snapshotNameCheckDone = false;
    snapshotDone: string = 'Waiting';
    /**
     * Name of the snapshot.
     */
    snapshotName: string = '';
    /**
     * Tab which is shown own|all.
     * @type {string}
     */
    tab = 'own';
    /**
     * The changed status.
     * @type {number}
     */
    status_changed: number = 0;

    /**
     * Timeout for checking vm status.
     * @type {number}
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


    constructor(private voService:VoService,private imageService: ImageService, private userservice: UserService, private virtualmachineservice: VirtualmachineService, private perunsettings: PerunSettings) {
        super()
    }

    /**
     * Load vms depending on page.
     * @param event
     */
    pageChanged(event): void {

        const startItem = (event.page - 1) * event.itemsPerPage;
        const endItem = event.page * event.itemsPerPage;
        this.vmStart = startItem;
        this.vmEnd = endItem;
        this.vms_returned = this.vms_filtered.slice(startItem, endItem)

    }


    /**
     * Check if vm corresponds the filter.
     * @param {VirtualMachine} vm vm which is checked
     * @returns {boolean} True if it matches the filter
     */
    checkFilter(vm: VirtualMachine) {
        if (this.isFilterstatus(vm.status) && this.isFilterProjectName(vm.project) && this.isFilterCreated_at(vm.created_at) && this.isFilterElixir_id(vm.elixir_id) && this.isFilterName(vm.name) && this.isFilterStopped_at(vm.stopped_at) && this.isFilterUsername(vm.username)) {
            return true
        }
        else {
            return false
        }


    }

    /**
     * Apply filter to all vms.
     */
    applyFilter() {

        this.vms_filtered = this.vms_content.filter(vm => this.checkFilter(vm));

        this.vmStart = 0;
        this.vmEnd = this.vmsPerPage;

        this.vms_returned = this.vms_filtered.slice(this.vmStart, this.vmEnd);
        this.currentPage = 1


    }

    /**
     * Toggle tab own|all.
     * @param {string} tabString
     */
    toggleTab(tabString: string) {
        this.tab = tabString;
    }

    /**
     * Check status of all inactive vms.
     */
    checkInactiveVms() {
        this.virtualmachineservice.checkStatusInactiveVms().subscribe(vms => {
            this.vms_content = vms;
            for (let vm of this.vms_content) {
                if (vm.created_at != '') {
                    vm.created_at = new Date(parseInt(vm.created_at) * 1000).toLocaleDateString();
                }
                if (vm.stopped_at != '' && vm.stopped_at != 'ACTIVE') {
                    vm.stopped_at = new Date(parseInt(vm.stopped_at) * 1000).toLocaleDateString();
                }
                else {
                    vm.stopped_at = ''
                }
            }
            this.applyFilter();

        })
    }

    /**
     * Check if the snapshot name is valid.
     * @param e
     */
    validSnapshotName(e) {
        this.snapshotNameCheckDone = false;
        this.imageService.checkSnapshotNameVaiable(this.snapshotName).subscribe(res => {

            this.validSnapshotNameBool = this.snapshotName.length > 0 && res['valid']
            this.snapshotNameCheckDone = true;
        })


    }


    /**
     * Reset the snapshotDone to waiting.
     */
    resetSnapshotResult() {
        this.snapshotDone = 'Waiting';
    }

    /**
     * Check status of vm.
     * @param {string} openstackid  of the instance
     */
    checkStatus(openstackid: string) {
        this.virtualmachineservice.checkVmStatus(openstackid).subscribe(res => {


                this.virtualmachineservice.getVmsFromLoggedInUser().subscribe(vms => {
                        this.vms_content = vms;
                        for (let vm of this.vms_content) {
                            if (vm.created_at != '') {
                                vm.created_at = new Date(parseInt(vm.created_at) * 1000).toLocaleDateString();
                            }
                            if (vm.stopped_at != '' && vm.stopped_at != 'ACTIVE') {
                                vm.stopped_at = new Date(parseInt(vm.stopped_at) * 1000).toLocaleDateString();
                            }
                            else {
                                vm.stopped_at = ''
                            }
                        }
                        this.applyFilter()


                    }
                );

            }
        )
    }

    /**
     * Delete Vm.
     * @param {string} openstack_id of instance
     */
    deleteVm(openstack_id: string): void {
        this.virtualmachineservice.deleteVM(openstack_id).subscribe(result => {

            this.status_changed = 0;


            if (this.tab === 'own') {
                this.getVms();
            }
            else if (this.tab === 'all') {
                this.getAllVms();

            }

            if (result['deleted'] === true) {
                this.status_changed = 1;
            }
            else {
                this.status_changed = 2;
            }


        })
    }

    /**
     * Reboot a vm.
     * @param {string} openstack_id of the instance
     * @param {string} reboot_type HARD|SOFT
     */
    public rebootVm(openstack_id: string, reboot_type: string) {
        this.virtualmachineservice.rebootVM(openstack_id, reboot_type).subscribe(result => {
            this.status_changed = 0;


            if (result['reboot']) {
                this.status_changed = 1;
                this.check_status_loop(openstack_id)
            }
            else {
                this.status_changed = 2;
            }


        })
    }

    /**
     * Check Status of vm in loop till active.
     * @param {string} id of instance.
     */
    check_status_loop(id: string) {

        setTimeout(() => {
            this.virtualmachineservice.checkVmStatus(id).subscribe(res => {
                res = res;

                if (res['Started']) {
                    this.reboot_done = true;
                    if (this.tab === 'own') {
                        this.getVms();
                    }
                    else if (this.tab === 'all') {
                        this.getAllVms();

                    }


                }
                else {
                    if (res['Error']) {
                        this.status_check_error = true


                    }
                    this.check_status_loop(id)
                }

            })
        }, this.checkStatusTimeout);
    }

    /**
     * Stop a vm.
     * @param {string} openstack_id of instance.
     */
    stopVm(openstack_id: string): void {
        this.virtualmachineservice.stopVM(openstack_id).subscribe(result => {

            this.status_changed = 0;


            if (this.tab === 'own') {
                this.getVms();
            }
            else if (this.tab === 'all') {
                this.getAllVms();

            }

            if (result['stopped']) {
                this.status_changed = 1;
            }
            else {
                this.status_changed = 2;
            }


        })
    }

    /**
     * Get all vms of user.
     * @param {string} elixir_id of user
     */
    getVms(): void {
        this.virtualmachineservice.getVmsFromLoggedInUser().subscribe(vms => {
                this.vms_content = vms;

                for (let vm of this.vms_content) {
                    this.setCollapseStatus(vm.openstackid, false)

                    if (vm.created_at != '') {
                        vm.created_at = new Date(parseInt(vm.created_at) * 1000).toLocaleDateString();
                    }

                    if (vm.stopped_at != '' && vm.stopped_at != 'ACTIVE') {
                        vm.stopped_at = new Date(parseInt(vm.stopped_at) * 1000).toLocaleDateString();
                    }
                    else {
                        vm.stopped_at = ''
                    }
                }
                this.isLoaded = true;
                this.applyFilter();

            }
        );
    }

    refreshVms(): void {
        this.vms_returned = [];
        this.virtualmachineservice.getVmsFromLoggedInUser().subscribe(vms => {
                this.vms_content = vms;

                for (let vm of this.vms_content) {
                    this.setCollapseStatus(vm.openstackid, false)

                    if (vm.created_at != '') {
                        vm.created_at = new Date(parseInt(vm.created_at) * 1000).toLocaleDateString();
                    }

                    if (vm.stopped_at != '' && vm.stopped_at != 'ACTIVE') {
                        vm.stopped_at = new Date(parseInt(vm.stopped_at) * 1000).toLocaleDateString();
                    }
                    else {
                        vm.stopped_at = ''
                    }
                }
                this.isLoaded = true;
                this.applyFilter();

            }
        );


    }

    /**
     * Resume a vm.
     * @param {string} openstack_id of instance.
     */
    resumeVM(openstack_id: string): void {

        this.virtualmachineservice.resumeVM(openstack_id).subscribe(result => {


            this.status_changed = 0;


            if (this.tab === 'own') {
                this.getVms();
            }
            else if (this.tab === 'all') {
                this.getAllVms();

            }

            if (result['resumed']) {
                this.status_changed = 1;
            }
            else {
                this.status_changed = 2;
            }

        })
    }

    /**
     * Get all vms.
     */
    getAllVms(): void {
        this.virtualmachineservice.getAllVM().subscribe(vms => {
                this.vms_content = vms;
                for (let vm of this.vms_content) {
                    this.setCollapseStatus(vm.openstackid, false)


                    if (vm.created_at != '') {
                        vm.created_at = new Date(parseInt(vm.created_at) * 1000).toLocaleDateString();
                    }
                    if (vm.stopped_at != '' && vm.stopped_at != 'ACTIVE') {
                        vm.stopped_at = new Date(parseInt(vm.stopped_at) * 1000).toLocaleDateString();
                    }
                    else {
                        vm.stopped_at = ''
                    }

                }
                this.applyFilter();


            }
        );
    }

    ngOnInit(): void {
        this.getVms();
        this.checkVOstatus()

    }

    /**
     * Check vm status.
     * @param {UserService} userservice
     */
    checkVOstatus() {
       this.voService.isVo().subscribe(res =>{
           this.is_vo_admin=res['Is_Vo_Manager'];
       })
    }

    /**
     * Create snapshot.
     * @param {string} snapshot_instance which is used for creating the snapshot
     * @param {string} snapshot_name name of the snapshot
     */
    createSnapshot(snapshot_instance: string, snapshot_name: string) {
        this.imageService.createSnapshot(snapshot_instance, snapshot_name).subscribe(result => {
            if (result['Error']) {
                this.snapshotDone = result['Error'].toString();
            }
            else if (result['Created']) {
                this.imageService.getSnapshot(result['Created']).subscribe(res => {
                })
                this.snapshotDone = 'true';
            }

        })
    }

}
