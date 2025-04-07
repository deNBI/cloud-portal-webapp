import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ApplicationFilter } from 'app/shared/classes/application-filter'
import {
	Application_States,
	Project_States,
	Lifetime_States
} from 'app/shared/shared_modules/baseClass/abstract-base-class'

@Component({
	selector: 'app-application-filter-input',
	imports: [FormsModule],
	templateUrl: './application-filter-input.component.html',
	styleUrl: './application-filter-input.component.scss'
})
export class ApplicationFilterInputComponent {
	@Input() applicationFilter: ApplicationFilter = new ApplicationFilter()
	@Output() filterChangedEvent: EventEmitter<ApplicationFilter> = new EventEmitter<ApplicationFilter>()

	protected readonly Project_States = Project_States
	protected readonly Application_States = Application_States
	protected readonly Lifetime_States = Lifetime_States

	emitChangedFilterEvent(): void {
		this.filterChangedEvent.emit(this.applicationFilter)
	}
}
