import { Component, Input } from '@angular/core'
import { ApplicationBaseClassComponent } from '../../shared/shared_modules/baseClass/application-base-class.component'
import { Application } from '../../applications/application.model/application.model'
import { Application_States } from '../../shared/shared_modules/baseClass/abstract-base-class'
import { NgClass, NgIf } from '@angular/common'
import { HasstatusinlistPipe } from '../../pipe-module/pipes/hasstatusinlist.pipe'
import { IsPiApprovedPipe } from '../../pipe-module/pipes/is-pi-approved'

/**
 * Components displays progress of given application.
 */
@Component({
	selector: 'app-application-progress',
	templateUrl: './application-progress.component.html',
	styleUrls: ['./application-progress.component.scss'],
	providers: [],
	imports: [NgClass, NgIf, HasstatusinlistPipe, IsPiApprovedPipe]
})
export class ApplicationProgressComponent extends ApplicationBaseClassComponent {
	@Input() application: Application
	Application_States: typeof Application_States = Application_States
}
