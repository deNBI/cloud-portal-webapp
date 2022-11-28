import { Component, Input } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { saveAs } from 'file-saver';
import { BsModalService } from 'ngx-bootstrap/modal';
import { KeyService } from '../../../api-connector/key.service';
import { ApiSettings } from '../../../api-connector/api-settings.service';
import { Userinfo } from '../../../userinfo/userinfo.model';
import { IResponseTemplate } from '../../../api-connector/response-template';
import { AbstractBaseClass } from '../baseClass/abstract-base-class';
import { WIKI_GENERATE_KEYS } from '../../../../links/links';
import { NotificationModalComponent } from '../../modal/notification-modal';

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

	constructor(
		private keyService: KeyService,
		private clipboardService: ClipboardService,
		private modalService: BsModalService,
	) {
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

		this.keyService.postKey(publicKey.replace(re, '%2B')).subscribe({
			next: (): void => {
				this.getUserPublicKey();
				const initialState = {
					notificationModalTitle: 'Success',
					notificationModalType: 'info',
					notificationModalMessage: 'The new public key got successfully set',
				};
				this.modalService.show(NotificationModalComponent, { initialState });
			},
			error: (): any => {
				const initialState = {
					notificationModalTitle: 'Error',
					notificationModalType: 'danger',
					notificationModalMessage:
						'We were not able successfully set a new public key. Please enter a valid public key!',
				};
				this.modalService.show(NotificationModalComponent, { initialState });
			},
		});
	}

	copyToClipboard(text: string): void {
		if (this.clipboardService.isSupported) {
			this.clipboardService.copy(text);
		} else {
			super.copyToClipboard(text);
		}
	}

	getUserPublicKey(): void {
		this.keyService.getKey().subscribe((key: IResponseTemplate): void => {
			this.userinfo.PublicKey = key.value as string;
		});
	}
}
