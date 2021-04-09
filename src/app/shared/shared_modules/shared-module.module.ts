import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ApplicationBaseClassComponent } from './baseClass/application-base-class.component';

/**
 * Shared module.
 */
@NgModule({
	exports: [ApplicationBaseClassComponent],
	imports: [
		CommonModule, ModalModule.forRoot(),
	],
	declarations: [ApplicationBaseClassComponent],

})
export class SharedModuleModule {
}
