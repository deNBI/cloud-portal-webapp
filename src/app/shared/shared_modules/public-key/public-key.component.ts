import {Component, Input} from '@angular/core';
import {KeyService} from '../../../api-connector/key.service';
import {ApiSettings} from '../../../api-connector/api-settings.service';
import {Userinfo} from '../../../userinfo/userinfo.model';
import {IResponseTemplate} from '../../../api-connector/response-template';
import {AbstractBaseClasse} from '../baseClass/abstract-base-class';
import {WIKI_GENERATE_KEYS} from '../../../../links/links';
import {ClipboardService} from 'ngx-clipboard';

/**
 * Public Key component.
 */
@Component({
             // tslint:disable-next-line:component-selector
             selector: '[app-public-key]',
             templateUrl: './public-key.component.html',
             styleUrls: ['./public-key.component.scss'],
             providers: [ApiSettings, KeyService]

           })
export class PublicKeyComponent extends AbstractBaseClasse {
  WIKI_GENERATE_KEYS: string = WIKI_GENERATE_KEYS;

  public_key: string;
  acknowledgement_given: boolean = false;
  @Input() userinfo: Userinfo;

  constructor(private keyservice: KeyService,
              private clipboardService: ClipboardService) {
    super()
  }

  importKey(publicKey: string): void {

    const re: RegExp = /\+/gi;

    this.keyservice.postKey(publicKey.replace(re, '%2B')).subscribe(() => {
      this.getUserPublicKey();
    });
  }

  copyToClipboard(text: string): void {
    if (this.clipboardService.isSupported) {
      this.clipboardService.copy(text);
    } else {
      super.copyToClipboard(text);
    }
  }

  validatePublicKey(): boolean {

    if (/^ssh-rsa AAAA[0-9A-Za-z+/]+[=]{0,3}( [^@]+@[^@]+)?/.test(this.public_key)) {
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
}
