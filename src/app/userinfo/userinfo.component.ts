import ***REMOVED***Component***REMOVED*** from '@angular/core';
import 'rxjs/add/operator/toPromise';

import ***REMOVED***Userinfo***REMOVED*** from './userinfo.model'
import ***REMOVED***AuthzResolver***REMOVED*** from '../perun-connector/authz-resolver.service'
import ***REMOVED***PerunSettings***REMOVED*** from "../perun-connector/connector-settings.service";
import ***REMOVED***MembersManager***REMOVED*** from '../perun-connector/members-manager.service'
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service'
import ***REMOVED***keyService***REMOVED*** from "../api-connector/key.service";
import ***REMOVED***UsersManager***REMOVED*** from "../perun-connector/users-manager.service";
import ***REMOVED***AttributesManager***REMOVED*** from "../perun-connector/attributes-manager";
import ***REMOVED***UserService***REMOVED*** from "../api-connector/user.service";


@Component(***REMOVED***
  templateUrl: 'userinfo.component.html',
  providers: [UserService, AuthzResolver, PerunSettings, MembersManager, ApiSettings, keyService, UsersManager, AttributesManager]
***REMOVED***)
export class UserinfoComponent ***REMOVED***
  userinfo: Userinfo;
  key: string = 'Show Public Key';
  key_visible = false;
  newsletter_subscribed :boolean;
  public_key: string='';

  constructor(private userservice: UserService,private authzresolver: AuthzResolver, private memberssmanager: MembersManager, private keyService: keyService, private usersmanager: UsersManager, private attributemanager: AttributesManager) ***REMOVED***
    this.userinfo = new Userinfo();
    this.getUserinfo();
      this.userservice.getNewsletterSubscription().subscribe(result =>***REMOVED***
      this.newsletter_subscribed=result.json();***REMOVED***)



  ***REMOVED***

  setNewsletterSubscription(e)***REMOVED***
     this.userservice.setNewsletterSubscription(this.newsletter_subscribed).subscribe(result => ***REMOVED***
      this.userservice.getNewsletterSubscription().subscribe(result =>***REMOVED***
      this.newsletter_subscribed=result.json()***REMOVED***)
    ***REMOVED***)
  ***REMOVED***

  importKey(publicKey: string, keyname: string) ***REMOVED***

    let re = /\+/gi;

    let newstr = publicKey.replace(re, "%2B");

    this.keyService.postKey(this.userinfo.ElxirId, publicKey.replace(re, '%2B'), keyname).subscribe(result => ***REMOVED***
      this.getUserPublicKey();
    ***REMOVED***);
  ***REMOVED***

  validatePublicKey() ***REMOVED***

    if (/ssh-rsa AAAA[0-9A-Za-z+/]+[=]***REMOVED***0,3***REMOVED***( [^@]+@[^@]+)?/.test(this.public_key)) ***REMOVED***
      return true;
    ***REMOVED***
    else ***REMOVED***

      return false;
    ***REMOVED***

  ***REMOVED***

 

  getUserPublicKey() ***REMOVED***
    this.keyService.getKey(this.userinfo.ElxirId).subscribe(result => ***REMOVED***
      this.userinfo.PublicKey = result.toString();
    ***REMOVED***)
  ***REMOVED***

  getUserinfo() ***REMOVED***
    this.authzresolver.getLoggedUser().toPromise()
      .then(result => ***REMOVED***
        let res = result.json();

        this.userinfo.FirstName = res["firstName"];
        this.userinfo.LastName = res["lastName"];
        this.userinfo.Id = res["id"];

        return this.memberssmanager.getMemberByUser(res["id"]).toPromise();

      ***REMOVED***).then(memberinfo => ***REMOVED***
      this.userinfo.MemberId = memberinfo.json()["id"];
      this.attributemanager.getLogins(this.userinfo.Id).toPromise().then(result => ***REMOVED***
        let logins = result.json()
        for (let login of logins) ***REMOVED***
          if (login['friendlyName'] === 'login-namespace:elixir-persistent') ***REMOVED***
            this.userinfo.ElxirId = login['value']
          ***REMOVED***
          else if (login['friendlyName'] === 'login-namespace:elixir') ***REMOVED***
            this.userinfo.UserLogin = login['value'];

          ***REMOVED***

        ***REMOVED***

      ***REMOVED***).then(result => ***REMOVED***
        this.getUserPublicKey()

      ***REMOVED***);

    ***REMOVED***)
  ***REMOVED***
  show_key()***REMOVED***
    if(this.key_visible ==false)***REMOVED***
      this.toggleKey();
    ***REMOVED***
  ***REMOVED***
  toggleKey() ***REMOVED***
    if (this.key == 'Show Public Key') ***REMOVED***
      this.key = 'Hide Public Key';
      this.key_visible = true;
    ***REMOVED*** else ***REMOVED***
      this.key = 'Show Public Key';
      this.key_visible = false;
    ***REMOVED***
  ***REMOVED***
***REMOVED***

