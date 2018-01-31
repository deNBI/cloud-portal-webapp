import {Component} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {Userinfo} from './userinfo.model'
import {AuthzResolver} from '../perun-connector/authz-resolver.service'
import {PerunSettings} from "../perun-connector/connector-settings.service";
import {MembersManager} from '../perun-connector/members-manager.service'
import {ApiSettings} from '../api-connector/api-settings.service'
import {keyService} from "../api-connector/key.service";
import {UsersManager} from "../perun-connector/users-manager.service";
import {AttributesManager} from "../perun-connector/attributes-manager";


@Component({
  templateUrl: 'userinfo.component.html',
  providers: [AuthzResolver, PerunSettings, MembersManager, ApiSettings, keyService, UsersManager, AttributesManager]
})
export class UserinfoComponent {
  userinfo: Userinfo;
  key: string = 'Show Public Key';
  key_visible = false;
  public_key: string;

  constructor(private authzresolver: AuthzResolver, private memberssmanager: MembersManager, private keyService: keyService, private usersmanager: UsersManager, private attributemanager: AttributesManager) {
    this.userinfo = new Userinfo();
    this.getUserinfo();


  }

  importKey(publicKey: string, keyname: string) {

    let re = /\+/gi;

    let newstr = publicKey.replace(re, "%2B");

    this.keyService.postKey(this.userinfo.ElxirId, publicKey.replace(re, '%2B'), keyname).subscribe(result => {
      this.getUserPublicKey();
    });
  }

  validatePublicKey() {

    if (/ssh-rsa AAAA[0-9A-Za-z+/]+[=]{0,3}( [^@]+@[^@]+)?/.test(this.public_key)) {
      return true;
    }
    else {

      return false;
    }

  }

  getUserPublicKey() {
    this.keyService.getKey(this.userinfo.ElxirId).subscribe(result => {
      this.userinfo.PublicKey = result.toString();
    })
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
      this.attributemanager.getLogins(this.userinfo.Id).toPromise().then(result => {
        let logins = result.json()
        for (let login of logins) {
          if (login['friendlyName'] === 'login-namespace:elixir-persistent') {
            this.userinfo.ElxirId = login['value']
          }
          else if (login['friendlyName'] === 'login-namespace:elixir') {
            this.userinfo.UserLogin = login['value'];

          }

        }

      }).then(result => {
        this.getUserPublicKey()

      });

    })
  }

  toggleKey() {
    if (this.key == 'Show Public Key') {
      this.key = 'Hide Public Key';
      this.key_visible = true;
    } else {
      this.key = 'Show Public Key';
      this.key_visible = false;
    }
  }
}

