import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ClipboardService } from 'ngx-clipboard'
import { KeyService } from '../../../api-connector/key.service'
import { ApiSettings } from '../../../api-connector/api-settings.service'
import { Userinfo } from '../../../userinfo/userinfo.model'
import { IResponseTemplate } from '../../../api-connector/response-template'
import { AbstractBaseClass } from '../baseClass/abstract-base-class'
import { WIKI_GENERATE_KEYS, CLOUD_PORTAL_SUPPORT_MAIL } from '../../../../links/links'
import { BlacklistedResponse } from '../../../api-connector/response-interfaces'
import { GeneratePublicKeyModalComponent } from './generate-public-key-modal/generate-public-key-modal.component'
import { SetPublicKeyModalComponent } from './set-public-key-modal/set-public-key-modal.component'

/**
 * Public Key component.
 */
@Component({
	selector: '[app-public-key]',
	templateUrl: './public-key.component.html',
	styleUrls: ['./public-key.component.scss'],
	providers: [ApiSettings, KeyService]
})
export class PublicKeyComponent extends AbstractBaseClass implements OnInit {
	WIKI_GENERATE_KEYS: string = WIKI_GENERATE_KEYS
	public_key: string
	validated_key: boolean = false
	blocked_key: boolean = false
	current_key_blocked: boolean = false
	acknowledgement_given: boolean = false
	@Input() userinfo: Userinfo
	@Output() readonly currentKeyBlockedChanged: EventEmitter<boolean> = new EventEmitter()
	CLOUD_PORTAL_SUPPORT_MAIL: string = CLOUD_PORTAL_SUPPORT_MAIL

	constructor(
		private keyService: KeyService,
		private clipboardService: ClipboardService,
		private generatePublicKeyModal:GeneratePublicKeyModalComponent,
		private setPublicKeyModalComponent:SetPublicKeyModalComponent
	) {
		super()
	}

	ngOnInit() {
		if (this.userinfo?.PublicKey) {
			this.isCurrentKeyBlocked()
		}
	}

	showSetPublicKeyModal():void{
		this.setPublicKeyModalComponent.showSetPublicKeyModal(this.userinfo.PublicKey).subscribe(() =>{
			console.log("event submitted")
			this.getUserPublicKey()
		})

	}

	showGeneratePublicKeyModal():void{
		this.generatePublicKeyModal.showGeneratePublicKeyModal(this.userinfo.UserLogin).subscribe(() =>{
			console.log("event submitted")
			this.getUserPublicKey()
		})
	}

	unsetAcknowledgment():void{
		this.acknowledgement_given=false;
	}




	isKeyBlocked(): void {
		this.keyService.isBlocked(this.userinfo.PublicKey.trim()).subscribe((res: BlacklistedResponse) => {
			this.blocked_key = res.blacklisted
		})
	}

	isCurrentKeyBlocked(): void {
		this.keyService.isBlocked(this.userinfo.PublicKey).subscribe((res: BlacklistedResponse) => {
			this.current_key_blocked = res.blacklisted
			this.currentKeyBlockedChanged.emit(this.current_key_blocked)
		})
	}



	copyToClipboard(text: string): void {
		if (this.clipboardService.isSupported) {
			this.clipboardService.copy(text)
		} else {
			super.copyToClipboard(text)
		}
	}

	getUserPublicKey(): void {
		this.keyService.getKey().subscribe((key: IResponseTemplate): void => {
			this.userinfo.PublicKey = key.value as string
			this.isKeyBlocked()
		})
	}
}
