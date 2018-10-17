import ***REMOVED***Component, OnInit,Input***REMOVED*** from '@angular/core';
import ***REMOVED***keyService***REMOVED*** from "../../api-connector/key.service";
import ***REMOVED***ApiSettings***REMOVED*** from "../../api-connector/api-settings.service";
import ***REMOVED***UserService***REMOVED*** from "../../api-connector/user.service";
import ***REMOVED***PerunSettings***REMOVED*** from "../../perun-connector/connector-settings.service";

@Component(***REMOVED***
    selector: 'app-public-key',
    templateUrl: './public-key.component.html',
    styleUrls: ['./public-key.component.scss'],
    providers: [ UserService, PerunSettings, ApiSettings, keyService]

***REMOVED***)
export class PublicKeyComponent implements OnInit ***REMOVED***

    @Input() public_key: string ;
    show_key_text: string = 'Show Public Key';
    key_visible = false;


    constructor( private userservice: UserService, private keyService: keyService) ***REMOVED***
    ***REMOVED***

    ngOnInit() ***REMOVED***
    ***REMOVED***

    importKey(publicKey: string) ***REMOVED***

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
            this.userservice = result['public_key'];
        ***REMOVED***)
    ***REMOVED***

    show_key() ***REMOVED***
        if (this.key_visible == false) ***REMOVED***
            this.toggleKey();
        ***REMOVED***
    ***REMOVED***

    toggleKey() ***REMOVED***
        if (this.show_key_text == 'Show Public Key') ***REMOVED***
            this.show_key_text = 'Hide Public Key';
            this.key_visible = true;
        ***REMOVED*** else ***REMOVED***
            this.show_key_text = 'Show Public Key';
            this.key_visible = false;
        ***REMOVED***
    ***REMOVED***


***REMOVED***
