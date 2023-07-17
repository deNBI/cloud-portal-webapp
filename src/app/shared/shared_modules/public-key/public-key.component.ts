import {
	Component, EventEmitter, Input, OnInit, Output,
} from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { saveAs } from 'file-saver';
import { BsModalService } from 'ngx-bootstrap/modal';
import { KeyService } from '../../../api-connector/key.service';
import { ApiSettings } from '../../../api-connector/api-settings.service';
import { Userinfo } from '../../../userinfo/userinfo.model';
import { IResponseTemplate } from '../../../api-connector/response-template';
import { AbstractBaseClass } from '../baseClass/abstract-base-class';
import { WIKI_GENERATE_KEYS, CLOUD_PORTAL_SUPPORT_MAIL } from '../../../../links/links';
import { NotificationModalComponent } from '../../modal/notification-modal';
import { BlacklistedResponse } from '../../../api-connector/response-interfaces';

/**
 * Public Key component.
 */
@Component({
	selector: '[app-public-key]',
	templateUrl: './public-key.component.html',
	styleUrls: ['./public-key.component.scss'],
	providers: [ApiSettings, KeyService],
})
export class PublicKeyComponent extends AbstractBaseClass implements OnInit {
	WIKI_GENERATE_KEYS: string = WIKI_GENERATE_KEYS;
	public_key: string;
	validated_key: boolean = false;
	blocked_key: boolean = false;
	current_key_blocked: boolean = false;
	acknowledgement_given: boolean = false;
	@Input() userinfo: Userinfo;
	@Output() readonly currentKeyBlockedChanged: EventEmitter<boolean> = new EventEmitter();
	CLOUD_PORTAL_SUPPORT_MAIL: string = CLOUD_PORTAL_SUPPORT_MAIL;

	constructor(
		private keyService: KeyService,
		private clipboardService: ClipboardService,
		private modalService: BsModalService,
	) {
		super();
	}

	ngOnInit() {
		if (this.userinfo?.PublicKey) {
			this.isCurrentKeyBlocked();
		}
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

	isKeyBlocked(): void {
		this.keyService.isBlocked(this.public_key.trim()).subscribe((res: BlacklistedResponse) => {
			this.blocked_key = res.blacklisted;
		});
	}

	isCurrentKeyBlocked(): void {
		this.keyService.isBlocked(this.userinfo.PublicKey).subscribe((res: BlacklistedResponse) => {
			this.current_key_blocked = res.blacklisted;
			this.currentKeyBlockedChanged.emit(this.current_key_blocked);
		});
	}

	validateKey(): void {
		this.keyService.validateKey(this.public_key.trim()).subscribe(
			(res: any) => {
				this.validated_key = res['status'] === 'valid';
			},
			() => {
				this.validated_key = false;
			},
		);
	}

	importKey(): void {
		const re: RegExp = /\+/gi;

		this.keyService.postKey(this.public_key.replace(re, '%2B').trim()).subscribe({
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
			this.isKeyBlocked();
		});
	}
}
