import ***REMOVED***Component, OnInit, TemplateRef***REMOVED*** from '@angular/core';
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';

import ***REMOVED***PerunSettings***REMOVED*** from "../perun-connector/connector-settings.service";
import ***REMOVED***VirtualmachineService***REMOVED*** from "../api-connector/virtualmachine.service";
import ***REMOVED***VirtualMachine***REMOVED*** from "./virtualmachinemodels/virtualmachine";
import ***REMOVED***FullLayoutComponent***REMOVED*** from "../layouts/full-layout.component";
import ***REMOVED***UserService***REMOVED*** from "../api-connector/user.service";
import ***REMOVED***ImageService***REMOVED*** from "../api-connector/image.service";
import ***REMOVED***Vmclient***REMOVED*** from "./virtualmachinemodels/vmclient";
import ***REMOVED***FilterBaseClass***REMOVED*** from "../shared_modules/baseClass/filter-base-class";

@Component(***REMOVED***
    selector: 'vm-overview',
    templateUrl: 'vmOverview.component.html',
    providers: [ImageService, UserService, VirtualmachineService, FullLayoutComponent, PerunSettings]
***REMOVED***)


export class VmOverviewComponent extends FilterBaseClass implements OnInit ***REMOVED***
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


    constructor(private imageService: ImageService, private userservice: UserService, private virtualmachineservice: VirtualmachineService, private perunsettings: PerunSettings) ***REMOVED***
        super()
    ***REMOVED***

    pageChanged(event): void ***REMOVED***

        const startItem = (event.page - 1) * event.itemsPerPage;
        const endItem = event.page * event.itemsPerPage;
        this.vmStart = startItem;
        this.vmEnd = endItem;
        this.vms_returned = this.vms_filtered.slice(startItem, endItem)

    ***REMOVED***


    checkFilter(vm: VirtualMachine) ***REMOVED***
        if (this.isFilterstatus(vm.status) && this.isFilterProjectName(vm.project) && this.isFilterCreated_at(vm.created_at) && this.isFilterElixir_id(vm.elixir_id) && this.isFilterName(vm.name) && this.isFilterStopped_at(vm.stopped_at) && this.isFilterUsername(vm.username)) ***REMOVED***
            return true
        ***REMOVED***
        else ***REMOVED***
            return false
        ***REMOVED***


    ***REMOVED***


    applyFilter() ***REMOVED***


        this.vms_filtered = this.vms_content.filter(vm => this.checkFilter(vm));

        this.vmStart = 0;
        this.vmEnd = this.vmsPerPage;

        this.vms_returned = this.vms_filtered.slice(this.vmStart, this.vmEnd);
        this.currentPage = 1


    ***REMOVED***


    toggleTab(tabString: string) ***REMOVED***
        this.tab = tabString;
    ***REMOVED***

    checkInactiveVms() ***REMOVED***
        this.virtualmachineservice.checkStatusInactiveVms(this.elixir_id).subscribe(vms => ***REMOVED***
            this.vms_content = vms;
            for (let vm of this.vms_content) ***REMOVED***
                if (vm.created_at != '') ***REMOVED***
                    vm.created_at = new Date(parseInt(vm.created_at) * 1000).toLocaleDateString();
                ***REMOVED***
                if (vm.stopped_at != '' && vm.stopped_at != 'ACTIVE') ***REMOVED***
                    vm.stopped_at = new Date(parseInt(vm.stopped_at) * 1000).toLocaleDateString();
                ***REMOVED***
                else ***REMOVED***
                    vm.stopped_at = ''
                ***REMOVED***
            ***REMOVED***
            this.applyFilter();

        ***REMOVED***)
    ***REMOVED***

    validSnapshotName(e) ***REMOVED***
        this.validSnapshotNameBool = this.snapshotName.length > 0 ? true : false;


    ***REMOVED***

    resetSnapshotResult() ***REMOVED***
        this.snapshotDone = 'Waiting';
    ***REMOVED***

    checkStatus(openstackid: string) ***REMOVED***
        this.virtualmachineservice.checkVmStatus(openstackid).subscribe(res => ***REMOVED***


                this.virtualmachineservice.getVmsFromLoggedInUser().subscribe(vms => ***REMOVED***
                        this.vms_content = vms;
                        for (let vm of this.vms_content) ***REMOVED***
                            if (vm.created_at != '') ***REMOVED***
                                vm.created_at = new Date(parseInt(vm.created_at) * 1000).toLocaleDateString();
                            ***REMOVED***
                            if (vm.stopped_at != '' && vm.stopped_at != 'ACTIVE') ***REMOVED***
                                vm.stopped_at = new Date(parseInt(vm.stopped_at) * 1000).toLocaleDateString();
                            ***REMOVED***
                            else ***REMOVED***
                                vm.stopped_at = ''
                            ***REMOVED***
                        ***REMOVED***
                        this.applyFilter()


                    ***REMOVED***
                );

            ***REMOVED***
        )
    ***REMOVED***


    deleteVm(openstack_id: string): void ***REMOVED***
        this.virtualmachineservice.deleteVM(openstack_id).subscribe(result => ***REMOVED***

            this.status_changed = 0;


            if (this.tab === 'own') ***REMOVED***
                this.getVms(this.elixir_id);
            ***REMOVED***
            else if (this.tab === 'all') ***REMOVED***
                this.getAllVms();

            ***REMOVED***

            if (result['deleted'] === true) ***REMOVED***
                this.status_changed = 1;
            ***REMOVED***
            else ***REMOVED***
                this.status_changed = 2;
            ***REMOVED***


        ***REMOVED***)
    ***REMOVED***

    public rebootVm(openstack_id: string, reboot_type: string) ***REMOVED***
        this.virtualmachineservice.rebootVM(openstack_id, reboot_type).subscribe(result => ***REMOVED***
            this.status_changed = 0;


            if (result['reboot']) ***REMOVED***
                this.status_changed = 1;
                this.check_status_loop(openstack_id)
            ***REMOVED***
            else ***REMOVED***
                this.status_changed = 2;
            ***REMOVED***


        ***REMOVED***)
    ***REMOVED***

    check_status_loop(id: string) ***REMOVED***

        setTimeout(() => ***REMOVED***
            this.virtualmachineservice.checkVmStatus(id).subscribe(res => ***REMOVED***
                res = res;

                if (res['Started']) ***REMOVED***
                    this.reboot_done = true;
                    if (this.tab === 'own') ***REMOVED***
                        this.getVms(this.elixir_id);
                    ***REMOVED***
                    else if (this.tab === 'all') ***REMOVED***
                        this.getAllVms();

                    ***REMOVED***


                ***REMOVED***
                else ***REMOVED***
                    if (res['Error']) ***REMOVED***
                        this.status_check_error = true


                    ***REMOVED***
                    this.check_status_loop(id)
                ***REMOVED***

            ***REMOVED***)
        ***REMOVED***, this.checkStatusTimeout);
    ***REMOVED***


    stopVm(openstack_id: string): void ***REMOVED***
        this.virtualmachineservice.stopVM(openstack_id).subscribe(result => ***REMOVED***

            this.status_changed = 0;


            if (this.tab === 'own') ***REMOVED***
                this.getVms(this.elixir_id);
            ***REMOVED***
            else if (this.tab === 'all') ***REMOVED***
                this.getAllVms();

            ***REMOVED***

            if (result['stopped']) ***REMOVED***
                this.status_changed = 1;
            ***REMOVED***
            else ***REMOVED***
                this.status_changed = 2;
            ***REMOVED***


        ***REMOVED***)
    ***REMOVED***

    getVms(elixir_id: string): void ***REMOVED***
        this.virtualmachineservice.getVmsFromLoggedInUser().subscribe(vms => ***REMOVED***
                this.vms_content = vms;

                for (let vm of this.vms_content) ***REMOVED***
                    this.setCollapseStatus(vm.openstackid, false)

                    if (vm.created_at != '') ***REMOVED***
                        vm.created_at = new Date(parseInt(vm.created_at) * 1000).toLocaleDateString();
                    ***REMOVED***

                    if (vm.stopped_at != '' && vm.stopped_at != 'ACTIVE') ***REMOVED***
                        vm.stopped_at = new Date(parseInt(vm.stopped_at) * 1000).toLocaleDateString();
                    ***REMOVED***
                    else ***REMOVED***
                        vm.stopped_at = ''
                    ***REMOVED***
                ***REMOVED***
                this.isLoaded = true;
                this.applyFilter();

                this.checkInactiveVms();
            ***REMOVED***
        );
    ***REMOVED***

    resumeVM(openstack_id: string): void ***REMOVED***

        this.virtualmachineservice.resumeVM(openstack_id).subscribe(result => ***REMOVED***


            this.status_changed = 0;


            if (this.tab === 'own') ***REMOVED***
                this.getVms(this.elixir_id);
            ***REMOVED***
            else if (this.tab === 'all') ***REMOVED***
                this.getAllVms();

            ***REMOVED***

            if (result['resumed']) ***REMOVED***
                this.status_changed = 1;
            ***REMOVED***
            else ***REMOVED***
                this.status_changed = 2;
            ***REMOVED***

        ***REMOVED***)
    ***REMOVED***


    getAllVms(): void ***REMOVED***
        this.virtualmachineservice.getAllVM().subscribe(vms => ***REMOVED***
                this.vms_content = vms;
                for (let vm of this.vms_content) ***REMOVED***
                    this.setCollapseStatus(vm.openstackid, false)


                    if (vm.created_at != '') ***REMOVED***
                        vm.created_at = new Date(parseInt(vm.created_at) * 1000).toLocaleDateString();
                    ***REMOVED***
                    if (vm.stopped_at != '' && vm.stopped_at != 'ACTIVE') ***REMOVED***
                        vm.stopped_at = new Date(parseInt(vm.stopped_at) * 1000).toLocaleDateString();
                    ***REMOVED***
                    else ***REMOVED***
                        vm.stopped_at = ''
                    ***REMOVED***

                ***REMOVED***
                this.applyFilter();


            ***REMOVED***
        );
    ***REMOVED***

    ngOnInit(): void ***REMOVED***
        this.getElixirId();
        this.checkVOstatus(this.userservice)

    ***REMOVED***

    checkVOstatus(userservice: UserService) ***REMOVED***
        let user_id: number;
        let admin_vos: ***REMOVED******REMOVED***;
        this.userservice
            .getLoggedUser().toPromise()
            .then(function (userdata) ***REMOVED***
                //TODO catch errors
                user_id = userdata["id"];
                return userservice.getVosWhereUserIsAdmin().toPromise();
            ***REMOVED***).then(function (adminvos) ***REMOVED***
            admin_vos = adminvos;
        ***REMOVED***).then(result => ***REMOVED***
            //check if user is a Vo admin so we can serv according buttons
            for (let vkey in admin_vos) ***REMOVED***
                if (admin_vos[vkey]["id"] == this.perunsettings.getPerunVO().toString()) ***REMOVED***
                    this.is_vo_admin = true;
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***

    createSnapshot(snapshot_instance: string, snapshot_name: string) ***REMOVED***
        this.imageService.createSnapshot(snapshot_instance, snapshot_name).subscribe(result => ***REMOVED***
            if (result['Error']) ***REMOVED***
                this.snapshotDone = result['Error'].toString();
            ***REMOVED***
            else if (result['Created'])
                this.snapshotDone = 'true';


        ***REMOVED***)
    ***REMOVED***


    getElixirId() ***REMOVED***
        this.userservice.getLoggedUser().toPromise()
            .then(result => ***REMOVED***
                let res = result;

                let userid = res["id"];
                this.userservice.getLogins().toPromise().then(result => ***REMOVED***
                    let logins = result;
                    for (let login of logins) ***REMOVED***
                        if (login['friendlyName'] === 'login-namespace:elixir-persistent') ***REMOVED***

                            this.elixir_id = login['value'];

                            break

                        ***REMOVED***


                    ***REMOVED***
                ***REMOVED***).then(result => ***REMOVED***
                    this.getVms(this.elixir_id)

                ***REMOVED***);
            ***REMOVED***)

    ***REMOVED***
***REMOVED***
