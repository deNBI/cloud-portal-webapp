import ***REMOVED***Component, OnInit, TemplateRef***REMOVED*** from '@angular/core';
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import 'rxjs/Rx'

import ***REMOVED***PerunSettings***REMOVED*** from "../perun-connector/connector-settings.service";
import ***REMOVED***VirtualmachineService***REMOVED*** from "../api-connector/virtualmachine.service";
import ***REMOVED***VirtualMachine***REMOVED*** from "./virtualmachinemodels/virtualmachine";
import ***REMOVED***FullLayoutComponent***REMOVED*** from "../layouts/full-layout.component";
import ***REMOVED***UserService***REMOVED*** from "../api-connector/user.service";
import ***REMOVED***ImageService***REMOVED*** from "../api-connector/image.service";


@Component(***REMOVED***
    selector: 'vm-overview',
    templateUrl: 'vmOverview.component.html',
    providers: [ImageService, UserService, VirtualmachineService, FullLayoutComponent, PerunSettings]
***REMOVED***)


export class VmOverviewComponent implements OnInit ***REMOVED***
    vms: VirtualMachine[];
    status_changed_vm: string;
    status_changed_vm_id: string;
    elixir_id: string;
    is_vo_admin: boolean;
    snapshot_vm: string;
    validSnapshotNameBool: boolean;
    snapshotDone: string='Waiting';
    snapshotName: string;
    tab = 'own';
    status_changed: number = 0;
    filterusername: string;
    filterip: string;
    filtername: string;
    filterstatus: string;
    filtercreated_at: string;
    filterelixir_id: string;
    filterstopped_at: string;
    filterproject: string;
    filterssh: string;



    constructor(private imageService: ImageService, private userservice: UserService, private virtualmachineservice: VirtualmachineService, private perunsettings: PerunSettings) ***REMOVED***
   this.virtualmachineservice.getVolumesByUser().subscribe()

    ***REMOVED***

    toggleTab(tabString: string) ***REMOVED***
        this.tab = tabString;
    ***REMOVED***

    isFilterSSH(ssh_command: string): boolean ***REMOVED***
        if (!this.filterssh) ***REMOVED***
            return true;
        ***REMOVED***
        else if (ssh_command.indexOf(this.filterssh) === 0) ***REMOVED***

            return true;

        ***REMOVED***
        else ***REMOVED***
            return false;
        ***REMOVED***
    ***REMOVED***

    isFilterProject(vmproject: string): boolean ***REMOVED***
        if (!this.filterproject) ***REMOVED***
            return true;
        ***REMOVED***
        else if (vmproject.indexOf(this.filterproject) === 0) ***REMOVED***

            return true;

        ***REMOVED***
        else ***REMOVED***
            return false;
        ***REMOVED***
    ***REMOVED***

    checkInactiveVms() ***REMOVED***
        this.virtualmachineservice.checkStatusInactiveVms(this.elixir_id).subscribe(vms => ***REMOVED***
            this.vms = vms;
            for (let vm of this.vms) ***REMOVED***
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

        ***REMOVED***)
    ***REMOVED***

    validSnapshotName(e) ***REMOVED***
        this.validSnapshotNameBool = this.snapshotName.length > 0 ? true : false;


    ***REMOVED***
    resetSnapshotResult()***REMOVED***
        this,this.snapshotDone='Waiting';
    ***REMOVED***

    checkStatus(openstackid: string) ***REMOVED***
        this.virtualmachineservice.checkVmStatus(openstackid).subscribe(res => ***REMOVED***


                this.virtualmachineservice.getVm(this.elixir_id).subscribe(vms => ***REMOVED***
                        this.vms = vms;
                        for (let vm of this.vms) ***REMOVED***
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

                    ***REMOVED***
                );

            ***REMOVED***
        )
    ***REMOVED***

    isFilterStopped_at(vmstopped_at: string): boolean ***REMOVED***
        if (!this.filterstopped_at) ***REMOVED***
            return true;
        ***REMOVED***
        else if (vmstopped_at.indexOf(this.filterstopped_at) === 0) ***REMOVED***
            return true;
        ***REMOVED***
        else ***REMOVED***
            return false;
        ***REMOVED***
    ***REMOVED***


    isFilterElixir_id(vmelixir_id: string): boolean ***REMOVED***
        if (!this.filterelixir_id) ***REMOVED***
            return true;
        ***REMOVED***
        else if (vmelixir_id.indexOf(this.filterelixir_id) === 0) ***REMOVED***
            return true;
        ***REMOVED***
        else ***REMOVED***
            return false;
        ***REMOVED***
    ***REMOVED***

    isFilterCreated_at(vmcreated_at: string): boolean ***REMOVED***
        if (!this.filtercreated_at) ***REMOVED***
            return true;
        ***REMOVED***
        else if (vmcreated_at.indexOf(this.filtercreated_at) === 0) ***REMOVED***
            return true;
        ***REMOVED***
        else ***REMOVED***
            return false;
        ***REMOVED***
    ***REMOVED***

    isFilterName(vmname: string): boolean ***REMOVED***
        if (!this.filtername) ***REMOVED***
            return true;
        ***REMOVED***
        else if (vmname.indexOf(this.filtername) === 0) ***REMOVED***
            return true;
        ***REMOVED***
        else ***REMOVED***
            return false;
        ***REMOVED***
    ***REMOVED***

    isFilterIP(vmip: string): boolean ***REMOVED***
        if (!this.filterip) ***REMOVED***
            return true;
        ***REMOVED***
        else if (vmip == null) ***REMOVED***
            return false;
        ***REMOVED***
        else if (vmip.indexOf(this.filterip) === 0) ***REMOVED***

            return true;
        ***REMOVED***
        else ***REMOVED***
            return false;
        ***REMOVED***
    ***REMOVED***

    isFilterstatus(vmstatus: string): boolean ***REMOVED***
        if (!this.filterstatus) ***REMOVED***
            return true;
        ***REMOVED***
        else if (vmstatus.indexOf(this.filterstatus) === 0) ***REMOVED***
            return true;
        ***REMOVED***
        else ***REMOVED***
            return false;
        ***REMOVED***
    ***REMOVED***

    isFilterUsername(vmusername: string): boolean ***REMOVED***
        if (!this.filterusername) ***REMOVED***
            return true;
        ***REMOVED***
        else if (vmusername.indexOf(this.filterusername) === 0) ***REMOVED***

            return true;
        ***REMOVED***
        else ***REMOVED***
            return false;
        ***REMOVED***
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

            if (result.text() === 'true') ***REMOVED***
                this.status_changed = 1;
            ***REMOVED***
            else ***REMOVED***
                this.status_changed = 2;
            ***REMOVED***


        ***REMOVED***)
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

            if (result.text() === 'true') ***REMOVED***
                this.status_changed = 1;
            ***REMOVED***
            else ***REMOVED***
                this.status_changed = 2;
            ***REMOVED***


        ***REMOVED***)
    ***REMOVED***

    getVms(elixir_id: string): void ***REMOVED***
        this.virtualmachineservice.getVm(elixir_id).subscribe(vms => ***REMOVED***
                this.vms = vms;
                for (let vm of this.vms) ***REMOVED***
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

            if (result.text() === 'true') ***REMOVED***
                this.status_changed = 1;
            ***REMOVED***
            else ***REMOVED***
                this.status_changed = 2;
            ***REMOVED***

        ***REMOVED***)
    ***REMOVED***


    getAllVms(): void ***REMOVED***
        this.virtualmachineservice.getAllVM().subscribe(vms => ***REMOVED***
                this.vms = vms;
                for (let vm of this.vms) ***REMOVED***

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
                user_id = userdata.json()["id"];
                return userservice.getVosWhereUserIsAdmin(user_id).toPromise();
            ***REMOVED***).then(function (adminvos) ***REMOVED***
            admin_vos = adminvos.json();
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
            if (result['Error'])***REMOVED***
                this.snapshotDone=result['Error'].toString();
            ***REMOVED***
            else if (result['Created'])
                this.snapshotDone='true';


        ***REMOVED***)
    ***REMOVED***


    getElixirId() ***REMOVED***
        this.userservice.getLoggedUser().toPromise()
            .then(result => ***REMOVED***
                let res = result.json();

                let userid = res["id"];
                this.userservice.getLogins(userid).toPromise().then(result => ***REMOVED***
                    let logins = result.json()
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
