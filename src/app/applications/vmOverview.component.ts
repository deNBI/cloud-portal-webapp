import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormsModule} from '@angular/forms';
import 'rxjs/Rx'

import {PerunSettings} from "../perun-connector/connector-settings.service";
import {AuthzResolver} from "../perun-connector/authz-resolver.service";
import {UsersManager} from "../perun-connector/users-manager.service";
import {VirtualmachineService} from "../api-connector/virtualmachine.service";
import {VirtualMachine} from "../virtualmachinemodels/virtualmachine";
import {FullLayoutComponent} from "../layouts/full-layout.component";


@Component({
  selector: 'vm-overview',
  templateUrl: 'vmOverview.component.html',
  providers: [VirtualmachineService, FullLayoutComponent, AuthzResolver, UsersManager, PerunSettings]
})


export class VmOverviewComponent implements OnInit {
  vms: VirtualMachine[];
  elixir_id: string;
  is_vo_admin: boolean;


  constructor(private virtualmachineservice: VirtualmachineService, private authzresolver: AuthzResolver, private  usersmanager: UsersManager, private perunsettings: PerunSettings) {

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

  getAllVms():void{
    this.virtualmachineservice.getAllVM().subscribe(vms => {
        this.vms = vms;
        for (let vm of this.vms) {
          vm.created_at = new Date(parseInt(vm.created_at) * 1000).toLocaleDateString();
        }
      }
    );
  }

  ngOnInit(): void {
    this.getElixirId();
    this.checkVOstatus(this.usersmanager)
  }

    checkVOstatus(usersmanager: UsersManager) {
    let user_id: number;
    let admin_vos: {};
    this.authzresolver
      .getLoggedUser().toPromise()
      .then(function (userdata) {
        //TODO catch errors
        user_id = userdata.json()["id"];
        return usersmanager.getVosWhereUserIsAdmin(user_id).toPromise();
      }).then(function (adminvos) {
      admin_vos = adminvos.json();
    }).then(result => {
      //check if user is a Vo admin so we can serv according buttons
      for (let vkey in admin_vos) {
        if (admin_vos[vkey]["id"] == this.perunsettings.getPerunVO().toString()) {
          this.is_vo_admin = true;
        }
        break;
      }
    });
  }


  getElixirId() {
    this.authzresolver.getPerunPrincipal().toPromise().then(result => {
      this.elixir_id = result.json()['actor'];
    }).then(result => {
      this.getVms(this.elixir_id)
    });
  }

}
