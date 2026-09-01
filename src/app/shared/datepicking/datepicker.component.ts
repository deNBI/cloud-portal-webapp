import { Component, EventEmitter, OnInit, Output, ChangeDetectionStrategy, inject } from '@angular/core'
import { NgbDateStruct, NgbCalendar, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule } from '@angular/forms'

@Component({
	selector: 'app-datepicker',
	imports: [NgbDatepickerModule, FormsModule],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './datepicker.component.html'
})
export class DatePickerComponent implements OnInit {
	private calendar = inject(NgbCalendar)

	model: NgbDateStruct
	date: { year: number; month: number; day: number }
	@Output() readonly dayChange: EventEmitter<{ year: number; month: number; day: number }> = new EventEmitter<{
		year: number
		month: number
		day: number
	}>()
	constructor() {
		const calendar = this.calendar

		this.calendar = calendar
	}

	ngOnInit(): void {
		this.selectToday()
	}

	selectToday() {
		this.model = this.calendar.getToday()
	}
}
