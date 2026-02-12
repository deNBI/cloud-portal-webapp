import { Component, Input } from '@angular/core'
import { Application } from 'app/applications/application.model/application.model'
import {
	Application_States,
	Lifetime_States,
	Project_States
} from 'app/shared/shared_modules/baseClass/abstract-base-class'
import { HasstatusinlistPipe } from '../../../../../pipe-module/pipes/hasstatusinlist.pipe'
import { HasStatusPipe } from 'app/pipe-module/pipes/has-status.pipe'

@Component({
	selector: 'app-application-status-badges',
	imports: [HasStatusPipe, HasstatusinlistPipe],
	templateUrl: './application-status-badges.component.html',
	styleUrl: './application-status-badges.component.scss'
})
export class ApplicationStatusBadgesComponent {
	@Input() application: Application
	protected readonly Project_States = Project_States
	protected readonly Application_States = Application_States
	protected readonly Lifetime_States = Lifetime_States
}
