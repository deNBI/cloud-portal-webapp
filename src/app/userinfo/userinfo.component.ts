import {Component, OnInit} from '@angular/core';

import {Userinfo} from './userinfo.model'
import {ApiSettings} from '../api-connector/api-settings.service'
import {KeyService} from '../api-connector/key.service';
import {UserService} from '../api-connector/user.service';
import {GroupService} from '../api-connector/group.service';
import {IResponseTemplate} from "../api-connector/response-template";
import {forkJoin} from "rxjs/index";

@Component({
  selector: 'app-userinfo',
  templateUrl: 'userinfo.component.html',
  providers: [GroupService, UserService, ApiSettings, KeyService]
})
export class UserinfoComponent implements OnInit {
  userinfo: Userinfo;
  key = 'Show Public Key';
  key_visible = false;
  newsletter_subscribed: boolean;
  public_key = '';
  isLoaded = false;
  is_project_member = true;
  freemium_active = false;
  emailChange = '';
  freemium: boolean;

  constructor(private groupService: GroupService, private userservice: UserService, private keyservice: KeyService) {
    this.getUserinfo();

  }

  requestChangePreferredMailUser(email: string): void {
    this.userservice.requestChangePreferredMailUser(email).subscribe(() => {
      this.getPendingPreferredMailUser();
    })
  }

  getPendingPreferredMailUser(): void {
    this.userservice.getPendingPreferredMailUser().subscribe((res: IResponseTemplate) => {
      this.userinfo.PendingEmails = <string[]>res.value;

    })
  }

  ngOnInit(): void {
    this.isFreemiumActive();
    this.is_vm_project_member();
    this.getPreferredMail();

  }

  isFreemiumActive(): void {
    this.groupService.isFreemiumActive().subscribe((result: IResponseTemplate) => {
      this.freemium_active = <boolean><Boolean> result.value;

    });
  }

  setNewsletterSubscription(e): void {
    if (this.newsletter_subscribed) {
      this.userservice.setNewsletterSubscriptionWhenSubscribed().subscribe();
    }
    else {
      this.userservice.setNewsletterSubscriptionWhenNotSubscribed().subscribe();
    }

  }

  importKey(publicKey: string, keyname: string) {

    const re: RegExp = /\+/gi;

    this.keyservice.postKey(publicKey.replace(re, '%2B')).subscribe(() => {
      this.getUserPublicKey();
    });
  }

  validatePublicKey() {

    if (/ssh-rsa AAAA[0-9A-Za-z+/]+[=]{0,3}( [^@]+@[^@]+)?/.test(this.public_key)) {
      return true;
    } else {

      return false;
    }

  }

  getUserPublicKey(): void {
    this.keyservice.getKey().subscribe((key: IResponseTemplate) => {
      this.userinfo.PublicKey = <string>key.value;
      this.isLoaded = true;
    })
  }

  // Returns the preffered Mail of the logged in User
  getPreferredMail(): void {
    this.userservice.getPreferredMailUser().subscribe()
  }

  getUserinfo(): void {
    this.userservice.getUserInfo().subscribe((userinfo: any) => {
      this.userinfo = new Userinfo(userinfo);
      forkJoin(this.userservice.getNewsletterSubscription(), this.userservice.getPendingPreferredMailUser()).subscribe((res: IResponseTemplate[]) => {
        this.newsletter_subscribed = <boolean>res[0].value;
        this.userinfo.PendingEmails = <string[]>res[1].value;
        this.isLoaded = true;


      })


    })

  }

  show_key() {
    if (!this.key_visible) {
      this.toggleKey();
    }
  }

  toggleKey() {
    if (this.key === 'Show Public Key') {
      this.key = 'Hide Public Key';
      this.key_visible = true;
    } else {
      this.key = 'Show Public Key';
      this.key_visible = false;
    }
  }

  joinFreemium() {
    this.groupService.addMemberToFreemium().subscribe();
  }

  is_vm_project_member() {
    this.groupService.getSimpleVmByUser().subscribe(result => {
      if (result.length > 0) {
        this.is_project_member = true
      } else {
        this.is_project_member = false
      }
    })
  }
}
