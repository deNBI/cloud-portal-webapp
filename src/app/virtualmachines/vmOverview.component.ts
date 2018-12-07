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

@Component({
    selector: 'vm-overview',
    templateUrl: 'vmOverview.component.html',
    providers: [ImageService, UserService, VirtualmachineService, FullLayoutComponent, PerunSettings]
})


export class VmOverviewComponent extends FilterBaseClass implements OnInit {
    vms_content: VirtualMachine[];
    vms_filtered: VirtualMachine[];
    vms_returned: VirtualMachine[];
    vmsPerPage = 5;
    currentPage = 1;
    vmStart = 0;
    selected_command: string;
    vmEnd = this.vmsPerPage;
    status_changed_vm: string;
    status_changed_vm_id: string;
    elixir_id: string;
    is_vo_admin: boolean;
    snapshot_vm: VirtualMachine;
    validSnapshotNameBool: boolean;
    snapshotDone: string = 'Waiting';
    snapshotName: string;
    tab = 'own';
    status_changed: number = 0;

    private checkStatusTimeout: number = 1500;
    reboot_type: string;
    status_check_error: boolean;
    reboot_done: boolean;


    constructor(private imageService: ImageService, private userservice: UserService, private virtualmachineservice: VirtualmachineService, private perunsettings: PerunSettings) {
        super()
    }

    pageChanged(event): void {

        const startItem = (event.page - 1) * event.itemsPerPage;
        const endItem = event.page * event.itemsPerPage;
        this.vmStart = startItem;
        this.vmEnd = endItem;
        this.vms_returned = this.vms_filtered.slice(startItem, endItem)

    }


    checkFilter(vm: VirtualMachine) {
        if (this.isFilterstatus(vm.status) && this.isFilterProjectName(vm.project) && this.isFilterCreated_at(vm.created_at) && this.isFilterElixir_id(vm.elixir_id) && this.isFilterName(vm.name) && this.isFilterStopped_at(vm.stopped_at) && this.isFilterUsername(vm.username)) {
            return true
        }
        else {
            return false
        }


    }


    applyFilter() {


        this.vms_filtered = this.vms_content.filter(vm => this.checkFilter(vm));

        this.vmStart = 0;
        this.vmEnd = this.vmsPerPage;

        this.vms_returned = this.vms_filtered.slice(this.vmStart, this.vmEnd);
        this.currentPage = 1


    }


    toggleTab(tabString: string) {
        this.tab = tabString;
    }

    checkInactiveVms() {
        this.virtualmachineservice.checkStatusInactiveVms(this.elixir_id).subscribe(vms => {
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

    validSnapshotName(e) {
        this.validSnapshotNameBool = this.snapshotName.length > 0 ? true : false;


    }

    resetSnapshotResult() {
        this.snapshotDone = 'Waiting';
    }

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


    deleteVm(openstack_id: string): void {
        this.virtualmachineservice.deleteVM(openstack_id).subscribe(result => {

            this.status_changed = 0;


            if (this.tab === 'own') {
                this.getVms(this.elixir_id);
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

    check_status_loop(id: string) {

        setTimeout(() => {
            this.virtualmachineservice.checkVmStatus(id).subscribe(res => {
                res = res;

                if (res['Started']) {
                    this.reboot_done = true;
                    if (this.tab === 'own') {
                        this.getVms(this.elixir_id);
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


    stopVm(openstack_id: string): void {
        this.virtualmachineservice.stopVM(openstack_id).subscribe(result => {

            this.status_changed = 0;


            if (this.tab === 'own') {
                this.getVms(this.elixir_id);
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

    getVms(elixir_id: string): void {
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

                this.checkInactiveVms();
            }
        );
    }

    resumeVM(openstack_id: string): void {

        this.virtualmachineservice.resumeVM(openstack_id).subscribe(result => {


            this.status_changed = 0;


            if (this.tab === 'own') {
                this.getVms(this.elixir_id);
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
        this.getElixirId();
        this.checkVOstatus(this.userservice)

    }

    checkVOstatus(userservice: UserService) {
        let user_id: number;
        let admin_vos: {};
        this.userservice
            .getLoggedUser().toPromise()
            .then(function (userdata) {
                //TODO catch errors
                user_id = userdata["id"];
                return userservice.getVosWhereUserIsAdmin().toPromise();
            }).then(function (adminvos) {
            admin_vos = adminvos;
        }).then(result => {
            //check if user is a Vo admin so we can serv according buttons
            for (let vkey in admin_vos) {
                if (admin_vos[vkey]["id"] == this.perunsettings.getPerunVO().toString()) {
                    this.is_vo_admin = true;
                }
            }
        });
    }

    createSnapshot(snapshot_instance: string, snapshot_name: string) {
        this.imageService.createSnapshot(snapshot_instance, snapshot_name).subscribe(result => {
            if (result['Error']) {
                this.snapshotDone = result['Error'].toString();
            }
            else if (result['Created'])
                this.snapshotDone = 'true';


        })
    }


    getElixirId() {
        this.userservice.getLoggedUser().toPromise()
            .then(result => {
                let res = result;

                let userid = res["id"];
                this.userservice.getLogins().toPromise().then(result => {
                    let logins = result;
                    for (let login of logins) {
                        if (login['friendlyName'] === 'login-namespace:elixir-persistent') {

                            this.elixir_id = login['value'];

                            break

                        }


                    }
                }).then(result => {
                    this.getVms(this.elixir_id)

                });
            })

    }
}
