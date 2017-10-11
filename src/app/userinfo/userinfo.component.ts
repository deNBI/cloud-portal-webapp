import {Component} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Userinfo} from './userinfo.model'
import {AuthzResolver} from '../perun-connector/authz-resolver.service'
import {PerunSettings} from "../perun-connector/connector-settings.service";

@Component({
  templateUrl: 'userinfo.component.html',
  providers: [AuthzResolver, PerunSettings]
})
export class UserinfoComponent {
  userinfo: Userinfo;

  constructor(private authzresolver: AuthzResolver) {
    this.userinfo = new Userinfo();
    this.getUserinfo();
  }

  getUserinfo() {
    this.authzresolver.getLoggedUser().toPromise()
      .then(result => {

        let res = result.json()
        this.userinfo.FirstName = res["firstName"];
        this.userinfo.LastName = res["lastName"];
        this.userinfo.Id = res["id"];

      })
  }

}

