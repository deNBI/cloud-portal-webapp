import ***REMOVED***Component, Input, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***KeyService***REMOVED*** from '../../api-connector/key.service';
import ***REMOVED***ApiSettings***REMOVED*** from '../../api-connector/api-settings.service';
import ***REMOVED***PerunSettings***REMOVED*** from '../../perun-connector/connector-settings.service';
import ***REMOVED***Userinfo***REMOVED*** from '../../userinfo/userinfo.model';

@Component(***REMOVED***
    selector: '[app-public-key]',
    templateUrl: './public-key.component.html',
    styleUrls: ['./public-key.component.scss'],
    providers: [PerunSettings, ApiSettings, KeyService]

***REMOVED***)
export class PublicKeyComponent implements OnInit ***REMOVED***

    public_key: string;
    @Input() userinfo: Userinfo;
    show_key_text = 'Show Public Key';
    key_visible = false;

    constructor(private keyservice: KeyService) ***REMOVED***
    ***REMOVED***

    ngOnInit() ***REMOVED***
    ***REMOVED***

    importKey(publicKey: string) ***REMOVED***

        const re = /\+/gi;

        const newstr = publicKey.replace(re, '%2B');

        this.keyservice.postKey(publicKey.replace(re, '%2B')).subscribe(result => ***REMOVED***
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

    getUserPublicKey() ***REMOVED***
        this.keyservice.getKey().subscribe(result => ***REMOVED***
            this.userinfo.PublicKey = result['public_key'];
        ***REMOVED***)
    ***REMOVED***

    show_key() ***REMOVED***
        if (!this.key_visible) ***REMOVED***
            this.toggleKey();
        ***REMOVED***
    ***REMOVED***

    toggleKey() ***REMOVED***
        if (this.show_key_text === 'Show Public Key') ***REMOVED***
            this.show_key_text = 'Hide Public Key';
            this.key_visible = true;
        ***REMOVED*** else ***REMOVED***
            this.show_key_text = 'Show Public Key';
            this.key_visible = false;
        ***REMOVED***
    ***REMOVED***

***REMOVED***
