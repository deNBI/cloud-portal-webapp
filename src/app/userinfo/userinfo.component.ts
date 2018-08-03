import {Component,OnInit} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {Userinfo} from './userinfo.model'
import {PerunSettings} from "../perun-connector/connector-settings.service";
import {ApiSettings} from '../api-connector/api-settings.service'
import {keyService} from "../api-connector/key.service";
import {UserService} from "../api-connector/user.service";


@Component({
  templateUrl: 'userinfo.component.html',
  providers: [UserService, PerunSettings,  ApiSettings, keyService]
})
export class UserinfoComponent implements OnInit{
  userinfo: Userinfo;
  key: string = 'Show Public Key';
  key_visible = false;
  newsletter_subscribed :boolean;
  public_key: string='';
  isLoaded=false;

  constructor(private userservice: UserService, private keyService: keyService) {
    this.userinfo = new Userinfo();
    this.getUserinfo();



  }

   ngOnInit(): void {

            this.userservice.getNewsletterSubscription().subscribe(result => {
          result = result.json()['subscribed'];
          if (result.toString() == 'true') {
              this.newsletter_subscribed = true;
          }
          else {
              this.newsletter_subscribed = false;
          }

      })


    }

  setNewsletterSubscription(e){
     this.userservice.setNewsletterSubscription(this.newsletter_subscribed).subscribe(result => {
    })
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
      this.isLoaded=true;
    })
  }

  getUserinfo() {
    this.userservice.getLoggedUser().toPromise()
      .then(result => {
        let res = result.json();

        this.userinfo.FirstName = res["firstName"];
        this.userinfo.LastName = res["lastName"];
        this.userinfo.Id = res["id"];

        return this.userservice.getMemberByUser().toPromise();

      }).then(memberinfo => {
      this.userinfo.MemberId = memberinfo.json()["id"];
      this.userservice.getLogins().toPromise().then(result => {
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
  show_key(){
    if(this.key_visible ==false){
      this.toggleKey();
    }
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

