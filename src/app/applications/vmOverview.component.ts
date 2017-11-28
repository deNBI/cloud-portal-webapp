import ***REMOVED***Component, OnInit, TemplateRef***REMOVED*** from '@angular/core';
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import 'rxjs/Rx'

import ***REMOVED***PerunSettings***REMOVED*** from "../perun-connector/connector-settings.service";
import ***REMOVED***AuthzResolver***REMOVED*** from "../perun-connector/authz-resolver.service";
import ***REMOVED***UsersManager***REMOVED*** from "../perun-connector/users-manager.service";
import ***REMOVED***ApiSettings***REMOVED*** from "../api-connector/api-settings.service";
import ***REMOVED***MembersManager***REMOVED*** from '../perun-connector/members-manager.service'
import ***REMOVED***GroupsManager***REMOVED*** from "../perun-connector/groups-manager.service";
import ***REMOVED***VirtualmachineService***REMOVED*** from "../api-connector/virtualmachine.service";
import ***REMOVED***VirtualMachine***REMOVED*** from "../virtualmachinemodels/virtualmachine";
import ***REMOVED***Userinfo***REMOVED*** from "../userinfo/userinfo.model";
import ***REMOVED***keyService***REMOVED*** from "../api-connector/key.service";


@Component(***REMOVED***
  selector: 'vm-overview',
  templateUrl: 'vmOverview.component.html',
  providers: [VirtualmachineService, AuthzResolver, UsersManager, MembersManager, Userinfo, PerunSettings, ApiSettings, GroupsManager, keyService]
***REMOVED***)


export class VmOverviewComponent implements OnInit ***REMOVED***
  vms: VirtualMachine[];
  elixir_id: string


  constructor(private virtualmachineservice: VirtualmachineService, private authzresolver: AuthzResolver) ***REMOVED***

  ***REMOVED***
  stopVm(openstack_id :string):void ***REMOVED***
    this.virtualmachineservice.stopVM(openstack_id).subscribe(result =>***REMOVED***console.log(result.text());***REMOVED***)
  ***REMOVED***

  getVms(elixir_id: string): void ***REMOVED***
    this.virtualmachineservice.getVm(elixir_id).subscribe(vms => ***REMOVED***
        this.vms = vms;
        for (let vm of this.vms) ***REMOVED***
          vm.created_at = new Date(parseInt(vm.created_at) * 1000).toLocaleDateString();
        ***REMOVED***
      ***REMOVED***
    );
  ***REMOVED***

  getAllVms():void***REMOVED***
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
  ***REMOVED***


  getElixirId() ***REMOVED***
    this.authzresolver.getPerunPrincipal().toPromise().then(result => ***REMOVED***
      this.elixir_id = result.json()['actor'];
    ***REMOVED***).then(result => ***REMOVED***
      this.getVms(this.elixir_id)
    ***REMOVED***);
  ***REMOVED***

***REMOVED***
