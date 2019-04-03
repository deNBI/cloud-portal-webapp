import {Component, OnInit} from '@angular/core';

import {Userinfo} from './userinfo.model'
import {ApiSettings} from '../api-connector/api-settings.service'
import {KeyService} from '../api-connector/key.service';
import {UserService} from '../api-connector/user.service';
import {GroupService} from '../api-connector/group.service';
import {IResponseTemplate} from "../api-connector/response-template";

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
        this.userinfo = new Userinfo();
        this.getUserinfo();

    }

    requestChangePreferredMailUser(email: string) {
        this.userservice.requestChangePreferredMailUser(email).subscribe(res => {
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

    isFreemiumActive() {
        this.groupService.isFreemiumActive().subscribe(result => {
            this.freemium_active = result['Freemium'];

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

        const re = /\+/gi;

        const newstr = publicKey.replace(re, '%2B');

        this.keyservice.postKey(publicKey.replace(re, '%2B')).subscribe(result => {
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

    getUserPublicKey() {
        this.keyservice.getKey().subscribe(result => {
            this.userinfo.PublicKey = result['public_key'];
            this.isLoaded = true;
        })
    }

    // Returns the preffered Mail of the logged in User
    getPreferredMail(): void {
        this.userservice.getPreferredMailUser().subscribe()
    }

    // TODO: Refactor this Method
    getUserinfo() {
        this.userservice.getLoggedUser().toPromise()
            .then(result => {
                const res = result;

                this.userinfo.FirstName = res['firstName'];
                this.userinfo.LastName = res['lastName'];
                this.userinfo.Id = res['id'];

                return this.userservice.getMemberByUser().toPromise();

            }).then(memberinfo => {
            this.userinfo.MemberId = memberinfo['id'];
            this.userservice.getLogins().toPromise().then(result => {
                const logins = result;
                for (const login of logins) {
                    if (login['friendlyName'] === 'login-namespace:elixir-persistent') {
                        this.userinfo.ElxirId = login['value']
                    } else if (login['friendlyName'] === 'login-namespace:elixir') {
                        this.userinfo.UserLogin = login['value'];

                    }

                }

            })
        });
        this.userservice.getPreferredMailUser().subscribe((prefEmail: IResponseTemplate) => {
            this.userinfo.Email = <string>prefEmail.value;
            this.userservice.getPendingPreferredMailUser().subscribe((pendingEmails: IResponseTemplate) => {
                this.userinfo.PendingEmails = <string[]>pendingEmails.value;
                this.userservice.getNewsletterSubscription().subscribe((subscribed: IResponseTemplate) => {

                    if (<boolean><Boolean>subscribed.value) {
                        this.newsletter_subscribed = true;
                    } else {
                        this.newsletter_subscribed = false;
                    }
                    this.getUserPublicKey()

                })
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
        this.groupService.getMemberGroupsStatus().subscribe(result => {
            if (result.length > 0) {
                this.is_project_member = true
            } else {
                this.is_project_member = false
            }
        })
    }
}
