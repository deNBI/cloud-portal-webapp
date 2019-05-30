import {Component, Input, OnInit} from '@angular/core';
import {KeyService} from '../../../api-connector/key.service';
import {ApiSettings} from '../../../api-connector/api-settings.service';
import {Userinfo} from '../../../userinfo/userinfo.model';
import {IResponseTemplate} from "../../../api-connector/response-template";

@Component({
    selector: '[app-public-key]',
    templateUrl: './public-key.component.html',
    styleUrls: ['./public-key.component.scss'],
    providers: [ApiSettings, KeyService]

})
export class PublicKeyComponent implements OnInit {

    public_key: string;
    @Input() userinfo: Userinfo;
    show_key_text = 'Show Public Key';
    key_visible = false;

    constructor(private keyservice: KeyService) {
    }

    ngOnInit() {
    }

    importKey(publicKey: string) {

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
        })
    }

    show_key() {
        if (!this.key_visible) {
            this.toggleKey();
        }
    }

    toggleKey() {
        if (this.show_key_text === 'Show Public Key') {
            this.show_key_text = 'Hide Public Key';
            this.key_visible = true;
        } else {
            this.show_key_text = 'Show Public Key';
            this.key_visible = false;
        }
    }

}
