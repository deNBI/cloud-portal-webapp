import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormsModule} from '@angular/forms';
import 'rxjs/Rx'

import {PerunSettings} from "../perun-connector/connector-settings.service";
import {AuthzResolver} from "../perun-connector/authz-resolver.service";
import {UsersManager} from "../perun-connector/users-manager.service";
import {ApiSettings} from "../api-connector/api-settings.service";
import {MembersManager} from '../perun-connector/members-manager.service'
import {GroupsManager} from "../perun-connector/groups-manager.service";
import {VirtualmachineService} from "../api-connector/virtualmachine.service";
import {VirtualMachine} from "../virtualmachinemodels/virtualmachine";
import {Userinfo} from "../userinfo/userinfo.model";
import {keyService} from "../api-connector/key.service";


@Component({
  selector: 'vm-overview',
  templateUrl: 'vmOverview.component.html',
  providers: [VirtualmachineService, AuthzResolver, UsersManager, MembersManager, Userinfo, PerunSettings, ApiSettings, GroupsManager, keyService]
})


export class VmOverviewComponent implements OnInit {
  vms: VirtualMachine[];
  userinfo: Userinfo;
  elixir_id: string


  constructor(private virtualmachineservice: VirtualmachineService, private authzresolver: AuthzResolver, private  memberssmanager: MembersManager, private keyService: keyService) {

  }
  stopVm(openstack_id :string):void {
    this.virtualmachineservice.stopVM(openstack_id).subscribe(result =>{console.log(result.text());})
  }

  getVms(elixir_id: string): void {
    this.virtualmachineservice.getVm(elixir_id).subscribe(vms => {
        this.vms = vms;
        for (let vm of this.vms) {
          vm.created_at = new Date(parseInt(vm.created_at) * 1000).toLocaleDateString();
        }
      }
    );
  }

  ngOnInit(): void {
    this.getUserinfo();
  }

  getUserPublicKey() {
    this.keyService.getKey(this.userinfo.ElxirId).subscribe(result => {
      this.userinfo.PublicKey = result.toString();
    })
  }

  getUserinfo() {
    this.authzresolver.getPerunPrincipal().toPromise().then(result => {
      this.elixir_id = result.json()['actor'];
    }).then(result => {
      this.getVms(this.elixir_id)
    });
  }

}
