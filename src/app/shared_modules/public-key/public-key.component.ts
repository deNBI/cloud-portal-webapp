import {Component, OnInit, Input} from '@angular/core';
import {keyService} from '../../api-connector/key.service';
import {ApiSettings} from '../../api-connector/api-settings.service';
import {PerunSettings} from '../../perun-connector/connector-settings.service';
import {Userinfo} from '../../userinfo/userinfo.model';

@Component({
    selector: '[app-public-key]',
    templateUrl: './public-key.component.html',
    styleUrls: ['./public-key.component.scss'],
    providers: [ PerunSettings, ApiSettings, keyService]

})
export class PublicKeyComponent implements OnInit {

    public_key: string;
    @Input() userinfo: Userinfo;
    show_key_text = 'Show Public Key';
    key_visible = false;


    constructor( private keyService: keyService) {
    }

    ngOnInit() {
    }

    importKey(publicKey: string) {

        const re = /\+/gi;

        const newstr = publicKey.replace(re, '%2B');

        this.keyService.postKey(publicKey.replace(re, '%2B')).subscribe(result => {
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
        this.keyService.getKey().subscribe(result => {
            this.userinfo.PublicKey = result['public_key'];
        })
    }

    show_key() {
        if (this.key_visible == false) {
            this.toggleKey();
        }
    }

    toggleKey() {
        if (this.show_key_text == 'Show Public Key') {
            this.show_key_text = 'Hide Public Key';
            this.key_visible = true;
        } else {
            this.show_key_text = 'Show Public Key';
            this.key_visible = false;
        }
    }


}
