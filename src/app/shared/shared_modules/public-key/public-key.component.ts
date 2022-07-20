import { Component, Input } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { saveAs } from 'file-saver';
import { KeyService } from '../../../api-connector/key.service';
import { ApiSettings } from '../../../api-connector/api-settings.service';
import { Userinfo } from '../../../userinfo/userinfo.model';
import { IResponseTemplate } from '../../../api-connector/response-template';
import { AbstractBaseClass } from '../baseClass/abstract-base-class';
import { WIKI_GENERATE_KEYS } from '../../../../links/links';

/**
 * Public Key component.
 */
@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: '[app-public-key]',
	templateUrl: './public-key.component.html',
	styleUrls: ['./public-key.component.scss'],
	providers: [ApiSettings, KeyService],
})
export class PublicKeyComponent extends AbstractBaseClass {
	WIKI_GENERATE_KEYS: string = WIKI_GENERATE_KEYS;

	public_key: string;
	acknowledgement_given: boolean = false;
	@Input() userinfo: Userinfo;

	constructor(private keyService: KeyService, private clipboardService: ClipboardService) {
		super();
	}

	downloadPem(data: string): void {
		const blob: Blob = new Blob([data], { type: 'pem' });
		const url: string = window.URL.createObjectURL(blob);
		saveAs(url, `${this.userinfo.UserLogin}_ecdsa`);
	}

	generateKey(): void {
		this.keyService.generateKey().subscribe((res: any): void => {
			this.getUserPublicKey();
			this.downloadPem(res['private_key']);
		});
	}

	importKey(publicKey: string): void {
		const re: RegExp = /\+/gi;

		this.keyService.postKey(publicKey.replace(re, '%2B')).subscribe((): void => {
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
		const valid_rsa: boolean = /^ssh-rsa AAAA[0-9A-Za-z+/]+[=]{0,3}( [^@]+@[^@]+)?/.test(this.public_key);
		const valid_ecdsa_521: boolean = /^ecdsa-sha2-nistp521 AAAA[0-9A-Za-z+/]+[=]{0,3}( [^@]+@[^@]+)?/.test(
			this.public_key,
		);
		const valid_ecdsa_256: boolean = /^ecdsa-sha2-nistp256 AAAA[0-9A-Za-z+/]+[=]{0,3}( [^@]+@[^@]+)?/.test(
			this.public_key,
		);
		const valid_ecdsa_384: boolean = /^ecdsa-sha2-nistp384 AAAA[0-9A-Za-z+/]+[=]{0,3}( [^@]+@[^@]+)?/.test(
			this.public_key,
		);
		const valid_ed25519: boolean = /^ssh-ed25519 AAAA[0-9A-Za-z+/]+[=]{0,3}( [^@]+@[^@]+)?/.test(this.public_key);

		return valid_rsa || valid_ecdsa_256 || valid_ecdsa_384 || valid_ecdsa_521 || valid_ed25519;
	}

	getUserPublicKey(): void {
		this.keyService.getKey().subscribe((key: IResponseTemplate): void => {
			this.userinfo.PublicKey = key.value as string;
		});
	}
}
