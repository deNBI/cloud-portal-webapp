import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecoiUploadComponent } from './decoi-upload/decoi-upload.component';
import { DecoiRoutingModule } from './decoi-routing.module';

/**
 * Module for decoi
 */
@NgModule({
	declarations: [DecoiUploadComponent],
	imports: [
		CommonModule,
		DecoiRoutingModule,
	],
})
export class DecoiModule { }
