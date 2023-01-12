import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ApplicationBaseClassComponent } from './baseClass/application-base-class.component';
import { NotificationModalComponent } from '../modal/notification-modal';
import { ConfirmationModalComponent } from '../modal/confirmation-modal.component';

/**
 * Shared module.
 */
@NgModule({
	exports: [ApplicationBaseClassComponent, NotificationModalComponent, ConfirmationModalComponent],
	imports: [CommonModule, ModalModule.forRoot()],
	declarations: [ApplicationBaseClassComponent, NotificationModalComponent, ConfirmationModalComponent],
})
export class SharedModuleModule {}
