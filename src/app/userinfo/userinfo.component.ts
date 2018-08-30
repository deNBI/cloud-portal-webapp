import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';

import ***REMOVED***Userinfo***REMOVED*** from './userinfo.model'
import ***REMOVED***PerunSettings***REMOVED*** from "../perun-connector/connector-settings.service";
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service'
import ***REMOVED***keyService***REMOVED*** from "../api-connector/key.service";
import ***REMOVED***UserService***REMOVED*** from "../api-connector/user.service";
import ***REMOVED***GroupService***REMOVED*** from "../api-connector/group.service";


@Component(***REMOVED***
    templateUrl: 'userinfo.component.html',
    providers: [GroupService, UserService, PerunSettings, ApiSettings, keyService]
***REMOVED***)
export class UserinfoComponent implements OnInit ***REMOVED***
    userinfo: Userinfo;
    key: string = 'Show Public Key';
    key_visible = false;
    newsletter_subscribed: boolean;
    public_key: string = '';
    isLoaded = false;
    is_project_member= true;
    freemium_active = false;

    constructor(private groupService: GroupService, private userservice: UserService, private keyService: keyService) ***REMOVED***
        this.userinfo = new Userinfo();
        this.getUserinfo();


    ***REMOVED***


    ngOnInit(): void ***REMOVED***
        this.isFreemiumActive();
        this.is_vm_project_member();


    ***REMOVED***

    isFreemiumActive() ***REMOVED***
        this.groupService.isFreemiumActive().subscribe(result => ***REMOVED***
            this.freemium_active = result['Freemium'];

        ***REMOVED***);
    ***REMOVED***


    setNewsletterSubscription(e) ***REMOVED***
        this.userservice.setNewsletterSubscription(this.newsletter_subscribed).subscribe(result => ***REMOVED***
        ***REMOVED***)
    ***REMOVED***

    importKey(publicKey: string, keyname: string) ***REMOVED***

        let re = /\+/gi;

        let newstr = publicKey.replace(re, "%2B");

        this.keyService.postKey(publicKey.replace(re, '%2B')).subscribe(result => ***REMOVED***
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
        this.keyService.getKey().subscribe(result => ***REMOVED***
            this.userinfo.PublicKey = result['public_key'];
            this.isLoaded = true;
        ***REMOVED***)
    ***REMOVED***

    getUserinfo() ***REMOVED***
        this.userservice.getLoggedUser().toPromise()
            .then(result => ***REMOVED***
                let res = result;

                this.userinfo.FirstName = res["firstName"];
                this.userinfo.LastName = res["lastName"];
                this.userinfo.Id = res["id"];

                return this.userservice.getMemberByUser().toPromise();

            ***REMOVED***).then(memberinfo => ***REMOVED***
            this.userinfo.MemberId = memberinfo["id"];
            this.userservice.getLogins().toPromise().then(result => ***REMOVED***
                let logins = result;
                for (let login of logins) ***REMOVED***
                    if (login['friendlyName'] === 'login-namespace:elixir-persistent') ***REMOVED***
                        this.userinfo.ElxirId = login['value']
                    ***REMOVED***
                    else if (login['friendlyName'] === 'login-namespace:elixir') ***REMOVED***
                        this.userinfo.UserLogin = login['value'];

                    ***REMOVED***

                ***REMOVED***

            ***REMOVED***).then(result => ***REMOVED***
                this.userservice.getNewsletterSubscription().subscribe(result => ***REMOVED***
                    result = result['subscribed'];
                    if (result.toString() == 'true') ***REMOVED***
                        this.newsletter_subscribed = true;
                    ***REMOVED***
                    else ***REMOVED***
                        this.newsletter_subscribed = false;
                    ***REMOVED***
                    this.getUserPublicKey()


                ***REMOVED***)

            ***REMOVED***);

        ***REMOVED***)
    ***REMOVED***

    show_key() ***REMOVED***
        if (this.key_visible == false) ***REMOVED***
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

    joinFreemium() ***REMOVED***
        this.groupService.addMemberToFreemium().subscribe(result => ***REMOVED***
        ***REMOVED***);
        window.location.reload(true);

    ***REMOVED***

    is_vm_project_member() ***REMOVED***
        this.groupService.getMemberGroupsStatus().subscribe(result => ***REMOVED***
            if (result.length > 0) ***REMOVED***
                this.is_project_member = true
            ***REMOVED***
            else ***REMOVED***
                this.is_project_member = false
            ***REMOVED***
        ***REMOVED***)
    ***REMOVED***
***REMOVED***

