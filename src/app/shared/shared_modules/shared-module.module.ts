import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressModule, ToastModule } from '@coreui/angular';
import { ApplicationBaseClassComponent } from './baseClass/application-base-class.component';
import { NotificationModalComponent } from '../modal/notification-modal';
import { InformationToastComponent } from '../toaster/information-toast.component';

/**
 * Shared module.
 */
@NgModule({
	exports: [ApplicationBaseClassComponent, NotificationModalComponent, InformationToastComponent],
	imports: [CommonModule, ModalModule.forRoot(), ToastModule, ProgressModule],
	declarations: [ApplicationBaseClassComponent, NotificationModalComponent, InformationToastComponent],
})
export class SharedModuleModule {}
