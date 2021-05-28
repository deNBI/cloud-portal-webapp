import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AlertModule } from 'ngx-bootstrap/alert';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CreditsCalculatorComponent } from './credits-calculator.component';
import { SharedDirectivesModule } from '../shared/shared_modules/shared_directives.module';
import { PipeModuleModule } from '../pipe-module/pipe-module.module';

@NgModule({
	declarations: [
		CreditsCalculatorComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		SharedDirectivesModule,
		TimepickerModule.forRoot(),
		BsDatepickerModule.forRoot(),
		ReactiveFormsModule,
		PipeModuleModule,
		AlertModule,
		AccordionModule,
	],
})
export class CreditsCalculatorModule { }
