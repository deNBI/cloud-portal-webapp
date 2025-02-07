import { Component, Input } from '@angular/core'
import { Application } from '../../application.model/application.model'
import { NgIf } from '@angular/common'
import { TextColorDirective, TextBgColorDirective, BadgeComponent } from '@coreui/angular'

/**
 * PI/User informations
 */
@Component({
	selector: 'app-application-pi-detail',
	templateUrl: './application-pi-detail.component.html',
	imports: [NgIf, TextColorDirective, TextBgColorDirective, BadgeComponent]
})
export class ApplicationPiDetailComponent {
	@Input() application: Application
}
