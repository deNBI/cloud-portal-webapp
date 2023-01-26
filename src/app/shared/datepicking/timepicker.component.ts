import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-timepicker',
	standalone: true,
	imports: [NgbTimepickerModule, FormsModule, JsonPipe],
	templateUrl: './timepicker.component.html',
})
export class TimepickerComponent {
	@Output() readonly timeChange: EventEmitter<{ hour: number; minute: number }> = new EventEmitter<{
		hour: number
		minute: number
	}>();
	time = { hour: new Date().getHours(), minute: new Date().getMinutes() };
}
