import { Component, EventEmitter, Injectable } from '@angular/core'
import { KeyService } from 'app/api-connector/key.service'
import { AbstractBaseModalComponent } from 'app/shared/modal/abstract-base-modal/abstract-base-modal.component'
import { BsModalService } from 'ngx-bootstrap/modal'
import { saveAs } from 'file-saver'
import { FormsModule } from '@angular/forms'

@Injectable({ providedIn: 'root' })
@Component({
	selector: 'app-generate-public-key-modal',
	templateUrl: './generate-public-key-modal.component.html',
	styleUrl: './generate-public-key-modal.component.scss',
	imports: [FormsModule]
})
export class GeneratePublicKeyModalComponent extends AbstractBaseModalComponent {
	userlogin: string
	acknowledgement_given: boolean = false

	constructor(
		protected modalService: BsModalService,
		private keyService: KeyService
	) {
		super(modalService)
	}
	showGeneratePublicKeyModal(userlogin: string): EventEmitter<void> {
		const initialState = {
			userlogin
		}

		return this.showBaseModal(GeneratePublicKeyModalComponent, initialState)
	}

	downloadPem(data: string): void {
		const blob: Blob = new Blob([data], { type: 'pem' })
		const url: string = window.URL.createObjectURL(blob)
		saveAs(url, `${this.userlogin}_ecdsa`)
	}

	generateKey(): void {
		this.keyService.generateKey().subscribe((res: any): void => {
			this.event.emit()
			this.downloadPem(res['private_key'])
		})
	}
}
