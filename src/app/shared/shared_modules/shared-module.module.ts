import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressModule, ToastModule } from '@coreui/angular';
import { ApplicationBaseClassComponent } from './baseClass/application-base-class.component';
import { NotificationModalComponent } from '../modal/notification-modal';
import { InformationToastComponent } from '../toaster/information-toast.component';
import { ConfirmationModalComponent } from '../modal/confirmation-modal.component';
import { MigrationInformationComponent } from './migration-information/migration-information.component';

/**
 * Shared module.
 */
@NgModule({
	exports: [
		ApplicationBaseClassComponent,
		NotificationModalComponent,
		ConfirmationModalComponent,
		InformationToastComponent,
		MigrationInformationComponent,
	],
	imports: [CommonModule, ModalModule.forRoot(), ToastModule, ProgressModule],
	declarations: [
		ApplicationBaseClassComponent,
		NotificationModalComponent,
		ConfirmationModalComponent,
		InformationToastComponent,
		MigrationInformationComponent,
	],
})
export class SharedModuleModule {}
