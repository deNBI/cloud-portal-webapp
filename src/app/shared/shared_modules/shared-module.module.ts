import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressModule, ToastModule } from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApplicationBaseClassComponent } from './baseClass/application-base-class.component';
import { NotificationModalComponent } from '../modal/notification-modal';
import { InformationToastComponent } from '../toaster/information-toast.component';
import { ConfirmationModalComponent } from '../modal/confirmation-modal.component';
import { MigrationInformationComponent } from './migration-information/migration-information.component';
import { ApplicationBadgesComponent } from './components/applications/application-badges/application-badges.component';
import { ProjectEmailModalComponent } from '../modal/email/project-email-modal/project-email-modal.component';
import { TestimonialFormComponent } from './testimonial-forms/testimonial-form.component';
import { SharedDirectivesModule } from './shared_directives.module';

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
		ApplicationBadgesComponent,
		ProjectEmailModalComponent,
		TestimonialFormComponent,
	],
	imports: [
		CommonModule,
		ModalModule.forRoot(),
		ToastModule,
		ProgressModule,
		FormsModule,
		NgSelectModule,
		SharedDirectivesModule,
	],
	declarations: [
		ApplicationBaseClassComponent,
		NotificationModalComponent,
		ConfirmationModalComponent,
		InformationToastComponent,
		MigrationInformationComponent,
		ApplicationBadgesComponent,
		ProjectEmailModalComponent,
		TestimonialFormComponent,
	],
})
export class SharedModuleModule {}
