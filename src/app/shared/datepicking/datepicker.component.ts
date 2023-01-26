import {
	Component, EventEmitter, OnInit, Output,
} from '@angular/core';
import { NgbDateStruct, NgbCalendar, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
	selector: 'app-datepicker',
	standalone: true,
	imports: [NgbDatepickerModule, FormsModule, JsonPipe],
	templateUrl: './datepicker.component.html',
})
export class DatePickerComponent implements OnInit {
	model: NgbDateStruct;
	date: { year: number; month: number; day: number };
	@Output() readonly dayChange: EventEmitter<{ year: number; month: number; day: number }> = new EventEmitter<{
		year: number
		month: number
		day: number
	}>();
	constructor(private calendar: NgbCalendar) {
		this.calendar = calendar;
	}

	ngOnInit(): void {
		this.selectToday();
	}

	selectToday() {
		this.model = this.calendar.getToday();
	}
}
