import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TimepickerModule } from 'ngx-bootstrap/timepicker'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AlertModule } from 'ngx-bootstrap/alert'
import { AccordionModule } from 'ngx-bootstrap/accordion'
import { CreditsCalculatorComponent } from './credits-calculator.component'

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		TimepickerModule.forRoot(),
		BsDatepickerModule.forRoot(),
		ReactiveFormsModule,
		AlertModule,
		AccordionModule,
		CreditsCalculatorComponent
	]
})
export class CreditsCalculatorModule {}
