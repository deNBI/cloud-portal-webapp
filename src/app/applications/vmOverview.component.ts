import ***REMOVED***Component, OnInit, TemplateRef***REMOVED*** from '@angular/core';
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import 'rxjs/Rx'

import ***REMOVED***PerunSettings***REMOVED*** from "../perun-connector/connector-settings.service";
import ***REMOVED***AuthzResolver***REMOVED*** from "../perun-connector/authz-resolver.service";
import ***REMOVED***UsersManager***REMOVED*** from "../perun-connector/users-manager.service";
import ***REMOVED***VirtualmachineService***REMOVED*** from "../api-connector/virtualmachine.service";
import ***REMOVED***VirtualMachine***REMOVED*** from "../virtualmachinemodels/virtualmachine";
import ***REMOVED***FullLayoutComponent***REMOVED*** from "../layouts/full-layout.component";


@Component(***REMOVED***
  selector: 'vm-overview',
  templateUrl: 'vmOverview.component.html',
  providers: [VirtualmachineService, FullLayoutComponent, AuthzResolver, UsersManager, PerunSettings]
***REMOVED***)


export class VmOverviewComponent implements OnInit ***REMOVED***
  vms: VirtualMachine[];
  elixir_id: string;
  is_vo_admin: boolean;


  constructor(private virtualmachineservice: VirtualmachineService, private authzresolver: AuthzResolver, private  usersmanager: UsersManager, private perunsettings: PerunSettings) ***REMOVED***

  ***REMOVED***

  stopVm(openstack_id: string): void ***REMOVED***
    this.virtualmachineservice.stopVM(openstack_id).subscribe(result => ***REMOVED***
      console.log(result.text());
      this.virtualmachineservice.getVm(this.elixir_id);

    ***REMOVED***)
  ***REMOVED***

  getVms(elixir_id: string): void ***REMOVED***
    this.virtualmachineservice.getVm(elixir_id).subscribe(vms => ***REMOVED***
        this.vms = vms;
        for (let vm of this.vms) ***REMOVED***
          vm.created_at = new Date(parseInt(vm.created_at) * 1000).toLocaleDateString();
          vm.stopped_at = new Date(parseInt(vm.stopped_at) * 1000).toLocaleDateString();
        ***REMOVED***
      ***REMOVED***
    );
  ***REMOVED***

  resumeVM(openstack_id: string): void ***REMOVED***

    this.virtualmachineservice.resumeVM(openstack_id).subscribe(result => ***REMOVED***
      console.log(result.text());
      this.virtualmachineservice.getVm(this.elixir_id);
    ***REMOVED***)
  ***REMOVED***

  getAllVms(): void ***REMOVED***
    this.virtualmachineservice.getAllVM().subscribe(vms => ***REMOVED***
        this.vms = vms;
        for (let vm of this.vms) ***REMOVED***
          vm.created_at = new Date(parseInt(vm.created_at) * 1000).toLocaleDateString();
        ***REMOVED***
      ***REMOVED***
    );
  ***REMOVED***

  ngOnInit(): void ***REMOVED***
    this.getElixirId();
    this.checkVOstatus(this.usersmanager)
  ***REMOVED***

    checkVOstatus(usersmanager: UsersManager) ***REMOVED***
    let user_id: number;
    let admin_vos: ***REMOVED******REMOVED***;
    this.authzresolver
      .getLoggedUser().toPromise()
      .then(function (userdata) ***REMOVED***
        //TODO catch errors
        user_id = userdata.json()["id"];
        return usersmanager.getVosWhereUserIsAdmin(user_id).toPromise();
      ***REMOVED***).then(function (adminvos) ***REMOVED***
      admin_vos = adminvos.json();
    ***REMOVED***).then(result => ***REMOVED***
      //check if user is a Vo admin so we can serv according buttons
      for (let vkey in admin_vos) ***REMOVED***
        if (admin_vos[vkey]["id"] == this.perunsettings.getPerunVO().toString()) ***REMOVED***
          this.is_vo_admin = true;
        ***REMOVED***
        break;
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED***


  getElixirId() ***REMOVED***
    this.authzresolver.getPerunPrincipal().toPromise().then(result => ***REMOVED***
      this.elixir_id = result.json()['actor'];
    ***REMOVED***).then(result => ***REMOVED***
      this.getVms(this.elixir_id)
    ***REMOVED***);
  ***REMOVED***

***REMOVED***
