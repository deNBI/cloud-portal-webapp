import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ApplicationBaseClassComponent } from './baseClass/application-base-class.component';
import { NotificationModalComponent } from '../modal/notification-modal';

/**
 * Shared module.
 */
@NgModule({
	          exports: [ApplicationBaseClassComponent, NotificationModalComponent],
	          imports: [
		          CommonModule, ModalModule.forRoot(),
	          ],
	          declarations: [ApplicationBaseClassComponent, NotificationModalComponent],

})
export class SharedModuleModule {
}
