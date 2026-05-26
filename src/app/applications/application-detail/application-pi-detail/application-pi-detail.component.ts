import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core'
import { Application } from '../../application.model/application.model'
import { is_vo } from 'app/shared/globalvar'
import { TextColorDirective, TextBgColorDirective, BadgeComponent } from '@coreui/angular'

/**
 * PI/User informations
 */
@Component({
	selector: 'app-application-pi-detail',
	templateUrl: './application-pi-detail.component.html',
	imports: [TextColorDirective, TextBgColorDirective, BadgeComponent]
})
export class ApplicationPiDetailComponent implements OnInit {
	@Input() application: Application
	@Output() piVerificationChange = new EventEmitter<boolean>()

	is_vo_admin: boolean = false

	ngOnInit() {
		this.is_vo_admin = is_vo
	}

	togglePIVerification() {
		this.piVerificationChange.emit(!this.application.pi_verified)
	}
}
