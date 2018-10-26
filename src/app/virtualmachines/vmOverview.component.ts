import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {PerunSettings} from "../perun-connector/connector-settings.service";
import {VirtualmachineService} from "../api-connector/virtualmachine.service";
import {VirtualMachine} from "./virtualmachinemodels/virtualmachine";
import {FullLayoutComponent} from "../layouts/full-layout.component";
import {UserService} from "../api-connector/user.service";
import {ImageService} from "../api-connector/image.service";
import {Vmclient} from "./virtualmachinemodels/vmclient";

@Component({
    selector: 'vm-overview',
    templateUrl: 'vmOverview.component.html',
    providers: [ImageService, UserService, VirtualmachineService, FullLayoutComponent, PerunSettings]
})


export class VmOverviewComponent implements OnInit {
    vms_content: VirtualMachine[];
    vms_filtered: VirtualMachine[];
    vms_returned: VirtualMachine[];
    vmsPerPage = 5;
    currentPage=1;
    vmStart = 0;
    selected_command:string;
    vmEnd = this.vmsPerPage;
    status_changed_vm: string;
    status_changed_vm_id: string;
    elixir_id: string;
    is_vo_admin: boolean;
    snapshot_vm: VirtualMachine
    validSnapshotNameBool: boolean;
    snapshotDone: string = 'Waiting';
    snapshotName: string;
    tab = 'own';
    status_changed: number = 0;
    filterusername: string;
    filterip: string;
    filtername: string;
    filterstatus: string;
    filterstatus_list: { [status: string]: boolean } = {'ACTIVE': true, 'SUSPENDED': true, 'DELETED': false};
    filtercreated_at: string;
    filterelixir_id: string;
    filterstopped_at: string;
    filterproject: string;
    filterssh: string;
    collapse_status: { [id: string]: string } = {};
    isLoaded=false;


    constructor(private imageService: ImageService, private userservice: UserService, private virtualmachineservice: VirtualmachineService, private perunsettings: PerunSettings) {

    }

    pageChanged(event): void {

        const startItem = (event.page - 1) * event.itemsPerPage;
        const endItem = event.page * event.itemsPerPage;
        this.vmStart = startItem;
        this.vmEnd = endItem;
        this.vms_returned = this.vms_filtered.slice(startItem, endItem)

    }


    filterVM(vm: VirtualMachine) {
        if (this.isFilterstatus(vm.status) && this.isFilterProject(vm.project) && this.isFilterCreated_at(vm.created_at) && this.isFilterElixir_id(vm.elixir_id) && this.isFilterName(vm.name) && this.isFilterStopped_at(vm.stopped_at) && this.isFilterUsername(vm.username)) {
            return true
        }
        else {
            return false
        }


    }


    applyFilter() {


        this.vms_filtered = this.vms_content.filter(vm => this.filterVM(vm));

        this.vmStart = 0;
        this.vmEnd = this.vmsPerPage;

        this.vms_returned = this.vms_filtered.slice(this.vmStart, this.vmEnd);
        this.currentPage=1


    }

    changeFilterStatus(status: string) {
        this.filterstatus_list[status] = !this.filterstatus_list[status];


    }


    public getCollapseStatus(id: string) {
        if (id in this.collapse_status) {
            this.switchCollapseStatus(id);
        } else {
            this.collapse_status[id] = 'open';
        }
    }

    public closeCollapse(id:string){
                    this.collapse_status[id] = '';


    }

    public switchCollapseStatus(id: string) {
        this.collapse_status[id] == '' ? this.collapse_status[id] = 'open' : this.collapse_status[id] = '';
    }

    toggleTab(tabString: string) {
        this.tab = tabString;
    }


    isFilterProject(vmproject: string): boolean {

        if (!this.filterproject) {
            return true;
        }
        else if (vmproject.indexOf(this.filterproject) === 0) {

            return true;

        }
        else {

            return false;
        }
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

    isFilterStopped_at(vmstopped_at: string): boolean {
        if (!this.filterstopped_at) {
            return true;
        }
        else if (vmstopped_at.indexOf(this.filterstopped_at) === 0) {
            return true;
        }
        else {
            return false;
        }
    }


    isFilterElixir_id(vmelixir_id: string): boolean {
        if (!this.filterelixir_id) {
            return true;
        }
        else if (vmelixir_id.indexOf(this.filterelixir_id) === 0) {
            return true;
        }
        else {
            return false;
        }
    }

    isFilterCreated_at(vmcreated_at: string): boolean {
        if (!this.filtercreated_at) {
            return true;
        }
        else if (vmcreated_at.indexOf(this.filtercreated_at) === 0) {
            return true;
        }
        else {
            return false;
        }
    }

    isFilterName(vmname: string): boolean {
        if (!this.filtername) {
            return true;
        }
        else if (vmname.indexOf(this.filtername) === 0) {
            return true;
        }
        else {
            return false;
        }
    }

    isFilterIP(vmip: string): boolean {
        if (!this.filterip) {
            return true;
        }
        else if (vmip == null) {
            return false;
        }
        else if (vmip.indexOf(this.filterip) === 0) {

            return true;
        }
        else {
            return false;
        }
    }

    isFilterstatus(vmstatus: string): boolean {
        if (vmstatus == 'FREEMIUM'){
            return true
        }
        if (this.filterstatus_list[vmstatus]
        ) {

            return true
        }
        else {
            return false
        }
    }

    isFilterUsername(vmusername: string): boolean {
        if (!this.filterusername) {
            return true;
        }
        else if (vmusername.indexOf(this.filterusername) === 0) {

            return true;
        }
        else {
            return false;
        }
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
                this.isLoaded=true;
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
