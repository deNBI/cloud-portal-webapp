import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';

import ***REMOVED***Userinfo***REMOVED*** from './userinfo.model'
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service'
import ***REMOVED***KeyService***REMOVED*** from '../api-connector/key.service';
import ***REMOVED***UserService***REMOVED*** from '../api-connector/user.service';
import ***REMOVED***GroupService***REMOVED*** from '../api-connector/group.service';
import ***REMOVED***IResponseTemplate***REMOVED*** from "../api-connector/response-template";
import ***REMOVED***forkJoin***REMOVED*** from "rxjs/index";

@Component(***REMOVED***
  selector: 'app-userinfo',
  templateUrl: 'userinfo.component.html',
  providers: [GroupService, UserService, ApiSettings, KeyService]
***REMOVED***)
export class UserinfoComponent implements OnInit ***REMOVED***
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

  constructor(private groupService: GroupService, private userservice: UserService, private keyservice: KeyService) ***REMOVED***
    this.getUserinfo();

  ***REMOVED***

  requestChangePreferredMailUser(email: string): void ***REMOVED***
    this.userservice.requestChangePreferredMailUser(email).subscribe(() => ***REMOVED***
      this.getPendingPreferredMailUser();
    ***REMOVED***)
  ***REMOVED***

  getPendingPreferredMailUser(): void ***REMOVED***
    this.userservice.getPendingPreferredMailUser().subscribe((res: IResponseTemplate) => ***REMOVED***
      this.userinfo.PendingEmails = <string[]>res.value;

    ***REMOVED***)
  ***REMOVED***

  ngOnInit(): void ***REMOVED***
    this.isFreemiumActive();
    this.is_vm_project_member();
    this.getPreferredMail();

  ***REMOVED***

  isFreemiumActive(): void ***REMOVED***
    this.groupService.isFreemiumActive().subscribe((result: IResponseTemplate) => ***REMOVED***
      this.freemium_active = <boolean><Boolean> result.value;

    ***REMOVED***);
  ***REMOVED***

  setNewsletterSubscription(e): void ***REMOVED***
    if (this.newsletter_subscribed) ***REMOVED***
      this.userservice.setNewsletterSubscriptionWhenSubscribed().subscribe();
    ***REMOVED***
    else ***REMOVED***
      this.userservice.setNewsletterSubscriptionWhenNotSubscribed().subscribe();
    ***REMOVED***

  ***REMOVED***

  importKey(publicKey: string, keyname: string) ***REMOVED***

    const re: RegExp = /\+/gi;

    this.keyservice.postKey(publicKey.replace(re, '%2B')).subscribe(() => ***REMOVED***
      this.getUserPublicKey();
    ***REMOVED***);
  ***REMOVED***

  validatePublicKey() ***REMOVED***

    if (/ssh-rsa AAAA[0-9A-Za-z+/]+[=]***REMOVED***0,3***REMOVED***( [^@]+@[^@]+)?/.test(this.public_key)) ***REMOVED***
      return true;
    ***REMOVED*** else ***REMOVED***

      return false;
    ***REMOVED***

  ***REMOVED***

  getUserPublicKey(): void ***REMOVED***
    this.keyservice.getKey().subscribe((key: IResponseTemplate) => ***REMOVED***
      this.userinfo.PublicKey = <string>key.value;
      this.isLoaded = true;
    ***REMOVED***)
  ***REMOVED***

  // Returns the preffered Mail of the logged in User
  getPreferredMail(): void ***REMOVED***
    this.userservice.getPreferredMailUser().subscribe()
  ***REMOVED***

  getUserinfo(): void ***REMOVED***
    this.userservice.getUserInfo().subscribe((userinfo: any) => ***REMOVED***
      this.userinfo = new Userinfo(userinfo);
      forkJoin(this.userservice.getNewsletterSubscription(), this.userservice.getPendingPreferredMailUser()).subscribe((res: IResponseTemplate[]) => ***REMOVED***
        this.newsletter_subscribed = <boolean>res[0].value;
        this.userinfo.PendingEmails = <string[]>res[1].value;
        this.isLoaded = true;


      ***REMOVED***)


    ***REMOVED***)

  ***REMOVED***

  show_key() ***REMOVED***
    if (!this.key_visible) ***REMOVED***
      this.toggleKey();
    ***REMOVED***
  ***REMOVED***

  toggleKey() ***REMOVED***
    if (this.key === 'Show Public Key') ***REMOVED***
      this.key = 'Hide Public Key';
      this.key_visible = true;
    ***REMOVED*** else ***REMOVED***
      this.key = 'Show Public Key';
      this.key_visible = false;
    ***REMOVED***
  ***REMOVED***

  joinFreemium() ***REMOVED***
    this.groupService.addMemberToFreemium().subscribe();
  ***REMOVED***

  is_vm_project_member() ***REMOVED***
    this.groupService.getSimpleVmByUser().subscribe(result => ***REMOVED***
      if (result.length > 0) ***REMOVED***
        this.is_project_member = true
      ***REMOVED*** else ***REMOVED***
        this.is_project_member = false
      ***REMOVED***
    ***REMOVED***)
  ***REMOVED***
***REMOVED***
