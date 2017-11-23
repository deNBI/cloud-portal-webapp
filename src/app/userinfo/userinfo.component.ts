import {Component} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Userinfo} from './userinfo.model'
import {AuthzResolver} from '../perun-connector/authz-resolver.service'
import {PerunSettings} from "../perun-connector/connector-settings.service";
import {MembersManager} from '../perun-connector/members-manager.service'
import {ApiSettings} from '../api-connector/api-settings.service'

@Component({
  templateUrl: 'userinfo.component.html',
  providers: [AuthzResolver, PerunSettings, MembersManager, ApiSettings]
})
export class UserinfoComponent {
  userinfo: Userinfo;
  elixid: string;

  constructor(private authzresolver: AuthzResolver, private memberssmanager: MembersManager) {
    this.userinfo = new Userinfo();
    this.getUserinfo();
  }

  getUserinfo() {
    this.authzresolver.getLoggedUser().toPromise()
      .then(result => {
        let res = result.json();

        this.userinfo.FirstName = res["firstName"];
        this.userinfo.LastName = res["lastName"];
        this.userinfo.Id = res["id"];

        return this.memberssmanager.getMemberByUser(res["id"]).toPromise();

      }).then(memberinfo => {
      this.userinfo.MemberId = memberinfo.json()["id"];

    })
    this.authzresolver.getPerunPrincipal().toPromise().then(result =>{
        this.userinfo.ElxirId = result.json()['actor'];
      });
  }


}

